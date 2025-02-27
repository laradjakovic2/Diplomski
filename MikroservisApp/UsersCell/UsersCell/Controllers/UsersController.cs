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
            new User { Id = 1, FirstName = "Lara", LastName = "Dakovic", Email = "laradjakovic00@gmail.com", Password="lara123!" },
            new User { Id = 2, FirstName = "Marta", LastName = "Fer", Email = "lara.dakovic@fer.hr", Password="lara123!" },
        };

        private readonly ILogger<UsersController> _logger;

        public UsersController(ILogger<UsersController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            return users;
        }
        /*
        [HttpPut]
        public IActionResult Create(CreateUserRequest request)
        {
            return NoContent();
        }

        [HttpPut]
        public IActionResult Update(int id)
        {
            return NoContent();
        }*/

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}
