using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UsersCell.Interfaces;
using UsersCell.Entities;
using Microsoft.AspNetCore.Authorization;
using UsersCell.Services;

namespace UsersCell.Controllers
{
    [Authorize]
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

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register(CreateUser request)
        {
            var token = await _usersService.Create(request);
            return Ok(token);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUser request)
        {
            var token = await _usersService.Login(request);
            return Ok(token);
        }

        [HttpPut]
        public async Task<IActionResult> Update(User request)
        {
            await _usersService.Update(request);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _usersService.Delete(id);

            return Ok();
        }
    }
}
