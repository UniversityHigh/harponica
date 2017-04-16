#!/usr/bin/env node
const Server = require("./server.js");
const fs = require("fs");
const path = require("path");
const args = process.argv.splice(process.execArgv.length + 2);

if(args[0]) {
	let subArgs = args.slice(1);
	let server;
	switch(args[0].toLowerCase()) {
		case "start":
			if(server) console.error("Server instance already running.");

			
			if(subArgs.length === 0) {
				server = new Server(process.cwd());
				server.start(3000);
			} else if(subArgs.length === 1) {
				server = new Server(path.isAbsolute(subArgs[0]) ? subArgs[0] : path.join(process.cwd(), subArgs[0]));
				server.start(3000);
			} else if(subArgs.length === 2) {
				server = new Server(path.isAbsolute(subArgs[0]) ? subArgs[0] : path.join(process.cwd(), subArgs[0]));
				server.start(subArgs[1]);
			} else if(subArgs.length > 2) console.error("Usage: harponica start [directory] [port]");
			break;
		case "stop":
			if(!server) console.error("Server instance not running.");

			if(subArgs.length != 0) {
				console.error("Usage: harponica stop");
			} else {
				server.stop();
			}
			break;
		case "compile":
			if(subArgs.length === 0) {
				if(!server) server = new Server(process.cwd());
				server.compile(path.join(process.cwd(), "compiled"));
			} else if(subArgs.length === 1) {
				if(!server) server = new Server(path.isAbsolute(subArgs[0]) ? subArgs[0] : path.join(process.cwd(), subArgs[0]));
				server.compile(path.join(process.cwd(), "compiled"));
			} else if(subArgs.length === 2) {
				if(!server) server = new Server(path.isAbsolute(subArgs[0]) ? subArgs[0] : path.join(process.cwd(), subArgs[0]));
				server.compile(path.isAbsolute(subArgs[1]) ? subArgs[1] : path.join(process.cwd(), subArgs[1]));
			} else {
				console.error("Usage: harponica compile [sourceDirectory] [outputDirectory]");
			}
			break;
	}
} else {
	console.log("Usage:");
	console.log("harponica start [directory] [port]");
	console.log("harponica stop");
	console.log("harponica compile [sourceDirectory] [outputDirectory]");
}