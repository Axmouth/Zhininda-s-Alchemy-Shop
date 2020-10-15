using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.Models
{
    public class OrderDetail
    {
        [Key]
        public int OrderDetailId { get; set; }
        [Required]
        public int OrderId { get; set; }
        [Required]
        public int MerchandiseId { get; set; }
        [Required]
        public int Amount { get; set; }
        [Required]
        public int Value { get; set; }
        [ForeignKey(nameof(MerchandiseId))]
        public virtual Merchandise Merchandise { get; set; }
        [ForeignKey(nameof(OrderId))]
        public virtual Order Order { get; set; }
    }
}
