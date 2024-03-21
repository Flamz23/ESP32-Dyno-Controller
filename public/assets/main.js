let port;
let portInfo;
const baud = 115200;

const serialDataSeparator = "\n"; // character to separate data

let parsedTraceFile;
const csvHeaderRow = 15; // row to look for headers
const rpmColumnHeader = '"RPM"\r'; // word to look for indicating header row
const rpmStartRow = 18;
const rpmDataSize = 300; // number of values to read
const rpmTracePeriod = 0.05;
let rpmData = []; // array to hold the parsed rpm data

// Set main chart chart options
var RPM_Chart_options = {
  title: "Dynamic Chart",
  curveType: "none",
  legend: { position: "bottom" },
};

let debug = false;
let recording = false;

/***********************************************************************************************************/

// check web serial api availability
if ("serial" in navigator) {
  log("The web serial API is supported", "info");
} else {
  log(
    "The web serial API is not supported in this context or browser",
    "alert"
  );
}

// alert user when device is disconnected
navigator.serial.addEventListener("disconnect", (e) => {
  log("Device disconnected", "alert");
});

async function connectDevice() {
  try {
    // Request access to the selected serial port
    port = await navigator.serial.requestPort();

    // Open the port
    await port.open({ baudRate: baud });

    // get vendor and product id
    portInfo = port.getInfo();

    log(
      `Connected to Vendor: ${portInfo.usbVendorId} (${portInfo.usbProductId})`,
      "info"
    );

    //start reading data from the serial port
    readSerialMessage();
  } catch (error) {
    log("Error connecting to port:", "error", error);
  }
}

async function disconnectDevice() {
  try {
    if (port) {
      // Close the serial port
      await port.close();
      log("Serial connection closed.", "info");
    } else {
      log("No active serial connection.", "warn");
    }
  } catch (error) {
    log("Error closing serial connection:", "error", error);
  }
}

/***********************************************************************************************************/

async function readSerialMessage() {
  try {
    // Create a text decoder to handle received data
    const textDecoder = new TextDecoderStream("utf-8");

    // Create a readable stream from the serial port
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);

    // Get a reference to the readable stream
    const readableStream = textDecoder.readable;

    // Start reading data from the stream
    const reader = readableStream.getReader();
    
    // Buffer to accumulate received data
    let lineBuffer = ""; 

    // read data from the serial port and parse
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        reader.releaseLock();
        log("Reader has been closed", "info");
        break;
      }

      // Append the received data to the buffer
      lineBuffer += value;

      // Check if the received data contains a newline character
      if (lineBuffer.includes(serialDataSeparator)) {
        // If so, remove the newline character and process the received data
        const lines = lineBuffer.split(serialDataSeparator);
        lineBuffer = lines.pop(); // Store the remaining data in the buffer
        
        lines.forEach((line) => {
          // Process the received line of data
          parseSerialMessage(line);

          console.log(line);
        });
      }
    }
  } catch (error) {}
}

function parseSerialMessage(line) {
  // Object to hold parsed data
  var parsedData = {};

  // Parse the received data
  const data = (line.toString()).trim();

  switch (data[0]) {
    case "0": // Used for debugging. Shows data from all devices and sensors
      // Do something
      break;
    case "1": // Only real-time data (i.e data used during tests)
      // Do something else
      break;
    case "2": // Reports
        // Do something else
        break;
    default:
      // Do nothing
      break;
  }
}

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

      var myChart = new googleChart(RPM_Chart_options);
      google.charts.setOnLoadCallback(
        myChart.createLineChart("RPM", "main-graph")
      );
      myChart.updateLineChart(rpmData, 0, rpmTracePeriod);

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
    for (var i = rpmStartRow - 1; i < rpmStartRow - 1 + rpmDataSize; i++) {
      // excel numbering starts at 1
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

// #TODO: Chart crosshair
// #TODO: Chart scaling\zooming
// #TODO: Chart lines
// #TODO: Add a class to handle logging

google.charts.load("current", { packages: ["corechart"] }); // Load the Visualization API

class googleChart {
  label;
  element;
  data;
  chartObject;
  options;

  constructor(options) {
    this.options = options;
  }

  // Create a new chart instance
  createLineChart(label, element) {
    // Create an empty data table with one column
    this.data = new google.visualization.DataTable();
    this.data.addColumn("number", "Time");
    this.data.addColumn("number", label);

    this.chartObject = new google.visualization.LineChart(
      document.getElementById(element)
    );

    this.label = label;
    this.element = element;
  }

  // Update chart with new data from an array
  updateLineChart(dataArray, startingTime, period) {
    var time = startingTime;
    for (var i = 0; i < dataArray.length; i++) {
      this.data.addRow([time, dataArray[i]]);
      time += period;
    }
    this.chartObject.draw(this.data, this.options); // update chart
  }

  updateLineChartPoint(time, value) {
    this.data.addRow([time, value]);
    this.chartObject.draw(this.data, this.options); // update chart
  }

  // Clear chart data
  clearLineChart() {
    this.data.removeRows(0, this.data.getNumberOfRows());
    this.chartObject.draw(this.data, this.options); // update chart
  }
}

/***********************************************************************************************************/
/*                                              Logging                                                    */
/***********************************************************************************************************/

function log(msg, level, error = "") {
  if (debug == false) {
    switch (level) {
      case "alert":
        alert(msg);
        console.log(msg);
        break;
      case "info":
        console.info(msg);
        break;
      case "warn":
        console.warn(msg);
        break;
      case "error":
        console.error(msg, error);
        break;
      default:
        console.log(msg);
    }
  } else {
    console.log(msg);
  }
}
