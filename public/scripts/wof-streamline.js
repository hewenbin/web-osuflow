/*
Streamline class, streamline manager for web-osuflow

Author: Wenbin He
*/

WOF.Streamline = function (geometry) {
	// geometry
	this.geometry = new THREE.Geometry();
	this.setGeometry(geometry);
	// object
	this.object = new THREE.Line(this.geometry, WOF.BasicMaterials.lbmGreen);
	// geometric measurements
	this.curl = [];
	this.curvature = [];
	this.torsion = [];
	// vortex detection measurements
	this.lambda2 = [];
	this.q = [];
	this.delta = [];
	this.gamma2 = [];
	// distribution
	this.CurvDistribution = [];
	// labels
	this.vortex = false;
}

WOF.Streamline.prototype.constructor = WOF.Streamline;

WOF.Streamline.prototype.setGeometry = function (geometry) {
	this.geometry.vertices.length = 0;
	for (var i = 0, il = geometry.length / 3; i < il; i++) {
		this.geometry.vertices.push(new THREE.Vector3(geometry[i * 3], geometry[i * 3 + 1], geometry[i * 3 + 2]));
	}
}

WOF.Streamline.prototype.setMaterial = function (material) {
	this.object.material = material;
}

WOF.Streamline.prototype.setGeoMeasurements = function (curl, curvature, torsion) {
	this.curl = curl;
	this.curvature = curvature;
	this.torsion = torsion;
}

WOF.Streamline.prototype.setVorMeasurements = function (lambda2, q, delta, gamma2) {
	this.lambda2 = lambda2;
	this.q = q;
	this.delta = delta;
	this.gamma2 = gamma2;
}

WOF.Streamline.prototype.measureColorMapping = function (measurement) {
	if (measurement === WOF.Curvature) {
		for (var i = 0, il = this.curvature.length; i < il; i++) {
			var id = Math.floor(this.curvature[i] * 10);
			if (id < 10) {
				this.geometry.colors[i] = WOF.ColorTable[id];
			}
			else {
				this.geometry.colors[i] = WOF.ColorTable[10];
			}
		}
	}
	else if (measurement === WOF.Lambda2) {
		for (var i = 0, il = this.lambda2.length; i < il; i++) {
			if (this.lambda2[i] < -0.000001) {
				this.geometry.colors[i] = WOF.ColorTable[10];
			}
			else {
				this.geometry.colors[i] = WOF.ColorTable[1];
			}
		}
	}
	else if (measurement === WOF.Q) {
		for (var i = 0, il = this.q.length; i < il; i++) {
			if (this.q[i] > 0.000001) {
				this.geometry.colors[i] = WOF.ColorTable[10];
			}
			else {
				this.geometry.colors[i] = WOF.ColorTable[1];
			}
		}
	}
	else if (measurement === WOF.Delta) {
		for (var i = 0, il = this.delta.length; i < il; i++) {
			if (this.delta[i] > 0) {
				this.geometry.colors[i] = WOF.ColorTable[10];
			}
			else {
				this.geometry.colors[i] = WOF.ColorTable[1];
			}
		}
	}
	else if (measurement === WOF.Gamma2) {
		for (var i = 0, il = this.gamma2.length; i < il; i++) {
			if (this.gamma2[i] - 1 > 0.000001) {
				this.geometry.colors[i] = WOF.ColorTable[10];
			}
			else {
				this.geometry.colors[i] = WOF.ColorTable[1];
			}
		}
	}
	this.geometry.colorsNeedUpdate = true;
}

WOF.Streamline.prototype.distribute = function () {
	var temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (var i = 0, il = this.curvature.length; i < il; i++) {
		var id = Math.floor(this.curvature[i] * 10);
		if (id < 10) {
			temp[id]++;
		}
		else {
			temp[10]++;
		}
	}
	for (var j = 0; j < 11; j++) {
		this.CurvDistribution[j] = temp[j] / this.curvature.length;
	}
}
