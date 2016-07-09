document.title = "Mapa de calor - regiões com mais ônibus - Rio Bus";

var totalSamples = 0;
var maxSample = 0;
var maxIntensity = getParameterByName('maxIntensity');
var maxIntensityDefault = 300;
var file = getParameterByName('file');

var map, info;

function addHeatSamples(data) {
	totalSamples = data.query_result.data.rows.length;
	console.log('Total samples: ' + data.query_result.data.rows.length);

	var layerSamples = [];

	data.query_result.data.rows.forEach(function(sample) {
		layerSamples.push([sample.lat, sample.long, sample.amostra]);
		maxSample = Math.max(maxSample, sample.amostra);
	});

	console.log('Max sample found: ' + maxSample);

	if (maxIntensity == null) {
		maxIntensity = maxIntensityDefault;
	}

	console.log('Max used: ' + maxIntensity);

	var heat = L.heatLayer(layerSamples, { max: maxIntensity }).addTo(map);
}

function loadMap() {
	if (file == null) {
		alert('No file specified in query parameters.');
		return;
	}

	setupMap();

	// Configure data source
	console.log('Fetching data from ' + file + '...');
	loadScript(file, function () {
		console.log('Finished loading file.');
		addHeatSamples(results);
		info.update();
	});
}

function setupMap() {
	map = L.map('map').setView([-22.9235, -43.4096], 11);

	var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
	
	loadInfoBox();
}

function loadInfoBox() {
	info = L.control();

	info.onAdd = function (map) {
	    this._div = L.DomUtil.create('div', 'info');
	    this.update();
	    return this._div;
	};

	info.update = function(props) {
	    this._div.innerHTML = 
	        '<b>Total samples: </b>' + totalSamples + '<br>' +
	        '<b>Maximum used: </b>' + maxIntensity + '<br>' +
	        '<b>Maximum read: </b>' + maxSample + '<br>' +
	        '<b>Maximum default: </b>' + maxIntensityDefault;
	};

	info.addTo(map);
}