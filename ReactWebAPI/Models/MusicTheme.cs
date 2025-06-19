namespace ReactWebAPI.Models;

public class MusicTheme {
    public int    Id    { get; set; }
    public string Title { get; set; } = string.Empty;

    public int CharacterId { get; set; }
    public int GameId      { get; set; }

    public Character? Character { get; set; }
    public Game?      Game      { get; set; }
}