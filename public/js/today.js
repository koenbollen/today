
(function(window){

	var data = undefined;

    var canvas = document.getElementById('today');
    canvas.style.display = "block";
    canvas.style.margin = "auto";
    var context = canvas.getContext('2d');

	function redrawChart()
	{
		if( !data ) {
			return;
		}
		var chart = new Chart(context).Line(data, {
			scaleOverride: true,
			scaleSteps: 25,
			scaleStepWidth: 0.1,
			scaleStart: 0
		});
	}

    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth * .8;
        canvas.height = window.innerHeight * .8;
        redrawChart();
    }
    resizeCanvas();

	if(navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(function(position) {

			var r = new XMLHttpRequest();
			r.open("GET", "/rr/"+position.coords.latitude+"/"+position.coords.longitude, false);
			r.onreadystatechange = function () {
				if (r.readyState != 4 || r.status != 200) return;
				var rawdata = JSON.parse(r.responseText);

				var ldata = { 
					labels: [], 
					datasets: [{
						fillColor: "rgba(151,187,205,0.5)",
						strokeColor: "rgba(151,187,205,1)",
						pointColor: "rgba(151,187,205,1)",
						pointStrokeColor: "#fff",
						data: []
					}] 
				};
				rawdata.forEach(function(e, i) {
					ldata.labels.push(e.time);
					ldata.datasets[0].data.push( Math.pow(10,((e.value -109)/32)) );
				});
				data = ldata;
				redrawChart();

			};
			r.send();

		}, function(error) {
			console.err("Error occurred. Error code: " + error.code);
			// error.code can be:
			//   0: unknown error
			//   1: permission denied
			//   2: position unavailable (error response from locaton provider)
			//   3: timed out
		});

}

})(window);
