using Zhinindas_Alchemy_Shop.Data.Models;
using Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>

    {
        private readonly DbContextOptions<AppDbContext> DbOptions;
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            DbOptions = options;
        }

        public DbSet<Merchandise> Merchandises {get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Effect> Effects { get; set; }

        public AppDbContext SpawnNew() {
            return new AppDbContext(DbOptions);
        }

    }
}
