using RabbitMQ.Client;
using TrainingsCell.Interfaces;

public class RabbitMqSender : IRabbitMqSender
{
    private readonly IConnection _connection;
    private readonly string _exchangeName;
    private readonly string _routingKey;
    private readonly string _queueName;

    public RabbitMqSender(IConnection connection, string exchangeName, string routingKey, string queueName)
    {
        _connection = connection;
        _exchangeName = exchangeName;
        _routingKey = routingKey;
        _queueName = queueName;
    }

    public async Task SendMessage(byte[] messageBodyBytes)
    {
        // Kreira se kanal per-poziv (thread-safe i lightweight)
        await using var channel = await _connection.CreateChannelAsync();

        await channel.ExchangeDeclareAsync(_exchangeName, ExchangeType.Direct);
        await channel.QueueDeclareAsync(_queueName, false, false, false, null);
        await channel.QueueBindAsync(_queueName, _exchangeName, _routingKey, null);

        var props = new BasicProperties
        {
            ContentType = "text/plain",
            DeliveryMode = (DeliveryModes)2
        };

        await channel.BasicPublishAsync(_exchangeName, _routingKey, mandatory: true, basicProperties: props, body: messageBodyBytes);

        // Kanal se automatski zatvara jer koristiš `await using`
    }
}
