namespace ReactWebAPI.Models;

public class Character {
    public          int              Id          { get; set; }
    public required string           Name        { get; set; }
    public          string           Description { get; set; } = "";
    public          List<string>     Abilities   { get; set; } = [];
    public required List<Game>       Games       { get; set; } = [];
    public required List<MusicTheme> MusicThemes { get; set; } = [];
    public required string           ImageUrl    { get; set; }
}