using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Jumpstart.Core.Controllers
{
    [Route("q/[controller]")]
    public class QueryController : Controller
    {
        // GET q/query
        [HttpGet]
        public String Get()
        {
            return "TODO";
        }
    }
}
