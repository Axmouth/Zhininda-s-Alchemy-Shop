using Zhinindas_Alchemy_Shop.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.interfaces
{
    public interface IOrderRepository
    {
        void CreateOrder(Order order);

        Task<IEnumerable<Order>> GetUserOrders(string userId);

        Task<Order> GetOrderById(int orderId);
    }
}
