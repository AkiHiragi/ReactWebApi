namespace ReactWebAPI.Dto;

public class GameBasicDto {
    public int    Id         { get; set; }
    public string Title      { get; set; } = "";
    public double GameNumber { get; set; }
    public string ImageUrl   { get; set; } = "";
}