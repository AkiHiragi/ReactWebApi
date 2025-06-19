using Microsoft.EntityFrameworkCore;
using ReactWebAPI.Data;
using ReactWebAPI.Models;

namespace ReactWebAPI.Repositories;

public class GameRepository : Repository<Game>, IGameRepository
{
    public GameRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Game?> GetGameWithDetailsAsync(int id)
    {
        return await _context.Games
                             .Include(g => g.Characters)
                             .Include(g => g.MusicThemes)
                             .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task AddCharacterToGameAsync(int gameId, int characterId)
    {
        var game = await _context.Games
                                 .Include(g => g.Characters)
                                 .FirstOrDefaultAsync(g => g.Id == gameId);

        if (game == null)
            throw new KeyNotFoundException($"Game with ID {gameId} noy found");

        var character = await _context.Characters.FindAsync(characterId);
        if (character == null)
            throw new KeyNotFoundException($"Character with ID {characterId} noy found");

        if (game.Characters.All(c => c.Id != characterId))
        {
            game.Characters.Add(character);
            await _context.SaveChangesAsync();
        }
    }

    public async Task AddMusicThemeToGameAsync(MusicTheme musicTheme)
    {
        await _context.MusicThemes.AddAsync(musicTheme);
        await _context.SaveChangesAsync();
    }
}