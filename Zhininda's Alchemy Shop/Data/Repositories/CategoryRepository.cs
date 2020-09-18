﻿using Zhinindas_Alchemy_Shop.Data.interfaces;
using Zhinindas_Alchemy_Shop.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.Repositories
{
    public class CategoryRepository: ICategoryRepository
    {
        private readonly AppDbContext _appDbContext;
        public CategoryRepository(AppDbContext dbContext)
        {
            _appDbContext = dbContext;
        }

        public IEnumerable<Category> Categories => _appDbContext.Categories;
    }
}
