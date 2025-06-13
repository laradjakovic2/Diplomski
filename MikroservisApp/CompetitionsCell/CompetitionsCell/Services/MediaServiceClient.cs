using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using CompetitionsCell.Enums;

namespace CompetitionsCell.Services;
public class MediaServiceClient
{
    private readonly HttpClient _httpClient;

    public MediaServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    //trenutno nije u planu ovako raditi nego direktni poziv na media servis
    public async Task<int> UploadImageAsync(MediaRequestModel request)
    {
        using (var content = new MultipartFormDataContent())
        {
            var stream = request.File.OpenReadStream();
            var fileContent = new StreamContent(stream);
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(request.File.ContentType);

            content.Add(fileContent, "file", request.File.FileName);
            content.Add(new StringContent(request.CompetitionId.ToString()), "RelatedEntityId");
            content.Add(new StringContent(EntityType.Competition.ToString()), "EntityType");
            content.Add(new StringContent(MediaType.File.ToString()), "MediaType");

            var response = await _httpClient.PostAsync("http://localhost:5006/media/upload", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Failed to upload media");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var mediaId = JsonSerializer.Deserialize<int>(responseString);
            return mediaId;
        }
    }

    public async Task<string> GetImageUrlAsync(int relatedEntityId, EntityType entityType)
    {
        string requestUrl = $"http://localhost:5006/media/get-url?relatedEntityId={relatedEntityId}&entityType={entityType}";

        var response = await _httpClient.GetAsync(requestUrl);

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            Console.WriteLine($"Error fetching file URL: {response.StatusCode}");
        }

        return null;
    }
}


public class MediaRequestModel{
    public int CompetitionId { get; set; }
    public IFormFile File { get; set; }
}