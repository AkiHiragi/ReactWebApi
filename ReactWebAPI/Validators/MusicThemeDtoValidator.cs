using FluentValidation;
using ReactWebAPI.Dto;

namespace ReactWebAPI.Validators;

public class MusicThemeDtoValidator : AbstractValidator<MusicThemeDto>
{
    public MusicThemeDtoValidator()
    {
        RuleFor(x => x.Title)
           .NotEmpty().WithMessage("Music theme title is required")
           .Length(1, 100).WithMessage("Title must be between 1 and 100 characters")
           .Matches("^[a-zA-Z0-9\\s~\\-\\.,!\\(\\)]+$")
           .WithMessage("Title can only contain letters, numbers, spaces and common punctuation");

        RuleFor(x => x.CharacterId)
           .GreaterThan(0).WithMessage("Character ID must be greater than 0");

        RuleFor(x => x.GameId)
           .GreaterThan(0).WithMessage("Game ID must be greater than 0");

        // Опциональные поля могут быть пустыми, но если заполнены - проверяем
        RuleFor(x => x.CharacterName)
           .MaximumLength(50).WithMessage("Character name cannot exceed 50 characters")
           .When(x => !string.IsNullOrEmpty(x.CharacterName));

        RuleFor(x => x.GameTitle)
           .MaximumLength(100).WithMessage("Game title cannot exceed 100 characters")
           .When(x => !string.IsNullOrEmpty(x.GameTitle));
    }
}