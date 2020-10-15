using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.Models
{
    public class Merchandise
    {
        public int MerchandiseId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string ShortDescription { get; set; }

        [Required]
        public string LongDescription { get; set; }

        [Required]
        public int Value { get; set; }

        [Required]
        public decimal Weight { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        [Required]
        public string ImageThumbnailUrl { get; set; }
        [Required]
        public bool IsPreferred { get; set; }

        [Required]
        public int AmountInStock { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public virtual Category Category { get; set; }

        [Required]
        public int? PrimaryEffectId { get; set; }
        [ForeignKey(nameof(PrimaryEffectId))]
        public virtual Effect PrimaryEffect { get; set; }

        public int? SecondaryEffectId { get; set; }

        [ForeignKey(nameof(SecondaryEffectId))]
        public virtual Effect SecondaryEffect { get; set; }

        public int? TertiaryEffectId { get; set; }

        [ForeignKey(nameof(TertiaryEffectId))]
        public virtual Effect TertiaryEffect { get; set; }

        public int? QuaternaryEffectId { get; set; }

        [ForeignKey(nameof(QuaternaryEffectId))]
        public virtual Effect QuaternaryEffect { get; set; }
    }
}
