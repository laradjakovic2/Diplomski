using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using PaymentsCell.Interfaces;
using PaymentsCell.Models;
using PaymentsCell.Services;

namespace PaymentsCell;

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

        try
        {
            _connection = await _factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await _channel.ExchangeDeclareAsync(ExchangeName, ExchangeType.Direct);

            foreach (var (queueName, routingKey) in _queues)
            {
                await _channel.QueueDeclareAsync(queueName, false, false, false, null);
                await _channel.QueueBindAsync(queueName, ExchangeName, routingKey, null);
                await _channel.BasicQosAsync(0, 1, false); // Procesiraj jednu poruku odjednom

                var consumer = new AsyncEventingBasicConsumer(_channel);
                consumer.ReceivedAsync += async (sender, args) =>
                {
                    var body = args.Body.ToArray();
                    string message = Encoding.UTF8.GetString(body);

                    if (queueName == "competition-payment")
                    {
                        var deserialized = JsonSerializer.Deserialize<CreateCompetitionPayment>(message);

                        //spremi ili nesto
                        if (deserialized != null)
                        {
                            await paymentService.SaveCompetitionPayment(deserialized);
                        }
                    }

                    await _channel.BasicAckAsync(args.DeliveryTag, false);
                };

                string consumerTag = await _channel.BasicConsumeAsync(queue: queueName, autoAck: false, consumer: consumer);
                _consumerTags.Add(consumerTag);
            }

            await Task.Delay(Timeout.Infinite, stoppingToken);
        }
        catch
        {

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

