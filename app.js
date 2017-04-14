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
		this.server.use("/assets", express.static(this.directory + "/assets"));
		
		this.server.get("/", (req, res) => {
			res.render("index", merge(require(`${this.directory}/_harp.json`).globals, require(`${this.directory}/_data.json`).index));
		});
		this.server.get("/:page", (req, res) => {
			res.render(req.params.page, merge(require(`${this.directory}/_harp.json`).globals, require(`${this.directory}/_data.json`)[req.params.page]));
		});
	}

	start(port, callback) {
		this.server = this.server.listen(port);
		callback();
	}

	stop(callback) {
		this.server.close();
		callback();
	}

	compile(outputDirectory, callback) {
		mkdirp(outputDirectory, (err) => { if(err) throw err; });

		glob(`${this.directory}/[^_]*.pug`, (err, files) => {
			for(let file of files) {
				let base = path.basename(file);
				let baseName = base.split(".")[0];
				let baseExt = base.split(".")[1];

				let compiled = pug.compileFile(file);
				fs.writeFile(`${outputDirectory}/${baseName}.html`, compiled(merge(require(`${this.directory}/_harp.json`).globals, require(`${this.directory}/_data.json`)[baseName])), (err) => {
					if(err) throw err;
				});
			}
		});

		ncp(`${this.directory}/assets/img/`, `${outputDirectory}/img`, (err) => { if(err) throw err; });
		callback();
	}
}

module.exports.Server = Server;