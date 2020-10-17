using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Data.interfaces;
using Zhinindas_Alchemy_Shop.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Zhinindas_Alchemy_Shop.Contracts.V1.Responses;
using Zhinindas_Alchemy_Shop.Contracts.V1;
using Microsoft.EntityFrameworkCore;

namespace Zhinindas_Alchemy_Shop.Controllers.V1
{
    [ApiController]
    public class ShoppingCartController : ControllerBase
    {
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly ShoppingCart _shoppingCart;

        public ShoppingCartController(IMerchandiseRepository merchandiseRepository, ShoppingCart shoppingCart)
        {
            _merchandiseRepository = merchandiseRepository;
            _shoppingCart = shoppingCart;
        }

        [HttpGet(ApiRoutes.ShoppingCart.GetAll)]
        public async Task<IActionResult> GetAll()
        {
            ShoppingCartItem[] items = await _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            ShoppingCartResponse shoppingCartResponse = new ShoppingCartResponse
            {
                ShoppingCart = _shoppingCart,
                ShoppingCartTotal = await _shoppingCart.GetShoppingCartTotal()
            };
            return Ok(new BaseResponse<ShoppingCartResponse>
            {
                Data = shoppingCartResponse,
                Success = true
            });
        }

        [HttpPost(ApiRoutes.ShoppingCart.Add)]
        public async Task<IActionResult> AddToShoppingCart([FromRoute]int merchandiseId, [FromQuery] int amount)
        {
            Merchandise selectedMerchandise = await _merchandiseRepository.Merchandises.FirstOrDefaultAsync(p => p.MerchandiseId == merchandiseId);

            if (selectedMerchandise != null)
            {
                await _shoppingCart.AddToCart(selectedMerchandise, amount);
            }
            else
            {
                return NotFound();
            }
            ShoppingCartItem[] items = await _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            ShoppingCartResponse shoppingCartResponse = new ShoppingCartResponse
            {
                ShoppingCart = _shoppingCart,
                ShoppingCartTotal = await _shoppingCart.GetShoppingCartTotal()
            };
            return Ok(new BaseResponse<ShoppingCartResponse>
            {
                Data = shoppingCartResponse,
                Success = true
            });
        }

        [HttpDelete(ApiRoutes.ShoppingCart.Remove)]
        public async Task<IActionResult> RemoveFromShoppingCart([FromRoute]int merchandiseId, [FromQuery] int amount)
        {
            Merchandise selectedMerchandise = _merchandiseRepository.Merchandises.FirstOrDefault(p => p.MerchandiseId == merchandiseId);

            if (selectedMerchandise != null)
            {
                await _shoppingCart.RemoveFromCart(selectedMerchandise, amount);
            }
            else
            {
                return NotFound();
            }
            ShoppingCartItem[] items = await _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            ShoppingCartResponse shoppingCartResponse = new ShoppingCartResponse
            {
                ShoppingCart = _shoppingCart,
                ShoppingCartTotal = await _shoppingCart.GetShoppingCartTotal()
            };
            return Ok(new BaseResponse<ShoppingCartResponse>
            {
                Data = shoppingCartResponse,
                Success = true
            });
        }

        [HttpPut(ApiRoutes.ShoppingCart.Update)]
        public async Task<IActionResult> UpdateShoppingCartItem([FromRoute] int merchandiseId, [FromQuery] int amount)
        {
            Merchandise selectedMerchandise = _merchandiseRepository.Merchandises.FirstOrDefault(p => p.MerchandiseId == merchandiseId);

            if (selectedMerchandise != null)
            {
                await _shoppingCart.UpdateCartItem(selectedMerchandise, amount);
            }
            else
            {
                return NotFound();
            }
            ShoppingCartItem[] items = await _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            ShoppingCartResponse shoppingCartResponse = new ShoppingCartResponse
            {
                ShoppingCart = _shoppingCart,
                ShoppingCartTotal = await _shoppingCart.GetShoppingCartTotal()
            };
            return Ok(new BaseResponse<ShoppingCartResponse>
            {
                Data = shoppingCartResponse,
                Success = true
            });
        }
    }
}