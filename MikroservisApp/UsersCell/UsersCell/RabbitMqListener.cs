using System.Threading.Channels;

namespace UsersCell;

using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

public class RabbitMqListener : BackgroundService
{
    private readonly ConnectionFactory _factory;
    private IConnection? _connection;
    private IChannel? _channel;

    private const string ExchangeName = "NotifyUser";

    private readonly Dictionary<string, string> _queues = new()
    {
        { "training-user", "training-user" },
    };

    private readonly List<string> _consumerTags = new();

    public RabbitMqListener()
    {
        _factory = new ConnectionFactory
        {
            Uri = new Uri("amqp://guest:guest@rabbitmq:5672"),
            ClientProvidedName = "User receiver"
        };
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            _connection = await _factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await _channel.ExchangeDeclareAsync(ExchangeName, ExchangeType.Direct);

            foreach (var (queueName, routingKey) in _queues)
            {
                await _channel.QueueDeclareAsync(queueName, false, false, false, null);
                await _channel.QueueBindAsync(queueName, ExchangeName, routingKey, null);
                await _channel.BasicQosAsync(0, 1, false);

                var consumer = new AsyncEventingBasicConsumer(_channel);
                consumer.ReceivedAsync += async (sender, args) =>
                {
                    var body = args.Body.ToArray();
                    string message = Encoding.UTF8.GetString(body);
                    var deserialized = JsonSerializer.Deserialize<object>(message);

                    Console.WriteLine($"[Queue: {queueName}] Primljena poruka: {message}");

                    //spremi ili nesto

                    await _channel.BasicAckAsync(args.DeliveryTag, false);
                };

                string consumerTag = await _channel.BasicConsumeAsync(queue: queueName, autoAck: false, consumer: consumer);
                _consumerTags.Add(consumerTag);
            }
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

