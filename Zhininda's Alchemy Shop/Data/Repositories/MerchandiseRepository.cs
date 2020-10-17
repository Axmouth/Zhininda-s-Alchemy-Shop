using Zhinindas_Alchemy_Shop.Data.interfaces;
using Zhinindas_Alchemy_Shop.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.Repositories
{
    public class MerchandiseRepository : IMerchandiseRepository
    {

        private readonly AppDbContext _appDbContext;

        public MerchandiseRepository(AppDbContext dbContext)
        {
            _appDbContext = dbContext;
        }

        public IQueryable<Merchandise> Merchandises => _appDbContext.SpawnNew().Merchandises.Include(c => c.Category).Include(m => m.PrimaryEffect).Include(m => m.SecondaryEffect).Include(m => m.TertiaryEffect).Include(m => m.QuaternaryEffect).AsNoTracking();


        public IQueryable<Merchandise> PreferredMerchandises => _appDbContext.SpawnNew().Merchandises.Where(p => p.IsPreferred).Include(c => c.Category).Include(m => m.PrimaryEffect).Include(m => m.SecondaryEffect).Include(m => m.TertiaryEffect).Include(m => m.QuaternaryEffect).AsNoTracking();

        public Task<Merchandise> GetMerchandiseById(int merchandiseId) => _appDbContext.SpawnNew().Merchandises.AsNoTracking().Include(c => c.Category).Include(m => m.PrimaryEffect).Include(m => m.SecondaryEffect).Include(m => m.TertiaryEffect).Include(m => m.QuaternaryEffect).FirstOrDefaultAsync(p => p.MerchandiseId == merchandiseId);
    }
}
