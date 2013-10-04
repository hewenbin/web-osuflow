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

	// init analysis tools
	var tempLine = [];
	$("#al-analyze").on('click', function () {
		if (currentIntersected !== undefined) {
			if (!currentLine.analyzed) {
				$(this).button("loading");
				tempLine.length = 0;
				for (var i = 0, il = currentLine.geometry.vertices.length; i < il; i++) {
					tempLine.push(currentLine.geometry.vertices[i].x);
					tempLine.push(currentLine.geometry.vertices[i].y);
					tempLine.push(currentLine.geometry.vertices[i].z);
				}
				socket.emit("analyze", {
					group : groupID,
					line : lineID,
					points : tempLine
				});
			}
		}
	});

	$("#al-curvature").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Curvature);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
			}
		}
	});

	$("#al-lambda2").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Lambda2);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
			}
		}
	});

	$("#al-q").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Q);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
			}
		}
	});

	$("#al-delta").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Delta);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
			}
		}
	});

	$("#al-gamma2").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Gamma2);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
			}
		}
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
		var tempMaterial;
		if (webState === 3 && currentIntersected !== undefined) {
			tempMaterial = currentIntersected.material;
		}
		field.setColorMethod(WOF.BasicColor);
		if (webState === 3 && currentIntersected !== undefined) {
			currentIntersected.material = tempMaterial;
		}
	});
	$("#cm-group").on('click', function () {
		var tempMaterial;
		if (webState === 3 && currentIntersected !== undefined) {
			tempMaterial = currentIntersected.material;
		}
		field.setColorMethod(WOF.GroupColor);
		if (webState === 3 && currentIntersected !== undefined) {
			currentIntersected.material = tempMaterial;
		}
	});
	$("#cm-transparent").on('click', function () {
		var tempMaterial;
		if (webState === 3 && currentIntersected !== undefined) {
			tempMaterial = currentIntersected.material;
		}
		field.setColorMethod(WOF.TransparentColor);
		if (webState === 3 && currentIntersected !== undefined) {
			currentIntersected.material = tempMaterial;
		}
	});
	$("#cm-label").on('click', function () {
		var tempMaterial;
		if (webState === 3 && currentIntersected !== undefined) {
			tempMaterial = currentIntersected.material;
		}
		field.setColorMethod(WOF.LabelColor);
		if (webState === 3 && currentIntersected !== undefined) {
			currentIntersected.material = tempMaterial;
		}
	});

	$("#h-clear").on("click", function () {
		field.clearStreamlines();
		if (webState === 3) {
			init_al();
		}
	});
}
