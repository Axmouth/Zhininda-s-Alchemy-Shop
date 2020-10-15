using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Data.interfaces;
using Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Zhinindas_Alchemy_Shop.Contracts.V1.Requests;
using Zhinindas_Alchemy_Shop.Contracts.V1.Responses;
using Zhinindas_Alchemy_Shop.Data.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using AutoMapper;
using Zhinindas_Alchemy_Shop.Contracts.V1;
using Zhinindas_Alchemy_Shop.Services.Interfaces;
using Microsoft.AspNetCore.Http;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Zhinindas_Alchemy_Shop.Controllers.V1
{
    [ApiController]
    public class AccountController : ControllerBase
    {
        public const string refreshTokenCookieName = "ZhinindasAuthRefreshToken";
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IOrderRepository orderRepository, IOrderDetailRepository orderDetailRepository, IMapper mapper, IAccountService accountService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _mapper = mapper;
            _accountService = accountService;
        }

        [AllowAnonymous]
        [HttpPost(ApiRoutes.Account.Login)]
        public async Task<IActionResult> Login(UserAuthenticationRequest userAuthenticationRequest)
        {
            if (!ModelState.IsValid)
            {
                BadRequest(
                   new BaseResponse<string>
                   {
                       Data = null,
                       Errors = ModelState.Values.SelectMany(err => err.Errors.Select(errm => errm.ErrorMessage)),
                       Success = false,
                   });
            }
            if (userAuthenticationRequest == null)
            {
                return BadRequest(
                   new BaseResponse<string>
                   {
                       Data = null,
                       Errors = new List<string>() { "Empty Request." },
                       Success = false,
                   });
            }

            var authResponse = await _accountService.LoginAsync(userAuthenticationRequest.UserName, userAuthenticationRequest.Password).ConfigureAwait(false);

            if (!authResponse.Success)
            {
                return Unauthorized(new BaseResponse<string>
                {
                    Data = null,
                    Errors = authResponse.Errors,
                    Success = false,
                });
            }

            HttpContext.Response.Cookies.Append(
             refreshTokenCookieName,
             authResponse.RefreshToken,
             new CookieOptions
             {
                 HttpOnly = true,
                 Domain = getCookieDomain(),
                 SameSite = SameSiteMode.None,
                 Secure = false
             });

            return Ok(
                new BaseResponse<AuthSuccessResponse>
                {
                    Data =
                new AuthSuccessResponse
                {
                    Token = authResponse.Token,
                    RefreshToken = authResponse.RefreshToken
                },
                    Success = true,
                });

        }

        [AllowAnonymous]
        [HttpPost(ApiRoutes.Account.Register)]
        public async Task<IActionResult> Register(UserRegistrationRequest userRegistrationRequest)
        {
            if (userRegistrationRequest == null)
            {
                return BadRequest(
                   new BaseResponse<string>
                   {
                       Data = null,
                       Errors = new List<string>() { "Empty Request." },
                       Success = false,
                   });
            }
            if (userRegistrationRequest.Password.Equals(userRegistrationRequest.ConfirmPassword) == false)
            {
                ModelState.AddModelError("ConfirmPassword", "Password and Confirm Password must match.");
            }
            if (!ModelState.IsValid)
            {
                BadRequest(
                   new BaseResponse<string>
                   {
                       Data = null,
                       Errors = ModelState.Values.SelectMany(err => err.Errors.Select(errm => errm.ErrorMessage)),
                       Success = false,
                   });
            }
            var authResponse = await _accountService.RegisterAsync(userRegistrationRequest.UserName, userRegistrationRequest.Email, userRegistrationRequest.Password).ConfigureAwait(false);

            if (!authResponse.Success)
            {
                return Unauthorized(new BaseResponse<string>
                {
                    Data = null,
                    Errors = authResponse.Errors,
                    Success = false,
                });
            }

            return Ok(
                new BaseResponse<AuthSuccessResponse>
                {
                    Data =
                new AuthSuccessResponse
                {
                    Token = authResponse.Token,
                    RefreshToken = authResponse.RefreshToken
                },
                    Success = true,
                });
        }

        [AllowAnonymous]
        [HttpPost(ApiRoutes.Account.Refresh)]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var RefreshToken = Request.Cookies[refreshTokenCookieName];
            var jwtToken = request.Token; // HttpContext.Request.Headers["authorization"].ToString().Replace("Bearer ", "") ?? "";

            var authResponse = await _accountService.RefreshTokenAsync(jwtToken, RefreshToken).ConfigureAwait(false);

            if (!authResponse.Success)
            {
                return Unauthorized(new BaseResponse<string>
                {
                    Data = null,
                    Errors = authResponse.Errors,
                    Success = false,
                });
            }

            HttpContext.Response.Cookies.Append(
             refreshTokenCookieName,
             authResponse.RefreshToken,
             new CookieOptions
             {
                 HttpOnly = true,
                 Domain = getCookieDomain(),
                 SameSite = SameSiteMode.None,
                 Secure = false
             });

            return Ok(
                new BaseResponse<AuthSuccessResponse>
                {
                    Data =
                new AuthSuccessResponse
                {
                    Token = authResponse.Token,
                    RefreshToken = authResponse.RefreshToken
                },
                    Success = true,
                });
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpDelete(ApiRoutes.Account.Logout)]
        public async Task<IActionResult> Logout()
        {
            var RefreshToken = Request.Cookies[refreshTokenCookieName];

            var authResponse = await _accountService.LogoutAsync(RefreshToken).ConfigureAwait(false);

            if (!authResponse.Success)
            {
                return Unauthorized(new BaseResponse<string>
                {
                    Data = null,
                    Errors = authResponse.Errors,
                    Success = false,
                });
            }


            HttpContext.Response.Cookies.Delete(refreshTokenCookieName);

            return NoContent();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet(ApiRoutes.Account.Profile)]
        public async Task<IActionResult> Profile()
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            var user = await _userManager.FindByNameAsync(userId);
            var profileResponse = new ProfileResponse { UserName = user.UserName, Email = user.Email };
            return Ok(new BaseResponse<ProfileResponse>
            {
                Data = profileResponse,
                Success = true
            });
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet(ApiRoutes.Account.GetSettings)]
        public async Task<IActionResult> GetSettings()
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            var user = await _userManager.FindByNameAsync(userId);
            AccountSettingsResponse accountSettingsResponse = new AccountSettingsResponse
            {
                AddressLine = user.AddressLine,
                Username = user.UserName,
                City = user.City,
                Country = user.Country,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                PublicInfo = user.PublicInfo,
                Zipcode = user.ZipCode,
                State = user.State
            };
            return Ok(new BaseResponse<AccountSettingsResponse>
            {
                Data = accountSettingsResponse,
                Success = true
            });
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut(ApiRoutes.Account.UpdateSettings)]
        public async Task<IActionResult> UpdateSettings(UpdateAccountSettingsRequest updateAccountSettingsRequest)
        {
            if (updateAccountSettingsRequest.NewPassword != updateAccountSettingsRequest.ConfirmNewPassword)
            {
                ModelState.AddModelError("ConfirmPassword", "Password and Confirm Password must match.");
            }

            var userId = _userManager.GetUserId(HttpContext.User);
            var user = await _userManager.FindByNameAsync(userId);

            user.FirstName = updateAccountSettingsRequest.FirstName;
            user.LastName = updateAccountSettingsRequest.LastName;
            user.PublicInfo = updateAccountSettingsRequest.PublicInfo;
            user.Country = updateAccountSettingsRequest.Country;
            user.ZipCode = updateAccountSettingsRequest.Zipcode;
            user.State = updateAccountSettingsRequest.State;
            user.City = updateAccountSettingsRequest.City;
            user.AddressLine = updateAccountSettingsRequest.AddressLine;
            var updateResult = await _userManager.UpdateAsync(user);
            if (updateResult.Succeeded == false)
            {
                foreach (var error in updateResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                updateAccountSettingsRequest.Email = user.Email;
            }


            var emailResult = await _userManager.SetEmailAsync(user, updateAccountSettingsRequest.Email);
            if (emailResult.Succeeded == false)
            {
                foreach (var error in emailResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                updateAccountSettingsRequest.Email = user.Email;
            }
            var phoneResult = await _userManager.SetPhoneNumberAsync(user, updateAccountSettingsRequest.PhoneNumber);
            if (phoneResult.Succeeded == false)
            {
                foreach (var error in phoneResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                updateAccountSettingsRequest.PhoneNumber = user.PhoneNumber;
            }
            if (string.IsNullOrEmpty(updateAccountSettingsRequest.NewPassword) == false)
            {
                var passwordResult = await _userManager.ChangePasswordAsync(user, updateAccountSettingsRequest.CurrentPassword, updateAccountSettingsRequest.NewPassword);
                if (passwordResult.Succeeded == false)
                {
                    foreach (var error in passwordResult.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    updateAccountSettingsRequest.Username = user.UserName;
                }

            }
            user = await _userManager.FindByNameAsync(userId);
            return Ok(new BaseResponse<AccountSettingsResponse>
            {
                Data = new AccountSettingsResponse
                {
                    AddressLine = user.AddressLine,
                    Username = user.UserName,
                    City = user.City,
                    Country = user.Country,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    PublicInfo = user.PublicInfo,
                    Zipcode = user.ZipCode,
                    State = user.State
                },
                Success = true,
            });
        }

        private string getCookieDomain()
        {
            return "." + RemoveSubdomain(Request.Host.ToString());
        }

        private string RemoveSubdomain(string host)
        {
            var splitHostname = host.Split('.');
            //if not localhost
            if (splitHostname.Length > 1)
            {
                return string.Join(".", splitHostname.TakeLast(2));
            }
            else
            {
                return host;
            }
        }


        [HttpPost(ApiRoutes.Account.PasswordChange)]
        public async Task<IActionResult> PasswordChange([FromBody] PasswordChangeRequest request)
        {
            if (request == null)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Empty Request." },
                    Success = false,
                });
            }
            var oldUser = await _userManager.FindByNameAsync(request.UserName).ConfigureAwait(false);
            if (oldUser == null)
            {
                return NotFound(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Could not find this User." },
                    Success = false,
                });
            }
            var userId = _userManager.GetUserId(HttpContext.User);
            var user = await _userManager.FindByIdAsync(userId).ConfigureAwait(false);
            if (user.UserName != request.UserName)
            {
                return Unauthorized(new BaseResponse<string>
                {
                    Errors = new List<string>() { "You are not Authorized to edit this User." },
                    Success = false,
                });
            }
            var passCheck = await _accountService.CheckUserPasswordAsync(user, request.OldPassword).ConfigureAwait(false);
            if (!passCheck.Success)
            {
                return Unauthorized(new BaseResponse<string>
                {
                    Errors = passCheck.Errors,
                    Success = false,
                });
            }
            var passUpdated = await _accountService.UpdatePasswordAsync(user, request.NewPassword).ConfigureAwait(false);
            if (!passUpdated.Success)
            {
                return StatusCode(500, new BaseResponse<string>
                {
                    Errors = passUpdated.Errors,
                    Success = false,
                });
            }
            return NotFound();
        }


        [AllowAnonymous]
        [HttpPost(ApiRoutes.Account.PasswordReset)]
        public async Task<IActionResult> PasswordReset([FromBody] PasswordResetRequest request)
        {
            if (request == null)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Empty Request." },
                    Success = false,
                });
            }
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "No password change token included." },
                    Success = false,
                });
            }
            AppUser user;
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var userId = _userManager.GetUserId(HttpContext.User);
                user = await _userManager.FindByIdAsync(userId).ConfigureAwait(false);
                if (user != null && ((!string.IsNullOrEmpty(request.Email) && user.Email != request.Email) || (!string.IsNullOrEmpty(request.UserName) && user.UserName != request.UserName)))
                {
                    return BadRequest(new BaseResponse<string>
                    {
                        Errors = new List<string>() { "Mismatched user data." },
                        Success = false,
                    });
                }
            }
            else if (!string.IsNullOrEmpty(request.UserName))
            {
                user = await _userManager.FindByNameAsync(request.UserName).ConfigureAwait(false);
            }
            else if (!string.IsNullOrEmpty(request.Email))
            {
                user = await _userManager.FindByEmailAsync(request.Email).ConfigureAwait(false);
            }
            else
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "No user data included." },
                    Success = false,
                });
            }
            if (user == null)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Could not find user." },
                    Success = false,
                });
            }
            var sentResult = await _accountService.ResetPasswordAsync(user, request.Token, request.NewPassword).ConfigureAwait(false);
            if (!sentResult.Success)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = sentResult.Errors,
                    Success = false,
                });
            }
            return Ok(new BaseResponse<string>
            {
                Success = true,
            });
        }

        [AllowAnonymous]
        [HttpPost(ApiRoutes.Account.PasswordResetEmail)]
        public async Task<IActionResult> PasswordResetEmail([FromBody] PasswordResetEmailRequest request)
        {
            if (request == null)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Empty Request." },
                    Success = false,
                });
            }
            AppUser user;
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var userId = _userManager.GetUserId(HttpContext.User);
                user = await _userManager.FindByIdAsync(userId).ConfigureAwait(false);
                if (user != null && ((!string.IsNullOrEmpty(request.Email) && user.Email != request.Email) || (!string.IsNullOrEmpty(request.UserName) && user.UserName != request.UserName)))
                {
                    return BadRequest(new BaseResponse<string>
                    {
                        Errors = new List<string>() { "Mismatched user data." },
                        Success = false,
                    });
                }
            }
            else if (!string.IsNullOrEmpty(request.UserName))
            {
                user = await _userManager.FindByNameAsync(request.UserName).ConfigureAwait(false);
            }
            else if (!string.IsNullOrEmpty(request.Email))
            {
                user = await _userManager.FindByEmailAsync(request.Email).ConfigureAwait(false);
            }
            else
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "No user data included." },
                    Success = false,
                });
            }
            if (user == null)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Could not find user." },
                    Success = false,
                });
            }
            var sentResult = await _accountService.ResetPasswordEmailAsync(user).ConfigureAwait(false);
            if (!sentResult.Success)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = sentResult.Errors,
                    Success = false,
                });
            }
            return Ok(new BaseResponse<string>
            {
                Success = true,
            });
        }

        [AllowAnonymous]
        [HttpPost(ApiRoutes.Account.EmailConfirmEmail)]
        public async Task<IActionResult> EmailConfirmEmail([FromBody] EmailConfirmEmailRequest request)
        {
            if (request == null)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Empty Request." },
                    Success = false,
                });
            }
            AppUser user;
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var userId = _userManager.GetUserId(HttpContext.User);
                user = await _userManager.FindByIdAsync(userId).ConfigureAwait(false);
                if (user != null && ((!string.IsNullOrEmpty(request.Email) && user.Email != request.Email) || (!string.IsNullOrEmpty(request.UserName) && user.UserName != request.UserName)))
                {
                    return BadRequest(new BaseResponse<string>
                    {
                        Errors = new List<string>() { "Mismatched user data." },
                        Success = false,
                    });
                }
            }
            else if (!string.IsNullOrEmpty(request.UserName))
            {
                user = await _userManager.FindByNameAsync(request.UserName).ConfigureAwait(false);
            }
            else if (!string.IsNullOrEmpty(request.Email))
            {
                user = await _userManager.FindByEmailAsync(request.Email).ConfigureAwait(false);
            }
            else
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "No user data included." },
                    Success = false,
                });
            }
            if (user == null)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Could not find user." },
                    Success = false,
                });
            }
            var sentResult = await _accountService.SendConfirmationEmailAsync(user).ConfigureAwait(false);
            if (!sentResult.Success)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = sentResult.Errors,
                    Success = false,
                });
            }
            return Ok(new BaseResponse<string>
            {
                Success = true,
            });
        }

        [AllowAnonymous]
        [HttpPost(ApiRoutes.Account.EmailConfirm)]
        public async Task<IActionResult> EmailConfirm([FromBody] EmailConfirmRequest request)
        {
            if (request == null)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Empty Request." },
                    Success = false,
                });
            }
            AppUser user;
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var userId = _userManager.GetUserId(HttpContext.User);
                user = await _userManager.FindByIdAsync(userId).ConfigureAwait(false);
            }
            else if (!string.IsNullOrEmpty(request.UserName))
            {
                user = await _userManager.FindByNameAsync(request.UserName).ConfigureAwait(false);
            }
            else if (!string.IsNullOrEmpty(request.Email))
            {
                user = await _userManager.FindByEmailAsync(request.Email).ConfigureAwait(false);
            }
            else
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "No user data included." },
                    Success = false,
                });
            }
            if (user == null)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = new List<string>() { "Could not find user." },
                    Success = false,
                });
            }
            var result = await _accountService.ConfirmEmailAsync(user, request.Token).ConfigureAwait(false);
            if (!result.Success)
            {
                return BadRequest(new BaseResponse<string>
                {
                    Errors = result.Errors,
                    Success = false,
                });
            }
            return Ok(new BaseResponse<string>
            {
                Success = true
            });
        }


    }
}
