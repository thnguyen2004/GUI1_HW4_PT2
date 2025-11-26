// github username: thnguyen2004
// Student email: Thomas_Nguyen3@student.uml.edu

// Event listeners
document.querySelector("form").addEventListener("submit", generateTable);
document.addEventListener("DOMContentLoaded", generateTable);

$(document).ready(function () {
  // Initialize validation
  const $submit = $("#submit"); // Submit button
  // Source for validation: https://www.youtube.com/watch?v=yaxUV3Ib4vM
  $("#range-form").validate({
    // Validation rules
    rules: {
      minCol: {
        required: true,
        number: true,
        range: [-50, 50],
        max: function () { // If maxCol is empty, use 50 as default
          return Number($("#maxCol").val()) || 50;
        }
      },
      maxCol: {
        required: true,
        number: true,
        range: [-50, 50],
        min: function () { // If minCol is empty, use -50 as default
          return Number($("#minCol").val()) || -50;
        }
      },
      minRow: {
        required: true,
        number: true,
        range: [-50, 50],
        max: function () { // If maxRow is empty, use 50 as default
          return Number($("#maxRow").val()) || 50;
        }
      },
      maxRow: {
        required: true,
        number: true,
        range: [-50, 50],
        min: function () { // If minRow is empty, use -50 as default
          return Number($("#minRow").val()) || -50;
        }
      }
    },
    // Validation messages
    messages: {
      minCol: {
        required: "Please enter a minimum column value.",
        number: "Please enter a valid number.",
        range: "Value must be between -50 and 50.",
        max: "Minimum column value must be ≤ maximum column value."
      },
      maxCol: {
        required: "Please enter a maximum column value.",
        number: "Please enter a valid number.",
        range: "Value must be between -50 and 50.",
        min: "Maximum column value must be ≥ minimum column value."
      },
      minRow: {
        required: "Please enter a minimum row value.",
        number: "Please enter a valid number.",
        range: "Value must be between -50 and 50.",
        max: "Minimum row value must be ≤ maximum row value."
      },
      maxRow: {
        required: "Please enter a maximum row value.",
        number: "Please enter a valid number.",
        range: "Value must be between -50 and 50.",
        min: "Maximum row value must be ≥ minimum row value."
      }
    }
  });

  // Disable button initially
  $submit.prop("disabled", true);

  // Function to check overall form validity
  function checkFormValidity() {
    if ($("#range-form").valid()) {
      $submit.prop("disabled", false);
    } else {
      $submit.prop("disabled", true);
    }
  }

  // jQuery version of input listener
  // Source for input listener: https://www.w3schools.com/jquery/jquery_events.asp
  $("#range-form").on("input", "input[type=number]", function () {
    $(this).valid(); // revalidate this field as user types

    // revalidate paired field if needed
    if (this.id === "minCol") $("#maxCol").valid();
    if (this.id === "maxCol") $("#minCol").valid();
    if (this.id === "minRow") $("#maxRow").valid();
    if (this.id === "maxRow") $("#minRow").valid();

    // Check overall form validity
    checkFormValidity();
  });

  // Check overall form validity initially
  checkFormValidity();
});

function generateTable(e) {
    if (e) e.preventDefault();

    // Get the values of the input fields
    const minCol = parseInt(document.getElementById('minCol').value);
    const maxCol = parseInt(document.getElementById('maxCol').value);
    const minRow = parseInt(document.getElementById('minRow').value);
    const maxRow = parseInt(document.getElementById('maxRow').value);

    // Clear the table
    const container = document.getElementsByClassName('table')[0];
    container.innerHTML = "";

    // Create the table
    const table = document.createElement("table");

    // Create the body of the table
    const tbody = document.createElement("tbody");
    const headerRow = document.createElement("tr");

    // Create the header row
    for (let i = minCol; i <= maxCol; i++) {
        if (i === minCol) {
            const topLeft = document.createElement("th");
            topLeft.classList.add("topLeft");
            headerRow.appendChild(topLeft);
        }
        const th = document.createElement("th");
        th.classList.add("header-cell");
        th.textContent = i;
        headerRow.appendChild(th);
    }

    // Append the header row to the body
    tbody.appendChild(headerRow);

    // Create the rows of the table
    for (let r = minRow; r <= maxRow; r++) {
        const row = document.createElement("tr");
        for (let c = minCol; c <= maxCol; c++) {
            if (c === minCol) {
                // Create the vertical header cell
                const rowValues = document.createElement("th");
                rowValues.classList.add("vertical-header-cell");
                rowValues.textContent = r;
                row.append(rowValues);
            }
            // Create the cell
            const cell = document.createElement("td");
            cell.textContent = r * c;
            row.appendChild(cell);
        }
        // Append the row to the body
        tbody.appendChild(row);
    }

    // Append the body to the table
    table.appendChild(tbody);
    container.appendChild(table);
}

// 2-way bind slider
function initSlider(inputId) {
  const $input = $("#" + inputId);
  const $slider = $("#" + inputId + "-slider");

  // initialize jQuery UI slider
  // Source: https://jqueryui.com/slider/
  $slider.slider({
    min: -50,
    max: 50,
    value: Number($input.val()),

    // slider -> input
    slide: function (e, ui) {
      $input.val(ui.value).trigger("input");
      generateTable(); // live update dynamic table
    }
  });

  // input -> slider
  $input.on("input", function () {
    let v = Number($input.val());
    if (!isNaN(v) && $("#range-form").valid()) {
      $slider.slider("value", v);
      generateTable(); // live update dynamic table
    }
  });
}

// call for all 4 inputs
$(function () {
  initSlider("minCol");
  initSlider("maxCol");
  initSlider("minRow");
  initSlider("maxRow");
});

// init tabs widget
// Source: https://api.jqueryui.com/tabs/
$("#tabs").tabs();
let tabCounter = 1;

// Save button handler
$("#submit").off("click").on("click", function (e) {
  e.preventDefault();

  if (!$("#range-form").valid()) return;

  // tab label from parameters
  const minCol = $("#minCol").val();
  const maxCol = $("#maxCol").val();
  const minRow = $("#minRow").val();
  const maxRow = $("#maxRow").val();

  const tabId = "tab-" + tabCounter++;

  // add new tab list item
  $("#tabs-list").append(`
    <li id="${tabId}-li">
      <input type="checkbox" class="tab-checkbox" data-tab="${tabId}">
      <a href="#${tabId}">${minCol} to ${maxCol} × ${minRow} to ${maxRow}</a>
      <button class="close-tab delete-tab" data-tab="${tabId}">×</button>
    </li>
  `);

  // add tab panel
  $("#tabs").append(`
    <div id="${tabId}">
      <div class="saved-table">${document.querySelector(".table-container").innerHTML}</div>
    </div>
  `);

  $("#tabs").tabs("refresh");
  $("#tabs").tabs("option", "active", $("#tabs-list li").length - 1);
});

// delete one tab
$(document).on("click", ".delete-tab", function () {
  const id = $(this).data("tab");
  $("#" + id + "-li").remove();
  $("#" + id).remove();
  $("#tabs").tabs("refresh");
});

// delete selected tabs
$("#delete-selected").on("click", function () {
  $(".tab-checkbox:checked").each(function () {
    const id = $(this).data("tab");
    $("#" + id + "-li").remove();
    $("#" + id).remove();
  });
  $("#tabs").tabs("refresh");
});