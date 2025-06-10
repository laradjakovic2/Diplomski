using Microsoft.AspNetCore.Mvc;
using NotificationsCell.Services;

namespace NotificationsCell.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly ILogger<NotificationsController> _logger;
        public EmailService _emailService;

        public NotificationsController(ILogger<NotificationsController> logger, EmailService emailServce)
        {
            _logger = logger;
            _emailService = emailServce;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            await _emailService.SendEmailAsync("lara.dakovic@fer.hr", "bok", "bokic");
            return Ok("hej notification");
        }
    }
}
