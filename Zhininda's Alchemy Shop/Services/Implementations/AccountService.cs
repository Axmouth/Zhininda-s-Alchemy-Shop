using Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Contracts.V1.Domain;
using Zhinindas_Alchemy_Shop.Data;
using Zhinindas_Alchemy_Shop.Data.Models;
using Zhinindas_Alchemy_Shop.Options;
using Zhinindas_Alchemy_Shop.Services.Interfaces;

namespace Zhinindas_Alchemy_Shop.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JwtSettings _jwtSettings;
        private readonly TokenValidationParameters _tokenValidationParameters;
        private readonly AppDbContext _appMainDataContext;
        private readonly IMailService _mailService;

        public AccountService(UserManager<AppUser> userManager, JwtSettings jwtSettings, TokenValidationParameters tokenValidationParameters, AppDbContext appMainDataContext, RoleManager<IdentityRole> roleManager, IMailService mailService)
        {

            _userManager = userManager;
            _jwtSettings = jwtSettings;
            _tokenValidationParameters = tokenValidationParameters;
            _appMainDataContext = appMainDataContext;
            _roleManager = roleManager;
            _mailService = mailService;
        }
        public async Task<AuthenticationResult> CheckUserPasswordAsync(AppUser user, string password)
        {
            var result = await _userManager.CheckPasswordAsync(user, password);

            return new AuthenticationResult
            {
                Success = result,
                Errors = new List<string>() { "Failed password check." },
            };
        }

        public async Task<AuthenticationResult> ConfirmEmailAsync(AppUser user, string token)
        {
            var confirmResult = await _userManager.ConfirmEmailAsync(user, token);

            return new AuthenticationResult
            {
                Success = confirmResult.Succeeded,
                Errors = confirmResult.Errors.Select(x => x.Description)
            };
        }

        public async Task<AuthenticationResult> LoginAsync(string loginId, string password)
        {
            var user = await _userManager.FindByNameAsync(loginId);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(loginId);
            }

            if (user == null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User does not exist" },
                };
            }

            var userHasValidPassword = await _userManager.CheckPasswordAsync(user, password);

            if (!userHasValidPassword)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User/password combination is wrong" },
                };
            }

            return await GenerateAuthenticationResultForUserAsync(user);
        }

        public async Task<AuthenticationResult> LogoutAsync(string token)
        {
            var refreshToken = _appMainDataContext.RefreshTokens.SingleOrDefault(rt => rt.Token == token);

            if (refreshToken == null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "Invalid Token" },
                };
            }

            refreshToken.Invalidated = true;
            _appMainDataContext.RefreshTokens.Update(refreshToken);
            var updated = await _appMainDataContext.SaveChangesAsync();

            // var refreshToken = new RefreshToken { Token = RefreshToken };
            // _context.RefreshTokens.Attach(refreshToken);
            // _context.RefreshTokens.Remove(refreshToken);
            //var deleted = await _context.SaveChangesAsync();

            return new AuthenticationResult { Success = true };
        }

        public async Task<AuthenticationResult> RefreshTokenAsync(string token, string refreshToken)
        {
            var validatedToken = GetPrincipalFromToken(token);

            if (string.IsNullOrEmpty(token))
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "Empty Token" },
                };
            }
            if (string.IsNullOrEmpty(refreshToken))
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "Empty Refresh Token" },
                };
            }
            if (validatedToken == null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "Invalid Token" },
                };
            }
            var expiryDateUnix =
                long.Parse(validatedToken.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Exp).Value);
            var expiryDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                .AddSeconds(expiryDateUnix);
            if (expiryDateTimeUtc > DateTime.UtcNow)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "This token hasn't expired yet" },
                };
            }
            var jti = validatedToken.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Jti).Value;
            var storedRefreshToken = await _appMainDataContext.RefreshTokens.SingleOrDefaultAsync(x => x.Token == refreshToken);
            if (storedRefreshToken == null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "This refresh token does not exist" },
                };
            }
            if (DateTime.UtcNow > storedRefreshToken.ExpiryDate)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "This refresh token has expired" },
                };
            }
            if (storedRefreshToken.Invalidated)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "This refresh token has been invalidated" },
                };
            }
            if (storedRefreshToken.Used)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "This refresh token has been used" },
                };
            }
            if (storedRefreshToken.JwtId != jti)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "This refresh token does not match this JWT" },
                };
            }
            storedRefreshToken.Used = true;
            _appMainDataContext.RefreshTokens.Update(storedRefreshToken);
            await _appMainDataContext.SaveChangesAsync();
            var user = await _userManager.FindByIdAsync(validatedToken.Claims.Single(x => x.Type == "id").Value);
            return await GenerateAuthenticationResultForUserAsync(user);
        }

        public async Task<AuthenticationResult> RegisterAsync(string email, string password)
        {
            var existingUserWithEmail = await _userManager.FindByEmailAsync(email);

            if (existingUserWithEmail != null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User with this email address already exists" }
                };
            }

            var newUser = new AppUser
            {
                Email = email,
                UserName = email
            };

            var createdUser = await _userManager.CreateAsync(newUser, password);

            if (!createdUser.Succeeded)
            {
                return new AuthenticationResult
                {
                    Errors = createdUser.Errors.Select(x => x.Description)
                };
            }

            return await GenerateAuthenticationResultForUserAsync(newUser);
        }

        public async Task<AuthenticationResult> RegisterAsync(string username, string email, string password)
        {
            var existingUserWithEmail = await _userManager.FindByEmailAsync(email);

            if (existingUserWithEmail != null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User with this email address already exists" }
                };
            }
            var existingUserWithUsername = await _userManager.FindByNameAsync(username);

            if (existingUserWithUsername != null)
            {
                return new AuthenticationResult
                {
                    Errors = new[] { "User with this Username already exists" }
                };
            }

            var newUser = new AppUser
            {
                Email = email,
                UserName = username
            };

            var createdUser = await _userManager.CreateAsync(newUser, password);

            if (!createdUser.Succeeded)
            {
                return new AuthenticationResult
                {
                    Errors = createdUser.Errors.Select(x => x.Description)
                };
            }

            var sent = await SendConfirmationEmailAsync(newUser);

            return await GenerateAuthenticationResultForUserAsync(newUser);
        }

        public async Task<AuthenticationResult> ResetPasswordAsync(AppUser user, string token, string newPassword)
        {
            var passChangeResult = await _userManager.ResetPasswordAsync(user, token, newPassword);

            return new AuthenticationResult
            {
                Success = passChangeResult.Succeeded,
                Errors = passChangeResult.Errors.Select(x => x.Description)
            };
        }

        public async Task<AuthenticationResult> ResetPasswordEmailAsync(AppUser user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _mailService.SendPasswordResetEmailAsync(user, token);

            return new AuthenticationResult
            {
                Success = result,
                Errors = new List<string>() { "Failed to send Email." }
            };
        }

        public async Task<AuthenticationResult> SendConfirmationEmailAsync(AppUser user)
        {
            var emailConfirmationCode = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var sent = await _mailService.SendAccountVerificationEmailAsync(user, emailConfirmationCode);

            return new AuthenticationResult
            {
                Success = sent,
                Errors = new List<string>() { "Failed to send Email." }
            };
        }

        public async Task<AuthenticationResult> UpdatePasswordAsync(AppUser userToUpdate, string newPassword)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(userToUpdate);
            var passChangeResult = await _userManager.ResetPasswordAsync(userToUpdate, token, newPassword);

            return new AuthenticationResult
            {
                Success = passChangeResult.Succeeded,
                Errors = passChangeResult.Errors.Select(x => x.Description)
            };
        }

        public Task<AuthenticationResult> ValidatePasswordAsync(string password)
        {
            throw new NotImplementedException();
        }

        private async Task<AuthenticationResult> GenerateAuthenticationResultForUserAsync(AppUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("id", user.Id.ToString())
            };

            var userClaims = await _userManager.GetClaimsAsync(user);
            claims.AddRange(userClaims);

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var userRole in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole));
                var role = await _roleManager.FindByNameAsync(userRole);
                if (role == null) continue;
                var roleClaims = await _roleManager.GetClaimsAsync(role);

                foreach (var roleClaim in roleClaims)
                {
                    if (claims.Contains(roleClaim))
                        continue;

                    claims.Add(roleClaim);
                }
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(_jwtSettings.TokenLifetime),
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var refreshToken = new RefreshToken
            {
                JwtId = token.Id,
                UserId = user.Id,
                CreationDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddMonths(6)
            };

            await _appMainDataContext.RefreshTokens.AddAsync(refreshToken);
            await _appMainDataContext.SaveChangesAsync();

            return new AuthenticationResult
            {
                Success = true,
                Token = tokenHandler.WriteToken(token),
                RefreshToken = refreshToken.Token
            };
        }

        private ClaimsPrincipal GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var tokenValidationParameters = _tokenValidationParameters.Clone();
                tokenValidationParameters.ValidateLifetime = false;
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
                if (!IsJwtWithValidSecurityAlgorithm(validatedToken))
                {
                    return null;
                }

                return principal;
            }
            catch
            {
                return null;
            }
        }

        private static bool IsJwtWithValidSecurityAlgorithm(SecurityToken validatedToken)
        {
            return (validatedToken is JwtSecurityToken jwtSecurityToken) &&
                   jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                       StringComparison.InvariantCultureIgnoreCase);
        }

    }
}
