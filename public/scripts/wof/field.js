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
	// seed boundary
	this.mbmRed = new THREE.MeshBasicMaterial({color: 0xe77175, opacity: 0.6});
	this.mbmRed.transparent = true;
	this.mbmRed.blending = THREE["NormalBlending"];
	this.geoCubeSB = new THREE.CubeGeometry(1, 1, 1);
	this.cubeSB = new THREE.Mesh(this.geoCubeSB, this.mbmRed);
	// vec
	this.geoVecs = [];
	this.vecs = [];
	// lic
	this.geoLic = new THREE.PlaneGeometry(1, 1);
	this.texLic = {
		xy : [],
		yz : [],
		zx : []
	};
	this.mbmTex = new THREE.MeshBasicMaterial({side : THREE.DoubleSide});
	this.lic = new THREE.Mesh(this.geoLic, this.mbmTex);

	// streamline groups
	this.colorMethod = WOF.BasicColor;
	this.groups = [];
	this.groupRoot = new THREE.Object3D();
	this.root.add(this.groupRoot);
};

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
};

WOF.Field.prototype.setVecs = function (pos, vecs) {
	this.clearVecs();
	for (var i = 0, il = vecs.length / 3; i < il; i++) {
		this.geoVecs.push(new THREE.Vector3(vecs[i * 3], vecs[i * 3 + 1], vecs[i * 3 + 2]));
		var length = this.geoVecs[i].length() * 30;
		this.vecs.push(new THREE.ArrowHelper(this.geoVecs[i].normalize(), new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]), length, 0xe77175));
		this.root.add(this.vecs[i]);
	}
};

WOF.Field.prototype.clearSeedBoundary = function () {
	this.root.remove(this.cubeSB);
};

WOF.Field.prototype.setSeedBoundary = function () {
	this.cubeSB.position.set(this.bias.x, this.bias.y, this.bias.z);
	this.cubeSB.rotation.set(0, 0, 0);
	this.cubeSB.scale.set(8, 8, 8);
	this.root.add(this.cubeSB);
};

WOF.Field.prototype.clearLic = function () {
	this.root.remove(this.lic);
}

WOF.Field.prototype.setLic = function (face, pos) {
	if (face === 1) {
		if (this.texLic.xy[pos] === undefined) {
			this.texLic.xy[pos] = THREE.ImageUtils.loadTexture('textures/tornado/tornado_xy_' + pos + '.jpg');
		}
		this.mbmTex.map = this.texLic.xy[pos];

		this.lic.rotation.set(0, 0, 0);
		this.lic.position.set(this.bias.x, this.bias.y, pos);
	}
	if (face === 2) {
		if (this.texLic.yz[pos] === undefined) {
			this.texLic.yz[pos] = THREE.ImageUtils.loadTexture('textures/tornado/tornado_yz_' + pos + '.jpg');
		}
		this.mbmTex.map = this.texLic.yz[pos];

		this.lic.rotation.set(0, Math.PI / 2, 0);
		this.lic.position.set(pos, this.bias.y, this.bias.z);
	}
	if (face === 3) {
		if (this.texLic.zx[pos] === undefined) {
			this.texLic.zx[pos] = THREE.ImageUtils.loadTexture('textures/tornado/tornado_zx_' + pos + '.jpg');
		}
		this.mbmTex.map = this.texLic.zx[pos];

		this.lic.rotation.set(-Math.PI / 2, 0, 0);
		this.lic.position.set(this.bias.x, pos, this.bias.z);
	}
	this.lic.scale.set(this.bias.x * 2, this.bias.y * 2, this.bias.z * 2);
	this.root.add(this.lic);
};

WOF.Field.prototype.clearStreamlines = function () {
	for (var i = 0, il = this.groups.length; i < il; i++) {
		this.groupRoot.remove(this.groups[i].object);
	}
	this.groups.length = 0;
};

WOF.Field.prototype.setStreamlines = function (data) {
	var gn = this.groups.length;
	this.groups.push(new WOF.StreamlineGroup());
	this.groups[gn].setGeometries(data.streamlines);
	this.groups[gn].setColorMethod(this.colorMethod);
	this.groupRoot.add(this.groups[gn].object);
};

WOF.Field.prototype.setColorMethod = function (colorMethod) {
	this.colorMethod = colorMethod;
	for (var i = 0, il = this.groups.length; i < il; i++) {
		this.groups[i].setColorMethod(colorMethod);
	}
};

// utility functions
WOF.Field.prototype.genInCube = function (n) {
	this.seeds.length = 0;
	var tmp = WOF.Field.v1;
	for (var i = 0; i < n; i++) {
		tmp.set((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5));
		tmp.applyMatrix4(this.cubeSB.matrix);
		this.seeds.push(tmp.x); this.seeds.push(tmp.y); this.seeds.push(tmp.z);
	}
};

WOF.Field.prototype.groupOfLine = function (object) {
	var group = object.parent;
	for (var i = 0, il = this.groups.length; i < il; i++) {
		if (group === this.groups[i].object) break;
	}
	return i;
};

WOF.Field.prototype.indexOfLine = function (object, groupID) {
	var group = this.groups[groupID];
	for (var i = 0, il = group.streamlines.length; i < il; i++) {
		if (object === group.streamlines[i].object) break;
	}
	return i;
};

WOF.Field.v1 = new THREE.Vector3();
