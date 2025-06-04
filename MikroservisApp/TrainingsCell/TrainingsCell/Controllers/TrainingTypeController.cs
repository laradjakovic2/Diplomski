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
    public class TrainingTypeController : ControllerBase
    {
        private readonly ILogger<TrainingTypeController> _logger;
        private ITrainingsService _trainingsService { get; set; }

        public TrainingTypeController(ILogger<TrainingTypeController> logger, ITrainingsService trainingsService)
        {
            _logger = logger;
            _trainingsService = trainingsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _trainingsService.GetAllTrainingTypes();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _trainingsService.GetTrainingType(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTrainingType request)
        {
            await _trainingsService.CreateTrainingType(request);
            return Created();
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] TrainingType request)
        {
            await _trainingsService.UpdateTrainingType(request);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _trainingsService.DeleteTrainingType(id);
            return Ok();
        }
    }
}
