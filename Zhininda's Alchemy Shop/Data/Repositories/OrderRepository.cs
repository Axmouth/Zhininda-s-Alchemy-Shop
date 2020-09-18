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
        public void CreateOrder(Order order)
        {
            order.OrderPlaced = DateTime.Now;
            order.OrderTotal = 0;
            _appDbContext.Orders.Add(order);
            _appDbContext.SaveChanges();
            var shoppingCartItems  = _shoppingCart.ShoppingCartItems;
            foreach (var item in shoppingCartItems)
            {
                var orderDetail = new OrderDetail()
                {
                    Amount = item.Amount,
                    MerchandiseId = item.Merchandise.MerchandiseId,
                    OrderId = order.OrderId,
                    Price = item.Merchandise.Price
                };
                _appDbContext.OrderDetails.Add(orderDetail);
                order.OrderTotal += orderDetail.Price * orderDetail.Amount;
            }
            _appDbContext.SaveChanges();
        }

        public async Task<IEnumerable<Order>> GetUserOrders(string userId)
        {
            return await _appDbContext.Orders.Include(o => o.OrderLines).ThenInclude(ol => ol.Merchandise).Where(o => o.UserId == userId).OrderByDescending(o => o.OrderPlaced).ToListAsync();
        }

        public async Task<Order> GetOrderById(int orderId)
        {
            return await _appDbContext.Orders.Include(o => o.OrderLines).ThenInclude(ol => ol.Merchandise).Where(o => o.OrderId == orderId).SingleOrDefaultAsync();
        }
    }
}
