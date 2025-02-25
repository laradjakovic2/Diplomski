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
        public IRabbitMqSender _rabbitMqsender;
        public TrainingsService(IRabbitMqSender rabbitMqSender)
        {
            _rabbitMqsender = rabbitMqSender;
        }
        public async Task RegisterUserForTraining(int userId, int trainingId)
        {
            byte[] messageBodyBytes = Encoding.UTF8.GetBytes("Hello od Lare s treninga");

            await _rabbitMqsender.SendMessage(messageBodyBytes);
        }
    }
}
