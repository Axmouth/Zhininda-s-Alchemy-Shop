using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Contracts.V1.Requests
{
    public class PasswordResetEmailRequest
    {
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}
