using MassTransit;
using TrainingsCell.Interfaces;
using RabbitMQ.Client;
using System.Text;

namespace TrainingsCell.Services
{
    public class UserRegisteredForTraining
    {
        public int UserId { get; set; }
        public int TrainingId { get; set; }
    }
    public class TrainingsService : ITrainingsService
    {
        public async Task RegisterUserForTraining(int userId, int trainingId)
        {
            /*Rabbit mq sender*/
            ConnectionFactory factory = new();
            factory.Uri = new Uri("amqp://guest:guest@localhost:5672");
            factory.ClientProvidedName = "Training App";
            IConnection cnn = await factory.CreateConnectionAsync();
            IChannel channel = await cnn.CreateChannelAsync();
            string exchangeName = "UserRegisteredForTraining";
            string routingKey = "tr-u";
            string queueName = "TrainingUser";
            await channel.ExchangeDeclareAsync(exchangeName, ExchangeType.Direct);
            await channel.QueueDeclareAsync(queueName, false, false, false, null);
            await channel.QueueBindAsync(queueName, exchangeName, routingKey, null);

            byte[] messageBodyBytes = Encoding.UTF8.GetBytes("Hello od Lare s treninga");
            var props = new BasicProperties();
            props.ContentType = "text/plain";
            props.DeliveryMode = (DeliveryModes)2;
            await channel.BasicPublishAsync(exchangeName, routingKey, mandatory: true, basicProperties: props, body: messageBodyBytes);
            await channel.CloseAsync();
            await cnn.CloseAsync();
        }
    }
}
