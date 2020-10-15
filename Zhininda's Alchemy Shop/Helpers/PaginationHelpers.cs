using System.Collections.Generic;
using System.Linq;
using Zhinindas_Alchemy_Shop.Contracts.V1;
using Zhinindas_Alchemy_Shop.Contracts.V1.Requests.Queries;
using Zhinindas_Alchemy_Shop.Contracts.V1.Responses;
using Zhinindas_Alchemy_Shop.Services.Interfaces;

namespace Zhinindas_Alchemy_Shop.Helpers
{
    public class PaginationHelpers
    {
        public static BaseResponse<IEnumerable<T>> CreatePaginatedResponse<T>(IUriService uriService, PaginationFilter pagination, IEnumerable<T> response)
        {
             var nextPage = pagination.PageNumber >= 1
                ? uriService.GetPagedUri(new PaginationQuery(pagination.PageNumber + 1, pagination.PageSize)).ToString()
                : null;
            
            var previousPage = pagination.PageNumber - 1 >= 1
                ? uriService.GetPagedUri(new PaginationQuery(pagination.PageNumber - 1, pagination.PageSize)).ToString()
                : null;

            return new BaseResponse<IEnumerable<T>>
            {
                Data = response,
                Pagination = new Pagination
                {
                    PageNumber = pagination.PageNumber >= 1 ? pagination.PageNumber : (int?)null,
                    PageSize = pagination.PageSize >= 1 ? pagination.PageSize : (int?)null,
                    NextPage = response.Any() ? nextPage : null,
                    PreviousPage = previousPage,
                },
                Success = true,
            };
        }
        public static BaseResponse<IEnumerable<T>> CreatePaginatedResponse<T>(IUriService uriService, PaginationFilter pagination, IEnumerable<T> response, int count)
        {
            var nextPage = pagination.PageNumber >= 1
               ? uriService.GetPagedUri(new PaginationQuery(pagination.PageNumber + 1, pagination.PageSize)).ToString()
               : null;

            var previousPage = pagination.PageNumber - 1 >= 1
                ? uriService.GetPagedUri(new PaginationQuery(pagination.PageNumber - 1, pagination.PageSize)).ToString()
                : null;

            return new BaseResponse<IEnumerable<T>>
            {
                Data = response,
                Pagination = new Pagination
                {
                    PageNumber = pagination.PageNumber >= 1 ? pagination.PageNumber : (int?)null,
                    PageSize = pagination.PageSize >= 1 ? pagination.PageSize : (int?)null,
                    NextPage = response.Any() ? nextPage : null,
                    PreviousPage = previousPage,
                    TotalResults = count,
                },
                Success = true,
            };
        }
    }
}