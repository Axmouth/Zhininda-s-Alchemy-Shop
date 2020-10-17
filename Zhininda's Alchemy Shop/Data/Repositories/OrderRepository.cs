using Zhinindas_Alchemy_Shop.Data.interfaces;
using Zhinindas_Alchemy_Shop.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.Repositories
{
    public class OrderRepository : IOrderRepository
    {

        private readonly AppDbContext _appDbContext;
        private readonly ShoppingCart _shoppingCart;

        public OrderRepository(AppDbContext appDbContext, ShoppingCart shoppingCart)
        {
            _appDbContext = appDbContext;
            _shoppingCart = shoppingCart;
        }
        public async Task<Order> CreateOrder(Order order)
        {
            AppDbContext appDbContext = _appDbContext.SpawnNew();
            order.OrderPlaced = DateTime.Now;
            order.OrderTotal = 0;
            await appDbContext.Orders.AddAsync(order);
            await appDbContext.SaveChangesAsync();
            var shoppingCartItems  = _shoppingCart.ShoppingCartItems;
            foreach (var item in shoppingCartItems)
            {
                var orderDetail = new OrderDetail()
                {
                    Amount = item.Amount,
                    MerchandiseId = item.Merchandise.MerchandiseId,
                    OrderId = order.OrderId,
                    Value = item.Merchandise.Value
                };
                appDbContext.OrderDetails.Add(orderDetail);
                order.OrderTotal += orderDetail.Value * orderDetail.Amount;
            }
            appDbContext.SaveChanges();
            return await appDbContext.Orders.Where(o => o.OrderId == order.OrderId).Include(o => o.OrderLines).ThenInclude(ol => ol.Merchandise).AsNoTracking().FirstOrDefaultAsync();
        }

        public IQueryable<Order> GetUserOrders(string userId)
        {
            return _appDbContext.SpawnNew().Orders.Include(o => o.OrderLines).ThenInclude(ol => ol.Merchandise).Where(o => o.UserId == userId).OrderByDescending(o => o.OrderPlaced).AsNoTracking();
        }

        public async Task<Order> GetOrderById(int orderId)
        {
            return await _appDbContext.SpawnNew().Orders.AsNoTracking().Include(o => o.OrderLines).ThenInclude(ol => ol.Merchandise).Where(o => o.OrderId == orderId).SingleOrDefaultAsync();
        }
    }
}
