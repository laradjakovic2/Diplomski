namespace TrainingsCell.Entities
{
    public class Training
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Title { get; set; }
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int TrainerId { get; set; }

        public string? TrainerEmail { get; set; }

        public int? TrainingTypeId { get; set; }
        public int ScoreType { get; set; }

        public virtual TrainingType? TrainingType { get; set; }
    }
}
