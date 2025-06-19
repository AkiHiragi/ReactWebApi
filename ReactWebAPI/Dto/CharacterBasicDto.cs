namespace ReactWebAPI.Dto;

public class CharacterBasicDto
{
    public int          Id          { get; set; }
    public string       Name        { get; set; } = "";
    public string       Description { get; set; } = "";
    public List<string> Abilities   { get; set; } = [];
    public string       ImageUrl    { get; set; } = "";
}