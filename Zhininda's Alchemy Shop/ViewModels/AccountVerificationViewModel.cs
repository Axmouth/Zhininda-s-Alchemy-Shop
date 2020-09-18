using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.EmailTemplates.ViewModels
{
    public class AccountVerificationViewModel
    {
        public string VerificationLink { get; set; }
        public string UserName { get; set; }

        public AccountVerificationViewModel(string verificationLink, string username)
        {
            VerificationLink = verificationLink;
            UserName = username;
        }
    }
}
