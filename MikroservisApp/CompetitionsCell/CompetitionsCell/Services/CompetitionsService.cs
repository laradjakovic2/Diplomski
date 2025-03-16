using CompetitionsCell.Interfaces;
using System.Text;
using System.Text.Json;
using CompetitionsCell.Entities;

namespace CompetitionsCell.Services
{
    public class UserRegisteredForCompetition
    {
        public int UserId { get; set; }
        public int CompetitionId { get; set; }

        public string UserEmail { get; set; }
    }

    public class CreateWorkout
    {
        public string? Description { get; set; }
        public string? Title { get; set; }

        public int? CompetitionId { get; set; }

        public int ScoreType { get; set; }
    }
    public class CompetitionsService : ICompetitionsService
    {
        private AppDbContext _context;
        public CompetitionsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Competition>> GetAll()
        {
            return _context.Competitions.ToList();
        }

        public async Task<Competition> Get(int id)
        {
            return _context.Competitions.Where(t => t.Id == id).SingleOrDefault();
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

        public async Task UpdateScore(Result request)
        {
            var entity = _context.Results.Where(t => t.Id == request.Id).SingleOrDefault();

            if (entity == null)
            {
                //TODO provjeriti radi li ovo
                request.Workout = null;
                _context.Add(request);
            }
            else
            {
                entity.Score = request.Score;
            }

            await _context.SaveChangesAsync();
        }
    }
}
