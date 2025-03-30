﻿using CompetitionsCell;
using CompetitionsCell.Interfaces;
using CompetitionsCell.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<ICompetitionsService, CompetitionsService>();

builder.Services.AddHttpClient<MediaServiceClient>(client =>
{
    client.BaseAddress = new Uri("https://localhost:5006"); // URL MediaService-a
});
//DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database"));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    string reactOrigin = "http://localhost:5173";
    options.AddPolicy("WebClientUrl", builder =>
    {
        builder.WithOrigins(reactOrigin)
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

/* ovo otkomentirati za pokretanje sa dockerom*/
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5001);  // Listen on port 80
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseCors("WebClientUrl");
}

app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
