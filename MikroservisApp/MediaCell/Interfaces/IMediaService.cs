using Azure.Storage.Blobs.Models;
using MediaCell.Entities;
using MediaCell.Enums;

namespace MediaCell.Interfaces
{
    public interface IMediaService
    {
        public Task<int> SaveMediaUrlDb(Media media);
        public Task<Media?> GetMediaFromDb(int relatedEntityId, EntityType entityType);
        public Task<string> SaveFileWWWRoot(IFormFile file);
        public Task<string> SaveFileAzurites(IFormFile file);
        public Task<BlobDownloadInfo?> GetFileFromUrlAzurites(string url);
    }
}
