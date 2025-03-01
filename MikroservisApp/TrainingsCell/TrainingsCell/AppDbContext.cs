using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TrainingsCell.Entities;

namespace TrainingsCell
{
    public class AppDbContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public AppDbContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(Configuration.GetConnectionString("Database"));
        }

        public DbSet<Training> Trainings { get; set; }
    }
}
