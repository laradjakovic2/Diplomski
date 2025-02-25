using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.ComponentModel.Design;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

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

/*Rabbit MQ receiver*/
ConnectionFactory factory = new();
factory.Uri = new Uri("amqp://guest:guest@localhost:5672");
factory.ClientProvidedName = "User receiver";
IConnection cnn = await factory.CreateConnectionAsync();
IChannel channel = await cnn.CreateChannelAsync();
string exchangeName = "UserRegisteredForTraining";
string routingKey = "tr-u";
string queueName = "TrainingUser";
await channel.ExchangeDeclareAsync(exchangeName, ExchangeType.Direct);
await channel.QueueDeclareAsync(queueName, false, false, false, null);
await channel.QueueBindAsync(queueName, exchangeName, routingKey, null);
await channel.BasicQosAsync(0, 1, false); //procesiramo jednu poruku odjednom, a ne hrpu njih

var consumer = new AsyncEventingBasicConsumer(channel);
consumer.ReceivedAsync += async (sender, args) =>
{
    var body = args.Body.ToArray();
    string message = Encoding.UTF8.GetString(body);

    //obradi poruku tj spremi ju negdje

    await channel.BasicAckAsync(args.DeliveryTag, false); //ako uspjesno onda ovo posalji
};

string consumerTag = await channel.BasicConsumeAsync(queueName, false, consumer);
/*await channel.BasicCancelAsync(consumerTag);
await channel.CloseAsync();
await cnn.CloseAsync();*/


/* ovo otkomentirati za pokretanje sa dockerom*/
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5004);  // Listen on port 80
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

