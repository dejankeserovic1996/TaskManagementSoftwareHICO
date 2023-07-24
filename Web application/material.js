loadTable();
loadUnits();

function loadUnits(unit) {
  const unitSelect = document.getElementById("unitSelect");
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
        unitSelect.appendChild(option);
      }
      if(unit != null) {
        document.getElementById("unitSelect").value = unit;
      }
    })
    .catch((error) => console.log("Error:", error));
}

function insert() {
  var formData = getFormData();
  insertRow(formData);
  resetForm();
}
function update() {
  var formData = getFormData();
  updateRow(formData);
  resetForm();
}

function loadTable() {
  const table = document.getElementById("materialList");
  const tbody = table.querySelector("tbody");

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  fetch("http://localhost:5062/api/materials", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => response.json())
    .then((result) => {
      for (const element of result) {
        var table = document.getElementById("materialList").getElementsByTagName('tbody')[0];
        var newRow = table.insertRow(table.length);
        cell1 = newRow.insertCell(0);
        cell1.innerHTML = element.partnumber;
        cell2 = newRow.insertCell(1);
        cell2.innerHTML = element.manufacturerCode;
        cell3 = newRow.insertCell(2);
        cell3.innerHTML = element.price;
        cell4 = newRow.insertCell(3);
        cell4.innerHTML = element.unitOfIssue;
        cell5 = newRow.insertCell(4);
        cell5.innerHTML = `<a onClick="onEdit(this)">Edit</a><a onClick="onDelete(this)">Delete</a>`;
        cell6 = newRow.insertCell(5);
        cell6.innerHTML = element.id;
        cell6.style.display = "none";
      }
    })
    .catch((error) => console.log("Error:", error));
}

function getFormData() {
  var formData = {};
  formData["partNumber"] = document.getElementById("partNumber").value;
  formData["manufacturerCode"] = document.getElementById("manufacturerCode").value;
  formData["price"] = document.getElementById("price").value;
  const selectElement = document.getElementById("unitSelect");
  const selectedIndex = selectElement.selectedIndex;
  const selectedOption = selectElement.options[selectedIndex];
  const selectedValue = selectedOption.value;
  formData["unitOfIssue"] = selectedValue;
  formData["id"] = null;
  return formData;
}

function insertRow(data) {
  fetch("http://localhost:5062/api/materials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      loadTable();
    })
    .catch((error) => console.log("Error:", error));
}

function resetForm() {
  document.getElementById("partNumber").value = "";
  document.getElementById("manufacturerCode").value = "";
  document.getElementById("price").value = "";
}

function onEdit(td) {
  let row = td.parentElement.parentElement;
  document.getElementById("partNumber").value = row.cells[0].innerHTML;
  document.getElementById("manufacturerCode").value = row.cells[1].innerHTML;
  document.getElementById("price").value = row.cells[2].innerHTML;
  document.getElementById("unitSelect").value = row.cells[3].innerHTML;
  document.getElementById("id").value = row.cells[5].innerHTML;
}
function updateRow(data) {
  data["id"] = document.getElementById('id').value;

  fetch(`http://localhost:5062/api/materials/${data['id']}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      loadTable();
    })
    .catch((error) => console.log("Error:", error));
}

function onDelete(td) {
  if (confirm('Are you sure you want to delete the record?')) {
    let id = td.parentElement.parentElement.cells[5].innerHTML;

    fetch(`http://localhost:5062/api/materials/${id}`, {
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          row = td.parentElement.parentElement;
          document.getElementById("materialList").deleteRow(row.rowIndex);
        }
        else {
          alert("Error!");
        }
      })
      .catch((error) => console.log("Error:", error));
  }
}