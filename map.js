document.title = "Mapa de calor - regiões com mais ônibus - Rio Bus";

var maxSample = 0;
var maxIntensity = getParameterByName('maxIntensity');
var maxIntensityDefault = 300;
var maps = [];
var focusedMap;

function addHeatSamples(map, data) {
	var totalSamples = data.query_result.data.rows.length;
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

	return totalSamples;
}

function loadMap(elementID, fileName, callback) {
	var map = setupMap(elementID);
	map.on('moveend', updateMapsPosition);
	map.on('focus', mapDidFocus);
	maps.push(map);

	// Configure data source
	var filePath = 'data/' + fileName;
	console.log('Fetching data from ' + filePath + '...');
	loadScript(filePath, function () {
		console.log('Finished loading file.');
		var totalSamples = addHeatSamples(map, results);
		loadInfoBox(map, fileName, totalSamples);

		if (callback) callback();
	});
}

function setupMap(elementID) {
	var map = L.map(elementID).setView([-22.9235, -43.4096], 11);

	var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);

	return map;
}

function loadInfoBox(map, fileName, totalSamples) {
	var info = L.control();

	info.onAdd = function (map) {
	    this._div = L.DomUtil.create('div', 'info');
	    this.update();
	    return this._div;
	};

	info.update = function(props) {
	    this._div.innerHTML =
	        '<b>Dataset: </b>' + fileName + '<br>' +
	        '<b>Samples: </b>' + totalSamples + '<br>' +
	        '<b>Maximum detected: </b>' + maxSample + '<br>' +
	        '<b>Maximum used: </b>' + maxIntensity + '<br>';
	};

	info.addTo(map);
}

function mapDidFocus(e) {
	focusedMap = e.target;
}

function updateMapsPosition(e) {
	var updatedMap = e.target;
	if (focusedMap && updatedMap != focusedMap) {
		return;
	}

	var newCenter = updatedMap.getCenter();
	var newZoom = updatedMap.getZoom();

	for (var map of maps) {
		if (map == updatedMap) continue;

		map.panTo(newCenter, { animate: false });
		map.setZoom(newZoom, { animate: false });
	}
}
