using MassTransit;
using MassTransit.Transports;
using MassTransit.RabbitMqTransport;
using TrainingsCell.Interfaces;

namespace TrainingsCell.Services
{
    public class UserRegisteredForTraining
    {
        public int UserId { get; set; }
        public int TrainingId { get; set; }
    }
    public class TrainingsService : ITrainingsService
    {
        private readonly IPublishEndpoint _publishEndpoint;

        public TrainingsService(IPublishEndpoint publishEndpoint)
        {
            _publishEndpoint = publishEndpoint;
        }
        public async Task RegisterUserForTraining(int userId, int trainingId)
        {
            /*var training = _dbContext.Trainings.Find(trainingId);

            if (training != null)
            {
                training.RegisteredUsers.Add(userId);
                await _dbContext.SaveChangesAsync();

                
            }*/

            // Šaljemo event u RabbitMQ
            await _publishEndpoint.Publish(new UserRegisteredForTraining
            {
                UserId = userId,
                TrainingId = trainingId
            });
        }
    }
}
