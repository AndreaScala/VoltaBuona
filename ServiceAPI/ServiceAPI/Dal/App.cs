using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceAPI.Dal
{

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public int Age { get; set; }
        public string Password { get; set; }
    }

    public class Concert
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Where { get; set; }
        public string When { get; set; }
    }

    public class Association
    {
        public int Id { get; set; }
        public int UId { get; set; }
        public int CId { get; set; }
    }
}
