var VideoLib = require('../..');
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var sys = require('sys');

var fileRx = new RegExp(/^terminal-(\d+).rgb$/);

var outputFile = 'full-frames-stress.ogv';

var files = fs.readdirSync('.').sort().filter(
    function (f) { return fileRx.test(f) }
);

function baseName(fileName) {
    return fileName.slice(0, fileName.indexOf('.'));
}

var fixedVideo = new VideoLib.FixedVideo(720, 400); // width, height
fixedVideo.setOutputFile(outputFile);

var buf = new Buffer(1152000);

for(var i = 0;i<100;i++)
	files.forEach(function (file) {
    		sys.log(file);
    		var terminal = fs.readFileSync(file, 'binary');
    		buf.write(terminal, 'binary');
    		fixedVideo.newFrame(buf);
	});

fixedVideo.end();

