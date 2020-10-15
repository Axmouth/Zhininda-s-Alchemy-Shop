using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Contracts.V1.Requests
{
    public class PasswordChangeRequest
    {
        public string UserName { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
