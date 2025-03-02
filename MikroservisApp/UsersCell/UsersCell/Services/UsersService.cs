using UsersCell.Interfaces;
using UsersCell.Entities;

namespace UsersCell.Services
{
    public class UsersService : IUsersService
    {
        private AppDbContext _context;
        public UsersService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<User>> GetAll()
        {
            return _context.Users.ToList();
        }

        public async Task<User> Get(int id)
        {
            return _context.Users.Where(t => t.Id == id).SingleOrDefault();
        }

        public async Task Create(User request)
        {
            _context.Add(request);
            await _context.SaveChangesAsync();
        }

        public async Task Update(User request)
        {

        }

        public async Task Delete(int id)
        {

        }
    }
}
