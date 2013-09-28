// boundary is a initiation of the program
socket.on("boundary", function (result) {
	// set boundary of the field
	field.setBoundary(result.min, result.max);

	// set gui base on the boundary
	$("#os-x").slider({min : result.min[0], max : result.max[0]}).on("slide", function (event) {
		$("#os-x-info").html("x = " + event.value.toFixed(2) + " ");
		field.seeds[0] = event.value;
		socket.emit("seedInfo", field.seeds);
	});
	$("#os-y").slider({min : result.min[1], max : result.max[1]}).on("slide", function (event) {
		$("#os-y-info").html("y = " + event.value.toFixed(2) + " ");
		field.seeds[1] = event.value;
		socket.emit("seedInfo", field.seeds);
	});
	$("#os-z").slider({min : result.min[2], max : result.max[2]}).on("slide", function (event) {
		$("#os-z-info").html("z = " + event.value.toFixed(2));
		field.seeds[2] = event.value;
		socket.emit("seedInfo", field.seeds);
	});

	// set camera
	camera.position.z = field.min.distanceTo(field.max) * 1.4;

	// init one seed tool
	init_os();
});

socket.on("seedInfo", function (data) {
	field.setVecs(data.pos, data.vec);

	$("#os-l-info").html("lambda2 = " + data.lqdg[0].toFixed(6));
	$("#os-q-info").html("q = " + data.lqdg[1].toFixed(6));
	$("#os-d-info").html("delta = " + data.lqdg[2].toFixed(6));
	$("#os-g-info").html("gamma2 = " + data.lqdg[3].toFixed(6));
	if (data.lqdg[0] < -0.000001) {
		$("#os-l-label").removeClass("label-success").addClass("label-danger").html("Vortex");
	}
	else {
		$("#os-l-label").removeClass("label-danger").addClass("label-success").html("Normal");
	}
	if (data.lqdg[1] > 0.000001) {
		$("#os-q-label").removeClass("label-success").addClass("label-danger").html("Vortex");
	}
	else {
		$("#os-q-label").removeClass("label-danger").addClass("label-success").html("Normal");
	}
	if (data.lqdg[2] > 0) {
		$("#os-d-label").removeClass("label-success").addClass("label-danger").html("Vortex");
	}
	else {
		$("#os-d-label").removeClass("label-danger").addClass("label-success").html("Normal");
	}
	if (data.lqdg[3] - 1 > 0.000001) {
		$("#os-g-label").removeClass("label-success").addClass("label-danger").html("Vortex");
	}
	else {
		$("#os-g-label").removeClass("label-danger").addClass("label-success").html("Normal");
	}
});

socket.on("streamlines", function (data) {
	field.setStreamlines(data);
	$("#os-generate").button("reset");
	$("#as-generate").button("reset");
});
