namespace NotificationsCell.Models
{
    public class UserRegisteredForTrainingModel
    {
        public int UserId { get; set; }
        public string? UserEmail { get; set; }

        public int TrainingId { get; set; }

        public string? TrainingName { get; set; }
    }
}
