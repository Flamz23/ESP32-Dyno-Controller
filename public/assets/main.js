let port;
let portInfo;
const baud = 57600;


let parsedTraceFile;
const csvHeaderRow = 15; // row to look for headers
const rpmColumnHeader = "\"RPM\"\r" // word to look for indicating header row
const rpmStartRow = 18;
const rpmDataSize = 300; // number of values to read
const rpmTracePeriod = 0.05;
let rpmData = []; // array to hold the parsed rpm data

let global_RPM_Chart_Element;
let global_RPM_Chart_Object;

// Set main chart chart options
var RPM_Chart_options = {
  title: 'Dynamic Chart',
  curveType: 'none',
  legend: { position: 'bottom' }
};






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
      parseTraceFile(csvContent);
      // console.log(csvContent);

      // Update RPM Graph
      updateRPMTrace();

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

    // Extract column headers from the header
    var headers = rows[csvHeaderRow - 1].split(","); // excel numbering starts at 1

    // Find the index of the "rpm" column
    var rpmIndex = headers.indexOf(rpmColumnHeader);

    //console.log(rpmIndex);

    // Loop through rows and split each row into columns
    for (var i = (rpmStartRow - 1); i < ((rpmStartRow - 1) + rpmDataSize); i++) { // excel numbering starts at 1
      var columns = rows[i].split(",");
      var tempStr = columns[rpmIndex];
      rpmData.push(parseInt(tempStr.substring(1, tempStr.length - 1))); //convert to int, remove quotes

      // console.log(columns[rpmIndex]); // print rpm values to console
    }
  } else {
    console.error("No rows found in the CSV file.");
  }
}

/***********************************************************************************************************/
/*                                              DRAW                                                 */
/***********************************************************************************************************/
// See https://developers.google.com/chart/interactive/docs/gallery/linechart#classic

google.charts.load('current', { 'packages': ['corechart'] }); // Load the Visualization API
google.charts.setOnLoadCallback(drawRPMChart); // API load callback

// function UpdateData(value, data, chart, options) {
//     var today = new Date();
//     data.addRow([`${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`, value]); // Add to the data
//     chart.draw(data, options); // update chart

//     // Stop adding data after 10 points
//     var numRows = data.getNumberOfRows();
//     if (numRows > 10) {
//         data.removeRow(0);
//     }
// }

// function drawChart() {
//     // Create an empty data table with one column
//     var rpmTraceData = new google.visualization.DataTable();
//     rpmTraceData.addColumn('string', 'Time');
//     rpmTraceData.addColumn('number', 'RPM');

//     // Create a new line chart
//     var mainGraph = new google.visualization.LineChart(document.getElementById('main-graph'));

//     // Set chart options
//     var options = {
//         title: 'Dynamic Chart',
//         curveType: 'function',
//         legend: { position: 'bottom' }
//     };

//     setInterval(function () {
//         var value = Math.floor(Math.random() * 100); // Generate data point
//         UpdateData(value, rpmTraceData, mainGraph, options)
//     }, 1000)
// }

// Create a new chart instance for RPM Trace (RaceStudio Software) and Dynamometer RPM
function drawRPMChart() {
  // Create an empty data table with one column
  var rpmTraceChart = new google.visualization.DataTable();
  rpmTraceChart.addColumn('number', 'Time');
  rpmTraceChart.addColumn('number', 'RPM Trace');
  rpmTraceChart.addColumn('number', 'Dynamometer RPM');

  // Create a new line chart
  var mainGraph = new google.visualization.LineChart(document.getElementById('main-graph'));

  global_RPM_Chart_Element = mainGraph;
  global_RPM_Chart_Object = rpmTraceChart; // push to global scope
}

function updateRPMTrace() {
  var time = 0;
  for (var i = 0; i < rpmDataSize; i++) {
    global_RPM_Chart_Object.addRow([time, rpmData[i], 0]);
    console.log(rpmData[i]);
    time+=rpmTracePeriod;
  }
  global_RPM_Chart_Element.draw(global_RPM_Chart_Object, RPM_Chart_options); // update chart
}


/***********************************************************************************************************/
/*                                              Logging                                                    */
/***********************************************************************************************************/

function log(data, level) {

}