using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using CompetitionsCell.Entities;

namespace CompetitionsCell
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Competition> Competitions { get; set; }

        public DbSet<Result> Results { get; set; }

        public DbSet<Workout> Workouts { get; set; }

        public DbSet<CompetitionMembership> CompetitionMemberships { get; set; }
    }
}
