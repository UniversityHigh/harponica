#!/usr/bin/env node
const Server = require("./server.js");

const fs = require("fs");
const args = process.argv.splice(process.execArgv.length + 2);

if(args[0]) {
	let subArgs = args.slice(1);
	let server;
	switch(args[0].toLowerCase()) {
		case "start":
			if(server) console.error("Server instance already running.");

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
			if(!server) console.error("Server instance not running.");

			if(subArgs.length != 0) {
				console.error("Usage: harponica stop");
			} else {
				server.stop();
			}
			break;
		case "compile":
			if(subArgs.length === 0) {
				if(!server) server = new Server(__dirname);
				server.compile(path.join(__dirname, "compiled"));
			} else if(subArgs.length === 1) {
				if(!server) server = new Server(subArgs[0]);
				server.compile(path.join(__dirname, "compiled"));
			} else if(subArgs.length === 2) {
				if(!server) server = new Server(subArgs[0]);
				server.compile(subArgs[1]);
			} else {
				console.error("Usage: harponica compile [sourceDirectory] [outputDirectory]");
			}
			break;
	}
} else {
	console.log("Usage");
	console.log("harponica start [directory] [port]");
	console.log("harponica stop");
	console.log("harponica compile [sourceDirectory] [outputDirectory]");
}