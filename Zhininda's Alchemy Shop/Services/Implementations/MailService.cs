
using Zhinindas_Alchemy_Shop.EmailTemplates.ViewModels;
using Zhinindas_Alchemy_Shop.Helpers;
using Identity.Models;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http;
using MimeKit;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Options;
using Zhinindas_Alchemy_Shop.Services.Interfaces;

namespace Zhinindas_Alchemy_Shop.Services
{
    public class MailService : IMailService
    {
        private readonly string _fromName;
        private readonly string _fromAddress;
        private readonly string _username;
        private readonly string _password;
        private readonly string _host;
        private readonly int _port;
        private readonly IRazorViewToStringRenderer _renderer;
        const string templateBaseDir = "/Views/Emails";

        public MailService(EmailSettings settings, IRazorViewToStringRenderer renderer)
        {
            if (settings != null)
            {
                _fromName = settings.FromName;
                _username = settings.UserName;
                _password = settings.Password;
                _host = settings.Host;
                _port = settings.Port;
                _fromAddress = settings.FromAddress;
            }
            _renderer = renderer;
        }

        public async Task<bool> SendAccountVerificationEmailAsync(AppUser user, string token)
        {
            if (user == null)
            {
                return false;
            }

            var host = "http://dragonflytracker.com/";
            var verificationLink = $"{host}verify-email?email_confirm_token={Uri.EscapeDataString(token)}&user_name={user.UserName}";
            var model = new AccountVerificationViewModel(verificationLink, user.UserName);
            var name = "AccountVerification";
            var htmlBody = await _renderer.RenderViewToStringAsync($"{templateBaseDir}/{name}/{name}Html.cshtml", model).ConfigureAwait(false);
            var textBody = await _renderer.RenderViewToStringAsync($"{templateBaseDir}/{name}/{name}Text.cshtml", model).ConfigureAwait(false);
            var result = await SendEmailAsync(new List<string> { user.Email }, _fromAddress, "Verify your Dragonfly Account's Email", textBody, htmlBody).ConfigureAwait(false);
            return result;
        }

        public async Task<bool> SendEmailChangedEmailAsync(AppUser user, string oldEmail, string newEmail)
        {
            if (user == null)
            {
                return false;
            }
            var model = new HelloWorldViewModel("https://www.google.com");
            var name = "HelloWorld";
            var htmlBody = await _renderer.RenderViewToStringAsync($"{templateBaseDir}/{name}/{name}Html.cshtml", model).ConfigureAwait(false);
            var textBody = await _renderer.RenderViewToStringAsync($"{templateBaseDir}/{name}/{name}Text.cshtml", model).ConfigureAwait(false);
            var result = await SendEmailAsync(new List<string> { user.Email }, _fromAddress, "Your Dragonfly Email was changed", textBody, htmlBody).ConfigureAwait(false);
            return result;
        }

        public async Task<bool> SendPasswordChangedEmailAsync(AppUser user)
        {
            if (user == null)
            {
                return false;
            }
            var model = new HelloWorldViewModel("https://www.google.com");
            var name = "HelloWorld";
            var htmlBody = await _renderer.RenderViewToStringAsync($"{templateBaseDir}/{name}/{name}Html.cshtml", model).ConfigureAwait(false);
            var textBody = await _renderer.RenderViewToStringAsync($"{templateBaseDir}/{name}/{name}Text.cshtml", model).ConfigureAwait(false);
            var result = await SendEmailAsync(new List<string> { user.Email }, _fromAddress, "Your Dragonfly Password was changed", textBody, htmlBody).ConfigureAwait(false);
            return result;
        }

        public async Task<bool> SendPasswordResetEmailAsync(AppUser user, string token)
        {
            if (user == null)
            {
                return false;
            }
            var host = "http://dragonflytracker.com/";
            var resetLink = $"{host}password-reset?reset_password_token={Uri.EscapeDataString(token)}&user_name={user.UserName}";
            var model = new PasswordResetViewModel(resetLink, user.UserName);
            var name = "PasswordReset";
            var htmlBody = await _renderer.RenderViewToStringAsync($"{templateBaseDir}/{name}/{name}Html.cshtml", model).ConfigureAwait(false);
            var textBody = await _renderer.RenderViewToStringAsync($"{templateBaseDir}/{name}/{name}Text.cshtml", model).ConfigureAwait(false);
            var result = await SendEmailAsync(new List<string> { user.Email }, _fromAddress, "Dragonfly Password Reset Requested", textBody, htmlBody).ConfigureAwait(false);
            return result;
        }

        public async Task<bool> SendEmailAsync(List<string> recipients, string sender, string subject, string textBody, string htmlBody)
        {
            if (recipients == null)
            {
                return false;
            }
            foreach (string recipient in recipients)
            {

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_fromName, sender));
                message.To.Add(new MailboxAddress(recipient));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody,
                    TextBody = textBody
                };

                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(_host, _port, MailKit.Security.SecureSocketOptions.StartTlsWhenAvailable).ConfigureAwait(false);
                    // await client.ConnectAsync(_host, _port).ConfigureAwait(false);

                    // Note: only needed if the SMTP server requires authentication
                    await client.AuthenticateAsync(_username, _password).ConfigureAwait(false);

                    await client.SendAsync(message).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }
            }
            return true;
        }
    }
}
