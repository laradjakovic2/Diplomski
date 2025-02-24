using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using TrainingsCell.Entities;
using TrainingsCell.Interfaces;

namespace TrainingsCell.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrainingsController : ControllerBase
    {
        private readonly ILogger<TrainingsController> _logger;
        private ITrainingsService _trainingsService { get; set; }

        public TrainingsController(ILogger<TrainingsController> logger, ITrainingsService trainingsService)
        {
            _logger = logger;
            _trainingsService = trainingsService;
        }

        /*[HttpGet]
        public IActionResult<IEnumerable<Training>> Get(int id)
        {

        }*/

        [HttpPost]
        public IActionResult Create()
        {
            return Created();
        }

        [HttpPut]
        public IActionResult Update()
        {
            return Ok();
        }

        [HttpDelete]
        public IActionResult Delete()
        {
            return Ok();
        }

        [HttpPost("{trainingId}/register/{userId}")]
        public IActionResult RegisterUserForTraining(int trainingId, int userId)
        {
            _trainingsService.RegisterUserForTraining(userId, trainingId);
            return Ok();
        }
    }
}
