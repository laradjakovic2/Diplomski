using Microsoft.EntityFrameworkCore;
using PaymentsCell.Entities;

namespace PaymentsCell
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<CompetitionPayment> CompetitionPayments { get; set; }
    }
}
