﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Contracts.V1.Requests
{
    public class PasswordResetRequest
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string NewPassword { get; set; }
    }
}