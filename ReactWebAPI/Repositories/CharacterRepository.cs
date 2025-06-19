using Microsoft.EntityFrameworkCore;
using ReactWebAPI.Data;
using ReactWebAPI.Models;

namespace ReactWebAPI.Repositories;

public class CharacterRepository : Repository<Character>, ICharacterRepository
{
    public CharacterRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Character?> GetCharacterWithDetailsAsync(int id)
    {
        return await _context.Characters
                             .Include(c => c.Games)
                             .Include(c => c.MusicThemes)
                             .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Character>> GetAllWithGamesAsync()
    {
        return await _context.Characters
                             .Include(c => c.Games)
                             .ToListAsync();
    }
}