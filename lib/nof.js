/*
Websocket server for node-osuflow, an improvement of osuflow_s.js

Author: Wenbin He
*/

var socketio = require('socket.io');	// install socket.io first
var nof = require('../../node-osuflow/build/Release/nof');	// put your nof filepath here
var io;

// osuflow objects
var osuflow = new nof.OSUFlow();
osuflow.loadData("../data/vec/tornado.vec", true);
// osuflow.loadDataCurvilinear("../data/plot3d/channel", true);	// put your vec/plot3d data path here
var field = osuflow.getFlowField();
var min = [], max = [];
osuflow.boundary(min, max);
osuflow.setIntegrationParams(1, 1, 3);

// clients' information
var clientNumber = 0;
var streamlines = {};
var curvatures = {};
var lambda2s = {}, qs = {}, deltas = {}, gamma2s = {};

exports.listen = function (server) {
	io = socketio.listen(server);
	io.set("log level", 1);

	io.sockets.on("connection", function (socket) {
		clientNumber++;
		console.log(socket.handshake.time);
		console.log("Client: " + socket.handshake.address.address + " connect in.");
		console.log("Clients number: " + clientNumber);

		// join room
		socket.join("public");

		// init data
		streamlines[socket.id] = [];
		curvatures[socket.id] = [];
		lambda2s[socket.id] = []; qs[socket.id] = []; deltas[socket.id] = []; gamma2s[socket.id] = [];

		// handle requests
		handleLoadData(socket);
		handleSeedInfo(socket, field);
		handleGenStreamLines(socket, osuflow, field, streamlines, curvatures, lambda2s, qs, deltas, gamma2s);

		handleDisconnection(socket, streamlines, curvatures, lambda2s, qs, deltas, gamma2s);
	});
};

function handleLoadData(socket) {
	socket.on("loadData", function (filename) {
		// send boundary to the client
		socket.emit("boundary", {
			min : min,
			max : max
		});
	});
}

function handleSeedInfo(socket, field) {
	socket.on("seedInfo", function (pos) {
		var vec = [], lqdg = [];
		field.at_phys(pos, 0, vec);
		field.lqdg(pos, lqdg);

		socket.emit("seedInfo", {
			pos : pos,
			vec : vec,
			lqdg : lqdg
		});

		vec.length = 0;
		lqdg.length = 0;
	});
}

function handleGenStreamLines(socket, osuflow, field, streamlines, curvatures, lambda2s, qs, deltas, gamma2s) {
	socket.on("genStreamLines", function (params) {
		// set seeds
		osuflow.setSeedPoints(params.seeds);
	});
}

function handleDisconnection(socket, streamlines, curvatures, lambda2s, qs, deltas, gamma2s) {
	socket.on("disconnect", function () {
		delete streamlines[socket.id];
		delete curvatures[socket.id];
		delete lambda2s[socket.id]; delete qs[socket.id]; delete deltas[socket.id]; delete gamma2s[socket.id];

		clientNumber--;
		console.log(socket.handshake.time);
		console.log("Client: " + socket.handshake.address.address + " disconnect.");
		console.log("Clients number: " + clientNumber);
	});
}
