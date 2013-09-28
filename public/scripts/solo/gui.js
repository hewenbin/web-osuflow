// web osuflow solo gui initialization
function init_gui() {
	// init tool bar
	$("#tb-os").tooltip();
	$("#tb-as").tooltip();
	$("#tb-lic").tooltip();
	$("#tb-al").tooltip();
	$("#tb-set").tooltip();

	$("#tb-os").on('click', function () {
		if (webState !== 0) {
			if (webState === 1) {
				trans_control.detach(field.cubeSB);
				scene.remove(trans_control.gizmo);
			}

			$("#tool-os").show();
			$("#tool-as").hide();

			webState = 0;
			init_os();
		}
	});

	$("#tb-as").on('click', function () {
		if (webState !== 1) {
			$("#tool-os").hide();
			$("#tool-as").show();

			webState = 1;
			init_as();

			// attach control
			trans_control.attach(field.cubeSB);
			scene.add(trans_control.gizmo);
		}
	});

	// init one seed tools
	$("#os-generate").on('click', function () {
		$(this).button("loading");
		$("#as-generate").button("loading");
		socket.emit("genStreamLines", {
			seeds : field.seeds,
			direction : 2,
			maxpoints : 500
		});
	});

	// init area seed tools
	$("#as-number").slider({min : 1, max : 100, value : 10}).on("slide", function (event) {
		$("#as-number-info").html("seed number = " + event.value);
	});

	$("#as-generate").on('click', function () {
		$(this).button("loading");
		$("#os-generate").button("loading");
		field.genInCube($("#as-number").data('slider').getValue());
		socket.emit("genStreamLines", {
			seeds : field.seeds,
			direction : 2,
			maxpoints : 500
		});
	});

	// arrange all tools
	$("#tool-as").hide();

	// init top toggles
	$("#cm-basic").on('click', function () {
		field.setColorMethod(WOF.BasicColor);
	});
	$("#cm-group").on('click', function () {
		field.setColorMethod(WOF.GroupColor);
	});
	$("#cm-cv").on('click', function () {
		field.setColorMethod(WOF.Curvature);
	});
	$("#cm-l").on('click', function () {
		field.setColorMethod(WOF.Lambda2);
	});
	$("#cm-q").on('click', function () {
		field.setColorMethod(WOF.Q);
	});
	$("#cm-d").on('click', function () {
		field.setColorMethod(WOF.Delta);
	});
	$("#cm-g").on('click', function () {
		field.setColorMethod(WOF.Gamma2);
	});

	$("#h-clear").on("click", function () {
		field.clearStreamlines();
	});
}
