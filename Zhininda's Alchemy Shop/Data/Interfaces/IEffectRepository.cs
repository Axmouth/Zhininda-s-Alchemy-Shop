using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Zhinindas_Alchemy_Shop.Data.Models;

namespace Zhinindas_Alchemy_Shop.Data.Interfaces
{
    public interface IEffectRepository
    {
        IEnumerable<Effect> Effects { get; }
    }
}
