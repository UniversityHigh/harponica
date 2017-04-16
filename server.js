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
		this.files = {};
		this.files.globals = path.join(this.directory, "_globals.json");
		this.files.locals = path.join(this.directory, "_locals.json");
		this.files.assets = path.join(this.directory, "assets");
		this.server = express();

		this.server.set("views", directory);
		this.server.set("view engine", "pug");

		this.server.use("/assets", express.static(this.files.assets));
		
		this.server.get("/", (request, response) => {
			delete require.cache[require.resolve(this.files.locals)];
			delete require.cache[require.resolve(this.files.globals)];
			response.render("index", merge(require(this.files.globals), require(this.files.locals).index));
		});
		this.server.get("/:page", (request, response) => {
			if(require.cache[require.resolve(this.files.locals)] && require.cache[require.resolve(this.files.globals)]) {
				delete require.cache[require.resolve(this.files.locals)];
				delete require.cache[require.resolve(this.files.globals)];
			}
			
			try {
				response.render(request.params.page, merge(require(this.files.globals), require(this.files.locals)[request.params.page]));
			} catch(error) {
				response.send("404"); // Eventually make proper 404 response.
			}
		});
	}

	start(port, callback) {
		this.server = this.server.listen(port);
		console.log(`Harponica server has started on port ${port}.`);
		if(callback) callback();
	}

	stop(callback) {
		this.server.close();
		console.log(`Harponica server been stopped.`);
		if(callback) callback();
	}

	compile(outputDirectory, callback) {
		mkdirp(outputDirectory, (error) => { if(error) throw error; });

		glob(path.join(this.directory, "/[^_]*.pug"), (error, files) => {
			for(let file of files) {
				let base = path.basename(file);
				let baseName = base.split(".")[0];
				let baseExt = base.split(".")[1];

				let compiled = pug.compileFile(file);
				fs.writeFile(path.join(outputDirectory, `${baseName}.html`), compiled(merge(require(this.files.globals), require(this.files.locals)[baseName])), (error) => { if(error) throw error; });
			}
		});

		ncp(this.files.assets, path.join(outputDirectory, "/assets"), (error) => { if(error) throw error; });
		if(callback) callback();
	}
}

module.exports = Server;