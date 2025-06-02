namespace CompetitionsCell.Entities
{
    public class CompetitionMembership
    {
        public int Id { get; set; }
        public int? CompetitionId { get; set; }

        public int UserId { get; set; }
        public string? UserEmail { get; set; }

        //public virtual Competition? Competition { get; set; }
    }
}
