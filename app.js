const fs = require("fs");
const path = require("path");
const express = require("express");
const pug = require("pug");
const glob = require("glob");
const mkdirp = require("mkdirp");
const ncp = require('ncp').ncp;
const merge = require("merge");

class Server {
	constructor(directory) {
		this.directory = directory;
		this.server = express();

		this.server.set("views", directory);
		this.server.set("view engine", "pug");
		this.server.use("/assets", express.static(path.join(this.directory, "/assets")));
		
		this.server.get("/", (req, res) => {
			res.render("index", merge(require(path.join(this.directory, "/_globals.json")), require(path.join(this.directory, "/_locals.json")).index));
		});
		this.server.get("/:page", (req, res) => {
			res.render(req.params.page, merge(require(path.join(this.directory, "/_globals.json")), require(path.join(this.directory, "/_locals.json"))[req.params.page]));
		});
	}

	start(port, callback) {
		this.server = this.server.listen(port);
		if(callback) callback();
	}

	stop(callback) {
		this.server.close();
		if(callback) callback();
	}

	compile(outputDirectory, callback) {
		mkdirp(outputDirectory, (err) => { if(err) throw err; });

		glob(path.join(this.directory, "/[^_]*.pug"), (err, files) => {
			for(let file of files) {
				let base = path.basename(file);
				let baseName = base.split(".")[0];
				let baseExt = base.split(".")[1];

				let compiled = pug.compileFile(file);
				fs.writeFile(path.join(outputDirectory, `/${baseName}.html`), compiled(merge(require(path.join(this.directory, "/_globals.json")), require(path.join(this.directory, "/_locals.json"))[baseName])), (err) => {
					if(err) throw err;
				});
			}
		});

		ncp(path.join(this.directory, "/assets"), path.join(outputDirectory, "/assets"), (err) => { if(err) throw err; });
		if(callback) callback();
	}
}

module.exports.Server = Server;