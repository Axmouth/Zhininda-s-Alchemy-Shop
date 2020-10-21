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
using Microsoft.EntityFrameworkCore;

namespace Zhinindas_Alchemy_Shop.Controllers.V1
{
    public enum MerchandiseSortType
    {
        NameAsc,
        NameDesc,
        PriceAsc,
        PriceDesc,
        StockAsc,
        StockDesc,
    }

    [ApiController]
    public class MerchandiseController : ControllerBase
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
            string currentCategory = string.Empty;

            IQueryable<Merchandise> merchandises = _merchandiseRepository.Merchandises;
            IQueryable<Merchandise> merchCount = _merchandiseRepository.Merchandises;
            if (string.IsNullOrEmpty(categoryName) == false)
            {
                merchandises = merchandises.Where(m => m.Category.CategoryName.Equals(categoryName)).OrderBy(p => p.Name);
                merchCount = merchCount.Where(m => m.Category.CategoryName.Equals(categoryName)).OrderBy(p => p.Name);
            }
            if (preferred == true)
            {
                merchandises = merchandises.Where(m => m.IsPreferred == true);
                merchCount = merchCount.Where(m => m.IsPreferred == true);
            }
            if (string.IsNullOrEmpty(search) == false)
            {
                merchandises = merchandises.Where(m => m.Name.ToLower().Contains(search.ToLower()) || m.ShortDescription.ToLower().Contains(search.ToLower()));
                merchCount = merchCount.Where(m => m.Name.ToLower().Contains(search.ToLower()) || m.ShortDescription.ToLower().Contains(search.ToLower()));
            }
            if (string.IsNullOrEmpty(effectName) == false)
            {
                merchandises = merchandises.Where(m => m.PrimaryEffect.Name == effectName || m.SecondaryEffect.Name == effectName || m.TertiaryEffect.Name == effectName || m.QuaternaryEffect.Name == effectName);
                merchCount = merchCount.Where(m => m.PrimaryEffect.Name == effectName || m.SecondaryEffect.Name == effectName || m.TertiaryEffect.Name == effectName || m.QuaternaryEffect.Name == effectName);

            }
            Task<int> countTask = merchCount.CountAsync();
            if (sortType == MerchandiseSortType.NameAsc)
            {
                merchandises = merchandises.OrderBy(m => m.Name);
            }
            else if (sortType == MerchandiseSortType.NameDesc)
            {
                merchandises = merchandises.OrderByDescending(m => m.Name);
            }
            else if (sortType == MerchandiseSortType.PriceAsc)
            {
                merchandises = merchandises.OrderBy(m => m.Value);
            }
            else if (sortType == MerchandiseSortType.PriceDesc)
            {
                merchandises = merchandises.OrderByDescending(m => m.Value);
            }
            else if (sortType == MerchandiseSortType.StockAsc)
            {
                merchandises = merchandises.OrderBy(n => n.AmountInStock);
            }
            else if (sortType == MerchandiseSortType.StockDesc)
            {
                merchandises = merchandises.OrderByDescending(n => n.AmountInStock);
            }

            if (paginationQuery != null)
            {
                merchandises = merchandises.Skip(paginationQuery.PageSize * (paginationQuery.PageNumber - 1)).Take(paginationQuery.PageSize);
            }


            if (paginationQuery == null || paginationQuery.PageNumber < 1 || paginationQuery.PageSize < 1)
            {
                paginationQuery = new PaginationQuery
                {
                    PageNumber = 0,
                    PageSize = 0,
                };
            }

            Task<Merchandise[]> merchandiseTask = merchandises.ToArrayAsync();

            BaseResponse<IEnumerable<Merchandise>> paginationResponse = PaginationHelpers.CreatePaginatedResponse(_uriService, new PaginationFilter(paginationQuery), await merchandiseTask, await countTask);
            return Ok(paginationResponse);
        }

        [HttpGet(ApiRoutes.Categories.GetAll)]
        public async Task<IActionResult> GetAllCategories([FromQuery] PaginationQuery paginationQuery)
        {
            IQueryable<Category> categories = _categoryRepository.Categories;
            Task<int> countTask = _categoryRepository.Categories.CountAsync();
            categories = categories.OrderBy(c => c.CategoryName);
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
            Task<Category[]> categoriesTask = categories.ToArrayAsync();
            BaseResponse<IEnumerable<Category>> paginationResponse = PaginationHelpers.CreatePaginatedResponse(_uriService, new PaginationFilter(paginationQuery), await categoriesTask, await countTask);
            return Ok(paginationResponse);
        }

        [HttpGet(ApiRoutes.Effects.GetAll)]
        public async Task<IActionResult> GetAllEffects([FromQuery] PaginationQuery paginationQuery)
        {
            IQueryable<Effect> effects = _effectRepository.Effects;
            Task<int> countTask = _effectRepository.Effects.CountAsync();
            effects = effects.OrderBy(c => c.Name);
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
            Task<Effect[]> effectTask = effects.ToArrayAsync();
            BaseResponse<IEnumerable<Effect>> paginationResponse = PaginationHelpers.CreatePaginatedResponse(_uriService, new PaginationFilter(paginationQuery), await effectTask, await countTask);
            return Ok(paginationResponse);
        }

        [HttpGet(ApiRoutes.Merchandises.Get)]
        public async Task<IActionResult> MerchandiseDetails(int merchandiseId)
        {
            Merchandise merchandise = await _merchandiseRepository.GetMerchandiseById(merchandiseId);
            if (merchandise == null)
            {
                return NotFound();
            }
            return Ok(new BaseResponse<Merchandise>() { Data = merchandise, Success = true });
        }
    }
}
