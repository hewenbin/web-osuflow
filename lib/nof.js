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

		// handle requests
		handleLoadData(socket);

		handleDisconnection(socket);
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

function handleDisconnection(socket) {
	socket.on("disconnect", function () {
		clientNumber--;
		console.log(socket.handshake.time);
		console.log("Client: " + socket.handshake.address.address + " disconnect.");
		console.log("Clients number: " + clientNumber);
	});
}
