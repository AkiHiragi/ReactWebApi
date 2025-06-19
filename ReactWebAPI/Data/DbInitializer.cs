using ReactWebAPI.Models;

namespace ReactWebAPI.Data;

public class DbInitializer {
    public static void Initialize(ApplicationDbContext context) {
        context.Database.EnsureCreated();

        if (context.Games.Any())
            return;

        var games = new Game[] {
            new Game {
                Title       = "Embodiment of Scarlet Devil",
                GameNumber  = 6,
                ImageUrl    = "Images/th06.jpg",
                Characters  = [],
                MusicThemes = []
            },
            new Game {
                Title       = "Perfect Cherry Blossom",
                GameNumber  = 7,
                ImageUrl    = "Images/th07.jpg",
                Characters  = [],
                MusicThemes = []
            }
        };

        context.Games.AddRange(games);
        context.SaveChanges();

        var characters = new Character[] {
            new Character {
                Name        = "Hakurei Reimu",
                Description = "Жрица вечности",
                Abilities = [
                    "Сферы Инь-Ян",
                    "Техники барьера"
                ],
                Games       = [],
                MusicThemes = [],
                ImageUrl    = "Images/reimu.jpg"
            },
            new Character {
                Name        = "Marisa Kirisame",
                Description = "Странная волшебница",
                Abilities = [
                    "Использование магии",
                    "Способность летать",
                    "Скорость",
                    "Копирование приёмов"
                ],
                Games       = [],
                MusicThemes = [],
                ImageUrl    = "Images/marisa.jpg"
            },
            new Character {
                Name        = "Sakuya Izayoi",
                Description = "Элегантная горничная",
                Abilities = [
                    "Управление временем"
                ],
                Games       = [],
                MusicThemes = [],
                ImageUrl    = "Images/sakuya.jpg"
            },
            new Character {
                Name        = "Youmu Konpaku",
                Description = "Полупризрачный садовник",
                Abilities = [
                    "Фехтование"
                ],
                Games       = [],
                MusicThemes = [],
                ImageUrl    = "Images/youmu.jpg"
            }
        };

        context.Characters.AddRange(characters);
        context.SaveChanges();

        games[0].Characters.AddRange(characters[0], characters[1], characters[2]);
        games[1].Characters.AddRange(characters[0], characters[1], characters[3]);
        context.SaveChanges();

        var musicThemes = new MusicTheme[] {
            new MusicTheme {
                Title = "Maiden's Capriccio ~ Dream Battle",
                CharacterId = characters[0].Id,
                GameId = games[0].Id
            },
            new MusicTheme {
                Title = "Love-coloured Master Spark",
                CharacterId = characters[1].Id,
                GameId = games[0].Id
            },
            new MusicTheme {
                Title = "Lunar Clock ~ Luna Dial",
                CharacterId = characters[2].Id,
                GameId = games[0].Id
            },
            new MusicTheme {
                Title = "Bloom Nobly, Ink-Black Cherry Blossom ~ Border of Life",
                CharacterId = characters[3].Id,
                GameId = games[1].Id
            }
        };
        
        context.MusicThemes.AddRange(musicThemes);
        context.SaveChanges();
    }
}