using TrainingsCell.Entities;
using TrainingsCell.Services;

namespace TrainingsCell.Interfaces
{
    public interface ITrainingsService
    {
        public Task Create(Training request);
        public Task Update(Training request);
        public Task Delete(int id);
        public Task RegisterUserForTraining(UserRegisteredForTraining request);
    }
}
