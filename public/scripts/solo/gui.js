// d3 variables
var d3_view;
var formatCount = d3.format(',.0f');
var margin = {top : 10, right : 10, bottom : 30, left : 10},
	width = 240 - margin.left - margin.right,
	height = 200 - margin.top - margin.bottom;
var x = d3.scale.linear()
	.range([0, width]);
var y = d3.scale.linear()
	.range([height, 0]);
var xAxis = d3.svg.axis()
	.orient('bottom');

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
	$("#as-cube").on('click', function () {
		trans_control.detach(field.currentSB);
		field.setSeedBoundary(field.cubeSB);
		trans_control.attach(field.currentSB);
		$("#as-shape-info").html("&nbsp;&nbsp;&nbsp;Cube");
	});

	$("#as-sphere").on('click', function () {
		trans_control.detach(field.currentSB);
		field.setSeedBoundary(field.sphereSB);
		trans_control.attach(field.currentSB);
		$("#as-shape-info").html("&nbsp;&nbsp;&nbsp;Sphere");
	});

	$("#as-tetrahedron").on('click', function () {
		trans_control.detach(field.currentSB);
		field.setSeedBoundary(field.tetrahedronSB);
		trans_control.attach(field.currentSB);
		$("#as-shape-info").html("&nbsp;&nbsp;&nbsp;Tetrahedron");
	});

	$("#as-cylinder").on('click', function () {
		trans_control.detach(field.currentSB);
		field.setSeedBoundary(field.cylinderSB);
		trans_control.attach(field.currentSB);
		$("#as-shape-info").html("&nbsp;&nbsp;&nbsp;Cylinder");
	});

	$("#as-torus").on('click', function () {
		trans_control.detach(field.currentSB);
		field.setSeedBoundary(field.torusSB);
		trans_control.attach(field.currentSB);
		$("#as-shape-info").html("&nbsp;&nbsp;&nbsp;Torus");
	});

	$("#as-plane").on('click', function () {
		trans_control.detach(field.currentSB);
		field.setSeedBoundary(field.planeSB);
		trans_control.attach(field.currentSB);
		$("#as-shape-info").html("&nbsp;&nbsp;&nbsp;Plane");
	});

	$("#as-circle").on('click', function () {
		trans_control.detach(field.currentSB);
		field.setSeedBoundary(field.circleSB);
		trans_control.attach(field.currentSB);
		$("#as-shape-info").html("&nbsp;&nbsp;&nbsp;Circle");
	});

	$("#as-number").slider({min : 1, max : 100, value : 10}).on("slide", function (event) {
		$("#as-number-info").html("seed number = " + event.value);
	});

	$("#as-generate").on('click', function () {
		$(this).button("loading");
		$("#os-generate").button("loading");
		field.genInGeometry(field.currentSB.geometry ,$("#as-number").data('slider').getValue());
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

	$("#al-nonvortex").on('click', function () {
		if (currentIntersected !== undefined && currentLine.vortex !== false) {
			currentLine.vortex = false;
			$(this).button('toggle');
			$("#al-vortex").button('toggle');
		}
	});

	$("#al-vortex").on('click', function () {
		if (currentIntersected !== undefined && currentLine.vortex !== true) {
			currentLine.vortex = true;
			$(this).button('toggle');
			$("#al-nonvortex").button('toggle');
		}
	});

	$("#al-curvature").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Curvature);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
				update_histogram(0);
			}
		}
	});

	$("#al-lambda2").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Lambda2);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
				update_histogram(1);
			}
		}
	});

	$("#al-q").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Q);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
				update_histogram(2);
			}
		}
	});

	$("#al-delta").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Delta);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
				update_histogram(3);
			}
		}
	});

	$("#al-gamma2").on('click', function () {
		if (currentIntersected !== undefined) {
			if (currentLine.analyzed) {
				currentLine.measureColorMapping(WOF.Gamma2);
				currentLine.setMaterial(WOF.BasicMaterials.lbmVertex);
				update_histogram(4);
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

function update_histogram (dataType) {
	d3.select('svg').remove();

	d3_view = d3.select('#viewer-d3').append('svg')
		.attr('width', 240)
		.attr('height', 200)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		if (dataType === 0) {
			x.domain([Math.min.apply(Math, currentLine.curvature), Math.max.apply(Math, currentLine.curvature)]);

			var data = d3.layout.histogram()
				.bins(x.ticks(8))
				(currentLine.curvature);

			xAxis.scale(x).ticks(8)
				.tickFormat(d3.format(".2f"));
		}
		else if (dataType === 1) {
			x.domain([Math.min.apply(Math, currentLine.lambda2), Math.max.apply(Math, currentLine.lambda2)]);

			var data = d3.layout.histogram()
				.bins(x.ticks(6))
				(currentLine.lambda2);

			xAxis.scale(x).ticks(6)
				.tickFormat(d3.format(".1e"));
		}
		else if (dataType === 2) {
			x.domain([Math.min.apply(Math, currentLine.q), Math.max.apply(Math, currentLine.q)]);

			var data = d3.layout.histogram()
				.bins(x.ticks(6))
				(currentLine.q);

			xAxis.scale(x).ticks(6)
				.tickFormat(d3.format(".1e"));
		}
		else if (dataType === 3) {
			x.domain([Math.min.apply(Math, currentLine.delta), Math.max.apply(Math, currentLine.delta)]);

			var data = d3.layout.histogram()
				.bins(x.ticks(6))
				(currentLine.delta);

			xAxis.scale(x).ticks(6)
				.tickFormat(d3.format(".1e"));
		}
		else if (dataType === 4) {
			x.domain([Math.min.apply(Math, currentLine.gamma2), Math.max.apply(Math, currentLine.gamma2)]);

			var data = d3.layout.histogram()
				.bins(x.ticks(6))
				(currentLine.gamma2);

			xAxis.scale(x).ticks(6)
				.tickFormat(d3.format(".2f"));
		}

		y.domain([0, d3.max(data, function (d) {return d.y;})]);

		var bar = d3_view.selectAll('.bar')
			.data(data)
			.enter().append('g')
			.attr('class', 'bar')
			.attr('transform', function (d) {return 'translate(' + x(d.x) + ',' + y(d.y) + ')';});

		bar.append('rect')
			.attr('x', 1)
			.attr('width', x(data[0].x + data[0].dx) - x(data[0].x) - 1)
			.attr('height', function (d) {return height - y(d.y);});

		bar.append("text")
			.attr("dy", ".75em")
			.attr("y", -9)
			.attr("x", (x(data[0].x + data[0].dx) - x(data[0].x)) / 2)
			.attr("text-anchor", "middle")
			.text(function(d) {return formatCount(d.y);});

		d3_view.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
}
