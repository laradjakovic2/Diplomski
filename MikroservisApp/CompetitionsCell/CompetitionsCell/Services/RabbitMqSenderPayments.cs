using CompetitionsCell.Interfaces;
using RabbitMQ.Client;

namespace CompetitionsCell.Services;

public interface IRabbitMqSenderPayments : IRabbitMqSender { }

public class RabbitMqSenderPayments : RabbitMqSender, IRabbitMqSenderPayments
{
    public RabbitMqSenderPayments(IConnection connection)
        : base(connection, "SendPayment", "competition-payment", "competition-payment") { }
}