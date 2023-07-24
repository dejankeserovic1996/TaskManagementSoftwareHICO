using System.Text.Json.Serialization;
using HICOWebAPI.Model.Enums;

namespace HICOWebAPI.Model
{
    public class TaskMaterialUsage
    {
        public int Amount { get; set; }
        [System.Text.Json.Serialization.JsonConverter(typeof(JsonStringEnumConverter))]
        public Unit UnitOfMeasurement { get; set; }

        public Task Task { get; set; }
        public Material Material { get; set; }
    }
}
