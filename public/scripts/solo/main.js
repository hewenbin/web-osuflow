// web state
var webState = 0;
var filename = "tornado.vec";

// three variables
var container;
var camera, scene, renderer;
var editor_control, trans_control;
var projector, raycaster, currentIntersected,
	groupID, lineID, currentLine;
var mouse = new THREE.Vector2();

// socket.io object
var socket = io.connect();

// field object
var field = new WOF.Field();

// three initialization
function init_three() {
	// init container
	container = document.getElementById("viewer");

	// init renderer
	renderer = new THREE.WebGLRenderer({antialias : true, alpha : true});
	renderer.setClearColor(new THREE.Color(0x000000), 0);
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	container.appendChild(renderer.domElement);

	// init camera
	camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);

	// init controls
	editor_control = new THREE.EditorControls(camera, renderer.domElement);
	trans_control = new THREE.TransformControls(camera, renderer.domElement);
	trans_control.addEventListener('change', render);
	trans_control.scale = 0.8;

	// init picking tools
	projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();
	raycaster.linePrecision = 0.5;

	// init scene
	scene = new THREE.Scene();
	scene.add(field.root);
}

// web osuflow solo initialization
function init() {
	init_gui();
	init_three();

	socket.emit("loadData", filename);

	// add event listener
	renderer.domElement.addEventListener('mousedown', onMouseDown, false);
	window.addEventListener("resize", resize, false);
}

function resize() {
	var width = window.innerWidth - 350, height = window.innerHeight;
	container.style.width = width + "px";
	container.style.height = height + "px";

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
}

function update() {
	requestAnimationFrame(update);
	trans_control.update();
	render();
}

function render() {
	renderer.render(scene, camera);
}

// entry of web osuflow solo
$(document).ready(function () {
	init();
	resize();
	update();
});

// event listeners
function onMouseDown(event) {
	event.preventDefault();

	if (trans_control.hovered === false) {
		editor_control.enabled = true;
	}
	else {
		editor_control.enabled = false;
	}
}

function onMouseDownPicking(event) {
	mouse.x = (event.layerX / container.offsetWidth) * 2 - 1;
	mouse.y = -(event.layerY / container.offsetHeight) * 2 + 1;
}

function onMouseUpPicking(event) {
	if (mouse.x === (event.layerX / container.offsetWidth) * 2 - 1
		&& mouse.y === -(event.layerY / container.offsetHeight) * 2 + 1) {
		var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
		projector.unprojectVector(vector, camera);
		raycaster.set(camera.position, vector.sub(camera.position).normalize());

		var intersects = raycaster.intersectObjects(field.groupRoot.children, true);

		if (intersects.length > 0) {
			currentIntersected = intersects[0].object;
			field.setColorMethod(field.colorMethod);
			groupID = field.groupOfLine(currentIntersected);
			lineID = field.indexOfLine(currentIntersected, groupID);
			currentLine = field.groups[groupID].streamlines[lineID];
			currentIntersected.material = WOF.BasicMaterials.lbmWideRed;
			// update picked line info
			$("#al-group-info").html("group = " + groupID + " ");
			$("#al-line-info").html("line = " + lineID);
			$("#al-samples-info").html("sample points = " + currentIntersected.geometry.vertices.length);
			$("#al-analyzed-info").html("analyzed = " + currentLine.analyzed);
			// update label
			if (currentLine.vortex) {
				$("#al-nonvortex").removeClass("active");
				$("#al-vortex").addClass("active");
			}
			else {
				$("#al-nonvortex").addClass("active");
				$("#al-vortex").removeClass("active");
			}
			// update measurements
			if (currentLine.analyzed) {
				$("#al-curvature-info").html("curvature = " + Math.min.apply(Math, currentLine.curvature).toFixed(6) +
					" ~ " + Math.max.apply(Math, currentLine.curvature).toFixed(6));
				$("#al-lambda2-info").html("lambda2 = " + Math.min.apply(Math, currentLine.lambda2).toFixed(6) +
					" ~ " + Math.max.apply(Math, currentLine.lambda2).toFixed(6));
				$("#al-q-info").html("q = " + Math.min.apply(Math, currentLine.q).toFixed(6) +
					" ~ " + Math.max.apply(Math, currentLine.q).toFixed(6));
				$("#al-delta-info").html("delta = " + Math.min.apply(Math, currentLine.delta).toFixed(6) +
					" ~ " + Math.max.apply(Math, currentLine.delta).toFixed(6));
				$("#al-gamma2-info").html("gamma2 = " + Math.min.apply(Math, currentLine.gamma2).toFixed(6) +
					" ~ " + Math.max.apply(Math, currentLine.gamma2).toFixed(6));
			}
			else {
				$("#al-curvature-info").html("curvature = null");
				$("#al-lambda2-info").html("lambda2 = null");
				$("#al-q-info").html("q = null");
				$("#al-delta-info").html("delta = null");
				$("#al-gamma2-info").html("gamma2 = null");
			}
		}
	}
}

