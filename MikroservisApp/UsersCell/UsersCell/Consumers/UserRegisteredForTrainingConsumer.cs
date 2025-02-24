using MassTransit;
using System;

namespace UsersCell.Consumers
{
    public class UserRegisteredForTraining
    {
        public int UserId { get; set; }
        public int TrainingId { get; set; }
    }
    public class UserRegisteredForTrainingConsumer : IConsumer<UserRegisteredForTraining>
    {
        /*private readonly AppDbContext _dbContext;

        public UserRegisteredForTrainingConsumer(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }*

        public async Task Consume(ConsumeContext<UserRegisteredForTraining> context)
        {
            var user = await _dbContext.Users.FindAsync(context.Message.UserId);

            if (user != null)
            {
                user.Trainings.Add(context.Message.TrainingId);
                await _dbContext.SaveChangesAsync();
            }
        }*/
        public Task Consume(ConsumeContext<UserRegisteredForTraining> context)
        {
            throw new NotImplementedException();
        }
    }

}
