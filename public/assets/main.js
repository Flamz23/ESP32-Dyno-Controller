let port;
let portInfo;
let parsedTraceFile;
const csvHeaderRow = 14; // row to look for headers
const rpmColumnHeader = "\"RPM\"\r" // word to look for indicating header row
const rpmStartRow = 15;
const rpmDataSize = 20; // number of values to read
let rpmData = []; // array to hold the parsed rpm data
const baud = 57600;

/***********************************************************************************************************/

// check web serial api availability
if ("serial" in navigator) {
  console.log("The web serial API is supported");
} else {
  alert("The web serial API is not supported in this context or browser");
}

// alert user when device is disconnected
navigator.serial.addEventListener("disconnect", (e) => {
  alert("Device disconnected");
});

async function connectDevice() {
  try {
    // Request access to the selected serial port
    port = await navigator.serial.requestPort();

    // Open the port
    await port.open({ baudRate: baud });

    // get vendor and product id
    portInfo = port.getInfo();

    alert(
      `Connected to Vendor: ${portInfo.usbVendorId} (${portInfo.usbProductId})`
    );
  } catch (error) {
    console.error("Error connecting to port:", error);
  }
}

async function disconnectDevice() {
  try {
    if (port) {
      // Close the serial port
      await port.close();
      console.log("Serial connection closed.");
    } else {
      console.warn("No active serial connection.");
    }
  } catch (error) {
    console.error("Error closing serial connection:", error);
  }
}

/***********************************************************************************************************/

async function readSerialMessage() {
  try {
    // Create a text decoder to handle received data
    const decoder = new TextDecoderStream("utf-8");

    // Create a readable stream from the serial port
    const readableStreamClosed = port.readable.pipeTo(decoder.writable);

    // Get a reference to the readable stream
    const readableStream = decoder.readable;

    // Start reading data from the stream
    const reader = readableStream.getReader();

    // read data from the serial port and parse
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log("Reader has been closed");
        break;
      }

      // Display the received data
      //document.getElementById('output').innerText += value + '\n';
      console.log(value + "\n");
    }
  } catch (error) {}
}

function parseSerialMessage() {}

function sendSerialMessage() {}

/***********************************************************************************************************/

function importTraceFile() {
  // Get the file input element
  var fileInput = document.getElementById("csv-file-picker");

  // Check if a file is selected
  if (fileInput.files.length > 0) {
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      // e.target.result contains the content of the file
      var csvContent = e.target.result;

      // Parse the CSV content
      var parsedTraceFile = parseTraceFile(csvContent);

      // console.log(csvContent);
      // send to MCU
    };

    // Read the file as text
    reader.readAsText(file);
  } else {
    alert("Please select a CSV file.");
  }
}

function parseTraceFile(data) {
  // Split CSV content into rows
  var rows = data.split("\n");

   // Check if there are rows in the CSV content
  if (rows.length > 0) {

    // Extract column headers from the first row
    var headers = rows[csvHeaderRow].split(",");

    // Find the index of the "rpm" column
    var rpmIndex = headers.indexOf(rpmColumnHeader);

    console.log(rpmIndex);

    // Loop through rows and split each row into columns
    for (var i = rpmStartRow; i < (rpmStartRow + rpmDataSize); i++) {
      var columns = rows[i].split(",");
      rpmData.push(columns[rpmIndex]);
      
      console.log(columns[rpmIndex]); // print rpm values to console
    }
  } else {
    console.error("No rows found in the CSV file.");
  }

  return data;
}

/***********************************************************************************************************/

/***********************************************************************************************************/

google.charts.load('current', { 'packages': ['corechart'] }); // Load the Visualization API
google.charts.setOnLoadCallback(drawChart); // API load callback

function UpdateData(value, data, chart, options) {
    var today = new Date();
    data.addRow([`${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`, value]); // Add to the data
    chart.draw(data, options); // update chart

    // Stop adding data after 10 points
    var numRows = data.getNumberOfRows();
    if (numRows > 10) {
        data.removeRow(0);
    }
}

function drawChart() {
    // Create an empty data table with one column
    var rpmTraceData = new google.visualization.DataTable();
    rpmTraceData.addColumn('string', 'Time');
    rpmTraceData.addColumn('number', 'RPM');

    // Create a new line chart
    var mainGraph = new google.visualization.LineChart(document.getElementById('main-graph'));

    // Set chart options
    var options = {
        title: 'Dynamic Chart',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    setInterval(function () {
        var value = Math.floor(Math.random() * 100); // Generate data point
        UpdateData(value, rpmTraceData, mainGraph, options)
    }, 1000)
}
