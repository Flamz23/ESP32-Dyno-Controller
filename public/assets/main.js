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
    var rpmChart = new google.visualization.LineChart(document.getElementById('rpm-chart'));

    // Set chart options
    var options = {
        title: 'Dynamic Chart',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    setInterval(function () {
        var value = Math.floor(Math.random() * 100); // Generate data point
        UpdateData(value, )
    }, 1000)
}