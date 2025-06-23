using MediaCell.Entities;
using MediaCell.Enums;
using MediaCell.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage;

namespace MediaCell.Services;

public class MediaService : IMediaService
{
    private readonly AppDbContext _context;

    private const string connectionString = "UseDevelopmentStorage=true";
    private const string containerName = "images";
    private const string rootPath = "wwwroot";
    private const string uploadsFolder = "uploads";
    private const string baseUrl = "http://localhost:5006";
    public MediaService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<int> SaveMediaUrlDb(Media media)
    {
        _context.Medias.Add(media);
        await _context.SaveChangesAsync();

        return media.Id;
    }

    #region Local
    public async Task<Media?> GetMediaFromDb(int relatedEntityId, EntityType entityType)
    {
        var media = _context.Medias
            .Where(cm => cm.RelatedEntityId == relatedEntityId && cm.EntityType == entityType)
            .SingleOrDefault();

        return media;
    }

    public async Task<string> SaveFileWWWRoot(IFormFile file)
    {
        if (file == null) throw new ArgumentNullException(nameof(file));

        var uploadPath = Path.Combine(rootPath, uploadsFolder);
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
        var fullFilePath = Path.Combine(uploadPath, fileName);

        using (var stream = new FileStream(fullFilePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"{baseUrl}/{uploadsFolder}/{fileName}";
    }

    #endregion

    #region Azurites
    public async Task<string?> SaveFileAzurites(IFormFile file)
    {
        try
        {
            var blobServiceClient = new BlobServiceClient(connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            await containerClient.CreateIfNotExistsAsync();

            var blobClient = containerClient.GetBlobClient(file.FileName);
            using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, overwrite: true);

            var blobUrl = blobClient.Uri.ToString();

            return blobUrl;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }

    }

    public async Task<BlobDownloadInfo?> GetFileFromUrlAzurites(string url)
    {
        // Azurite podaci (standardni)
        const string accountName = "devstoreaccount1";
        const string accountKey = "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";
        var credential = new StorageSharedKeyCredential(accountName, accountKey);
        var blobUri = new Uri(url);

        var blobClient = new BlobClient(blobUri, credential);

        try
        {
            var exists = await blobClient.ExistsAsync();
            if (!exists) return null;

            var downloadInfo = await blobClient.DownloadAsync();
            return downloadInfo;
        }
        catch (Exception)
        {
            return null;
        }
    }
    #endregion
}


public class MediaRequestModel
{
    public IFormFile File { get; set; }

    public int RelatedEntityId { get; set; }

    public EntityType EntityType { get; set; }

    public MediaType MediaType { get; set; }
}
