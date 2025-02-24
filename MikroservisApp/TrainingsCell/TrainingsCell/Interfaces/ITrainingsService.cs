namespace TrainingsCell.Interfaces
{
    public interface ITrainingsService
    {
        public Task RegisterUserForTraining(int userId, int trainingId);
    }
}
