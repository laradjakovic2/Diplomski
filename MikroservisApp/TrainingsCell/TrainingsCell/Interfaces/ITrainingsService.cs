using Microsoft.EntityFrameworkCore;
using TrainingsCell.Entities;
using TrainingsCell.Services;

namespace TrainingsCell.Interfaces
{
    public interface ITrainingsService
    {
        public Task<List<Training>> GetAll();

        public Task<Training> Get(int id);
        public Task Create(CreateTraining request);
        public Task Update(Training request);
        public Task Delete(int id);

        public Task RegisterUserForTrainingType(CreateTrainingTypeMembership request);
        public Task RegisterUserForTraining(UserRegisteredForTraining request);
        public Task UpdateScore(Registration request);

        public Task<TrainingType> GetTrainingType(int id);

        public Task CreateTrainingType(CreateTrainingType request);

        public Task UpdateTrainingType(TrainingType request);

        public Task DeleteTrainingType(int id);
    }
}
