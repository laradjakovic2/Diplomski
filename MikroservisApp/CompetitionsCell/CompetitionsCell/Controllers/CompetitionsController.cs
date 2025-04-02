using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CompetitionsCell.Entities;
using CompetitionsCell.Interfaces;
using CompetitionsCell.Services;

namespace CompetitionsCell.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CompetitionsController : ControllerBase
    {
        private readonly ILogger<CompetitionsController> _logger;
        private ICompetitionsService _competitionsService { get; set; }
        private readonly MediaServiceClient _mediaServiceClient;

        public CompetitionsController(ILogger<CompetitionsController> logger, ICompetitionsService competitionsService, MediaServiceClient mediaServiceClient)
        {
            _logger = logger;
            _competitionsService = competitionsService;
            _mediaServiceClient = mediaServiceClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _competitionsService.GetAll();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _competitionsService.Get(id);
            return Ok(result);
        }

        [HttpPost("workout")]
        public async Task<IActionResult> CreateWorkout([FromBody] CreateWorkout request)
        {
            await _competitionsService.CreateWorkout(request);
            return Created();
        }

        [HttpPut("workout")]
        public async Task<IActionResult> UpdateWorkout([FromBody] Workout request)
        {
            await _competitionsService.UpdateWorkout(request);
            return Ok();
        }

        [HttpPost("pay-competition-membership")]
        public IActionResult PayCompetitionMembership()
        {
            _competitionsService.PayCompetitionMembership();
            return Ok();
        }

        [HttpPost("register-user-for-competition")]
        public IActionResult RegisterUserForCompetition([FromBody] UserRegisteredForCompetition request)
        {
            _competitionsService.RegisterUserForCompetition(request);
            return Ok();
        }

        [HttpPut("update-score")]
        public async Task<IActionResult> UpdateScore([FromBody] Result request)
        {
            await _competitionsService.UpdateScore(request);
            return Ok();
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage([FromForm] MediaRequestModel request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File is required");

            var mediaId = await _mediaServiceClient.UploadImageAsync(request);

            return Ok(new { MediaId = mediaId });
        }

        [HttpGet("{competitionId}/image-url")]
        public async Task<IActionResult> GetImageUrl(int competitionId)
        {
            var imageUrl = await _mediaServiceClient.GetImageUrlAsync(competitionId, Enums.EntityType.Competition);

            if (string.IsNullOrEmpty(imageUrl))
                return NotFound();

            return Ok(new { ImageUrl = imageUrl });
        }
    }
}
