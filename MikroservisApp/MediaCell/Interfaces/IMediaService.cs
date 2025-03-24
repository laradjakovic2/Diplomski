using MediaCell.Entities;

namespace MediaCell.Interfaces
{
    public interface IMediaService
    {
        public Task<int> SaveMediaRecordAsync(Media media);
        public Task<Media?> GetImageUrlByIdAsync(int Id);
        public Task<string> SaveFileAsync(IFormFile file);
    }
}
