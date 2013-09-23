/*
Field class, flow field manager for web-osuflow

Author: Wenbin He
*/

WOF.Field = function () {
	// root object
	this.root = new THREE.Object3D();

	// boundary
	this.min = new THREE.Vector3();
	this.max = new THREE.Vector3();
	this.bias = new THREE.Vector3();
	this.geoBoundary = new THREE.Geometry();
	this.boundary = undefined;

	// seeds
	this.seeds = [];
	// vec
	this.geoVecs = [];
	this.vecs = [];
}

WOF.Field.prototype.constructor = WOF.Field;

WOF.Field.prototype.setBoundary = function (min, max) {
	// set min, max and bias
	this.min.set(min[0], min[1], min[2]);
	this.max.set(max[0], max[1], max[2]);
	this.bias.addVectors(this.min, this.max);
	this.bias.divideScalar(2);

	// set boundary object
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], min[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], min[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], min[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], min[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], min[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], min[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], min[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], min[1], min[2]));

	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], max[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], max[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], max[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], max[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], max[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], max[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], max[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], max[1], min[2]));

	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], min[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], max[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], min[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], max[1], min[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], min[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(min[0], max[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], min[1], max[2]));
	this.geoBoundary.vertices.push(new THREE.Vector3(max[0], max[1], max[2]));

	this.boundary = new THREE.Line(this.geoBoundary, WOF.BasicMaterials.lbmBlack, THREE.LinePieces);
	this.root.add(this.boundary);
	this.root.position.set(-this.bias.x, -this.bias.y, -this.bias.z);
};

WOF.Field.prototype.clearVecs = function () {
	for (var i = 0, il = this.vecs.length; i < il; i++) {
		this.root.remove(this.vecs[i]);
	}
	this.vecs.length = 0; this.geoVecs.length = 0;
}

WOF.Field.prototype.setVecs = function (pos, vecs) {
	this.clearVecs();
	for (var i = 0, il = vecs.length / 3; i < il; i++) {
		this.geoVecs.push(new THREE.Vector3(vecs[i * 3], vecs[i * 3 + 1], vecs[i * 3 + 2]));
		var length = this.geoVecs[i].length() * 30;
		this.vecs.push(new THREE.ArrowHelper(this.geoVecs[i].normalize(), new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]), length, 0xe77175));
		this.root.add(this.vecs[i]);
	}
};
