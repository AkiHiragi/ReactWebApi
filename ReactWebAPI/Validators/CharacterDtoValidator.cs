using FluentValidation;
using ReactWebAPI.Dto;

namespace ReactWebAPI.Validators;

public class CharacterDtoValidator : AbstractValidator<CharacterDto>
{
    public CharacterDtoValidator()
    {
        RuleFor(x => x.Name)
           .NotEmpty().WithMessage("Name is required")
           .Length(1, 50).WithMessage("Name must be between 1 and 50 characters")
           .Matches("^[a-zA-Z\\s]+$").WithMessage("Name can only contain letters and spaces");

        RuleFor(x => x.Description)
           .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.ImageUrl)
           .NotEmpty().WithMessage("Image URL is required")
           .MaximumLength(200).WithMessage("Image URL cannot exceed 200 characters")
           .Must(BeValidImagePath).WithMessage("Image URL must be a valid path");

        RuleFor(x => x.Abilities)
           .NotNull().WithMessage("Abilities list cannot be null");

        RuleFor(x => x.Games)
           .NotNull().WithMessage("Games list cannot be null");

        RuleFor(x => x.MusicThemes)
           .NotNull().WithMessage("Music themes list cannot be null");
    }

    private bool BeValidImagePath(string imageUrl)
    {
        return imageUrl.StartsWith("Images/") &&
               (imageUrl.EndsWith(".jpg") || imageUrl.EndsWith(".png") || imageUrl.EndsWith(".jpeg"));
    }
}