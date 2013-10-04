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
	lbmLightGreen : new THREE.LineBasicMaterial({color : 0x6ec2a3, linewidth : 2}),
	lbmRed : new THREE.LineBasicMaterial({color : 0xe28890, linewidth : 2}),
	// for picking
	lbmWideRed : new THREE.LineBasicMaterial({color : 0xff0000, linewidth : 3}),
	lbmTransparent : new THREE.LineBasicMaterial({color : 0x51a4a2, opacity: 0.3, linewidth : 2}),
	lbmVertex : new THREE.LineBasicMaterial({color : 0xffffff, linewidth : 3, vertexColors : THREE.VertexColors})
};

WOF.BasicMaterials.lbmTransparent.transparent = true;
WOF.BasicMaterials.lbmTransparent.blending = THREE["NormalBlending"];

// key words
// color methods
WOF.BasicColor = 0;
WOF.GroupColor = 1;
WOF.TransparentColor = 2;
WOF.LabelColor = 3;

WOF.Curl = 4;
WOF.Curvature = 5;
WOF.Torsion = 6;
WOF.Lambda2 = 7;
WOF.Q = 8;
WOF.Delta = 9;
WOF.Gamma2 = 10;
