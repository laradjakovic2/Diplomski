
namespace NotificationsCell;

using Microsoft.Extensions.Hosting;
using NotificationsCell.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using NotificationsCell.Models;

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
            Uri = new Uri("amqp://guest:guest@rabbitmq:5672"),
            ClientProvidedName = "User receiver"
        };
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();

        // Get a Dbcontext from the scope
        var emailService = scope.ServiceProvider.GetRequiredService<EmailService>();

        try
        {
            _connection = await _factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await _channel.ExchangeDeclareAsync(ExchangeName, ExchangeType.Direct);

            foreach (var (qName, rKey) in _queues)
            {
                var queueName = qName;
                var routingKey = rKey;

                await _channel.QueueDeclareAsync(queueName, false, false, false, null);
                await _channel.QueueBindAsync(queueName, ExchangeName, routingKey, null);
                await _channel.BasicQosAsync(0, 1, false); // Procesiraj jednu poruku odjednom

                var consumer = new AsyncEventingBasicConsumer(_channel);
                consumer.ReceivedAsync += async (sender, args) =>
                {
                    var body = args.Body.ToArray();
                    string message = Encoding.UTF8.GetString(body);

                    if (queueName == "training-notification")
                    {
                        Console.WriteLine($"[Queue: {queueName}] Primljena poruka: {message}");
                        UserRegisteredForTrainingModel deserialized = JsonSerializer.Deserialize<UserRegisteredForTrainingModel>(message);

                        //spremi ili nesto
                        if (deserialized?.UserEmail != null)
                        {
                            await emailService.SendEmailAsync(deserialized.UserEmail,
                            "Trening kreiran",
                            "Pozdrav, uspješno ste kreirali trening");
                        }
                    }
                    else if (queueName == "competition-notification")
                    {
                        Console.WriteLine($"[Queue: {queueName}] Primljena poruka: {message}");
                        UserRegisteredForCompetitionModel deserialized = JsonSerializer.Deserialize<UserRegisteredForCompetitionModel>(message);

                        //spremi ili nesto
                        if (deserialized?.UserEmail != null)
                        {
                            await emailService.SendEmailAsync(deserialized.UserEmail,
                            "Prijava na natjecanje",
                            "Pozdrav, uspješno ste se prijavili na natjecanje");
                        }
                    }
                    else
                    {
                        var deserialized = JsonSerializer.Deserialize<object>(message);

                        Console.WriteLine($"[Queue: {queueName}] Primljena poruka: {message}");
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
            Console.WriteLine("Greška prilikom pokretanja RabbitMQ listenera");
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

