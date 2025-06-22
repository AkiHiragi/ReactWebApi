using Microsoft.AspNetCore.Mvc;

namespace ReactWebAPI.Controllers;

public class FileUploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public FileUploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension         = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type. Only images are allowed.");

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(_environment.WebRootPath, "Images", fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { imageUrl = $"Images/{fileName}" });
    }
}