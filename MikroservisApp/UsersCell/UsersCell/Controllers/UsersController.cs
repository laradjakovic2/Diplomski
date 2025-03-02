using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UsersCell.Interfaces;
using UsersCell.Entities;

namespace UsersCell.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        IUsersService _usersService;

        private readonly ILogger<UsersController> _logger;

        public UsersController(ILogger<UsersController> logger, IUsersService userService)
        {
            _logger = logger;
            _usersService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _usersService.GetAll();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _usersService.Get(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(User request)
        {
            await _usersService.Create(request);
            return Created();
        }

        [HttpPut]
        public IActionResult Update(User request)
        {
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return Ok();
        }
    }
}
