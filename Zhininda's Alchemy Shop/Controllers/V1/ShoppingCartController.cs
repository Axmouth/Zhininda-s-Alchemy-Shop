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
            var items = _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            var shoppingCartResponse = new ShoppingCartResponse
            {
                ShoppingCart = _shoppingCart,
                ShoppingCartTotal = _shoppingCart.GetShoppingCartTotal()
            };
            return Ok(new BaseResponse<ShoppingCartResponse>
            {
                Data = shoppingCartResponse,
                Success = true
            });
        }

        [HttpPost(ApiRoutes.ShoppingCart.Add)]
        public IActionResult AddToShoppingCart([FromRoute]int merchandiseId, [FromQuery] int amount)
        {
            var selectedMerchandise = _merchandiseRepository.Merchandises.FirstOrDefault(p => p.MerchandiseId == merchandiseId);

            if (selectedMerchandise != null)
            {
                _shoppingCart.AddToCart(selectedMerchandise, amount);
            }
            else
            {
                return NotFound();
            }
            var items = _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            var shoppingCartResponse = new ShoppingCartResponse
            {
                ShoppingCart = _shoppingCart,
                ShoppingCartTotal = _shoppingCart.GetShoppingCartTotal()
            };
            return Ok(new BaseResponse<ShoppingCartResponse>
            {
                Data = shoppingCartResponse,
                Success = true
            });
        }

        [HttpDelete(ApiRoutes.ShoppingCart.Remove)]
        public IActionResult RemoveFromShoppingCart([FromRoute]int merchandiseId, [FromQuery] int amount)
        {
            var selectedMerchandise = _merchandiseRepository.Merchandises.FirstOrDefault(p => p.MerchandiseId == merchandiseId);

            if (selectedMerchandise != null)
            {
                _shoppingCart.RemoveFromCart(selectedMerchandise, amount);
            }
            else
            {
                return NotFound();
            }
            var items = _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            var shoppingCartResponse = new ShoppingCartResponse
            {
                ShoppingCart = _shoppingCart,
                ShoppingCartTotal = _shoppingCart.GetShoppingCartTotal()
            };
            return Ok(new BaseResponse<ShoppingCartResponse>
            {
                Data = shoppingCartResponse,
                Success = true
            });
        }

        [HttpPut(ApiRoutes.ShoppingCart.Update)]
        public IActionResult UpdateShoppingCartItem([FromRoute] int merchandiseId, [FromQuery] int amount)
        {
            var selectedMerchandise = _merchandiseRepository.Merchandises.FirstOrDefault(p => p.MerchandiseId == merchandiseId);

            if (selectedMerchandise != null)
            {
                _shoppingCart.UpdateCartItem(selectedMerchandise, amount);
            }
            else
            {
                return NotFound();
            }
            var items = _shoppingCart.GetShoppingCartItems();
            _shoppingCart.ShoppingCartItems = items;

            var shoppingCartResponse = new ShoppingCartResponse
            {
                ShoppingCart = _shoppingCart,
                ShoppingCartTotal = _shoppingCart.GetShoppingCartTotal()
            };
            return Ok(new BaseResponse<ShoppingCartResponse>
            {
                Data = shoppingCartResponse,
                Success = true
            });
        }
    }
}