// tools initialization
// one seed tool
function init_os() {
	// clear remaining data
	if (webState === 1) {
		trans_control.detach(field.currentSB);
		scene.remove(trans_control.gizmo);
		field.clearSeedBoundary();
	}
	else if (webState === 2) {
		field.clearLic();
	}
	else if (webState === 3) {
		field.setColorMethod(field.colorMethod);
		renderer.domElement.removeEventListener('mousedown', onMouseDownPicking, false);
		renderer.domElement.removeEventListener('mouseup', onMouseUpPicking, false);

		// clear svg
		d3.select('svg').remove();
	}

	// init seed position
	field.seeds.length = 0;
	field.seeds[0] = field.bias.x;
	field.seeds[1] = field.bias.y;
	field.seeds[2] = field.bias.z;

	// set seed position gui
	$("#os-x").slider("setValue", field.seeds[0]);
	$("#os-y").slider("setValue", field.seeds[1]);
	$("#os-z").slider("setValue", field.seeds[2]);

	// set seed position info
	$("#os-x-info").html("x = " + field.seeds[0].toFixed(2) + " ");
	$("#os-y-info").html("y = " + field.seeds[1].toFixed(2) + " ");
	$("#os-z-info").html("z = " + field.seeds[2].toFixed(2) + " ");

	// get seed info
	socket.emit("seedInfo", field.seeds);
}

// area seed tool
function init_as() {
	// clear remaining data
	if (webState === 0) {
		field.clearVecs();
	}
	else if (webState === 2) {
		field.clearLic();
	}
	else if (webState === 3) {
		field.setColorMethod(field.colorMethod);
		renderer.domElement.removeEventListener('mousedown', onMouseDownPicking, false);
		renderer.domElement.removeEventListener('mouseup', onMouseUpPicking, false);

		// clear svg
		d3.select('svg').remove();
	}

	// set seed boundary
	field.setSeedBoundary(field.cubeSB);
	$("#as-shape-info").html("&nbsp;&nbsp;&nbsp;Cube");

	// attach control
	trans_control.attach(field.currentSB);
	scene.add(trans_control.gizmo);
}

// lic tool
function init_lic() {
	// clear remaining data
	if (webState === 0) {
		field.clearVecs();
	}
	else if (webState === 1) {
		trans_control.detach(field.currentSB);
		scene.remove(trans_control.gizmo);
		field.clearSeedBoundary();
	}
	else if (webState === 3) {
		field.setColorMethod(field.colorMethod);
		renderer.domElement.removeEventListener('mousedown', onMouseDownPicking, false);
		renderer.domElement.removeEventListener('mouseup', onMouseUpPicking, false);

		// clear svg
		d3.select('svg').remove();
	}

	// set lic position gui
	$("#lic-xy").slider("setValue", 0);
	$("#lic-yz").slider("setValue", 0);
	$("#lic-zx").slider("setValue", 0);

	$("#lic-xy-info").html("position = " + 0);
	$("#lic-yz-info").html("position = " + 0);
	$("#lic-zx-info").html("position = " + 0);

	// set lic
	field.setLic(1, 0);
}

// analysis tool
function init_al() {
	// clear remaining data
	if (webState === 0) {
		field.clearVecs();
	}
	else if (webState === 1) {
		trans_control.detach(field.currentSB);
		scene.remove(trans_control.gizmo);
		field.clearSeedBoundary();
	}
	else if (webState === 2) {
		field.clearLic();
	}

	// add picking event listeners
	renderer.domElement.addEventListener('mousedown', onMouseDownPicking, false);
	renderer.domElement.addEventListener('mouseup', onMouseUpPicking, false);

	// init picked line info
	currentIntersected = undefined;
	groupID = undefined; lineID = undefined;
	currentLine = undefined;
	$("#al-group-info").html("group = null ");
	$("#al-line-info").html("line = null");
	$("#al-samples-info").html("sample points = null");
	$("#al-analyzed-info").html("analyzed = false");
	$("#al-curvature-info").html("curvature = null");
	$("#al-lambda2-info").html("lambda2 = null");
	$("#al-q-info").html("q = null");
	$("#al-delta-info").html("delta = null");
	$("#al-gamma2-info").html("gamma2 = null");
	$("#al-nonvortex").removeClass("active");
	$("#al-vortex").removeClass("active");
}

// settings tool
function init_set() {
	// clear remaining data
	if (webState === 0) {
		field.clearVecs();
	}
	else if (webState === 1) {
		trans_control.detach(field.currentSB);
		scene.remove(trans_control.gizmo);
		field.clearSeedBoundary();
	}
	else if (webState === 2) {
		field.clearLic();
	}
	else if (webState === 3) {
		field.setColorMethod(field.colorMethod);
		renderer.domElement.removeEventListener('mousedown', onMouseDownPicking, false);
		renderer.domElement.removeEventListener('mouseup', onMouseUpPicking, false);

		// clear svg
		d3.select('svg').remove();
	}
}
