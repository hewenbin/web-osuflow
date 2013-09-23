// three variables
var container;
var camera, scene, renderer;
var editor_control;

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

	// init scene
	scene = new THREE.Scene();
}

// web osuflow initialization
function init() {
	init_gui();
	init_three();

	// add event listener
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
	render();
}

function render() {
	renderer.render(scene, camera);
}

// entry of web osuflow
$(document).ready(function () {
	init();
	resize();
	update();
});
