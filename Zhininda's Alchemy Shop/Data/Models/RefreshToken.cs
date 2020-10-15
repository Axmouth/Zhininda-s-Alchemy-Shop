using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Identity.Models;
using Microsoft.AspNetCore.Identity;

namespace Zhinindas_Alchemy_Shop.Data.Models
{
    public class RefreshToken
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Token { get; set; }
        [Required]
        public string JwtId { get; set; }
        [Required]
        public DateTime CreationDate { get; set; }
        [Required]
        public DateTime ExpiryDate { get; set; }
        public bool Used { get; set; }
        public bool Invalidated { get; set; }
        [Required]
        public string UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public AppUser User { get; set; }
    }
}