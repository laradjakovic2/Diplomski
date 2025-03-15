namespace TrainingsCell.Entities
{
    public class Registration
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string UserEmail { get; set; }

        public int TrainingId { get; set; }

        public string Score { get; set; }

        public virtual Training Training {get;set;}
    }
}
