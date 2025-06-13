using Microsoft.AspNetCore.Mvc;
using MediaCell.Interfaces;
using MediaCell.Enums;
using MediaCell.Services;

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

        [HttpGet("get-file-url")]
        public async Task<IActionResult> GetFileUrl([FromQuery] int relatedEntityId, [FromQuery] EntityType entityType)
        {
            var media = await _mediaService.GetMediaFromDb(relatedEntityId, entityType);

            if (!string.IsNullOrEmpty(media?.Url))
                return Ok(media.Url);

            return NotFound("File not found");

        }

        //ovo bas i nije dobro, bolje je da se dohvati url i onda display sliku sa clouda
        [HttpGet("get-file-azurite")]
        public async Task<IActionResult> GetFileAzurites([FromQuery] int relatedEntityId, [FromQuery] EntityType entityType)
        {
            try
            {
                var media = await _mediaService.GetMediaFromDb(relatedEntityId, entityType);

                if (string.IsNullOrEmpty(media?.Url))
                    return NotFound("Media url not found");

                var file = await _mediaService.GetFileFromUrlAzurites(media.Url);

                if (file == null)
                    return NotFound("File not found");

                return Ok(file);
            }
            catch
            {
                return StatusCode(500, "Error fetching file.");
            }
        }

        //radi-uploada na www root
        [HttpPost("upload")]
        public async Task<IActionResult> UploadWWWRoot([FromForm] MediaRequestModel request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File is required");

            var fileUrl = await _mediaService.SaveFileWWWRoot(request.File);

            if (fileUrl != null)
            {
                var mediaId = await _mediaService.SaveMediaUrlDb(
                    new Entities.Media()
                    {
                        Url = fileUrl,
                        RelatedEntityId = request.RelatedEntityId,
                        EntityType = request.EntityType,
                        MediaType = request.MediaType,
                        CreatedAt = DateTime.UtcNow
                    }
                );
                return Ok(new { mediaId, fileUrl });
            }
            return StatusCode(500, "Error saving.");
        }

        [HttpPost("upload-azurite")]
        public async Task<IActionResult> UploadAzurite([FromForm] MediaRequestModel request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File is required.");

            try
            {
                var blobUrl = await _mediaService.SaveFileAzurites(request.File);

                if (blobUrl == null)
                {
                    return StatusCode(500, "Error saving.");
                }

                var mediaId = await _mediaService.SaveMediaUrlDb(
                    new Entities.Media()
                    {
                        Url = blobUrl,
                        RelatedEntityId = request.RelatedEntityId,
                        EntityType = request.EntityType,
                        MediaType = request.MediaType,
                        CreatedAt = DateTime.UtcNow
                    }
                );

                return Ok(new { mediaId, blobUrl });
            }
            catch
            {
                return StatusCode(500, "Error saving.");
            }
        }
    }
}
