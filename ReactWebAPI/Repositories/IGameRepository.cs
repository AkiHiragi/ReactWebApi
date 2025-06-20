using ReactWebAPI.Models;

namespace ReactWebAPI.Repositories;

public interface IGameRepository : IRepository<Game>
{
    Task<IEnumerable<Game>> GetAllWithDetailsAsync();
    Task<Game?>             GetGameWithDetailsAsync(int         id);
    Task                    AddCharacterToGameAsync(int         gameId, int characterId);
    Task                    AddMusicThemeToGameAsync(MusicTheme musicTheme);
}