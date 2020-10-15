using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Contracts.V1.Responses
{
    public class Pagination
    {
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string NextPage { get; set; }
        public string PreviousPage { get; set; }
        public int? TotalResults { get; set; }
    }
}
