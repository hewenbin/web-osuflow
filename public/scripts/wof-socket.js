// boundary is a initiation of the program
socket.on("boundary", function (result) {
	// set boundary of the field
	field.setBoundary(result.min, result.max);

	// set gui base on the boundary
	$("#os-x").slider({min : result.min[0], max : result.max[0]}).on("slide", function (event) {
		$("#os-x-info").html("x = " + event.value.toFixed(2) + " ");
	});
	$("#os-y").slider({min : result.min[1], max : result.max[1]}).on("slide", function (event) {
		$("#os-y-info").html("y = " + event.value.toFixed(2) + " ");
	});
	$("#os-z").slider({min : result.min[2], max : result.max[2]}).on("slide", function (event) {
		$("#os-z-info").html("z = " + event.value.toFixed(2));
	});

	// set camera
	camera.position.z = field.min.distanceTo(field.max) * 1.4;
});
