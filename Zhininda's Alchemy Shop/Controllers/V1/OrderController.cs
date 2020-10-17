using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Data.interfaces;
using Zhinindas_Alchemy_Shop.Data.Models;
using Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Zhinindas_Alchemy_Shop.Contracts.V1.Responses;
using Zhinindas_Alchemy_Shop.Contracts.V1;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Zhinindas_Alchemy_Shop.Contracts.V1.Requests;
using Zhinindas_Alchemy_Shop.Contracts.V1.Requests.Queries;
using Zhinindas_Alchemy_Shop.Helpers;
using Zhinindas_Alchemy_Shop.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Zhinindas_Alchemy_Shop.Controllers.V1
{
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ShoppingCart _shoppingCart;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUriService _uriService;
        private readonly IMailService _mailService;

        public OrderController(IOrderRepository orderRepository, ShoppingCart shoppingCart, UserManager<AppUser> userManager, IUriService uriService, IMailService mailService)
        {
            _orderRepository = orderRepository;
            _shoppingCart = shoppingCart;
            _userManager = userManager;
            _uriService = uriService;
            _mailService = mailService;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost(ApiRoutes.Orders.Create)]
        public async Task<IActionResult> CheckoutAsync(CheckoutRequest checkoutRequest)
        {
            ShoppingCartItem[] items = await _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            if (_shoppingCart.ShoppingCartItems.Count() == 0)
            {
                ModelState.AddModelError(string.Empty, "Your cart is empty, add some merchandises first!");
            }

            Order order = new Order {
                AddressLine1 = checkoutRequest.AddressLine,
                AddressLine2 = checkoutRequest.AddressLine2,
                City = checkoutRequest.City,
                FirstName = checkoutRequest.FirstName,
                LastName = checkoutRequest.LastName,
                Country = checkoutRequest.Country,
                PhoneNumber = checkoutRequest.PhoneNumber,
                State = checkoutRequest.State,
                ZipCode = checkoutRequest.Zipcode,
                Email = checkoutRequest.Email,
            };

            if (ModelState.IsValid)
            {
                string username =  _userManager.GetUserId(HttpContext.User);
                AppUser user = await _userManager.FindByNameAsync(username);
                order.UserId = user.Id;
                Task<Order> orderTask = _orderRepository.CreateOrder(order);
                order = await orderTask;
                Task<bool> mailTask = _mailService.SendOrderCreatedEmailAsync(user, order);
                await mailTask;
                Task clearCartTask = _shoppingCart.ClearCart();
                await clearCartTask;
                return Ok(new BaseResponse<Order> { 
                    Data = order,
                    Success = true
                });
            }
            return BadRequest(new BaseResponse<string> {
                Data = null,
                Errors = ModelState.Values.SelectMany(err => err.Errors.Select(errm => errm.ErrorMessage)),
                Success = false,
            });
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet(ApiRoutes.Orders.GetAll)]
        public async Task<IActionResult> GetAllOrders([FromQuery] PaginationQuery paginationQuery)
        {
            var username = _userManager.GetUserId(HttpContext.User);
            var userId = (await _userManager.FindByNameAsync(username)).Id;
            var orders = _orderRepository.GetUserOrders(userId);
            var countTask = _orderRepository.GetUserOrders(userId).CountAsync(); ;
            if (paginationQuery != null)
            {
                orders = orders.Skip(paginationQuery.PageSize * (paginationQuery.PageNumber - 1)).Take(paginationQuery.PageSize);
            }


            if (paginationQuery == null || paginationQuery.PageNumber < 1 || paginationQuery.PageSize < 1)
            {
                paginationQuery = new PaginationQuery
                {
                    PageNumber = 0,
                    PageSize = 0,
                };
            }
            var orderListTask = orders.ToArrayAsync();

            var paginationResponse = PaginationHelpers.CreatePaginatedResponse(_uriService, new PaginationFilter(paginationQuery), await orderListTask, await countTask);
            return Ok(paginationResponse);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet(ApiRoutes.Orders.Get)]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            var order = await _orderRepository.GetOrderById(orderId);
            if (order is null)
            {
                return NotFound();
            }
            var username = _userManager.GetUserId(HttpContext.User);
            var userId = (await _userManager.FindByNameAsync(username)).Id;
            if (order?.UserId != userId)
            {
                return Forbid();
            }
            return Ok(new BaseResponse<Order>
            {
                Data = order,
                Success = true
            });
        }
    }
}