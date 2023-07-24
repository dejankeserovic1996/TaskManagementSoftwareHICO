using Unit = HICOWebAPI.Model.Enums.Unit;

namespace HICOWebAPI.Service
{
    public class UnitService
    {
        public static List<List<Unit>> unitList = new List<List<Unit>>() {
            new List<Unit>() { Unit.Millimeter, Unit.Centimeter, Unit.Meter, Unit.Kilometer },
            new List<Unit>() { Unit.Milligram, Unit.Gram, Unit.Kilogram, Unit.Ounce },
            new List<Unit>() { Unit.Milliliter, Unit.Liter, Unit.Gallon }
        };
        public static bool CanSwitchUnit(Unit unitToSwitch, Unit unitOfIssue)
        {
            return UnitService.unitList.Any(list => list.Contains(unitToSwitch) && list.Contains(unitOfIssue));
        }
    }
}
