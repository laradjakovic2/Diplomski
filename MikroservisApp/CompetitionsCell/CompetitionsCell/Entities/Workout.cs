namespace CompetitionsCell.Entities
{
    public class Workout
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Title { get; set; }

        public int? CompetitionId { get; set; }

        public int ScoreType { get; set; }

        public virtual Competition? Competition { get; set; }
    }
}
