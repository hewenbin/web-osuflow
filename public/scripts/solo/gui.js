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
			$("#tool-os").show();
			$("#tool-as").hide();
			$("#tool-lic").hide();
			$("#tool-al").hide();
			$("#tool-set").hide();
			init_os();
			webState = 0;
		}
	});

	$("#tb-as").on('click', function () {
		if (webState !== 1) {
			$("#tool-os").hide();
			$("#tool-as").show();
			$("#tool-lic").hide();
			$("#tool-al").hide();
			$("#tool-set").hide();
			init_as();
			webState = 1;
		}
	});

	$("#tb-lic").on('click', function () {
		if (webState !== 2) {
			$("#tool-os").hide();
			$("#tool-as").hide();
			$("#tool-lic").show();
			$("#tool-al").hide();
			$("#tool-set").hide();
			init_lic();
			webState = 2;
		}
	});

	$("#tb-al").on('click', function () {
		if (webState !== 3) {
			$("#tool-os").hide();
			$("#tool-as").hide();
			$("#tool-lic").hide();
			$("#tool-al").show();
			$("#tool-set").hide();
			init_al();
			webState = 3;
		}
	});

	$("#tb-set").on('click', function () {
		if (webState !== 4) {
			$("#tool-os").hide();
			$("#tool-as").hide();
			$("#tool-lic").hide();
			$("#tool-al").hide();
			$("#tool-set").show();
			init_set();
			webState = 4;
		}
	});

	// init one seed tools
	$("#os-generate").on('click', function () {
		$(this).button("loading");
		$("#as-generate").button("loading");
		socket.emit("genStreamLines", {
			seeds : field.seeds,
			direction : $("#set-td label.active input").val(),
			maxpoints : $("#set-number").data('slider').getValue(),
			stepsize : [$("#set-min").data('slider').getValue(),
				$("#set-max").data('slider').getValue()]
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
			direction : $("#set-td label.active input").val(),
			maxpoints : $("#set-number").data('slider').getValue(),
			stepsize : [$("#set-min").data('slider').getValue(),
				$("#set-max").data('slider').getValue()]
		});
	});

	// init settings tools
	$("#set-number").slider({min : 10, max : 1000, value : 500}).on("slide", function (event) {
		$("#set-number-info").html("max points number = " + event.value);
	});

	$("#set-min").slider({min : 0.2, max : 2, value : 1}).on("slide", function (event) {
		$("#set-min-info").html("min = " + event.value.toFixed(1) + " ");
	});

	$("#set-max").slider({min : 2, max : 5, value : 4}).on("slide", function (event) {
		$("#set-max-info").html("max = " + event.value.toFixed(1));
	});

	// init all tools
	$("#tool-as").hide();
	$("#tool-lic").hide();
	$("#tool-al").hide();
	$("#tool-set").hide();

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
