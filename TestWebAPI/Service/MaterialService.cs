using HICOWebAPI.Model;
using HICOWebAPI.Model.Enums;

namespace HICOWebAPI.Service
{
    public class MaterialService
    {
        public static List<Material> materials = new List<Material>()
        {
            new Material(Guid.NewGuid(), "A", 1, 1, Unit.Kilogram),
            new Material(Guid.NewGuid(), "B", 2, 2, Unit.Liter),
            new Material(Guid.NewGuid(), "C", 3, 3, Unit.Kilogram),
            new Material(Guid.NewGuid(), "D", 4, 4, Unit.Kilometer),
            new Material(Guid.NewGuid(), "E", 5, 5, Unit.Milliliter)
        };
    }
}
