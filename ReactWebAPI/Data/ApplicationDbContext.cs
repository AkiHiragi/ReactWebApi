using Microsoft.EntityFrameworkCore;
using ReactWebAPI.Models;

namespace ReactWebAPI.Data;

public class ApplicationDbContext : DbContext {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) {
    }

    public DbSet<Game>       Games       { get; set; }
    public DbSet<Character>  Characters  { get; set; }
    public DbSet<MusicTheme> MusicThemes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Game>()
                    .HasMany(g => g.Characters)
                    .WithMany(c => c.Games);
        
        modelBuilder.Entity<MusicTheme>()
                    .HasOne(m=>m.Character)
                    .WithMany(c=>c.MusicThemes)
                    .HasForeignKey(m=>m.CharacterId);
        
        modelBuilder.Entity<MusicTheme>()
                    .HasOne(m=>m.Game)
                    .WithMany(g=>g.MusicThemes)
                    .HasForeignKey(m=>m.GameId);
    }
}