using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.Models
{
    public class ShoppingCartItem
    {
        public int ShoppingCartItemId { get; set; }

        public Merchandise Merchandise { get; set; }

        public int Amount { get; set; }

        public string ShoppingCartId { get; set; }
    }
}
