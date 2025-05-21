using UsersCell.Entities;
using UsersCell.Services;

namespace UsersCell.Interfaces
{
    public interface IUsersService
    {
        public Task<List<User>> GetAll();

        public Task<User> Get(int id);
        public Task<string> Create(CreateUser request);

        public Task<string> Login(User request);
        public Task Update(User request);
        public Task Delete(int id);
    }
}
