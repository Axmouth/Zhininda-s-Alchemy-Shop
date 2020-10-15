using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.Models
{
    public class ShoppingCartItem
    {
        [Key]
        public int ShoppingCartItemId { get; set; }
        [Required]
        public int MerchandiseId { get; set; }
        [ForeignKey(nameof(MerchandiseId))]
        public Merchandise Merchandise { get; set; }

        [Required]
        public int Amount { get; set; }

        [Required]
        public string ShoppingCartId { get; set; }
    }
}
