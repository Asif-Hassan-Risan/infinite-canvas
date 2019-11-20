const fs = require("fs");

for(let fileName of ["index.html","index.css", "sandbox.html", "sandbox.css", "performance.html"]){
	fs.copyFile("./devtools/"+fileName, "./dist/"+fileName, (err) => {
		if (err) throw err;
	});
}
