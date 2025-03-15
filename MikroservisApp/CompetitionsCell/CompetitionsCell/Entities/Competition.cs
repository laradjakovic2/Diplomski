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
    }
}
