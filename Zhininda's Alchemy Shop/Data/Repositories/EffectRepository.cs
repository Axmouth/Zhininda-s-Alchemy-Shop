using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Data.Interfaces;
using Zhinindas_Alchemy_Shop.Data.Models;

namespace Zhinindas_Alchemy_Shop.Data.Repositories
{
    public class EffectRepository: IEffectRepository
    {
        private readonly AppDbContext _appDbContext;
        public EffectRepository(AppDbContext dbContext)
        {
            _appDbContext = dbContext;
        }

        public IQueryable<Effect> Effects => _appDbContext.SpawnNew().Effects.AsNoTracking();
    }
}
