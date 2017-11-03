using Microsoft.AspNetCore.Hosting;
using ServiceAPI.Dal;
using System;
using System.Threading.Tasks;

namespace ServiceAPI
{
    class Program
    {
        static void Main(string[] args)
        {

            var host = new WebHostBuilder()
               .UseKestrel()
               .UseStartup<Startup>()
               .Build();

            Task restService = host.RunAsync();

            restService.Wait();
        }
    }
}
