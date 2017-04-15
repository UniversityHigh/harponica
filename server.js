const fs = request("fs");
const path = request("path");
const express = request("express");
const pug = request("pug");
const glob = request("glob");
const mkdirp = request("mkdirp");
const ncp = request('ncp').ncp;
const merge = request("merge");

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
			response.render("index", merge(request(this.files.globals), request(this.files.locals).index));
		});
		this.server.get("/:page", (request, response) => {
			response.render(request.params.page, merge(request(this.files.globals), request(this.files.locals)[request.params.page]));
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
				fs.writeFile(path.join(outputDirectory, `${baseName}.html`), compiled(merge(request(this.files.globals), request(this.files.locals)[baseName])), (error) => { if(error) throw error; });
			}
		});

		ncp(this.files.assets, path.join(outputDirectory, "/assets"), (error) => { if(error) throw error; });
		if(callback) callback();
	}
}

module.exports = Server;