using UsersCell.Interfaces;
using UsersCell.Entities;
using UsersCell.Infrastructure;

namespace UsersCell.Services
{
    public class CreateUser
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }

        public int? RoleId { get; set; }
    }
    public class UsersService(AppDbContext _context, TokenProvider tokenProvider) : IUsersService
    {
        public async Task<List<User>> GetAll()
        {
            return _context.Users.ToList();
        }

        public async Task<User> Get(int id)
        {
            return _context.Users.Where(t => t.Id == id).SingleOrDefault();
        }

        public async Task<string> Create(CreateUser request)
        {
            var user = new User
            {
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Password = request.Password,
                RoleId = request.RoleId,
                EmailVerified = false,
            };

            _context.Add(user);

            await _context.SaveChangesAsync();

            var user1 = _context.Users.Where(t => t.Email == request.Email).SingleOrDefault();

            if (user1 == null)
            {
                throw new Exception("User not found");
            }

            string token = tokenProvider.Create(user1);

            return token;
        }

        public async Task Update(User request)
        {
            var user = _context.Users.Where(user => user.Id == request.Id).SingleOrDefault();

            user.FirstName = request.FirstName;

            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var user = _context
                .Users
                .Where(user => user.Id == id)
                .SingleOrDefault();

            _context.Remove(user);

            await _context.SaveChangesAsync();
        }

        public async Task<string> Login(User request)
        {
            var user = _context.Users.Where(t => t.Email == request.Email).SingleOrDefault();

            if (user == null)
            {
                throw new Exception("User not found");
            }

            string token = tokenProvider.Create(user);

            return token;
        }
    }
}
