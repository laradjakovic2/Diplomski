using MediaCell.Entities;
using MediaCell.Interfaces;

namespace MediaCell.Services
{
    public class MediaService : IMediaService
    {
        private readonly AppDbContext _context;
        public MediaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> SaveMediaRecordAsync(Media media)
        {
            _context.Medias.Add(media);
            await _context.SaveChangesAsync();

            return media.Id;
        }

        public async Task<Media?> GetImageUrlByIdAsync(int Id)
        {
            var media = _context.Medias
                .Where(cm => cm.Id == Id)
                .SingleOrDefault();

            return media;
        }

        public async Task<string> SaveFileAsync(IFormFile file)
        {
            var filePath = Path.Combine("wwwroot/uploads", file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{file.FileName}";
        }
    }
}
