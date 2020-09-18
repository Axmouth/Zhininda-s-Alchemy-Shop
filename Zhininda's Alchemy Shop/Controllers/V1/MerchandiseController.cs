using Zhinindas_Alchemy_Shop.Data.interfaces;
using Zhinindas_Alchemy_Shop.Data.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Contracts.V1.Responses;
using Zhinindas_Alchemy_Shop.Contracts.V1;
using Zhinindas_Alchemy_Shop.Contracts.V1.Requests.Queries;

namespace Zhinindas_Alchemy_Shop.Controllers.V1
{
    [ApiController]
    public class MerchandiseController: ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMerchandiseRepository _merchandiseRepository;

        public MerchandiseController(IMerchandiseRepository merchandiseRepository, ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
            _merchandiseRepository = merchandiseRepository;

        }

        [HttpGet(ApiRoutes.Merchandises.GetAll)]
        public async Task<IActionResult> GetAllMerchandises([FromQuery] string categoryName, [FromQuery] string search, [FromQuery] bool preferred, [FromQuery] PaginationQuery paginationQuery)
        {
            string _category = categoryName;
            IEnumerable<Merchandise> merchandises;

            string currentCategory = string.Empty;

            merchandises = _merchandiseRepository.Merchandises;
            if (string.IsNullOrEmpty(categoryName) == false)
            {
                merchandises = merchandises.Where(m => m.Category.CategoryName.Equals(categoryName)).OrderBy(p => p.Name);
            }
            if (preferred == true)
            {
                merchandises = merchandises.Where(m => m.IsPreferred == true);
            }
            if (string.IsNullOrEmpty(search) == false)
            {
                    merchandises = merchandises.Where(m => m.Name.ToLower().Contains(search.ToLower()) || m.ShortDescription.ToLower().Contains(search.ToLower()));
               
            }
            merchandises = merchandises.OrderBy(n => n.MerchandiseId);

            return Ok(new BaseResponse<IEnumerable<Merchandise>>() { Data = merchandises, Success = true });
        }

        [HttpGet(ApiRoutes.Categories.GetAll)]
        public async Task<IActionResult> GetAllCategories([FromQuery] PaginationQuery paginationQuery)
        {;
            IEnumerable<Category> categories;

            categories = _categoryRepository.Categories;
            categories = categories.OrderBy(c => c.CategoryName);

            return Ok(new BaseResponse<IEnumerable<Category>>() { Data = categories, Success = true });
        }

        [HttpGet(ApiRoutes.Merchandises.Get)]
        public async Task<IActionResult> Details(int merchandiseId)
        {
            var merchandise = _merchandiseRepository.Merchandises.FirstOrDefault(m => m.MerchandiseId == merchandiseId);
            if (merchandise == null)
            {
                return NotFound();
            }
            return Ok(new BaseResponse<Merchandise>() { Data = merchandise, Success = true });
        }
    }
}
