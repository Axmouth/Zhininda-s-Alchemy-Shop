#pragma checksum "C:\Users\silve\Documents\MyCodeProjects\asp.net\Zhininda's Alchemy Shop\Zhininda's Alchemy Shop\Views\Emails\AccountVerification\AccountVerificationText.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "69b56503d68abfb2a17b2c5fb519259028536902"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Emails_AccountVerification_AccountVerificationText), @"mvc.1.0.view", @"/Views/Emails/AccountVerification/AccountVerificationText.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "C:\Users\silve\Documents\MyCodeProjects\asp.net\Zhininda's Alchemy Shop\Zhininda's Alchemy Shop\Views\Emails\AccountVerification\AccountVerificationText.cshtml"
using Zhinindas_Alchemy_Shop.EmailTemplates.ViewModels;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"69b56503d68abfb2a17b2c5fb519259028536902", @"/Views/Emails/AccountVerification/AccountVerificationText.cshtml")]
    public class Views_Emails_AccountVerification_AccountVerificationText : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<AccountVerificationViewModel>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral("\r\n");
#nullable restore
#line 4 "C:\Users\silve\Documents\MyCodeProjects\asp.net\Zhininda's Alchemy Shop\Zhininda's Alchemy Shop\Views\Emails\AccountVerification\AccountVerificationText.cshtml"
  
    Layout = "_EmailLayoutText";
    ViewContext.ViewData["EmailTitle"] = "Verify your email account";

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n    Greetings ");
#nullable restore
#line 9 "C:\Users\silve\Documents\MyCodeProjects\asp.net\Zhininda's Alchemy Shop\Zhininda's Alchemy Shop\Views\Emails\AccountVerification\AccountVerificationText.cshtml"
         Write(Model.UserName);

#line default
#line hidden
#nullable disable
            WriteLiteral(",\r\n    Thank you for registering to Dragonfly services!\r\n\r\n    We need you to verify that this email belongs to you. In order to confirm your email address open the link bellow. If you did not register for Dragonfly, you can ignore this message. \r\n\r\n    ");
#nullable restore
#line 14 "C:\Users\silve\Documents\MyCodeProjects\asp.net\Zhininda's Alchemy Shop\Zhininda's Alchemy Shop\Views\Emails\AccountVerification\AccountVerificationText.cshtml"
Write(Model.VerificationLink);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n\r\n\r\n   - Dragonfly Team\r\n");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<AccountVerificationViewModel> Html { get; private set; }
    }
}
#pragma warning restore 1591
