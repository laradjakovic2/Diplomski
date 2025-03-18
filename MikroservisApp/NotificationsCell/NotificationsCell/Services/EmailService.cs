using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.Net;

namespace NotificationsCell.Services
{
    public class EmailService
    {
        private readonly SmtpClient _client;
        private readonly string sendFrom = "laradjakovic00@gmail.com";

        public EmailService()
        {
            _client = GetSmtpClient();
        }

        private SmtpClient GetSmtpClient()
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(sendFrom, "fypnkifjnfofbqej"),
                EnableSsl = true,
            };
            return smtpClient;
        }

        public bool SendEmailAsync(string sendTo, string subject, string body)
        {
            MailMessage message = new MailMessage(this.sendFrom, sendTo);
            message.Subject = subject;
            message.Body = body;

            try
            {
                _client.Send(message);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
