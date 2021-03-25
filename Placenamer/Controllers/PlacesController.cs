using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Marcware.Placenamer.ApiModels;
using Marcware.Placenamer.Classes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Marcware.Placenamer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlacesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public PlacesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("PingMethod")]
        public string Ping()
        {
            return "Ping result";
        }

        [HttpGet]
        public async Task<ProcessResult<IEnumerable<PlaceNameModel>>> Get(string search)
        {
            ProcessResult<IEnumerable<PlaceNameModel>> result = new ProcessResult<IEnumerable<PlaceNameModel>>();
            if (string.IsNullOrEmpty(search))
                result.SetError("No search text has been specified");

            if (result.Success)
            {
                SqlConnection connection = null;
                SqlDataReader reader = null;

                try
                {
                    List<PlaceNameModel> foundItems = new List<PlaceNameModel>();

                    connection = new SqlConnection();
                    connection.ConnectionString = _configuration.GetConnectionString("default");
                    connection.Open();

                    SqlCommand command = new SqlCommand();
                    command.Connection = connection;
                    command.CommandText = GetSearchSql(search);

                    reader = await command.ExecuteReaderAsync();
                    while (reader.Read())
                    {
                        foundItems.Add(BuildPlaceNameModel(reader));
                    }
                    reader.Close();
                    connection.Close();

                    result.SetResult(foundItems);
                }
                catch (Exception e)
                {
                    result.SetError(e.Message);
                    if (reader != null)
                        reader.Close();
                    if (connection != null && connection.State == ConnectionState.Open)
                        connection.Close();
                }
            }
            return result;
        }

        private string GetSearchSql(string searchText)
        {
            string searchSql = "Select sys_UKSettlement.SettlementName, " +
                "sys_UKArea.MapCaption," +
                "sys_UKSettlement.Latitude," +
                "sys_UKSettlement.Longitude " +
                "From sys_UKSettlementNamePart " +
                "Inner Join sys_UKSettlement On sys_UKSettlement.UKSettlementId = sys_UKSettlementNamePart.Settlement_UKSettlementId " +
                "Inner Join sys_UKArea On sys_UKArea.UKAreaId = sys_UKSettlement.Area_UKAreaId " +
                $"Where {GetMultiWhereClause(searchText)}" +
                "Order by sys_UKSettlement.SettlementName, sys_UKArea.AreaName";
            return searchSql;
        }

        private string GetMultiWhereClause(string searchText)
        {
            searchText = searchText.Replace("-", "%")
                .Replace("*", "%")
                .Replace("'", "")
                .ToLower()
                .Trim();

            string[] parts = searchText.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(p => p.Trim())
                .ToArray();

            return string.Join(" Or ", parts.Select(p => GetSingleWhereClause(p)));
        }

        private string GetSingleWhereClause(string searchText)
        {
            searchText = searchText.Replace(" ", "");

            string result = "NamePart ";
            if (searchText.Contains("%"))
                result = $"({result} Like '{searchText}' and {result} <> '{searchText.Replace("%", "")}')";
            else
                result = $"{result} = '{searchText}'";

            return result;
        }

        private PlaceNameModel BuildPlaceNameModel(SqlDataReader reader)
        {
            return new PlaceNameModel()
            {
                PlaceName = reader.GetString(0),
                Area = reader.GetString(1),
                Latitude = reader.GetDouble(2),
                Longitude = reader.GetDouble(3)
            };
        }
    }
}
