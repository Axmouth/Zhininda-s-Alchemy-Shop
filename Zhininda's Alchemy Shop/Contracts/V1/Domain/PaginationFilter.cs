using System.Linq;

namespace Zhinindas_Alchemy_Shop.Contracts.V1
{
    public class PaginationFilter
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }
    }
}