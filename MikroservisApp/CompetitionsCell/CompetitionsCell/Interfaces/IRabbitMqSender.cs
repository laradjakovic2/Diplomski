namespace CompetitionsCell.Interfaces
{
    public interface IRabbitMqSender
    {
        public Task SendMessage(byte[] messageBodyBytes);
    }
}
