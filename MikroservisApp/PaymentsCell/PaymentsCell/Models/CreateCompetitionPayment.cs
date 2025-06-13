namespace PaymentsCell.Models
{
    public class CreateCompetitionPayment
    {
        public int UserId { get; set; }
        public int CompetitionId { get; set; }
        public required string UserEmail { get; set; }
        public double Price { get; set; }
        public double Tax { get; set; }
        public double TotalPrice { get; set; }
    }
}
