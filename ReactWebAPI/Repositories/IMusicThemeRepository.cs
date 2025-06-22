using ReactWebAPI.Models;

namespace ReactWebAPI.Repositories;

public interface IMusicThemeRepository : IRepository<MusicTheme>
{
    Task<IEnumerable<MusicTheme>> GetMusicThemesByGameAsync(int      gameId);
    Task<IEnumerable<MusicTheme>> GetMusicThemesByCharacterAsync(int characterId);
    Task<IEnumerable<MusicTheme>> GetAllWithDetailsAsync();
}