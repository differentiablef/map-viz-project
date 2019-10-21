

var worldLightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 18,
	id: "mapbox.light",
	accessToken: API_KEY
});

// Create the base map, giving it the satellite map tile layer to display on load.

var myMap = L.map("state_chart", {
	center: [
	35.2, -79.6   // Centered at Raleigh, NC !
	],
	zoom: 7,
	layers: [worldLightMap]
});

var countyLayer = null;



function buildDatasetPanel(datasetName) {

	// Build the metadata panel.

	var datasetPanelObj = d3.select("#dataset_info");
	

	// Build the metadata output on the "dataset_info" div element.
	// First construct a request to the data route for the dataset in question.
	
	var averageValue = 0.0;
	var countyMax = "Mecklenburg County";
	var maxValue = 0.0;
	var countyMin = "Mecklenburg County";
	var minValue = 0.0;
	
	d3.json("/data/" + datasetName).then((dataset) => {
			
		let qmax = -10000000;
		let qmin =  10000000;
		let qtot = 0.0;
		
		for(var i =0; i<dataset[1].length; ++i){
			let qval = dataset[1][i]['quantity'];
			if(qval<qmin) countyMin = dataset[1][i]['name'];
			if(qval>qmax) countyMax = dataset[1][i]['name'];
			qmin = Math.min(qval, qmin);
			qmax = Math.max(qval, qmax);	
			qtot += qval;
		}
		
		let qave = qtot / dataset[1].length;
		
		let stsig = 0.0;  // Standard deviation.
		
		for(var i =0; i<dataset[1].length; ++i){
			let qval = dataset[1][i]['quantity'] - qave;
			stsig += qval**2;
		}
		
		let cv = Math.sqrt(stsig) / qave;
			
		// Create the dataset_info table.
		// Clear exisiting html out of the "dataset_info" div element.
		
		var qt = d3.select("#quantity-Text");
		qt.text(dataset[0]);
		
		datasetPanelObj.html("");
		datasetPanelObj.append("p").text("State Average =  " + qave.toFixed(1)).style("font-weight", "bold");
		datasetPanelObj.append("p").text("State CV =  " + cv.toFixed(3)).style("font-weight", "bold");
		datasetPanelObj.append("hr");
		datasetPanelObj.append("p").text("Maximum: " + countyMax + " = " + qmax.toFixed(1)).style("font-weight", "bold");
		datasetPanelObj.append("hr");
		datasetPanelObj.append("p").text("Minimum: " + countyMin + " = " + qmin.toFixed(1)).style("font-weight", "bold");
		
  
    });
	
}

function buildStateChart(datasetName) {

	// Build the state chart choropleth map.

	var stateChartObj = d3.select("#state_chart");
	
	//stateChartObj.html("");
	
	if(countyLayer!=null) myMap.removeLayer(countyLayer);
	

	var plist = [];
	
	d3.json("/data/" + datasetName).then((dataset) => {
			
		// Create the dataset_info table.
		// Clear exisiting html out of the "state_chart" div element.
		
		let qmax = -10000000;
		let qmin =  10000000;
		
		
		for(var i =0; i<dataset[1].length; ++i){
			let qval = dataset[1][i]['quantity'];
			qmin = Math.min(qval, qmin);
			qmax = Math.max(qval, qmax);	
		}
				
		for(var i =0; i<dataset[1].length; ++i){
			
			var coords = [];
			dataset[1][i]['polygon'].forEach(x=>{coords.push([x[1], x[0]]);})
			
			qval = dataset[1][i]['quantity'];
			countyName = dataset[1][i]['name'];
			
			plist.push(	L.polygon( coords, {
				color: "white",
				fillColor: markerColor(qval, qmin, qmax),			
				fillOpacity: 0.75,
				name: "XXX",
				weight: 1
			}).bindPopup("<h3>" + countyName + "</h3><hr><h4>" + dataset[0] + " = " + qval.toFixed(1) + "</h4>")
			
			);
			
			
			
					
			
		}
		
		//var countyLayer = L.layerGroup(plist);
		countyLayer = L.layerGroup(plist);
		countyLayer.addTo(myMap);	
		
    });
}

function markerColor(v, vmin, vmax){
	// Returns a color (rgb string) that interpolates between
	// dark blue and dark red using [vmin, vmax] as the domain
	// values.
	
	let r = Math.min(Math.max(v, vmin),vmax);
	
	console.log(r);
	
	let alpha = (r - vmin) / (vmax-vmin);
	alpha = Math.max(Math.min(alpha, 1.0),0.0);
	console.log(alpha);
	
	let col2 = [0, 0, 139];    // dark blue
	let col1 = [255, 0, 0];    // bright red
	let cdiff = [0, 0, 0];
	
	for(var i =0; i<3; ++i){
		cdiff[i] = col1[i] - col2[i];
	}
	//
	let rval = parseInt(col1[0] - alpha * cdiff[0], 10);
	rval = Math.max(Math.min(rval, 255),0);
	let gval = parseInt(col1[1] - alpha * cdiff[1], 10);
	gval = Math.max(Math.min(gval, 255),0);
	let bval = parseInt(col1[2] - alpha * cdiff[2], 10);
	bval = Math.max(Math.min(bval, 255),0);
    
	return "rgb(" + rval + "," + gval + "," + bval + ")";		
}	


function buildBarChart(datasetName) {

	// Build the bar chart.
	
	//border: 2px solid red;
//  border-radius: 50px 20px;

	var barChartHousing = d3.select("#bar_chart_house");
	barChartHousing.style("border", "1px solid black" );
	barChartHousing.style("border-radius", "5px" );

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
