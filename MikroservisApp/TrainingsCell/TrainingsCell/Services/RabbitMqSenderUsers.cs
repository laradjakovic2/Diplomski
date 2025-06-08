using TrainingsCell.Interfaces;
using RabbitMQ.Client;

namespace TrainingsCell.Services;

public interface IRabbitMqSenderUsers : IRabbitMqSender { }

public class RabbitMqSenderUsers : RabbitMqSender, IRabbitMqSenderUsers
{
    public RabbitMqSenderUsers(IConnection connection)
        : base(connection, "NotifyUser", "training-user", "training-user") { }
}