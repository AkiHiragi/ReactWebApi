using AutoMapper;
using ReactWebAPI.Dto;
using ReactWebAPI.Models;

namespace ReactWebAPI.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Game, GameBasicDto>();
        CreateMap<Game, GameDto>()
           .ForMember(
                dest => dest.Characters,
                opt => opt
                   .MapFrom(src => src.Characters)
            )
           .ForMember(
                dest => dest.MusicThemes,
                opt => opt
                   .MapFrom(src => src.MusicThemes)
            );

        CreateMap<Character, CharacterBasicDto>();
        CreateMap<Character, CharacterDto>()
           .ForMember(
                dest => dest.Games,
                opt => opt
                   .MapFrom(src => src.Games)
            )
           .ForMember(
                dest => dest.MusicThemes,
                opt => opt
                   .MapFrom(src => src.MusicThemes)
            );

        CreateMap<MusicTheme, MusicThemeDto>()
           .ForMember(
                dest => dest.CharacterName,
                opt => opt
                   .MapFrom(src => src.Character != null ? src.Character.Name : null))
           .ForMember(
                dest => dest.GameTitle,
                opt => opt
                   .MapFrom(src => src.Game != null ? src.Game.Title : null));

        CreateMap<GameBasicDto, Game>();
        CreateMap<CharacterBasicDto, Character>();
        CreateMap<MusicThemeDto, MusicTheme>();
    }
}