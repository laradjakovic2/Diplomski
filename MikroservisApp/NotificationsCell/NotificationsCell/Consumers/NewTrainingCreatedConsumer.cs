using MassTransit;

namespace NotificationsCell.Consumers
{
    public class NewTrainingCreated
    {
        public int TrainingId { get; set; }
    }
    public class NewTrainingCreatedConsumer : IConsumer<NewTrainingCreated>
    {
        /*private readonly INotificationService _notificationService;

        public NewTrainingCreatedConsumer(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task Consume(ConsumeContext<NewTrainingCreated> context)
        {
            await _notificationService.SendNotification(
                $"Novi trening: {context.Message.Title} na datum {context.Message.Date}");
        }*/
        public Task Consume(ConsumeContext<NewTrainingCreated> context)
        {
            throw new NotImplementedException();
        }
    }
}
