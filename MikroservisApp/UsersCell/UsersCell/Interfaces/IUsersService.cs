using UsersCell.Entities;

namespace UsersCell.Interfaces
{
    public interface IUsersService
    {
        public Task<List<User>> GetAll();

        public Task<User> Get(int id);
        public Task Create(User request);
        public Task Update(User request);
        public Task Delete(int id);
    }
}
