// web state
var webState = 0;
var filename = "tornado.vec";

// three variables
var container;
var camera, scene, renderer;
var editor_control, trans_control;

// socket.io object
var socket = io.connect();

// field object
var field = new WOF.Field();

// three initialization
function init_three() {
	// init container
	container = document.getElementById("viewer");

	// init renderer
	renderer = new THREE.WebGLRenderer({antialias : true});
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

// event listeners
function onMouseDown (event) {
	event.preventDefault();

	if (trans_control.hovered === false) {
		editor_control.enabled = true;
	}
	else {
		editor_control.enabled = false;
	}
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

// tools initialization
// one seed tool
function init_os() {
	// clear remaining data
	if (webState === 1) {
		trans_control.detach(field.cubeSB);
		scene.remove(trans_control.gizmo);
		field.clearSeedBoundary();
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
	$("#os-x-info").html("x = " + field.seeds[0] + " ");
	$("#os-y-info").html("y = " + field.seeds[1] + " ");
	$("#os-z-info").html("z = " + field.seeds[2] + " ");

	// get seed info
	socket.emit("seedInfo", field.seeds);
}

// area seed tool
function init_as() {
	// clear remaining data
	if (webState === 0) {
		field.clearVecs();
	}

	// set seed boundary
	field.setSeedBoundary();

	// attach control
	trans_control.attach(field.cubeSB);
	scene.add(trans_control.gizmo);
}

// lic tool
function init_lic() {
	// clear remaining data
	if (webState === 0) {
		field.clearVecs();
	}
	else if (webState === 1) {
		trans_control.detach(field.cubeSB);
		scene.remove(trans_control.gizmo);
		field.clearSeedBoundary();
	}
}

// analysis tool
function init_al() {
	// clear remaining data
	if (webState === 0) {
		field.clearVecs();
	}
	else if (webState === 1) {
		trans_control.detach(field.cubeSB);
		scene.remove(trans_control.gizmo);
		field.clearSeedBoundary();
	}
}

// settings tool
function init_set() {
	// clear remaining data
	if (webState === 0) {
		field.clearVecs();
	}
	else if (webState === 1) {
		trans_control.detach(field.cubeSB);
		scene.remove(trans_control.gizmo);
		field.clearSeedBoundary();
	}
}
