using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ReactWebAPI.Dto;
using ReactWebAPI.Models;
using ReactWebAPI.Repositories;

namespace ReactWebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MusicThemesController : ControllerBase
{
    private readonly IMapper               _mapper;
    private readonly IMusicThemeRepository _repository;

    public MusicThemesController(IMusicThemeRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper     = mapper;
    }

    // GET: api/MusicThemes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MusicThemeDto>>> GetAllMusicThemes()
    {
        var musicThemes     = await _repository.GetAllAsync();
        var musicThemesDtos = _mapper.Map<IEnumerable<MusicThemeDto>>(musicThemes);

        return Ok(musicThemesDtos);
    }

    // GET: api/MusicThemes/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<MusicThemeDto>> GetMusicThemeById(int id)
    {
        var musicTheme = await _repository.GetByIdAsync(id);

        if (musicTheme == null) return NotFound();

        var musicThemeDto = _mapper.Map<MusicThemeDto>(musicTheme);
        return Ok(musicThemeDto);
    }

    // GET: api/MusicThemes/Game/5
    [HttpGet("Game/{gameId:int}")]
    public async Task<ActionResult<IEnumerable<MusicThemeDto>>> GetMusicThemesByGame(int gameId)
    {
        var musicThemes     = await _repository.GetMusicThemesByGameAsync(gameId);
        var musicThemesDtos = _mapper.Map<IEnumerable<MusicThemeDto>>(musicThemes);

        return Ok(musicThemesDtos);
    }

    // GET: api/MusicThemes/Character/5
    [HttpGet("Character/{characterId:int}")]
    public async Task<ActionResult<IEnumerable<MusicThemeDto>>> GetMusicThemesByCharacter(int characterId)
    {
        var musicThemes     = await _repository.GetMusicThemesByCharacterAsync(characterId);
        var musicThemesDtos = _mapper.Map<IEnumerable<MusicThemeDto>>(musicThemes);

        return Ok(musicThemesDtos);
    }

    // POST: api/MusicThemes
    [HttpPost]
    public async Task<ActionResult<MusicThemeDto>> AddMusicTheme(MusicThemeDto musicThemeDto)
    {
        var musicTheme      = _mapper.Map<MusicTheme>(musicThemeDto);
        var addedMusicTheme = await _repository.AddAsync(musicTheme);
        var resultDto       = _mapper.Map<MusicThemeDto>(addedMusicTheme);
        return CreatedAtAction(nameof(GetMusicThemeById), new { id = resultDto.Id }, resultDto);
    }

    // PUT: api/MusicThemes/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMusicTheme(int id, MusicThemeDto musicThemeDto)
    {
        if (id != musicThemeDto.Id) return BadRequest();

        var musicTheme = await _repository.GetByIdAsync(id);
        if (musicTheme == null) return NotFound();

        _mapper.Map(musicThemeDto, musicTheme);

        await _repository.UpdateAsync(musicTheme);
        return NoContent();
    }

    // DELETE: api/MusicThemes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMusicTheme(int id)
    {
        var musicTheme = await _repository.GetByIdAsync(id);
        if (musicTheme == null) return NotFound();

        await _repository.DeleteAsync(id);
        return NoContent();
    }
}