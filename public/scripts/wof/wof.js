/*
Web-osuflow provides interactive web interface to the osuflow library

Author: Wenbin He
*/

// wof object
var WOF = {};

// color table
WOF.ColorTable = [new THREE.Color(0x0000ff),
	new THREE.Color(0x0066ff),
	new THREE.Color(0x00ccff),
	new THREE.Color(0x00ffcc),
	new THREE.Color(0x00ff66),
	new THREE.Color(0x00ff00),
	new THREE.Color(0x66ff00),
	new THREE.Color(0xccff00),
	new THREE.Color(0xffcc00),
	new THREE.Color(0xff6600),
	new THREE.Color(0xff0000)];

// basic materials
WOF.BasicMaterials = {
	lbm : new THREE.LineBasicMaterial({color : Math.random() * 0xffffff, linewidth : 2}),
	lbmBlack : new THREE.LineBasicMaterial({color : 0x5c6665, linewidth : 1}),
	lbmGreen : new THREE.LineBasicMaterial({color : 0x51a4a2, linewidth : 2}),
	// for picking
	lbmWideRed : new THREE.LineBasicMaterial({color : 0xff0000, linewidth : 3}),
	lbmVertex : new THREE.LineBasicMaterial({color : 0xffffff, linewidth : 3, vertexColors : THREE.VertexColors})
};

// key words
// color methods
WOF.BasicColor = 0;
WOF.GroupColor = 1;
WOF.LabelColor = 2;
WOF.Curl = 3;
WOF.Curvature = 4;
WOF.Torsion = 5;
WOF.Lambda2 = 6;
WOF.Q = 7;
WOF.Delta = 8;
WOF.Gamma2 = 9;
