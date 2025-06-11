using CompetitionsCell.Interfaces;
using System.Text;
using System.Text.Json;
using CompetitionsCell.Entities;
using Microsoft.EntityFrameworkCore;

namespace CompetitionsCell.Services
{
    public class UserRegisteredForCompetition
    {
        public int UserId { get; set; }
        public int CompetitionId { get; set; }

        public required string UserEmail { get; set; }
    }

    public class CreateCompetition
    {
        public string? Description { get; set; }
        public string? Title { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string? Location { get; set; }
    }

    public class CreateWorkout
    {
        public string? Description { get; set; }
        public string? Title { get; set; }

        public int? CompetitionId { get; set; }

        public int ScoreType { get; set; }
    }

    public class CreateCompetitionPayment
    {
        public int UserId { get; set; }
        public int CompetitionId { get; set; }
        public required string UserEmail { get; set; }
        public double Price { get; set; }
        public double Tax { get; set; }
        public double Total { get; set; }
    }

    public class UpdateResult
    {
        public int? Id { get; set; }

        public int? WorkoutId { get; set; }

        public int UserId { get; set; }
        public string? UserEmail { get; set; }

        public string Score { get; set; }
    }

    public class UpdateScoreRequest
    {
        public List<UpdateResult> Scores { get; set; } = new List<UpdateResult>();
    }

    public class CompetitionsService : ICompetitionsService
    {
        private AppDbContext _context;

        public IRabbitMqSender _rabbitMqSenderNotifications;
        public IRabbitMqSender _rabbitMqSenderPayments;

        public CompetitionsService(AppDbContext context,
        IRabbitMqSenderPayments rabbitMqSenderPayments,
        IRabbitMqSenderNotifications rabbitMqSenderNotifications)
        {
            _rabbitMqSenderNotifications = rabbitMqSenderNotifications;
            _rabbitMqSenderPayments = rabbitMqSenderPayments;
            _context = context;
        }

        public async Task<List<Competition>> GetAll()
        {
            return _context.Competitions.ToList();
        }

        public async Task<Competition?> Get(int id)
        {
            var competition = _context.Competitions
                //.Include(c => c.CompetitionMemberships)
                /*.Include(c => c.Workouts)
                    .ThenInclude(w => w.Results)*/
                .Where(t => t.Id == id)
                .SingleOrDefault();

            if (competition == null)
            {
                return null;
            }

            var workouts = _context.Workouts.Include(w => w.Results).Where(t => t.CompetitionId == id).ToList();
            var memberships = _context.CompetitionMemberships.Where(t => t.CompetitionId == id).ToList();
            competition.Workouts = workouts;
            competition.CompetitionMemberships = memberships;

            return competition;
        }

        public async Task CreateCompetition(CreateCompetition request)
        {
            var entity = new Competition
            {
                Description = request.Description,
                Title = request.Title,
                Location = request.Location,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            _context.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCompetition(Competition request)
        {
            var entity = _context.Competitions.Where(t => t.Id == request.Id).SingleOrDefault();

            if(entity == null){
                return;
            }

            entity.Title = request.Title;
            entity.Description = request.Description;
            entity.Location = request.Location;
            entity.StartDate = request.StartDate;
            entity.EndDate = request.EndDate;

            await _context.SaveChangesAsync();
        }

        public async Task CreateWorkout(CreateWorkout request)
        {
            var entity = new Workout
            {
                Description = request.Description,
                Title = request.Title,
                CompetitionId = request.CompetitionId,
                ScoreType = request.ScoreType
            };

            _context.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateWorkout(Workout request)
        {
            var entity = _context.Workouts.Where(t => t.Id == request.Id).SingleOrDefault();

            if (entity == null)
            {
                return;
            }

            entity.Title = request.Title;
            entity.Description = request.Description;

            await _context.SaveChangesAsync();
        }

        public async Task RegisterUserForCompetition(UserRegisteredForCompetition request)
        {
            var entity = new CompetitionMembership
            {
                UserId = request.UserId,
                CompetitionId = request.CompetitionId,
                UserEmail = request.UserEmail,
            };
            _context.Add(entity);

            await _context.SaveChangesAsync();
        }

        public async Task NotifyRegistration(UserRegisteredForCompetition request)
        {
            byte[] messageBodyBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(request));

            await _rabbitMqSenderNotifications.SendMessage(messageBodyBytes); //obavijesti notifications
        }

        public async Task PayCompetitionMembership(CreateCompetitionPayment request)
        {
            byte[] messageBodyBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(request));

            await _rabbitMqSenderPayments.SendMessage(messageBodyBytes);
        }

        public async Task UpdateScore(UpdateScoreRequest request)
        {
            foreach (var score in request.Scores)
            {
                if (score.Id == null)
                {
                    var entity = new Result
                    {
                        WorkoutId = score.WorkoutId,
                        UserId = score.UserId,
                        UserEmail = score.UserEmail,
                        Score = score.Score
                    };

                    _context.Results.Add(entity);
                }
                else
                {
                    var entity = _context.Results.Where(t => t.Id == score.Id).SingleOrDefault();
                    if (entity == null)
                    {
                        return;
                    }
                    entity.Score = score.Score;
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
