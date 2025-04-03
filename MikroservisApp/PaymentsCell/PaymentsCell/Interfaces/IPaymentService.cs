using PaymentsCell.Models;

namespace PaymentsCell.Interfaces
{
    public interface IPaymentService
    {
        public Task<int> SaveCompetitionPayment(CreateCompetitionPayment payment);
    }
}
