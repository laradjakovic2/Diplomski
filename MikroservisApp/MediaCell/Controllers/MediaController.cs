using Microsoft.AspNetCore.Mvc;
using MediaCell.Interfaces;

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
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required");

            var fileUrl = await _mediaService.SaveFileAsync(file);


            var mediaId = await _mediaService.SaveMediaRecordAsync(new Entities.Media() { Url=file.FileName, RelatedEntityId=1, CreatedAt=DateTime.Now});

            return Ok(mediaId);
        }

        [HttpGet("image/{Id}")]
        public async Task<IActionResult> GetImage(int Id)
        {
            var imageUrl = await _mediaService.GetImageUrlByIdAsync(Id);

            if (imageUrl == null)
                return NotFound();

            return Ok(imageUrl);
        }
    }
}
