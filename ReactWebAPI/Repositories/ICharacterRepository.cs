using ReactWebAPI.Models;

namespace ReactWebAPI.Repositories;

public interface ICharacterRepository : IRepository<Character>
{
    Task<Character?> GetCharacterWithDetailsAsync(int id);
}