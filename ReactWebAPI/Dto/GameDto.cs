namespace ReactWebAPI.Dto;

public class GameDto {
    public int    Id         { get; set; }
    public string Title      { get; set; } = "";
    public double GameNumber { get; set; }
    public string ImageUrl   { get; set; } = "";

    public List<CharacterBasicDto> Characters { get; set; } = [];

    public List<MusicThemeDto> MusicThemes { get; set; } = [];
}