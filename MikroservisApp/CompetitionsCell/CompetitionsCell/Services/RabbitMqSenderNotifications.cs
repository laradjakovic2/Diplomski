using CompetitionsCell.Interfaces;
using RabbitMQ.Client;

namespace CompetitionsCell.Services;

public interface IRabbitMqSenderNotifications : IRabbitMqSender { }

public class RabbitMqSenderNotifications : RabbitMqSender, IRabbitMqSenderNotifications
{
    public RabbitMqSenderNotifications(IConnection connection)
        : base(connection, "SendNotification", "competition-notification", "competition-notification") { }
}