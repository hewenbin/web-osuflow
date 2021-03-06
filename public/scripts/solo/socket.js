// boundary is a initiation of the program
socket.on("boundary", function (data) {
	// set boundary of the field
	field.setBoundary(data.min, data.max);

	// set gui base on the boundary
	$("#os-x").slider({min : data.min[0], max : data.max[0]}).on("slide", function (event) {
		$("#os-x-info").html("x = " + event.value.toFixed(2) + " ");
		field.seeds[0] = event.value;
		socket.emit("seedInfo", field.seeds);
	});
	$("#os-y").slider({min : data.min[1], max : data.max[1]}).on("slide", function (event) {
		$("#os-y-info").html("y = " + event.value.toFixed(2) + " ");
		field.seeds[1] = event.value;
		socket.emit("seedInfo", field.seeds);
	});
	$("#os-z").slider({min : data.min[2], max : data.max[2]}).on("slide", function (event) {
		$("#os-z-info").html("z = " + event.value.toFixed(2));
		field.seeds[2] = event.value;
		socket.emit("seedInfo", field.seeds);
	});

	$("#lic-xy").slider({min : data.min[2], max : data.max[2]}).on("slide", function (event) {
		$("#lic-xy-info").html("position = " + event.value);
		field.setLic(1, event.value);
	});
	$("#lic-yz").slider({min : data.min[0], max : data.max[0]}).on("slide", function (event) {
		$("#lic-yz-info").html("position = " + event.value);
		field.setLic(2, event.value);
	});
	$("#lic-zx").slider({min : data.min[1], max : data.max[1]}).on("slide", function (event) {
		$("#lic-zx-info").html("position = " + event.value);
		field.setLic(3, event.value);
	});

	// set camera
	camera.position.z = field.min.distanceTo(field.max) * 1.4;
	raycaster.linePrecision = camera.position.z * 0.003;

	// init one seed tool
	init_os();

	// init all tools
	$("#tool-as").hide();
	$("#tool-lic").hide();
	$("#tool-al").hide();
	$("#tool-set").hide();

	// remove overlay
	$("#overlay").fadeOut(200);
});

socket.on("seedInfo", function (data) {
	field.setVecs(data.pos, data.vec);

	$("#os-l-info").html("lambda2 = " + data.lqdg[0].toExponential(3));
	$("#os-q-info").html("q = " + data.lqdg[1].toExponential(3));
	$("#os-d-info").html("delta = " + data.lqdg[2].toExponential(3));
	$("#os-g-info").html("gamma2 = " + data.lqdg[3].toExponential(3));
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

socket.on("measurements", function (data) {
	var line = field.groups[data.group].streamlines[data.line];
	line.setGeoMeasurements(data.curvature, data.curvature, data.curvature);
	line.setVorMeasurements(data.lambda2, data.q, data.delta, data.gamma2);
	line.analyzed = true;
	$("#al-analyze").button("reset");

	if (line === currentLine) {
		$("#al-analyzed-info").html("analyzed = true");
		$("#al-curvature-info").html("curvature = " + Math.min.apply(Math, currentLine.curvature).toExponential(3) +
			" ~ " + Math.max.apply(Math, currentLine.curvature).toExponential(3));
		$("#al-lambda2-info").html("lambda2 = " + Math.min.apply(Math, currentLine.lambda2).toExponential(3) +
			" ~ " + Math.max.apply(Math, currentLine.lambda2).toExponential(3));
		$("#al-q-info").html("q = " + Math.min.apply(Math, currentLine.q).toExponential(3) +
			" ~ " + Math.max.apply(Math, currentLine.q).toExponential(3));
		$("#al-delta-info").html("delta = " + Math.min.apply(Math, currentLine.delta).toExponential(3) +
			" ~ " + Math.max.apply(Math, currentLine.delta).toExponential(3));
		$("#al-gamma2-info").html("gamma2 = " + Math.min.apply(Math, currentLine.gamma2).toExponential(3) +
			" ~ " + Math.max.apply(Math, currentLine.gamma2).toExponential(3));
	}
});
