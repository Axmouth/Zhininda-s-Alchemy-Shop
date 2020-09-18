using Zhinindas_Alchemy_Shop.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Identity.Models;

namespace Zhinindas_Alchemy_Shop.Services.Interfaces
{
    public interface IMailService
    {
        Task<bool> SendAccountVerificationEmailAsync(AppUser user, string token);
        Task<bool> SendPasswordResetEmailAsync(AppUser user, string token);
        Task<bool> SendPasswordChangedEmailAsync(AppUser user);
        Task<bool> SendEmailChangedEmailAsync(AppUser user, string oldEmail, string newEmail);
        Task<bool> SendEmailAsync(List<string> recipients, string sender, string subject, string textBody, string htmlBody);
    }
}
