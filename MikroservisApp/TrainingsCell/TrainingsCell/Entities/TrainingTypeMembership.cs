namespace TrainingsCell.Entities
{
    public class TrainingTypeMembership
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int TrainingTypeId { get; set; }

        public virtual TrainingType TrainingType {get;set;}
    }
}
