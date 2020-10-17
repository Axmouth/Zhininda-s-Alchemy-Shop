using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Zhinindas_Alchemy_Shop.Contracts.V1.Responses;
using System;
using System.Diagnostics;
using Newtonsoft.Json;

namespace Zhinindas_Alchemy_Shop.Filters
{
    public class ValidationFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (context == null || next == null)
            {
                return;
            }
            if (!context.ModelState.IsValid)
            {
                var errorsInModelState = context.ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Errors.Select(x => x.ErrorMessage)).ToArray();

                var errorResponse = new BaseResponse<string>
                {
                    Errors = context.ModelState.Values.SelectMany(err => err.Errors.Select(errm => errm.ErrorMessage)).ToList()
                };
                /*
                foreach (var error in errorsInModelState)
                {
                    foreach (var subError in error.Value)
                    {
                        var errorModel = new ErrorModel
                        {
                            FieldName = error.Key,
                            Message = subError
                        };
                        
                        errorResponse.Errors.Add(errorModel);
                    }
                }*/

                context.Result = new BadRequestObjectResult(errorResponse);
                return;
            }

            await next();

            // after controller
        }
    }
}