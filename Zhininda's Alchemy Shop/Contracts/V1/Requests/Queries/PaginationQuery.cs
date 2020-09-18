using System.Dynamic;

namespace Zhinindas_Alchemy_Shop.Contracts.V1.Requests.Queries
{
    public class PaginationQuery
    {
        public PaginationQuery()
        {
            PageNumber = 1;
            PageSize = 50;
        }

        public PaginationQuery(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize % 50;
        }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }
    }
}