using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TrainingsCell.Migrations
{
    /// <inheritdoc />
    public partial class Models : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Trainings");

            migrationBuilder.RenameColumn(
                name: "TrainingDateTime",
                table: "Trainings",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "RankingId",
                table: "Trainings",
                newName: "TrainerId");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Trainings",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Trainings",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "ScoreType",
                table: "Trainings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Trainings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TrainerEmail",
                table: "Trainings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TrainingTypeId",
                table: "Trainings",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Registrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    UserEmail = table.Column<string>(type: "text", nullable: false),
                    TrainingId = table.Column<int>(type: "integer", nullable: false),
                    Score = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Registrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Registrations_Trainings_TrainingId",
                        column: x => x.TrainingId,
                        principalTable: "Trainings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrainingTypeMemberships",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    TrainingTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingTypeMemberships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingTypeMemberships_TrainingTypes_TrainingTypeId",
                        column: x => x.TrainingTypeId,
                        principalTable: "TrainingTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trainings_TrainingTypeId",
                table: "Trainings",
                column: "TrainingTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Registrations_TrainingId",
                table: "Registrations",
                column: "TrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingTypeMemberships_TrainingTypeId",
                table: "TrainingTypeMemberships",
                column: "TrainingTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Trainings_TrainingTypes_TrainingTypeId",
                table: "Trainings",
                column: "TrainingTypeId",
                principalTable: "TrainingTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trainings_TrainingTypes_TrainingTypeId",
                table: "Trainings");

            migrationBuilder.DropTable(
                name: "Registrations");

            migrationBuilder.DropTable(
                name: "TrainingTypeMemberships");

            migrationBuilder.DropTable(
                name: "TrainingTypes");

            migrationBuilder.DropIndex(
                name: "IX_Trainings_TrainingTypeId",
                table: "Trainings");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Trainings");

            migrationBuilder.DropColumn(
                name: "ScoreType",
                table: "Trainings");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Trainings");

            migrationBuilder.DropColumn(
                name: "TrainerEmail",
                table: "Trainings");

            migrationBuilder.DropColumn(
                name: "TrainingTypeId",
                table: "Trainings");

            migrationBuilder.RenameColumn(
                name: "TrainerId",
                table: "Trainings",
                newName: "RankingId");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Trainings",
                newName: "TrainingDateTime");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Trainings",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Trainings",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
