"use strict";

var Rsvg = require('librsvg').Rsvg;
var request = require('request').defaults({ encoding: null });
var cfenv = require('cfenv');
var fs = require('fs');
var Readable = require('stream').Readable;
require('babel-core/register');


function parseSVG(svgText, resolve){
	
	let svg, sections;
	let svgStart;
	let regex = /[^\"]*/;
	[svgStart, ...sections] = svgText.split("xlink:href=\"");

	let section = sections.shift();
	//extract the url from the start of the section
	let url = section.match(regex)[0];
	//remove the url from the section
	section = section.replace(url,'');
	request.get(url, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			let data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
			resolve(svgStart + "xlink:href=\""+data+section);
		}
	});
}


module.exports = {
	toPDF: function(req,res){
		let svg = new Rsvg();
		let svgText = req.body.svg;
		let fileName = req.body.projectID;
		var p = new Promise(resolve => {parseSVG(svgText, resolve)});
		p.then(results => {
			svg.on('finish', function() {
				res.attachment(fileName+'.pdf');
				res.setHeader("Content-type", "application/force-download");
				var rs = Readable();
				rs._read = function(){
					rs.push(svg.render({
						format: 'pdf',
						width: svg.width,
						height: svg.height
					}).data);
					rs.push(null);
				}
				console.log('Finished!');
				rs.pipe(res);
				//res.end();
			});
			var rs = Readable();
			rs._read = function () {
				rs.push(results);
				rs.push(null);
			};

			rs.pipe(svg);
		});
	}
}