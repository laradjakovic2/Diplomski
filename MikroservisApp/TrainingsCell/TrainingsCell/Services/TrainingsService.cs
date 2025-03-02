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
        private AppDbContext _context;
        public IRabbitMqSender _rabbitMqSenderUsers;
        public IRabbitMqSender _rabbitMqSenderNotifications;
        public TrainingsService(AppDbContext context)
        {
            _rabbitMqSenderUsers = new RabbitMqSender("UserRegisteredForTraining", "training-user", "training-user");
            _rabbitMqSenderNotifications = new RabbitMqSender("UserRegisteredForTraining", "training-notification", "training-notification");
            _context = context;
        }

        public async Task<List<Training>> GetAll()
        {
            return _context.Trainings.ToList();
        }

        public async Task<Training> Get(int id)
        {
            return _context.Trainings.Where(t => t.Id == id).SingleOrDefault();
        }

        public async Task Create(Training request)
        {
            _context.Add(request);
            await _context.SaveChangesAsync();
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
