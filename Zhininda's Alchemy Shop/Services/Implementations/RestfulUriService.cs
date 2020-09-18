using System;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Http;
using Zhinindas_Alchemy_Shop.Contracts.V1.Requests.Queries;
using Zhinindas_Alchemy_Shop.Services.Interfaces;

namespace Zhinindas_Alchemy_Shop.Services.Implementations
{
    public class RestfulUriService : IUriService
    {
        private readonly string _baseUri;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public RestfulUriService(string baseUri, IHttpContextAccessor httpContextAccessor)
        {
            _baseUri = baseUri;
            _httpContextAccessor = httpContextAccessor;
        }

        public Uri GetUri(string idAttribute)
        {
            string resourcePath = _httpContextAccessor.HttpContext.Request.Path;
            return new Uri(_baseUri + resourcePath + "/" + idAttribute);
        }

        public Uri GetPagedUri(PaginationQuery pagination = null)
        {
            string resourcePath = _httpContextAccessor.HttpContext.Request.Path;
            var uri = new Uri(_baseUri + resourcePath);

            if (pagination == null)
            {
                return uri;
            }

            var modifiedUri = QueryHelpers.AddQueryString(_baseUri + resourcePath, "pageNumber", pagination.PageNumber.ToString());
            modifiedUri = QueryHelpers.AddQueryString(modifiedUri, "pageSize", pagination.PageSize.ToString());

            return new Uri(modifiedUri);
        }
    }
}