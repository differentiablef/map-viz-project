function buildDatasetPanel(datasetName) {

	// Build the metadata panel.

	var datasetPanelObj = d3.select("#dataset_info");
	

	// Build the metadata output on the "dataset_info" div element.
	// First construct a request to the data route for the dataset in question.
	
	d3.json("/data/" + datasetName).then((dataset) => {
			
		// Create the dataset_info table.
		// Clear exisiting html out of the "dataset_info" div element.
		
		datasetPanelObj.html("");
		datasetPanelObj.append("p").text(dataset[0]);
    });
	
}

function buildStateChart(datasetName) {

	// Build the state chart choropleth map.

	var stateChartObj = d3.select("#state_chart");
	

	// Build the metadata output on the "dataset_info" div element.
	// First construct a request to the data route for the dataset in question.
	
	d3.json("/data/" + datasetName).then((dataset) => {
			
		// Create the dataset_info table.
		// Clear exisiting html out of the "state_chart" div element.
		
		stateChartObj.html("");
		
		// TO DO.
    });
	
}


function buildBarChart(datasetName) {

	// Build the bar chart.

	var barChartObj = d3.select("#bar_chart");
	

	// Build the metadata output on the "dataset_info" div element.
	// First construct a request to the data route for the dataset in question.
	
	d3.json("/data/" + datasetName).then((dataset) => {
			
		// Create the dataset_info table.
		// Clear exisiting html out of the "bar_chart" div element.
		
		barChartObj.html("");
		
		// TO DO.
		
		
		
		
		
		
		// Part 2 - Adding attributes
		var trace1 = {
		x: ["beer", "wine", "martini", "margarita",
			"ice tea", "rum & coke", "mai tai", "gin & tonic"],
		y: [22.7, 17.1, 9.9, 8.7, 7.2, 6.1, 6.0, 4.6],
		type: "bar"
		};
		
		var data = [trace1];
		
		var layout = {
		title: dataset[0],
		xaxis: { title: "Drinks"},
		yaxis: { title: "% of Drinks Ordered"}
		};
		
		Plotly.newPlot("bar_chart", data, layout);



    });
	
}


function init() {
	
  // Grab a reference to the dropdown select element.
  
  var selector = d3.select("#selDataset");

  // Use the list of names for our quantities of interest to populate the <select>
  // element's options.
  
  d3.json("/names").then((datasetNames) => {
    datasetNames.forEach((dataset) => {
      selector
        .append("option")
        .text(dataset)
        .property("value", dataset);
    });
	
	// Create initial content based on the first quantity in the list of datasets.
	
	buildDatasetPanel(datasetNames[0]);
	buildStateChart(datasetNames[0]);
	buildBarChart(datasetNames[0]);  
  });
  
}

// The following function is a listener that is activated by a change
// to the "selDataSet" element (see onchange).
// <select id="selDataset" onchange="optionChanged(this.value)"></select>

function optionChanged(newDatasetName) {
	
	// Grab new data each time a new dataset is selected.
	
	buildDatasetPanel(newDatasetName);  
	buildStateChart(newDatasetName);
	buildBarChart(newDatasetName);  
}


// Initialize the page.

init();
