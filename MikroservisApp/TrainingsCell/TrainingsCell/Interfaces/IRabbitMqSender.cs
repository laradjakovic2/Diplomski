namespace TrainingsCell.Interfaces
{
    public interface IRabbitMqSender
    {
        public Task SendMessage(byte[] messageBodyBytes);
    }
}
