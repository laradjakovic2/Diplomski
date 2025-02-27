using TrainingsCell.Interfaces;
using System.Text;
using System.Text.Json;
using TrainingsCell.Entities;

namespace TrainingsCell.Services
{
    public class UserRegisteredForTraining
    {
        public int UserId { get; set; }
        public int TrainingId { get; set; }
    }
    public class TrainingsService : ITrainingsService
    {
        public IRabbitMqSender _rabbitMqSenderUsers;
        public IRabbitMqSender _rabbitMqSenderNotifications;
        public TrainingsService()
        {
            _rabbitMqSenderUsers = new RabbitMqSender("UserRegisteredForTraining", "training-user", "training-user");
            _rabbitMqSenderNotifications = new RabbitMqSender("UserRegisteredForTraining", "training-notification", "training-notification");
        }

        public async Task Create(Training request)
        {
            
        }

        public async Task Update(Training request)
        {

        }

        public async Task Delete(int id)
        {

        }

        public async Task RegisterUserForTraining(UserRegisteredForTraining request)
        {
            byte[] messageBodyBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(request));

            await _rabbitMqSenderUsers.SendMessage(messageBodyBytes); //obavijesti usere
            await _rabbitMqSenderNotifications.SendMessage(messageBodyBytes); //obavijesti notifications
        }
    }
}
