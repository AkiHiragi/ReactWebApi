namespace ReactWebAPI.Dto;

public class MusicThemeDto
{
    public int    Id    { get; set; }
    public string Title { get; set; } = "";

    public int? CharacterId { get; set; }

    public int? GameId { get; set; }

    public string? CharacterName { get; set; }
    public string? GameTitle     { get; set; }
}