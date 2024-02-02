// check web serial api availability
if ("serial" in navigator) {
    console.log("The web serial API is supported");
} else {
    console.log("The web serial API is not supported in this context or browser");
}

// alert user when device is disconnected
navigator.serial.addEventListener("disconnect", (e) => {
    alert("Device disconnected");
});

let port;
let portInfo;
const baud = 57600;

async function connectDevice() {
    try {
      // Request access to the selected serial port
      port = await navigator.serial.requestPort();

      // Open the port
      await port.open({ baudRate: baud });

      // get vendor and product id
      portInfo = port.getInfo();

      alert(`Connected to Vendor: ${portInfo.usbVendorId} (${portInfo.usbProductId})`);
    } catch (error) {
        console.error('Error connecting to port:', error);
    }
  }


async function disconnectDevice() {

}

async function readSerial() {
    try {
        
    } catch (error) {
        
    }
}



















// google.charts.load('current', { 'packages': ['corechart'] }); // Load the Visualization API
// google.charts.setOnLoadCallback(drawChart); // API load callback

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
//         UpdateData(value, )
//     }, 1000)
// }