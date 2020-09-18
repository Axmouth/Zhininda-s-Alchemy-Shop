using System;
using Zhinindas_Alchemy_Shop.Contracts.V1.Requests.Queries;

namespace Zhinindas_Alchemy_Shop.Services.Interfaces
{
    public interface IUriService
    {

        Uri GetUri(string idAttribute);

        Uri GetPagedUri(PaginationQuery pagination = null);
    }
}