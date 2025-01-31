using Microsoft.AspNetCore.Mvc;

namespace TrainingsCell.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrainingsController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<TrainingsController> _logger;

        public TrainingsController(ILogger<TrainingsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetTrainings")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}
