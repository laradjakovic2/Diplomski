using RabbitMQ.Client;
using TrainingsCell.Interfaces;

namespace TrainingsCell;

public class RabbitMqSender : IRabbitMqSender

{
    private readonly ConnectionFactory _factory;
    private readonly BasicProperties _props;
    private IConnection? _connection;
    private IChannel? _channel;

    private string _exchangeName;
    private string _routingKey;
    private string _queueName;

    public RabbitMqSender(string exchangeName, string routingKey, string queueName)
    {
        _exchangeName = exchangeName;
        _routingKey = routingKey;
        _queueName = queueName;

        _factory = new ConnectionFactory
        {
            Uri = new Uri("amqp://guest:guest@rabbitmq:5672"),
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

        await _channel.ExchangeDeclareAsync(_exchangeName, ExchangeType.Direct);
        await _channel.QueueDeclareAsync(_queueName, false, false, false, null);
        await _channel.QueueBindAsync(_queueName, _exchangeName, _routingKey, null);

        await _channel.BasicPublishAsync(_exchangeName, _routingKey, mandatory: true, basicProperties: _props, body: messageBodyBytes);

        await _channel.CloseAsync();
        await _connection.CloseAsync();
    }
}
