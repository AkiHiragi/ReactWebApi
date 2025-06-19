using FluentValidation;
using ReactWebAPI.Dto;

namespace ReactWebAPI.Validators;

public class GameDtoValidator : AbstractValidator<GameDto>
{
    public GameDtoValidator()
    {
        RuleFor(x => x.Title)
           .NotEmpty().WithMessage("Title is required")
           .Length(1, 100).WithMessage("Title must be between 1 and 100 characters");

        RuleFor(x => x.GameNumber)
           .GreaterThan(0).WithMessage("Game number must be greater than 0")
           .LessThan(100).WithMessage("Game number must be less than 100");

        RuleFor(x => x.ImageUrl)
           .NotEmpty().WithMessage("Image URL is required")
           .MaximumLength(200).WithMessage("Image URL cannot exceed 200 characters")
           .Must(BeValidImagePath).WithMessage("Image URL must be a valid path");

        RuleFor(x => x.Characters)
           .NotNull().WithMessage("Characters list cannot be null");

        RuleFor(x => x.MusicThemes)
           .NotNull().WithMessage("Music themes list cannot be null");
    }

    private bool BeValidImagePath(string imageUrl)
    {
        return imageUrl.StartsWith("Images/") && 
               (imageUrl.EndsWith(".jpg") || imageUrl.EndsWith(".png") || imageUrl.EndsWith(".jpeg"));
    }
}