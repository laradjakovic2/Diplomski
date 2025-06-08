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

    public class CreateTrainingTypeMembership
    {
        public int UserId { get; set; }

        public string UserEmail { get; set; }

        public int TrainingTypeId { get; set; }
    }

    public class CreateTraining
    {
        public string? Description { get; set; }
        public string? Title { get; set; }
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int TrainerId { get; set; }

        public string? TrainerEmail { get; set; }

        public int? TrainingTypeId { get; set; }
        public int ScoreType { get; set; }
    }

    public class CreateTrainingType
    {
        public string Description { get; set; }
        public string Title { get; set; }
    }

    public class TrainingsService : ITrainingsService
    {
        private AppDbContext _context;
        public IRabbitMqSender _rabbitMqSenderUsers;
        public IRabbitMqSender _rabbitMqSenderNotifications;
        public TrainingsService(AppDbContext context,
        IRabbitMqSenderUsers rabbitMqSenderUsers,
        IRabbitMqSenderNotifications rabbitMqSenderNotifications)
        {
            _rabbitMqSenderUsers = rabbitMqSenderUsers;
            _rabbitMqSenderNotifications = rabbitMqSenderNotifications;
           _context = context;
        }

        public async Task<List<Training>> GetAll()
        {
            return _context.Trainings.ToList();
        }

        public async Task<Training> Get(int id)
        {
            var training = _context.Trainings.Where(t => t.Id == id).SingleOrDefault();

            training.RegisteredAthletes = _context.Registrations.Where(t => t.TrainingId == id).ToList();

            return training;
        }

        public async Task Create(CreateTraining request)
        {
            var entity = new Training
            {
                Description = request.Description,
                Title = request.Title,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TrainerId = request.TrainerId,
                TrainerEmail = request.TrainerEmail,
                TrainingTypeId = request.TrainingTypeId,
                ScoreType = request.ScoreType
            };

            _context.Add(entity);
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
        }

        public async Task NotifyRegistration(UserRegisteredForTraining request)
        {
            byte[] messageBodyBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(request));

            //TODO ovo posloziti da radi nakon save changes
            //await _rabbitMqSenderUsers.SendMessage(messageBodyBytes); //obavijesti usere
            await _rabbitMqSenderNotifications.SendMessage(messageBodyBytes); //obavijesti notifications
        }

        public async Task RegisterUserForTrainingType(CreateTrainingTypeMembership request)
        {
            var entity = new TrainingTypeMembership
            {
                UserId = request.UserId,
                TrainingTypeId = request.TrainingTypeId,
            };

            _context.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateScore(Registration request)
        {
            var entity = _context.Registrations.Where(t => t.Id == request.Id).SingleOrDefault();

            entity.Score = request.Score;

            await _context.SaveChangesAsync();
        }

        public async Task<List<TrainingType>> GetAllTrainingTypes()
        {
            return _context.TrainingTypes.ToList();
        }

        public async Task<TrainingType> GetTrainingType(int id)
        {
            return _context.TrainingTypes.Where(t => t.Id == id).SingleOrDefault();
        }

        public async Task CreateTrainingType(CreateTrainingType request)
        {
            var entity = new TrainingType
            {
                Description = request.Description,
                Title = request.Title,
            };

            _context.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTrainingType(TrainingType request)
        {
            var entity = _context.TrainingTypes.Where(t => t.Id == request.Id).SingleOrDefault();

            entity.Title = request.Title;
            entity.Description = request.Description;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteTrainingType(int id)
        {
            var entity = _context
                .TrainingTypes
                .Where(t => t.Id == id)
                .SingleOrDefault();

            _context.Remove(entity);

            await _context.SaveChangesAsync();
        }
    }
}
