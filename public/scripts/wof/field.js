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
	this.size = new THREE.Vector3();
	this.bias = new THREE.Vector3();
	this.geoBoundary = new THREE.Geometry();
	this.boundary = undefined;

	// seeds
	this.seeds = [];
	// seed boundary
	this.mbmRed = new THREE.MeshBasicMaterial({color: 0xe77175, opacity: 0.6});
	this.mbmRed.transparent = true;
	this.mbmRed.blending = THREE["NormalBlending"];
	this.mbmRedDS = new THREE.MeshBasicMaterial({color: 0xe77175, opacity: 0.6, side : THREE.DoubleSide});
	this.mbmRedDS.transparent = true;
	this.mbmRedDS.blending = THREE["NormalBlending"];
	this.geoCubeSB = new THREE.CubeGeometry(1, 1, 1);
	this.cubeSB = new THREE.Mesh(this.geoCubeSB, this.mbmRed);
	this.geoSphereSB = new THREE.SphereGeometry(1, 20, 20);
	this.sphereSB = new THREE.Mesh(this.geoSphereSB, this.mbmRed);
	this.geoTetrahedronSB = new THREE.TetrahedronGeometry(1, 0);
	this.tetrahedronSB = new THREE.Mesh(this.geoTetrahedronSB, this.mbmRed);
	this.geoCylinderSB = new THREE.CylinderGeometry(0.5, 0.5, 1, 20, 1);
	this.cylinderSB = new THREE.Mesh(this.geoCylinderSB, this.mbmRed);
	this.geoTorusSB = new THREE.TorusGeometry(1, 0.1, 50, 20);
	this.torusSB = new THREE.Mesh(this.geoTorusSB, this.mbmRed);
	this.geoPlaneSB = new THREE.PlaneGeometry(1, 1, 1, 1);
	this.planeSB = new THREE.Mesh(this.geoPlaneSB, this.mbmRedDS);
	this.geoCircleSB = new THREE.CircleGeometry(0.5, 32, 0, Math.PI * 2);
	this.circleSB = new THREE.Mesh(this.geoCircleSB, this.mbmRedDS);
	this.currentSB = this.cubeSB;
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
	this.size.subVectors(this.max, this.min);
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
	var length = Math.min(this.size.x, this.size.y, this.size.z) / 3;
	for (var i = 0, il = vecs.length / 3; i < il; i++) {
		this.geoVecs.push(new THREE.Vector3(vecs[i * 3], vecs[i * 3 + 1], vecs[i * 3 + 2]));
		if (this.geoVecs[i].length() > 0.000005) {
			this.vecs.push(new THREE.ArrowHelper(this.geoVecs[i].normalize(), new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]), length, 0xe77175));
			this.root.add(this.vecs[i]);
		}
	}
};

WOF.Field.prototype.clearSeedBoundary = function () {
	this.root.remove(this.currentSB);
};

WOF.Field.prototype.setSeedBoundary = function (currentSB) {
	this.clearSeedBoundary();
	this.currentSB = currentSB;

	this.currentSB.position.set(this.bias.x, this.bias.y, this.bias.z);
	this.currentSB.rotation.set(0, 0, 0);
	var scale = Math.min(this.size.x, this.size.y, this.size.z) / 3;
	this.currentSB.scale.set(scale, scale, scale);
	this.root.add(this.currentSB);
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
WOF.Field.prototype.genInGeometry = function (geometry, n) {
	this.seeds.length = 0;
	var tmp = THREE.GeometryUtils.randomPointsInGeometry(geometry, n);
	for (var i = 0; i < n; i++) {
		tmp[i].applyMatrix4(this.currentSB.matrix);
		this.seeds.push(tmp[i].x); this.seeds.push(tmp[i].y); this.seeds.push(tmp[i].z);
	}
	tmp.length = 0;
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
