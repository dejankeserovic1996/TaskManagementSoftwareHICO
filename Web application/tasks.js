loadTable();
loadMaterials();

function loadTable() {
  const table = document.getElementById("taskList");
  const tbody = table.querySelector("tbody");

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  fetch(`http://localhost:5062/api/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => response.json())
    .then((result) => {
      for (const element of result) {
        fetch(`http://localhost:5062/api/tasks/material/${element.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        })
          .then((response) => response.json())
          .then((material) => {
            var table = document.getElementById("taskList").getElementsByTagName('tbody')[0];
            var newRow = table.insertRow(table.length);
            cell1 = newRow.insertCell(0);
            cell1.innerHTML = element.name;
            cell2 = newRow.insertCell(1);
            cell2.innerHTML = element.description;
            cell3 = newRow.insertCell(2);
            cell3.innerHTML = element.totalDuration;
            cell4 = newRow.insertCell(3);
            cell4.innerHTML = material.id;
            cell5 = newRow.insertCell(4);
            cell5.innerHTML = material.manufacturerCode;
            cell6 = newRow.insertCell(5);
            cell6.innerHTML = element.taskMaterialUsage.unitOfMeasurement;
            cell7 = newRow.insertCell(6);
            cell7.innerHTML = element.taskMaterialUsage.amount;
            cell8 = newRow.insertCell(7);
            cell8.innerHTML = `<a onClick="onEdit(this)">Edit</a><a onClick="onDelete(this)">Delete</a>`;
            cell9 = newRow.insertCell(8);
            cell9.innerHTML = element.id;
            cell9.style.display = "none";
          })
          .catch((error) => console.log("Error:", error));
      }
    })
    .catch((error) => console.log("Error:", error));
}

function loadMaterials() {
  const materialSelect = document.getElementById("materialSelect");
  fetch(`http://localhost:5062/api/materials`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => response.json())
    .then((result) => {
      for (const element of result) {
        const option = document.createElement("option");
        option.value = element.id;
        option.textContent = element.manufacturerCode;
        materialSelect.appendChild(option);
      }
      loadUnitsMaterial();
    })
    .catch((error) => console.log("Error:", error));
}

function loadUnitsMaterial(unit) {
  document.getElementById("unitSelect").innerText = "";
  let selectBox = document.getElementById("materialSelect");
  let selectedValue = selectBox.options[selectBox.selectedIndex].value;

  const unitSelect = document.getElementById("unitSelect");
  fetch(`http://localhost:5062/api/units/${selectedValue}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => response.json())
    .then((result) => {
      for (const element of result) {
        const option = document.createElement("option");
        option.value = element;
        option.textContent = element;
        unitSelect.appendChild(option);
      }
      if(unit != null) {
        document.getElementById("unitSelect").value = unit;
      }
    })
    .catch((error) => console.log("Error:", error));
}

function loadUnits() {
  const materialSelect = document.getElementById("unitSelect");
  fetch(`http://localhost:5062/api/units`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => response.json())
    .then((result) => {
      for (const element of result) {
        const option = document.createElement("option");
        option.value = element;
        option.textContent = element;
        materialSelect.appendChild(option);
      }
    })
    .catch((error) => console.log("Error:", error));
}

function insert() {
  var data = getFormData(null);
  insertRow(data);
  resetForm();
}

function update() {
  var data = getFormData(document.getElementById('id').value);
  updateRow(data);
  resetForm();
}

function getFormData(id) {
  const selectElement = document.getElementById("unitSelect");
  const selectedIndex = selectElement.selectedIndex;
  const selectedOption = selectElement.options[selectedIndex];
  const selectedValue = selectedOption.value;
  const data = {
    "ID": id,
    "Name": document.getElementById("name").value,
    "Description": document.getElementById("description").value,
    "TotalDuration": document.getElementById("totalDuration").value,
    "TaskMaterialUsage": {
      "Amount": document.getElementById("amount").value,
      "UnitOfMeasurement": selectedValue
    }
  }
  return data;
}

function insertRow(data) {
  const selectElement = document.getElementById("materialSelect");
  const selectedIndex = selectElement.selectedIndex;
  const selectedOption = selectElement.options[selectedIndex];
  const selectedValue = selectedOption.value;
  
  fetch(`http://localhost:5062/api/create/task/${selectedValue}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((result) => {
    fetch(`http://localhost:5062/api/materials/${result.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        if(response.ok)
          loadTable();
        else
          alert("Error!")
      })
      .catch((error) => console.log("Error:", error));
    })
    .catch((error) => console.log("Error:", error));
}

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("totalDuration").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("unitSelect").innerText = "";
  loadUnitsMaterial();
}

function onEdit(td) {
  let row = td.parentElement.parentElement;
  document.getElementById("name").value = row.cells[0].innerHTML;
  document.getElementById("description").value = row.cells[1].innerHTML;
  document.getElementById("totalDuration").value = row.cells[2].innerHTML;
  document.getElementById("materialSelect").value = row.cells[3].innerHTML;
  document.getElementById("amount").value = row.cells[6].innerHTML;
  document.getElementById("id").value = row.cells[8].innerHTML;
  loadUnitsMaterial(row.cells[5].innerHTML);
}

function updateRow(data) {
  var materialId = document.getElementById("materialSelect").value;
  const selectElement = document.getElementById("materialSelect");
  const selectedIndex = selectElement.selectedIndex;
  const selectedOption = selectElement.options[selectedIndex];

  fetch(`http://localhost:5062/api/tasks/${materialId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if(response.ok)
        loadTable();
      else
        alert("Error!")
    })
    .catch((error) => console.log("Error:", error));
}

function onDelete(td) {
  if (confirm('Are you sure you want to delete the record?')) {
    let id = td.parentElement.parentElement.cells[8].innerHTML;

    fetch(`http://localhost:5062/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          row = td.parentElement.parentElement;
          document.getElementById("taskList").deleteRow(row.rowIndex);
        }
        else {
          alert("Error!");
        }
      })
      .catch((error) => console.log("Error:", error));
  }
}