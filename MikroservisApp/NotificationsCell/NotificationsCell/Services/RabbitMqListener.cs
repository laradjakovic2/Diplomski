using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using NotificationsCell.Models;
using NotificationsCell.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace NotificationsCell.Services
{
    public class RabbitMqListener : BackgroundService
    {
        private readonly ConnectionFactory _factory;
        private IConnection? _connection;
        private IChannel? _channel;

        private readonly IServiceScopeFactory _scopeFactory;

        private const string ExchangeName = "SendNotification";

        private readonly Dictionary<string, string> _queues = new()
        {
            { "training-notification", "training-notification" },
            { "competition-notification", "competition-notification" }
        };

        private readonly List<string> _consumerTags = new();

        public RabbitMqListener(IServiceScopeFactory scopeFactory)
        {
            _factory = new ConnectionFactory
            {
                Uri = new Uri("amqp://guest:guest@localhost:5672"),
                ClientProvidedName = "Notification receiver"
            };
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var emailService = scope.ServiceProvider.GetRequiredService<EmailService>();

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    Console.WriteLine("Creating RabbitMQ connection...");
                    _connection = await _factory.CreateConnectionAsync();
                    Console.WriteLine("done connection...");
                    Console.WriteLine("Creating RabbitMQ channel...");
                    _channel = await _connection.CreateChannelAsync();
                    Console.WriteLine("done channel...");

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

                                if (queueName == "training-notification")
                                {
                                    var deserialized = JsonSerializer.Deserialize<UserRegisteredForTrainingModel>(message);
                                    if (deserialized?.UserEmail != null)
                                    {
                                        await emailService.SendEmailAsync(
                                            deserialized.UserEmail,
                                            "Trening kreiran",
                                            "Pozdrav, uspješno ste kreirali trening");
                                    }
                                }
                                else if (queueName == "competition-notification")
                                {
                                    var deserialized = JsonSerializer.Deserialize<UserRegisteredForCompetitionModel>(message);
                                    if (deserialized?.UserEmail != null)
                                    {
                                        await emailService.SendEmailAsync(
                                            deserialized.UserEmail,
                                            "Prijava na natjecanje",
                                            "Pozdrav, uspješno ste se prijavili na natjecanje");
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
