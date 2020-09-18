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

namespace Zhinindas_Alchemy_Shop.Controllers.V1
{
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ShoppingCart _shoppingCart;
        private readonly UserManager<AppUser> _userManager;

        public OrderController(IOrderRepository orderRepository, ShoppingCart shoppingCart, UserManager<AppUser> userManager)
        {
            _orderRepository = orderRepository;
            _shoppingCart = shoppingCart;
            _userManager = userManager;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet(ApiRoutes.Orders.Create+"derp")]
        public async Task<IActionResult> CheckoutAsync()
        {
            var user = await _userManager.FindByNameAsync(HttpContext.User.Identity.Name);
            var order = new Order
            {
                AddressLine1 = user.AddressLine,
                FirstName = user.FirstName,
                LastName = user.LastName,
                City = user.City,
                Country = user.Country,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                State = user.State,
                ZipCode = user.ZipCode
            };
            return Ok(order);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost(ApiRoutes.Orders.Create)]
        public async Task<IActionResult> CheckoutAsync(CheckoutRequest checkoutRequest)
        {
            var items = _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            if (_shoppingCart.ShoppingCartItems.Count == 0)
            {
                ModelState.AddModelError(string.Empty, "Your cart is empty, add some merchandises first!");
            }

            var order = new Order {
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
                var username =  _userManager.GetUserId(HttpContext.User);
                order.UserId = (await _userManager.FindByNameAsync(username)).Id;
                _orderRepository.CreateOrder(order);
                _shoppingCart.ClearCart();
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
        public async Task<IActionResult> GetAllOrders()
        {
            var username = _userManager.GetUserId(HttpContext.User);
            var userId = (await _userManager.FindByNameAsync(username)).Id;
            var orders = await _orderRepository.GetUserOrders(userId);
            return Ok(new BaseResponse<IEnumerable<Order>>
            {
                Data = orders,
                Success = true
            });
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