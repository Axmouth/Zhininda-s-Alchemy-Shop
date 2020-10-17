using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.Models
{
    public class ShoppingCart
    {

        private readonly AppDbContext _appDbContext;
        public ShoppingCart(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [Key]
        public string ShoppingCartId { get; set; }
        
        public ShoppingCartItem[] ShoppingCartItems { get; set; }

        public static ShoppingCart GetCart(IServiceProvider services)
        {
            ISession session = services.GetRequiredService<IHttpContextAccessor>()?
                .HttpContext.Session;

            var context = services.GetService<AppDbContext>();

            string cartId = session.GetString("CartId") ?? Guid.NewGuid().ToString();

            session.SetString("CartId", cartId);

            return new ShoppingCart(context) { ShoppingCartId = cartId };
        }

        public async Task AddToCart(Merchandise merchandise, int amount = 1)
        {
            AppDbContext appDbContext = _appDbContext;
            ShoppingCartItem shoppingCartItem = await appDbContext.ShoppingCartItems.SingleOrDefaultAsync(s => s.Merchandise.MerchandiseId == merchandise.MerchandiseId && s.ShoppingCartId == ShoppingCartId);

            if (shoppingCartItem == null)
            {
                shoppingCartItem = new ShoppingCartItem
                {
                    ShoppingCartId = ShoppingCartId,
                    MerchandiseId = merchandise.MerchandiseId,
                    Amount = amount
                };

                appDbContext.ShoppingCartItems.Add(shoppingCartItem);
            }
            else
            {
                shoppingCartItem.Amount += amount;
            }

            await appDbContext.SaveChangesAsync();
        }

        public async Task UpdateCartItem(Merchandise merchandise, int amount)
        {
            AppDbContext appDbContext = _appDbContext;
            ShoppingCartItem shoppingCartItem = await appDbContext.ShoppingCartItems.SingleOrDefaultAsync(s => s.Merchandise.MerchandiseId == merchandise.MerchandiseId && s.ShoppingCartId == ShoppingCartId);

            if (shoppingCartItem == null)
            {
                shoppingCartItem = new ShoppingCartItem
                {
                    ShoppingCartId = ShoppingCartId,
                    Merchandise = merchandise,
                    Amount = amount
                };

                appDbContext.ShoppingCartItems.Add(shoppingCartItem);
            }
            else
            {
                shoppingCartItem.Amount = amount;
            }

            await appDbContext.SaveChangesAsync();
        }

        public async Task<int> SetItemAmount(Merchandise merchandise, int amount)
        {
            AppDbContext appDbContext = _appDbContext;
            ShoppingCartItem shoppingCartItem = await appDbContext.ShoppingCartItems.SingleOrDefaultAsync(s => s.Merchandise.MerchandiseId == merchandise.MerchandiseId && s.ShoppingCartId == ShoppingCartId);

            int localAmount = 0;
            shoppingCartItem.Amount = amount;

            if (shoppingCartItem.Amount > 0)
            {
                localAmount = shoppingCartItem.Amount;
            }
            else
            {
                appDbContext.ShoppingCartItems.Remove(shoppingCartItem);
            }


            await appDbContext.SaveChangesAsync();

            return localAmount;
        }

        public async Task<int> RemoveFromCart(Merchandise merchandise, int amount = 1)
        {
            AppDbContext appDbContext = _appDbContext;
            ShoppingCartItem shoppingCartItem = appDbContext.ShoppingCartItems.SingleOrDefault(s => s.Merchandise.MerchandiseId == merchandise.MerchandiseId && s.ShoppingCartId == ShoppingCartId);

            var localAmount = 0;
                shoppingCartItem.Amount -= amount;

            if (shoppingCartItem.Amount > 0)
            {
                localAmount = shoppingCartItem.Amount;
            }
            else
            {
                appDbContext.ShoppingCartItems.Remove(shoppingCartItem);
            }
            

            await appDbContext.SaveChangesAsync();

            return localAmount;
        }

        public async Task<ShoppingCartItem[]> GetShoppingCartItems()
        {
            return ShoppingCartItems ??= await _appDbContext.ShoppingCartItems.Where(c => c.ShoppingCartId == ShoppingCartId).Include(s => s.Merchandise).AsNoTracking().ToArrayAsync();
        }

        public async Task ClearCart()
        {
            AppDbContext appDbContext = _appDbContext;
            IQueryable<ShoppingCartItem> cartItems = appDbContext.ShoppingCartItems.Where(cart => cart.ShoppingCartId == ShoppingCartId);

            appDbContext.ShoppingCartItems.RemoveRange(cartItems);

            await appDbContext.SaveChangesAsync();
        }

        public async Task<decimal> GetShoppingCartTotal()
        {
            decimal total = await _appDbContext.ShoppingCartItems.Where(c => c.ShoppingCartId == ShoppingCartId).AsNoTracking().Select(c => c.Merchandise.Value * c.Amount).SumAsync();

            return total;
        }
    }
}
