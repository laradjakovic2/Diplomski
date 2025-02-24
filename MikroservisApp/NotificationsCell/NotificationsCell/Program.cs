using MassTransit;
using NotificationsCell.Consumers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

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

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<NewTrainingCreatedConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("rabbitmq", h =>  // **MORA BITI "rabbitmq" ako koristimo Docker Compose** inace localhost
        {
            h.Username("guest");
            h.Password("guest");
        });

        cfg.ReceiveEndpoint("new-training-created-queue", e =>
        {
            e.ConfigureConsumer<NewTrainingCreatedConsumer>(context);
        });
    });
});

/* ovo otkomentirati za pokretanje sa dockerom*/
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5005);  // Listen on port 80
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
