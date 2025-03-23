namespace NotificationsCell.Models
{
    public class UserRegisteredForCompetitionModel
    {
        public int UserId { get; set; }
        public int CompetitionId { get; set; }

        public string UserEmail { get; set; }
    }
}
