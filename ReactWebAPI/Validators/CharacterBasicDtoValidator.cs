using FluentValidation;
using ReactWebAPI.Dto;

namespace ReactWebAPI.Validators;

public class CharacterBasicDtoValidator : AbstractValidator<CharacterBasicDto>
{
    public CharacterBasicDtoValidator()
    {
        RuleFor(x => x.Name)
           .NotEmpty().WithMessage("Name is required")
           .Length(1, 50).WithMessage("Name must be between 1 and 50 characters")
           .Matches("^[a-zA-Z\\s]+$").WithMessage("Name can only contain letters and spaces");

        RuleFor(x => x.ImageUrl)
           .NotEmpty().WithMessage("Image URL is required")
           .MaximumLength(200).WithMessage("Image URL cannot exceed 200 characters")
           .Must(BeValidImagePath).WithMessage("Image URL must be a valid path");

        RuleFor(x => x.Description)
           .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.Abilities)
           .NotNull().WithMessage("Abilities list cannot be null")
           .Must(abilities => abilities.Count <= 10).WithMessage("Cannot have more than 10 abilities")
           .ForEach(ability => ability
                              .NotEmpty().WithMessage("Ability cannot be empty")
                              .MaximumLength(100).WithMessage("Each ability cannot exceed 100 characters"));
    }

    private bool BeValidImagePath(string imageUrl)
    {
        return imageUrl.StartsWith("Images/") &&
               (imageUrl.EndsWith(".jpg") || imageUrl.EndsWith(".png") || imageUrl.EndsWith(".jpeg"));
    }
}