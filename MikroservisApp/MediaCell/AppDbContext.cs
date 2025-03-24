using Microsoft.EntityFrameworkCore;
using MediaCell.Entities;

namespace MediaCell
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Media> Medias { get; set; }
    }
}
