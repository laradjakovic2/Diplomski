using NotificationsCell;
using NotificationsCell.Services;
using NotificationsCell.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<EmailService>();

// Dodaj RabbitMQ Background Service
builder.Services.AddHostedService<RabbitMqListener>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5005);
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
