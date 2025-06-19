using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ReactWebAPI.Dto;
using ReactWebAPI.Models;
using ReactWebAPI.Repositories;

namespace ReactWebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
    private readonly ICharacterRepository _characterRepository;
    private readonly IMapper              _mapper;

    public CharactersController(ICharacterRepository characterRepository, IMapper mapper)
    {
        _characterRepository = characterRepository;
        _mapper              = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CharacterBasicDto>>> GetAllCharacters()
    {
        var characters    = await _characterRepository.GetAllAsync();
        var charactersDto = _mapper.Map<IEnumerable<CharacterBasicDto>>(characters);

        return Ok(charactersDto);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CharacterDto>> GetCharacterById(int id)
    {
        var character = await _characterRepository.GetCharacterWithDetailsAsync(id);

        if (character == null) return NotFound();

        var characterDto = _mapper.Map<CharacterDto>(character);

        return Ok(characterDto);
    }

    [HttpPost]
    public async Task<ActionResult<CharacterBasicDto>> AddCharacter(CharacterBasicDto characterDto)
    {
        var character = _mapper.Map<Character>(characterDto);
        character.Abilities   = [];
        character.Games       = [];
        character.MusicThemes = [];

        var addedCharacter = await _characterRepository.AddAsync(character);
        var resultDto      = _mapper.Map<CharacterBasicDto>(addedCharacter);

        return CreatedAtAction(nameof(GetCharacterById), new { id = resultDto.Id }, resultDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCharacter(int id, CharacterDto characterDto)
    {
        if (id != characterDto.Id) return BadRequest();

        var character = await _characterRepository.GetByIdAsync(id);
        if (character == null) return NotFound();

        _mapper.Map(characterDto, character);

        await _characterRepository.UpdateAsync(character);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCharacter(int id)
    {
        var character = await _characterRepository.GetByIdAsync(id);
        if (character == null) return NotFound();

        await _characterRepository.DeleteAsync(id);
        return NoContent();
    }
}