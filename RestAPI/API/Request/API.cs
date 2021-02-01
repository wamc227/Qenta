using Newtonsoft.Json;
using RestAPI.Models;
using System;
using System.Configuration;
using System.Net.Http;
using System.Threading.Tasks;

namespace RestAPI.API
{
    public class API
    {
        private HttpClient restClient;
        private string URI;
        public API()
        {
            if(string.IsNullOrEmpty(URI))
            URI = ConfigurationManager.AppSettings["URI"].ToString()?? "http://www.balldontlie.io/api/v1";
            restClient = new HttpClient();
        }
        public API(string uri):this()
        {
            URI = uri;
        }
        public async Task<string> testRequest()
        {
            var Builder = new System.UriBuilder($"{URI}/players");
            var response = await restClient.GetAsync(Builder.Uri);
            var context = await response.Content.ReadAsStringAsync();
            return context;
        }
        public async Task<string> GetPlayers()
        {
            return await testRequest();
        }
        public async Task<Player> GetPlayer(int id)
        {
            var Builder = new System.UriBuilder($"{URI}/players/{id}");
            var response = await restClient.GetAsync(Builder.Uri);
            var context = await response.Content.ReadAsStringAsync();
            Player player = (Player) JsonConvert.DeserializeObject(context);
            return player;
        }
        public async Task<string> UpdatePlayer(Player player)
        {

            var Builder = new System.UriBuilder($"{URI}/players/{player.id}");
            var response = await restClient.GetAsync(Builder.Uri);
            var context = await response.Content.ReadAsStringAsync();
            return context;
        }
    }
}