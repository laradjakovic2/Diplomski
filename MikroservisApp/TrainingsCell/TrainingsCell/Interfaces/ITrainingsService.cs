using Microsoft.EntityFrameworkCore;
using TrainingsCell.Entities;
using TrainingsCell.Services;

namespace TrainingsCell.Interfaces
{
    public interface ITrainingsService
    {
        public Task<List<Training>> GetAll();

        public Task<Training> Get(int id);
        public Task Create(Training request);
        public Task Update(Training request);
        public Task Delete(int id);

        public Task RegisterUserForTrainingType(TrainingTypeMembership request);
        public Task RegisterUserForTraining(UserRegisteredForTraining request);
        public Task UpdateScore(Registration request);
    }
}
