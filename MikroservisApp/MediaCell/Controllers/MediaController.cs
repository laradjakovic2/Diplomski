using Microsoft.AspNetCore.Mvc;
using MediaCell.Interfaces;
using MediaCell.Enums;

namespace MediaCell.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaService _mediaService;

        public MediaController(IMediaService mediaService)
        {
            _mediaService = mediaService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] MediaRequestModel request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File is required");

            var fileUrl = await _mediaService.SaveFileAsync(request.File);

            if(fileUrl != null)
            {
                var mediaId = await _mediaService.SaveMediaRecordAsync(
                    new Entities.Media()
                    {
                        Url = fileUrl,
                        RelatedEntityId = request.RelatedEntityId,
                        EntityType = request.EntityType,
                        MediaType = request.MediaType,
                        CreatedAt = DateTime.UtcNow
                    }
                );
                return Ok(mediaId);
            }
            return BadRequest("Error saving");
        }

        [HttpGet("get-file")]
        public async Task<IActionResult> GetFile([FromQuery] int relatedEntityId, [FromQuery] EntityType entityType)
        {
            var fileUrl = await _mediaService.GetImageUrlAsync(relatedEntityId, entityType);

            if (!string.IsNullOrEmpty(fileUrl))
                return Ok(fileUrl);

            return NotFound("File not found");
        }
    }
}
