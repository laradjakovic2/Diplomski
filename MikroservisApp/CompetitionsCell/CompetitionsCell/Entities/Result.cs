namespace CompetitionsCell.Entities
{
    public class Result
    {
        public int Id { get; set; }

        public int? WorkoutId { get; set; }

        public int UserId { get; set; }
        public string? UserEmail { get; set; }

        public string? Score { get; set; }

        //public virtual Workout? Workout { get; set; }
    }
}
