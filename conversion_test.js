var Rsvg = require('librsvg').Rsvg;
var request = require('request');
cfenv = require('cfenv');
var fs = require('fs');
var Readable = require('stream').Readable;

var vcapLocal = null
try {
  vcapLocal = require("./vcap-local.js");
}catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {};

var appEnv = cfenv.getAppEnv(appEnvOpts);

var svg = new Rsvg();

var request = require('request').defaults({ encoding: null });
var svgText;
request.get('http://dal.objectstorage.open.softlayer.com/v1/AUTH_75a955fd08674063893f0fc7e2928e33/prod_uploads/fb8b719c9905116e411fdae1e9d6e08e.png', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        datas = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        var svgText = '<svg height="873.3183856502242" width="1000" id="interface"><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+datas+'" height="873.3183856502242" width="1000"></image><line x1="620" y1="152" x2="761" y2="262" stroke-width="2" stroke="#DB2780"></line><line x1="398" y1="210" x2="620" y2="152" stroke-width="2" stroke="#DB2780"></line><line x1="180" y1="92" x2="398" y2="210" stroke-width="2" stroke="#DB2780"></line><defs><filter id="dropshadow" transform="translate(" width="200%" height="200%" x="-25%" y="-25%"><feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"></feGaussianBlur><feOffset in="blur" dx="0" dy="0" result="offsetBlur"></feOffset><feMerge><feMergeNode in="offsetBlur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g class="circle" style="cursor: pointer;"><circle transform="translate(180,92)" r="15" class="dot" filter="url(#dropshadow)" style="fill: rgb(219, 39, 128); stroke-width: 2; stroke: white; cursor: pointer;"></circle><text transform="translate(175,97)" class="circle_label" pointer-events="none" style="fill: white; font-weight: 500;">1</text></g><g class="circle" style="cursor: pointer;"><circle transform="translate(398,210)" r="15" class="dot" filter="url(#dropshadow)" style="fill: rgb(219, 39, 128); stroke-width: 2; stroke: white; cursor: pointer;"></circle><text transform="translate(393,215)" class="circle_label" pointer-events="none" style="fill: white; font-weight: 500;">2</text></g><g class="circle" style="cursor: pointer;"><circle transform="translate(620,152)" r="15" class="dot" filter="url(#dropshadow)" style="fill: rgb(219, 39, 128); stroke-width: 2; stroke: white; cursor: pointer;"></circle><text transform="translate(615,157)" class="circle_label" pointer-events="none" style="fill: white; font-weight: 500;">3</text></g><g class="circle" style="cursor: pointer;"><circle transform="translate(761,262)" r="15" class="dot" filter="url(#dropshadow)" style="fill: rgb(219, 39, 128); stroke-width: 2; stroke: white; cursor: pointer;"></circle><text transform="translate(756,267)" class="circle_label" pointer-events="none" style="fill: white; font-weight: 500;">4</text></g></svg>';
	
        /*
        var req_url = 'https://dal.objectstorage.open.softlayer.com/v1/';
		var swiftCredentials = appEnv.getServiceCreds("tabulous-storage");
		swiftCredentials.container = process.env.TABULOUS_OBJ_CONTAINER;
		swiftCredentials.req_url = req_url;
		var objStorage = require('./modules/object_storage/index.js').install(swiftCredentials);
		*/
		
		// When finishing reading SVG, render and save as PNG image. 
		svg.on('finish', function() {
		  console.log('SVG width: ' + svg.width);
		  console.log('SVG height: ' + svg.height);
		  fs.writeFile('tiger.pdf', svg.render({
		    format: 'pdf',
		    width: 600,
		    height: 400
		  }).data);
		});
		
		/*
		var req = request.post(url, function (err, resp, body) {
		  if (err) {
		    console.log('Error!');
		  } else {
		    console.log('URL: ' + body);
		  }
		});
		var form = req.form();
		form.append('file', '<FILE_DATA>', {
		  filename: 'myfile.txt',
		  contentType: 'text/plain'
		});
		*/

		var rs = Readable();

		var c = 97;
		rs._read = function () {
			rs.push(svgText);
			rs.push(null);
		};

		rs.pipe(svg);
	}
});