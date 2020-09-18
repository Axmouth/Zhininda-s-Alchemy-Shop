using Zhinindas_Alchemy_Shop.Data.interfaces;
using Zhinindas_Alchemy_Shop.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.mocks
{
    public class MockCategoryRepository : ICategoryRepository
    {
        public IEnumerable<Category> Categories
        {
            get
            {
                return new List<Category>
                {
                    new Category{CategoryName= "Alcoholic", Description = "All alcoholic drinks"},
                    new Category{CategoryName= "Non-Alcoholic", Description = "All non-alcoholic drinks"},
                };
            }
        }
    }
}
