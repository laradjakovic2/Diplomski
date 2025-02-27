using System.Threading.Channels;

namespace UsersCell;

using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

public class RabbitMqListener : BackgroundService
{
    private readonly ConnectionFactory _factory;
    private IConnection? _connection;
    private IChannel? _channel;

    private const string ExchangeName = "UserRegisteredForTraining";
    private const string RoutingKey = "tr-u";
    private const string QueueName = "TrainingUser";

    private string _consumerTag;

    public RabbitMqListener()
    {
        _factory = new ConnectionFactory
        {
            Uri = new Uri("amqp://guest:guest@localhost:5672"),
            ClientProvidedName = "User receiver"
        };
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _connection = await _factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();

        await _channel.ExchangeDeclareAsync(ExchangeName, ExchangeType.Direct);
        await _channel.QueueDeclareAsync(QueueName, false, false, false, null);
        await _channel.QueueBindAsync(QueueName, ExchangeName, RoutingKey, null);
        await _channel.BasicQosAsync(0, 1, false); // Procesiraj jednu poruku odjednom

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (sender, args) =>
        {
            var body = args.Body.ToArray();
            string message = Encoding.UTF8.GetString(body);

            // Obrada poruke
            Console.WriteLine($"Primljena poruka: {message}");

            //spremi ili nesto

            await _channel.BasicAckAsync(args.DeliveryTag, false);
        };

        _consumerTag = await _channel.BasicConsumeAsync(QueueName, false, consumer);

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if(_channel != null && _connection!= null && _consumerTag!= null)
        {
            await _channel.BasicCancelAsync(_consumerTag);
            await _channel.CloseAsync();
            await _connection.CloseAsync();
        }
        
        await base.StopAsync(cancellationToken);
    }
}

