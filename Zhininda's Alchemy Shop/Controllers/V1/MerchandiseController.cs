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
using Zhinindas_Alchemy_Shop.Data.Interfaces;
using Zhinindas_Alchemy_Shop.Helpers;
using Zhinindas_Alchemy_Shop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

public enum MerchandiseSortType
{
    NameAsc,
    NameDesc,
    StockAsc,
    StockDesc,
    DateAddedAsc,
    DateAddedDesc,
}

namespace Zhinindas_Alchemy_Shop.Controllers.V1
{
    [ApiController]
    public class MerchandiseController: ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMerchandiseRepository _merchandiseRepository;
        public readonly IEffectRepository _effectRepository;
        public readonly IUriService _uriService;

        public MerchandiseController(IMerchandiseRepository merchandiseRepository, ICategoryRepository categoryRepository, IEffectRepository effectRepository, IUriService uriService)
        {
            _categoryRepository = categoryRepository;
            _merchandiseRepository = merchandiseRepository;
            _effectRepository = effectRepository;
            _uriService = uriService;
        }

        [HttpGet(ApiRoutes.Merchandises.GetAll)]
        public async Task<IActionResult> GetAllMerchandises([FromQuery] string categoryName, [FromQuery] string effectName, [FromQuery] string search, [FromQuery] bool preferred, [FromQuery] PaginationQuery paginationQuery, [FromQuery] MerchandiseSortType sortType)
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
            if (string.IsNullOrEmpty(effectName) == false)
            {
                merchandises = merchandises.Where(m => m.PrimaryEffect?.Name == effectName || m.SecondaryEffect?.Name == effectName || m.TertiaryEffect?.Name == effectName || m.QuaternaryEffect?.Name == effectName);

            }
            merchandises = merchandises.OrderBy(n => n.Name);
            var count = merchandises.Count();
            if (paginationQuery != null)
            {
                merchandises = merchandises.Skip(paginationQuery.PageSize * (paginationQuery.PageNumber - 1)).Take(paginationQuery.PageSize);
            }


            if (paginationQuery == null || paginationQuery.PageNumber < 1 || paginationQuery.PageSize < 1)
            {
                paginationQuery = new PaginationQuery {
                    PageNumber = 0,
                    PageSize = 0,
                };
            }

            var paginationResponse = PaginationHelpers.CreatePaginatedResponse(_uriService, new PaginationFilter(paginationQuery), merchandises, count);
            return Ok(paginationResponse);
        }

        [HttpGet(ApiRoutes.Categories.GetAll)]
        public async Task<IActionResult> GetAllCategories([FromQuery] PaginationQuery paginationQuery)
        {;
            IEnumerable<Category> categories;

            categories = _categoryRepository.Categories;
            categories = categories.OrderBy(c => c.CategoryName);
            var count = categories.Count();
            if (paginationQuery != null)
            {
                categories = categories.Skip(paginationQuery.PageSize * (paginationQuery.PageNumber - 1)).Take(paginationQuery.PageSize);
            }


            if (paginationQuery == null || paginationQuery.PageNumber < 1 || paginationQuery.PageSize < 1)
            {
                paginationQuery = new PaginationQuery
                {
                    PageNumber = 0,
                    PageSize = 0,
                };
            }

            var paginationResponse = PaginationHelpers.CreatePaginatedResponse(_uriService, new PaginationFilter(paginationQuery), categories, count);
            return Ok(paginationResponse);
        }

        [HttpGet(ApiRoutes.Effects.GetAll)]
        public async Task<IActionResult> GetAllEffects([FromQuery] PaginationQuery paginationQuery)
        {
            ;
            IEnumerable<Effect> effects;

            effects = _effectRepository.Effects;
            effects = effects.OrderBy(c => c.Name);
            var count = effects.Count();
            if (paginationQuery != null)
            {
                effects = effects.Skip(paginationQuery.PageSize * (paginationQuery.PageNumber - 1)).Take(paginationQuery.PageSize);
            }


            if (paginationQuery == null || paginationQuery.PageNumber < 1 || paginationQuery.PageSize < 1)
            {
                paginationQuery = new PaginationQuery
                {
                    PageNumber = 0,
                    PageSize = 0,
                };
            }

            var paginationResponse = PaginationHelpers.CreatePaginatedResponse(_uriService, new PaginationFilter(paginationQuery), effects, count);
            return Ok(paginationResponse);
        }

        [HttpGet(ApiRoutes.Merchandises.Get)]
        public async Task<IActionResult> MerchandiseDetails(int merchandiseId)
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
