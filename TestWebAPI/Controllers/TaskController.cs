using Microsoft.AspNetCore.Mvc;
using HICOWebAPI.Model;
using HICOWebAPI.Model.Enums;
using HICOWebAPI.Service;
using Task = HICOWebAPI.Model.Task;

namespace HICOWebAPI.Controllers
{
    public class TasksController : ControllerBase
    {
        [HttpPost("api/tasks")]
        public IActionResult CreateTask(Task task)
        {
            task.ID = Guid.NewGuid();
            TaskService.tasks.Add(task);
            return Ok(task);
        }

        [HttpGet("api/tasks/{id}")]
        public IActionResult GetTask(Guid id)
        {
            var task = TaskService.tasks.FirstOrDefault(t => t.ID == id);
            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpGet("api/tasks/material/{taskId}")]
        public IActionResult GetMaterial(Guid taskId)
        {
            var task = TaskService.tasks.FirstOrDefault(t => t.ID == taskId);
            if (task == null)
            {
                return NotFound();
            }

            return Ok(task.TaskMaterialUsage.Material);
        }

        [HttpGet("api/tasks")]
        public IEnumerable<Task> GetTasks()
        {
            return TaskService.tasks;
        }

        [HttpPost]
        [Route("api/create/task/{materialId}")]
        public IActionResult CreateATaskWithMaterial(Guid materialId, [FromBody] Task task)
        {
            task.ID = Guid.NewGuid();
            TaskService.tasks.Add(task);

            var material = MaterialService.materials.FirstOrDefault(m => m.ID == materialId);

            if (material == null)
            {
                return NotFound();
            }

            if (!UnitService.CanSwitchUnit(task.TaskMaterialUsage.UnitOfMeasurement, material.UnitOfIssue))
            {
                return BadRequest("Invalid unit switch.");
            }

            task.TaskMaterialUsage.Task = task;
            task.TaskMaterialUsage.Material = material;
            material.TaskMaterialUsages.Add(task.TaskMaterialUsage);

            return Ok(task);
        }

        [HttpPut]
        [Route("api/tasks/{materialId}")]
        public IActionResult UpdateTask(Guid materialId, [FromBody] Task task)
        {
            var material = MaterialService.materials.FirstOrDefault(m => m.ID == materialId);
            var updatedTask = TaskService.tasks.FirstOrDefault(m => m.ID == task.ID);

            if (material == null || updatedTask == null)
            {
                return NotFound();
            }

            if (!UnitService.CanSwitchUnit(task.TaskMaterialUsage.UnitOfMeasurement, material.UnitOfIssue))
            {
                return BadRequest("Invalid unit switch.");
            }

            updatedTask.TaskMaterialUsage.Material.TaskMaterialUsages.RemoveAll(o => o.Task == updatedTask);
            updatedTask.TaskMaterialUsage.Material.TaskMaterialUsages.Add(updatedTask.TaskMaterialUsage);
            updatedTask.TaskMaterialUsage.Material = material;
            updatedTask.TaskMaterialUsage.Task = updatedTask;
            updatedTask.TaskMaterialUsage.UnitOfMeasurement = task.TaskMaterialUsage.UnitOfMeasurement;
            updatedTask.TaskMaterialUsage.Amount = task.TaskMaterialUsage.Amount;
            updatedTask.TotalDuration = task.TotalDuration;
            updatedTask.Description = task.Description;
            updatedTask.ID = task.ID;
            updatedTask.Name = task.Name;

            return Ok(task);
        }

        [HttpGet("api/units")]
        public IActionResult GetUnits()
        {
            var enumValues = Enum.GetValues(typeof(Unit));
            return Ok(enumValues);
        }

        [HttpGet("api/units/{materialId}")]
        public IActionResult GetUnits(Guid materialId)
        {
            var material = MaterialService.materials.FirstOrDefault(m => m.ID == materialId);

            if (material == null)
            {
                return NotFound();
            }

            var units = UnitService.unitList.FirstOrDefault(list => list.Contains(material.UnitOfIssue));

            if (units == null)
            {
                return NotFound();
            }

            return Ok(units);
        }

        [HttpDelete("api/tasks/{id}")]
        public IActionResult DeleteTask(Guid id)
        {
            var task = TaskService.tasks.FirstOrDefault(m => m.ID == id);
            if (task == null)
            {
                return NotFound();
            }

            task.TaskMaterialUsage.Material.TaskMaterialUsages.RemoveAll(o => o.Task == task);
            TaskService.tasks.Remove(task);

            return Ok();
        }
    }
}
