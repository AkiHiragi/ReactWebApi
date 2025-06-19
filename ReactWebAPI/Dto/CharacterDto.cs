using ReactWebAPI.Models;

namespace ReactWebAPI.Dto;

public class CharacterDto {
    public int          Id          { get; set; }
    public string       Name        { get; set; } = "";
    public string       Description { get; set; } = "";
    public string       ImageUrl    { get; set; } = "";
    public List<string> Abilities   { get; set; } = [];

    public List<GameBasicDto> Games { get; set; } = [];

    public List<MusicThemeDto> MusicThemes { get; set; } = [];
}