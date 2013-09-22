// web osuflow gui initialization
function init_gui() {
	// init tool tips
	$("#tb-os").tooltip();
	$("#tb-as").tooltip();
	$("#tb-lic").tooltip();
	$("#tb-al").tooltip();
	$("#tb-set").tooltip();
	// init slider
	$("#os-x").slider().on("slide", function (event) {
		$("#os-x-info").html("x = " + event.value.toFixed(2) + " ");
	});
	$("#os-y").slider().on("slide", function (event) {
		$("#os-y-info").html("y = " + event.value.toFixed(2) + " ");
	});
	$("#os-z").slider().on("slide", function (event) {
		$("#os-z-info").html("z = " + event.value.toFixed(2));
	});
}
