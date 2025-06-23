using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class MakeMusicThemeRelationsNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MusicThemes_Characters_CharacterId",
                table: "MusicThemes");

            migrationBuilder.DropForeignKey(
                name: "FK_MusicThemes_Games_GameId",
                table: "MusicThemes");

            migrationBuilder.AlterColumn<int>(
                name: "GameId",
                table: "MusicThemes",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "CharacterId",
                table: "MusicThemes",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_MusicThemes_Characters_CharacterId",
                table: "MusicThemes",
                column: "CharacterId",
                principalTable: "Characters",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MusicThemes_Games_GameId",
                table: "MusicThemes",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MusicThemes_Characters_CharacterId",
                table: "MusicThemes");

            migrationBuilder.DropForeignKey(
                name: "FK_MusicThemes_Games_GameId",
                table: "MusicThemes");

            migrationBuilder.AlterColumn<int>(
                name: "GameId",
                table: "MusicThemes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CharacterId",
                table: "MusicThemes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MusicThemes_Characters_CharacterId",
                table: "MusicThemes",
                column: "CharacterId",
                principalTable: "Characters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MusicThemes_Games_GameId",
                table: "MusicThemes",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
