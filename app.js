const Server = require("./server.js").Server;

const fs = require("fs");
const args = process.argv.splice(process.execArgv.length + 2);

let subArgs;
let server;
switch(args[0].toLowerCase()) {
	case "start":
		if(server) throw new Error("Server instance already running.");

		subArgs = args.slice(1);
		if(subArgs.length > 2 || subArgs.length < 1) {
			console.error("Usage: harponica start [directory] [port]");
		} else if(subArgs.length === 1) {
			server = new Server(subArgs[0]);
			server.start(3000);
		} else if(subArgs.length === 2) {
			server = new Server(subArgs[0]);
			server.start(subArgs[1]);
		}
		break;
	case "stop":
		if(!server) throw new Error("Server instance not running.");

		subArgs = args.slice(1);

		if(subArgs.length != 0) {
			console.error("Usage: harponica stop");
		} else {
			server.stop();
		}
		break;
	case "compile":
		subArgs = args.slice(1);

		if(subArgs.length != 2) {
			console.error("Usage: harponica compile <sourceDirectory> <outputDirectory>");
		} else {
			if(!server) {
				server = new Server(subArgs[0]);
				server.compile(subArgs[1]);
			} else {
				server.compile(subArgs[1]);
			}
		}
		break;
}