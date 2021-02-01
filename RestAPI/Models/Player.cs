using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RestAPI.Models
{
    public class Player
    {
        public int id { get; set; }
        public string firts_name { get; set; }
        public string last_name { get; set; }
        public string position { get; set; }
        public int height_feet { get; set; }
        public int height_inches { get; set; }
        public int weight_pounds { get; set; }
        public Team team { get; set; }
    }
}