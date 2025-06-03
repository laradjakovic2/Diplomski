using Microsoft.EntityFrameworkCore;
using CompetitionsCell.Entities;
using CompetitionsCell.Services;

namespace CompetitionsCell.Interfaces
{
    public interface ICompetitionsService
    {
        public Task<List<Competition>> GetAll();

        public Task<Competition> Get(int id);
        public Task CreateCompetition(CreateCompetition request);
        public Task UpdateCompetition(Competition request);
        public Task CreateWorkout(CreateWorkout request);
        public Task UpdateWorkout(Workout request);

        public Task RegisterUserForCompetition(UserRegisteredForCompetition request);

        public Task PayCompetitionMembership(CreateCompetitionPayment request);
        public Task UpdateScore(UpdateScoreRequest request);
    }
}
