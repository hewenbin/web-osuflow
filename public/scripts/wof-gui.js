// web osuflow gui initialization
function init_gui() {
	// init tool bar
	$("#tb-os").tooltip();
	$("#tb-as").tooltip();
	$("#tb-lic").tooltip();
	$("#tb-al").tooltip();
	$("#tb-set").tooltip();

	// init one seed tools
	$("#os-generate").on('click', function () {
		socket.emit("genStreamLines", {
			seeds : field.seeds,
			direction : 2,
			maxpoints : 500
		});
	});

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
}
