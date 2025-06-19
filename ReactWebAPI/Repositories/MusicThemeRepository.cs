using Microsoft.EntityFrameworkCore;
using ReactWebAPI.Data;
using ReactWebAPI.Models;

namespace ReactWebAPI.Repositories;

public class MusicThemeRepository : Repository<MusicTheme>, IMusicThemeRepository
{
    public MusicThemeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<MusicTheme>> GetMusicThemesByGameAsync(int gameId)
    {
        return await _context.MusicThemes
                             .Where(m => m.GameId == gameId)
                             .Include(m => m.Character)
                             .ToListAsync();
    }

    public async Task<IEnumerable<MusicTheme>> GetMusicThemesByCharacterAsync(int characterId)
    {
        return await _context.MusicThemes
                             .Where(m => m.CharacterId == characterId)
                             .Include(m => m.Game)
                             .ToListAsync();
    }
}