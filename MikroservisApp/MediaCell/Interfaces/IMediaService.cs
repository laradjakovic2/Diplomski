using MediaCell.Entities;
using MediaCell.Enums;

namespace MediaCell.Interfaces
{
    public interface IMediaService
    {
        public Task<int> SaveMediaRecordAsync(Media media);
        public Task<string> GetImageUrlAsync(int relatedEntityId, EntityType entityType);
        public Task<string> SaveFileAsync(IFormFile file);
    }
}
