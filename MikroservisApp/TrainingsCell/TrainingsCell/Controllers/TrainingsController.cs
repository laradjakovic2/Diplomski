using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TrainingsCell.Entities;
using TrainingsCell.Interfaces;
using TrainingsCell.Services;

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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _trainingsService.GetAll();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _trainingsService.Get(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Training request)
        {
            await _trainingsService.Create(request);
            return Created();
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Training request)
        {
            await _trainingsService.Update(request);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _trainingsService.Delete(id);
            return Ok();
        }

        [HttpPost("register-user-for-training")]
        public IActionResult RegisterUserForTraining([FromBody] UserRegisteredForTraining request)
        {
            _trainingsService.RegisterUserForTraining(request);
            return Ok();
        }

        [HttpPost("register-user-for-membership")]
        public async Task<IActionResult> Create([FromBody] TrainingTypeMembership request)
        {
            await _trainingsService.RegisterUserForTrainingType(request);
            return Ok();
        }

        [HttpPut("update-score")]
        public async Task<IActionResult> Update([FromBody] Registration request)
        {
            await _trainingsService.UpdateScore(request);
            return Ok();
        }
    }
}
