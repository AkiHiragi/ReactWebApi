namespace ReactWebAPI.Models;

public class Game {
    public          int             Id         { get; set; }
    public required string          Title      { get; set; }
    public          double          GameNumber { get; set; }
    public required List<Character> Characters { get; set; } = [];
    public required List<MusicTheme>? MusicThemes { get; set; } = [];
    public required string           ImageUrl    { get; set; }
}