/*
Streamline Group class, streamline manager for web-osuflow

Author: Wenbin He
*/

WOF.StreamlineGroup = function () {
	// streamlines
	this.streamlines = [];
	// object
	this.object = new THREE.Object3D();
	// material
	this.material = new THREE.LineBasicMaterial({color : Math.random() * 0xffffff, linewidth : 2});
	// distributions
	this.curlDistr = []; this.curvatureDistr = []; this.torsionDistr = [];
	this.lambda2Distr = []; this.qDistr = []; this.deltaDistr = []; this.gamma2Distr = [];
}

WOF.StreamlineGroup.prototype.constructor = WOF.StreamlineGroup;

WOF.StreamlineGroup.prototype.setGeometries = function (geometries) {
	this.streamlines.length = 0;
	for (var i = 0, il = geometries.length; i < il; i++) {
		this.streamlines.push(new WOF.Streamline(geometries[i]));
		this.object.add(this.streamlines[i].object);
	}
}

WOF.StreamlineGroup.prototype.setGeoMeasurements = function (curls, curvatures, torsions) {
	for (var i = 0, il = curls.length; i < il; i++) {
		this.streamlines[i].setGeoMeasurements(curls[i], curvatures[i], torsions[i]);
	}
}

WOF.StreamlineGroup.prototype.setVorMeasurements = function (lambda2s, qs, deltas, gamma2s) {
	for (var i = 0, il = lambda2s.length; i < il; i++) {
		this.streamlines[i].setVorMeasurements(lambda2s[i], qs[i], deltas[i], gamma2s[i]);
	}
}

WOF.StreamlineGroup.prototype.setColorMethod = function (colorMethod) {
	if (colorMethod === WOF.BasicColor) {
		for (var i = 0, il = this.streamlines.length; i < il; i++) {
			this.streamlines[i].setMaterial(WOF.BasicMaterials.lbmGreen);
		}
	}
	else if (colorMethod === WOF.GroupColor) {
		for (var i = 0, il = this.streamlines.length; i < il; i++) {
			this.streamlines[i].setMaterial(this.material);
		}
	}
	else {
		for (var i = 0, il = this.streamlines.length; i < il; i++) {
			this.streamlines[i].measureColorMapping(colorMethod);
			this.streamlines[i].setMaterial(WOF.BasicMaterials.lbmVertex);
		}
	}
}

// WOF.StreamlineGroup.prototype.distribute = function () {

// }
