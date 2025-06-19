using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ReactWebAPI.Dto;
using ReactWebAPI.Models;
using ReactWebAPI.Repositories;

namespace ReactWebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly ICharacterRepository _characterRepository;
    private readonly IGameRepository      _gameRepository;
    private readonly IMapper              _mapper;

    public GamesController(IGameRepository gameRepository, ICharacterRepository characterRepository, IMapper mapper)
    {
        _gameRepository      = gameRepository;
        _characterRepository = characterRepository;
        _mapper              = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameBasicDto>>> GetAllGames()
    {
        var games    = await _gameRepository.GetAllAsync();
        var gamesDto = _mapper.Map<IEnumerable<GameBasicDto>>(games);

        return Ok(gamesDto);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GameDto>> GetGameById(int id)
    {
        var game = await _gameRepository.GetGameWithDetailsAsync(id);

        if (game == null) return NotFound();

        var gameDto = _mapper.Map<GameDto>(game);

        return Ok(gameDto);
    }

    [HttpGet("Characters")]
    public async Task<ActionResult<IEnumerable<CharacterBasicDto>>> GetAllCharacters()
    {
        var characters    = await _characterRepository.GetAllAsync();
        var charactersDto = _mapper.Map<IEnumerable<CharacterBasicDto>>(characters);

        return Ok(charactersDto);
    }

    [HttpPost]
    public async Task<ActionResult<GameBasicDto>> AddGame(GameBasicDto gameDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var game = _mapper.Map<Game>(gameDto);
        game.Characters  = [];
        game.MusicThemes = [];

        var addedGame = await _gameRepository.AddAsync(game);
        var resultDto = _mapper.Map<GameBasicDto>(addedGame);

        return CreatedAtAction(nameof(GetGameById), new { id = resultDto.Id }, resultDto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        var game = await _gameRepository.GetByIdAsync(id);
        if (game == null) return NotFound();

        await _gameRepository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("{gameId:int}/Characters/{characterId:int}")]
    public async Task<IActionResult> AddCharacterToGame(int gameId, int characterId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _gameRepository.AddCharacterToGameAsync(gameId, characterId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("{gameId:int}/MusicThemes")]
    public async Task<ActionResult<MusicThemeDto>> AddMusicThemeToGame(int gameId, MusicThemeDto musicThemeDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var game = await _gameRepository.GetByIdAsync(gameId);
        if (game == null) return NotFound("Game not found");

        var character = await _characterRepository.GetByIdAsync(musicThemeDto.CharacterId);
        if (character == null) return NotFound("Character not found");

        var musicTheme = _mapper.Map<MusicTheme>(musicThemeDto);
        musicTheme.GameId = gameId;

        await _gameRepository.AddMusicThemeToGameAsync(musicTheme);

        var resultDto = _mapper.Map<MusicThemeDto>(musicTheme);
        return CreatedAtAction(nameof(GetGameById), new { id = gameId }, resultDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> ChangeGame(int id, GameBasicDto gameDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (id != gameDto.Id) return BadRequest();

        var game = await _gameRepository.GetByIdAsync(id);
        if (game == null) return NotFound();

        _mapper.Map(gameDto, game);
        await _gameRepository.UpdateAsync(game);
        return NoContent();
    }
}