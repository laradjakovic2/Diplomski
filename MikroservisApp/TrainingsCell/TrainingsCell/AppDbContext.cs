using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TrainingsCell.Entities;

namespace TrainingsCell
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Training> Trainings { get; set; }

        public DbSet<Registration> Registrations { get; set; }

        public DbSet<TrainingType> TrainingTypes { get; set; }

        public DbSet<TrainingTypeMembership> TrainingTypeMemberships { get; set; }
    }
}
