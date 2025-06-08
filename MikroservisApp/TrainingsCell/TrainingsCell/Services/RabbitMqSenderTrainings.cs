using TrainingsCell.Interfaces;
using RabbitMQ.Client;

namespace TrainingsCell.Services;

public interface IRabbitMqSenderNotifications : IRabbitMqSender { }

public class RabbitMqSenderNotifications : RabbitMqSender, IRabbitMqSenderNotifications
{
    public RabbitMqSenderNotifications(IConnection connection)
        : base(connection, "SendNotification", "training-notification", "training-notification") { }
}