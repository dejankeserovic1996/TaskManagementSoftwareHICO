using System.Text.Json.Serialization;

namespace HICOWebAPI.Model.Enums
{
    [System.Text.Json.Serialization.JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Unit
    {
        Millimeter,
        Centimeter,
        Meter,
        Kilometer,
        Milligram,
        Gram,
        Kilogram,
        Ounce,
        Milliliter,
        Liter,
        Gallon
    }
}