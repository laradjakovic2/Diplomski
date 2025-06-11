using RabbitMQ.Client;
using CompetitionsCell.Interfaces;

namespace CompetitionsCell.Services;

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
        Console.WriteLine("Creating RabbitMq channel...");
        await using var channel = await _connection.CreateChannelAsync();

        await channel.ExchangeDeclareAsync(_exchangeName, ExchangeType.Direct);
        Console.WriteLine("exchange declare");
        await channel.QueueDeclareAsync(_queueName, false, false, false, null);
        Console.WriteLine("queue declare...");
        await channel.QueueBindAsync(_queueName, _exchangeName, _routingKey, null);
        Console.WriteLine("bind...");

        var props = new BasicProperties
        {
            ContentType = "text/plain",
            DeliveryMode = (DeliveryModes)2
        };

        await channel.BasicPublishAsync(_exchangeName, _routingKey, mandatory: true, basicProperties: props, body: messageBodyBytes);
        Console.WriteLine("publish...");
        // Kanal se automatski zatvara jer koristiš `await using`
    }
}
