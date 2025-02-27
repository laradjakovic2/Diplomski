using UsersCell;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS konfiguracija
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

// Dodaj RabbitMQ Background Service
builder.Services.AddHostedService<RabbitMqListener>();

// Kestrel konfiguracija za Docker
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5004); // Listen on port 80
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