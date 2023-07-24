using Microsoft.AspNetCore.Mvc;
using HICOWebAPI.Model;
using HICOWebAPI.Service;

namespace HICOWebAPI.Controllers
{
    public class MaterialsController : ControllerBase
    {
        [HttpGet("api/materials")]
        public IEnumerable<Material> GetMaterials()
        {
            return MaterialService.materials;
        }

        [HttpGet("api/materials/{id}")]
        public IActionResult GetMaterial(Guid id)
        {
            var task = TaskService.tasks.FirstOrDefault(m => m.ID == id);
            if (task == null)
            {
                return NotFound();
            }
            
            return Ok(task);
        }

        [HttpPost("api/materials")]
        public IActionResult CreateMaterial([FromBody] Material material)
        {
            material.ID = Guid.NewGuid();
            MaterialService.materials.Add(material);
            return Ok(material);
        }

        [HttpPut("api/materials/{id}")]
        public IActionResult UpdateMaterial(Guid id, [FromBody] Material updatedMaterial)
        {
            var material = MaterialService.materials.FirstOrDefault(m => m.ID == id);
            if (material == null)
            {
                return NotFound();
            }

            if (!UnitService.CanSwitchUnit(updatedMaterial.UnitOfIssue, material.UnitOfIssue))
            {
                TaskService.tasks.RemoveAll(o => o.TaskMaterialUsage.Material == material);
                material.TaskMaterialUsages = new List<TaskMaterialUsage>();
            }

            material.Partnumber = updatedMaterial.Partnumber;
            material.ManufacturerCode = updatedMaterial.ManufacturerCode;
            material.Price = updatedMaterial.Price;
            material.UnitOfIssue = updatedMaterial.UnitOfIssue;

            return Ok(material);
        }

        [HttpDelete("api/materials/{id}")]
        public IActionResult DeleteMaterial(Guid id)
        {
            var material = MaterialService.materials.FirstOrDefault(m => m.ID == id);
            if (material == null)
            {
                return NotFound();
            }

            material.TaskMaterialUsages.ForEach(o =>
            {
                TaskService.tasks.Remove(o.Task);
            });

            MaterialService.materials.Remove(material);
            return Ok();
        }
    }
}
