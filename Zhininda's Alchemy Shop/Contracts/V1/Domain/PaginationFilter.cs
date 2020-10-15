using System.Linq;
using Zhinindas_Alchemy_Shop.Contracts.V1.Requests.Queries;

namespace Zhinindas_Alchemy_Shop.Contracts.V1
{
    public class PaginationFilter
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public PaginationFilter(PaginationQuery query)
        {
            PageNumber = query.PageNumber;
            PageSize = query.PageSize;
        }
    }
}