using Zhinindas_Alchemy_Shop.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Zhinindas_Alchemy_Shop.Data.interfaces
{
    public interface IMerchandiseRepository
    {
        IEnumerable<Merchandise> Merchandises { get;  }

        IEnumerable<Merchandise> PreferredMerchandises { get;  }

        Merchandise GetMerchandiseById(int merchandiseId);
    }
}
