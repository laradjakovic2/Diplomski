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

        public string UserEmail { get; set; }
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
            var entity = _context.Trainings.Where(t => t.Id == request.Id).SingleOrDefault();

            entity.Title = request.Title;
            entity.Description = request.Description;

            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = _context
                .Trainings
                .Where(t => t.Id == id)
                .SingleOrDefault();

            _context.Remove(entity);

            await _context.SaveChangesAsync();
        }

        public async Task RegisterUserForTraining(UserRegisteredForTraining request)
        {
            var entity = new Registration
            {
                UserId = request.UserId,
                TrainingId = request.TrainingId,
                UserEmail = request.UserEmail,
                Score = ""
            };
            _context.Registrations.Add(entity);
            await _context.SaveChangesAsync();

            byte[] messageBodyBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(request));

            await _rabbitMqSenderUsers.SendMessage(messageBodyBytes); //obavijesti usere
            await _rabbitMqSenderNotifications.SendMessage(messageBodyBytes); //obavijesti notifications
        }

        public async Task RegisterUserForTrainingType(TrainingTypeMembership request)
        {
            _context.Add(request);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateScore(Registration request)
        {
            var entity = _context.Registrations.Where(t => t.Id == request.Id).SingleOrDefault();

            entity.Score = request.Score;

            await _context.SaveChangesAsync();
        }
    }
}
