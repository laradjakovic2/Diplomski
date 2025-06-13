using PaymentsCell.Models;
using PaymentsCell.Entities;

namespace PaymentsCell.Interfaces
{
    public interface IPaymentService
    {
        public Task<CompetitionPayment> GetCompetitionPayment(string userEmail, int competitionId);
        public Task<List<CompetitionPayment>> GetAllCompetitionPayments();
        public Task<int> SaveCompetitionPayment(CreateCompetitionPayment payment);
    }
}
