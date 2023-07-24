using System.Text.Json.Serialization;
using HICOWebAPI.Model.Enums;

namespace HICOWebAPI.Model
{
    public class Material
    {
        public Guid? ID { get; set; }
        public string Partnumber { get; set; }
        public int ManufacturerCode { get; set; }
        public int Price { get; set; }
        [System.Text.Json.Serialization.JsonConverter(typeof(JsonStringEnumConverter))]
        public Unit UnitOfIssue { get; set; }
        public Material()
        {
            this.TaskMaterialUsages = new List<TaskMaterialUsage>();
        }
        public Material(Guid? iD, string partnumber, int manufacturerCode, int price, Unit unitOfIssue)
        {
            this.TaskMaterialUsages = new List<TaskMaterialUsage>();
            this.ID = iD;
            this.Partnumber = partnumber;
            this.ManufacturerCode = manufacturerCode;
            this.Price = price;
            this.UnitOfIssue = unitOfIssue;
        }

        public List<TaskMaterialUsage> TaskMaterialUsages { get; set; }
    }
}
