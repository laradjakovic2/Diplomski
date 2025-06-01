namespace CompetitionsCell.Entities
{
    public class Competition
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Title { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string? Location { get; set; }
        public virtual ICollection<CompetitionMembership> CompetitionMemberships { get; set; } = new List<CompetitionMembership>();
        public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    }
}
