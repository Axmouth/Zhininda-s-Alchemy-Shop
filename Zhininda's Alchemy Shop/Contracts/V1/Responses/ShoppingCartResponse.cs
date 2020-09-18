using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Data.Models;

namespace Zhinindas_Alchemy_Shop.Contracts.V1.Responses
{
    public class ShoppingCartResponse
    {
        public ShoppingCart ShoppingCart { get; set; }

        public decimal ShoppingCartTotal { get; set; }
    }
}
