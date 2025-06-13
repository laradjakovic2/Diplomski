using PaymentsCell.Entities;
using PaymentsCell.Interfaces;
using PaymentsCell.Models;

namespace PaymentsCell.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;
        public PaymentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CompetitionPayment> GetCompetitionPayment(string userEmail, int competitionId)
        {
            var entity = _context.CompetitionPayments
                   .Where(p => p.UserEmail == userEmail && p.CompetitionId == competitionId)
                   .SingleOrDefault();

            return entity;
        }

        public async Task<int> SaveCompetitionPayment(CreateCompetitionPayment payment)
        {
            var competitionPayment = new CompetitionPayment
            {
                UserId = payment.UserId,
                UserEmail = payment.UserEmail,
                CompetitionId = payment.CompetitionId,
                Price = payment.Price,
                Tax = payment.Tax,
                Total = payment.TotalPrice,
            };

            _context.CompetitionPayments.Add(competitionPayment);
            await _context.SaveChangesAsync();

            return competitionPayment.Id;
        }
    }
}
