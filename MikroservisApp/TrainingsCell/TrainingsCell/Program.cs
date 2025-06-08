using TrainingsCell.Interfaces;
using TrainingsCell.Services;
using TrainingsCell;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<IConnection>(sp =>
{
    var factory = new ConnectionFactory
    {
        Uri = new Uri("amqp://guest:guest@localhost:5672"),
        ClientProvidedName = "Training sender"
    };

    // Force async call to run synchronously at startup
    return factory.CreateConnectionAsync().GetAwaiter().GetResult();
});
builder.Services.AddScoped<IRabbitMqSenderUsers, RabbitMqSenderUsers>();
builder.Services.AddScoped<IRabbitMqSenderNotifications, RabbitMqSenderNotifications>();
builder.Services.AddScoped<ITrainingsService, TrainingsService>();

//DbContexta
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database"));
});

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

/* ovo otkomentirati za pokretanje sa dockerom ili u yaml podesiti da slusa na tom portu*/
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5003);  // Listen on port 80
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

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();  // Pokreće EF migracije
}

app.Run();
