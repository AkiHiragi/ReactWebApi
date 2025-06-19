using ReactWebAPI.Models;

namespace ReactWebAPI.Repositories;

public interface IGameRepository : IRepository<Game>
{
    Task<Game?> GetGameWithDetailsAsync(int         id);
    Task        AddCharacterToGameAsync(int         gameId, int characterId);
    Task        AddMusicThemeToGameAsync(MusicTheme musicTheme);
}