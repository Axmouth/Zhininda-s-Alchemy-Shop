using Identity.Models;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Data.Models;

namespace Zhinindas_Alchemy_Shop.EmailTemplates.ViewModels
{
    public class OrderCreatedViewModel
    {
        public AppUser User { get; set; }
        public Order Order { get; set; }
        public string Host { get; set; }

        public OrderCreatedViewModel(AppUser user, Order order, string host)
        {
            User = user;
            Order = order;
            Host = host;
        }
    }
}
