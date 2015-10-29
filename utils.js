function getJSON(url) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'json';
		xhr.onload = function() {
			var status = xhr.status;
			if (status == 200) {
				resolve(xhr.response);
			} else {
				reject(status);
			}
		};
		xhr.send();
	});
};

function addHeatSamples(data) {
	console.log('Total samples: ' + data.query_result.data.rows.length);

	var layerSamples = [];
	var maxIntensity = 0;
	data.query_result.data.rows.forEach(function(sample) {
		layerSamples.push([sample.lat, sample.long, sample.amostra]);
		maxIntensity = Math.max(maxIntensity, sample.amostra);
	});

	console.log('Total samples: ' + data.query_result.data.rows.length);
	console.log('Max sample: ' + maxIntensity);

	var heat = L.heatLayer(layerSamples, {max: maxIntensity}).addTo(map);
}