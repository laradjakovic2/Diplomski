using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompetitionsCell.Migrations
{
    /// <inheritdoc />
    public partial class CompetitionPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Price",
                table: "Competitions",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Tax",
                table: "Competitions",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "TotalPrice",
                table: "Competitions",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Competitions");

            migrationBuilder.DropColumn(
                name: "Tax",
                table: "Competitions");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "Competitions");
        }
    }
}
