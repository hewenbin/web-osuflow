// web state
var browser_checking = true;

// web osuflow index initialization
function init() {
	if (Detector.canvas) {
		$("#canvas-label").removeClass("label-warning").addClass("label-success").html("Passed");
	}
	else {
		$("#canvas-label").removeClass("label-warning").addClass("label-danger").html("Failed");
		browser_checking = false;
	}

	if (Detector.webgl) {
		$("#webgl-label").removeClass("label-warning").addClass("label-success").html("Passed");
	}
	else {
		$("#webgl-label").removeClass("label-warning").addClass("label-danger").html("Failed");
		browser_checking = false;
	}

	if (io !== undefined) {
		$("#socket-label").removeClass("label-warning").addClass("label-success").html("Passed");
	}
	else {
		$("#socket-label").removeClass("label-warning").addClass("label-danger").html("Failed");
		browser_checking = false;
	}

	if (Detector.workers) {
		$("#worker-label").removeClass("label-warning").addClass("label-success").html("Passed");
	}
	else {
		$("#worker-label").removeClass("label-warning").addClass("label-danger").html("Failed");
		browser_checking = false;
	}

	if (browser_checking) {
		$("#model-solo").removeClass("disabled");
	}
}

// entry of web osuflow index
$(document).ready(function () {
	init();
});
