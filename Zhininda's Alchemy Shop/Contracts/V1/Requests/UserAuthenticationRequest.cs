using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Contracts.V1.Requests
{
    public class UserAuthenticationRequest
    {
        public string UserName { get; set; }

        public string Password { get; set; }
    }
}
