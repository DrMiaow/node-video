var VideoLib = require('../..');
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var sys = require('sys');
var stream = require('stream');
var outputFileName = 'full-frames-stream.ogv';

//
// First let's make the target stream.
//

// http://loose-bits.com/2012/08/02/nodejs-read-write-streams-pipes.html
// https://groups.google.com/forum/#!topic/nodejs/0uUgncIKApc
// http://luismreis.github.io/node-bindings-guide/docs/calling-native.html

//
// Now lets pipe it to the filesystem...
//

var writeStream  = fs.createWriteStream(outputFileName);

var fileRx = new RegExp(/^terminal-(\d+).rgb$/);

var files = fs.readdirSync('.').sort().filter(
    function (f) { return fileRx.test(f) }
);

function baseName(fileName) {
    return fileName.slice(0, fileName.indexOf('.'));
}

var fixedVideo = new VideoLib.FixedVideo(720, 400); 

fixedVideo.setCallback(function(buffer){
   return;
   console.log("callback called with buffer.length = " + buffer.length);
   if (!writeStream.write(buffer))
   {
	console.log("WRITESTREAM BUFFERED");
   }
});

var buf = new Buffer(1864000);

for(var x = 0;x<10000;x++)
files.forEach(function (file) {
    sys.log(file);
    var terminal = fs.readFileSync(file, 'binary');
    if (!buf.write(terminal, 'binary'))
    {
       console.log("WRITE TO FILE BUFFERED");
    }
    fixedVideo.newFrame(buf);
});

fixedVideo.end();
writeStream.end();
