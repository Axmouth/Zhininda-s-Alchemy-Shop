using Identity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Contracts.V1.Domain;

namespace Zhinindas_Alchemy_Shop.Services.Interfaces
{
    public interface IAccountService
    {
        Task<AuthenticationResult> RegisterAsync(string email, string password);
        Task<AuthenticationResult> RegisterAsync(string username, string email, string password);
        Task<AuthenticationResult> LoginAsync(string email, string password);
        Task<AuthenticationResult> RefreshTokenAsync(string token, string refreshToken);
        Task<AuthenticationResult> LogoutAsync(string refreshToken);
        Task<AuthenticationResult> UpdatePasswordAsync(AppUser userToUpdate, string newPassword);
        Task<AuthenticationResult> ResetPasswordEmailAsync(AppUser user);
        Task<AuthenticationResult> ResetPasswordAsync(AppUser user, string token, string newPassword);
        Task<AuthenticationResult> CheckUserPasswordAsync(AppUser user, string password);
        Task<AuthenticationResult> ValidatePasswordAsync(string password);
        Task<AuthenticationResult> ConfirmEmailAsync(AppUser user, string token);
        Task<AuthenticationResult> SendConfirmationEmailAsync(AppUser user);
    }
}
