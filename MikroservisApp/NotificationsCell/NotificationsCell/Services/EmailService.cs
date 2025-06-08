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

        public async Task<bool> SendEmailAsync(string sendTo, string subject, string body)
        {
            using var message = new MailMessage(sendFrom, sendTo)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };

            try
            {
                await _client.SendMailAsync(message);
                Console.WriteLine("Email poslan na {SendTo} sa subjectom '{Subject}'", sendTo, subject);
                return true;
            }
            catch (SmtpException)
            {
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
