using Microsoft.AspNetCore.Mvc;
using UsersCell.Models;

namespace UsersCell.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {

        private static IEnumerable<User> users = new List<User>
        {
            new User { Id = 1, FirstName = "Lara", LastName = "Dakovic", Email = "laradjakovic00@gmail.com" },
            new User { Id = 2, FirstName = "Ema", LastName = "Petrovic", Email = "ema.petrovic@example.com" },
        };

        private readonly ILogger<UsersController> _logger;

        public UsersController(ILogger<UsersController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetUsers")]
        public IEnumerable<User> Get()
        {
            return users;
        }
    }
}
