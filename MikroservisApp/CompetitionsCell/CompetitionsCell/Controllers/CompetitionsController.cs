using Microsoft.AspNetCore.Mvc;

namespace CompetitionsCell.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CompetitionsController : ControllerBase
    {
        private readonly ILogger<CompetitionsController> _logger;

        public CompetitionsController(ILogger<CompetitionsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("bok");
        }
    }
}
