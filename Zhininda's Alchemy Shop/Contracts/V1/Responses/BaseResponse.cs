using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Contracts.V1.Responses
{
    public class BaseResponse<T>
    {
        public T Data { get; set; }

        public IEnumerable<string> Errors { get; set; }

        public IEnumerable<string> Messages { get; set; }

        public bool Success { get; set; }
        public Pagination Pagination { get; set; }
    }
}
