using RabbitMQ.Client;
using TrainingsCell.Interfaces;

namespace TrainingsCell;

public class RabbitMqSender : IRabbitMqSender

{
    private readonly ConnectionFactory _factory;
    private readonly BasicProperties _props;
    private IConnection? _connection;
    private IChannel? _channel;

    private const string ExchangeName = "UserRegisteredForTraining";
    private const string RoutingKey = "tr-u";
    private const string QueueName = "TrainingUser";

    public RabbitMqSender()
    {
        _factory = new ConnectionFactory
        {
            Uri = new Uri("amqp://guest:guest@localhost:5672"),
            ClientProvidedName = "Training sender"
        };

        _props = new BasicProperties()
        {
            ContentType = "text/plain",
            DeliveryMode = (DeliveryModes)2
        };
    }
    
    public async Task SendMessage(byte[] messageBodyBytes)
    {
        _connection = await _factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();

        await _channel.ExchangeDeclareAsync(ExchangeName, ExchangeType.Direct);
        await _channel.QueueDeclareAsync(QueueName, false, false, false, null);
        await _channel.QueueBindAsync(QueueName, ExchangeName, RoutingKey, null);

        await _channel.BasicPublishAsync(ExchangeName, RoutingKey, mandatory: true, basicProperties: _props, body: messageBodyBytes);
        await _channel.CloseAsync();
        await _connection.CloseAsync();
    }
}
