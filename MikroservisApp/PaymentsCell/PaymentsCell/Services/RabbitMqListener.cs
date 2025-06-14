using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using PaymentsCell.Interfaces;
using PaymentsCell.Models;
using PaymentsCell.Services;

namespace PaymentsCell.Services
{
    public class RabbitMqListener : BackgroundService
    {
        private readonly ConnectionFactory _factory;
        private IConnection? _connection;
        private IChannel? _channel;

        private readonly IServiceScopeFactory _scopeFactory;

        private const string ExchangeName = "SendPayment";

        private readonly Dictionary<string, string> _queues = new()
        {
            { "competition-payment", "competition-payment" }
        };

        private readonly List<string> _consumerTags = new();

        public RabbitMqListener(IServiceScopeFactory scopeFactory)
        {
            _factory = new ConnectionFactory
            {
                Uri = new Uri("amqp://guest:guest@rabbitmq:5672"),
                ClientProvidedName = "Payment receiver"
            };
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            // Get a Dbcontext from the scope
            var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _connection = await _factory.CreateConnectionAsync();
                    _channel = await _connection.CreateChannelAsync();

                    await _channel.ExchangeDeclareAsync(ExchangeName, ExchangeType.Direct);

                    Console.WriteLine($"[INFO] Spojeno na RabbitMQ Exchange: {ExchangeName}");

                    foreach (var (queueName, routingKey) in _queues)
                    {
                        await _channel.QueueDeclareAsync(queueName, false, false, false);
                        await _channel.QueueBindAsync(queueName, ExchangeName, routingKey);
                        await _channel.BasicQosAsync(0, 1, false);

                        var consumer = new AsyncEventingBasicConsumer(_channel);
                        consumer.ReceivedAsync += async (sender, args) =>
                        {
                            try
                            {
                                var body = args.Body.ToArray();
                                string message = Encoding.UTF8.GetString(body);

                                Console.WriteLine($"[Queue: {queueName}] Primljena poruka: {message}");

                                if (queueName == "competition-payment")
                                {
                                    var deserialized = JsonSerializer.Deserialize<CreateCompetitionPayment>(message);

                                    if (deserialized != null)
                                    {
                                        await paymentService.SaveCompetitionPayment(deserialized);
                                    }
                                }

                                await _channel.BasicAckAsync(args.DeliveryTag, false);
                            }
                            catch (JsonException ex)
                            {
                                Console.WriteLine($"[ERROR] Neuspješno parsiranje poruke: {ex.Message}");
                                await _channel.BasicNackAsync(args.DeliveryTag, false, requeue: false); // Loša poruka
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"[ERROR] Greška kod obrade poruke: {ex.Message}");
                                await _channel.BasicNackAsync(args.DeliveryTag, false, requeue: false);
                            }
                        };

                        string consumerTag = await _channel.BasicConsumeAsync(queueName, autoAck: false, consumer);
                        _consumerTags.Add(consumerTag);
                    }

                    await Task.Delay(Timeout.Infinite, stoppingToken);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[ERROR] Greška kod pokretanja RabbitMQ listenera: {ex.Message}");
                    Console.WriteLine("[INFO] Pokušaj ponovne konekcije za 5 sekundi...");

                    // Očisti stare konekcije
                    if (_channel != null)
                    {
                        await _channel.CloseAsync();
                        _channel.Dispose();
                        _channel = null;
                    }
                    if (_connection != null)
                    {
                        await _connection.CloseAsync();
                        _connection.Dispose();
                        _connection = null;
                    }

                    try
                    {
                        await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                    }
                    catch (TaskCanceledException)
                    {
                        // Cancelirano, izlazimo iz petlje
                        break;
                    }
                }
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            if (_channel != null && _connection != null)
            {
                foreach (var tag in _consumerTags)
                {
                    await _channel.BasicCancelAsync(tag);
                }

                await _channel.CloseAsync();
                await _connection.CloseAsync();
            }

            await base.StopAsync(cancellationToken);
        }
    }
}
