var VideoLib = require('video');
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var sys = require('sys');
var stream = require('stream');


var outputFileName = 'video-stream.ogv';


//
// First let's make the target stream.
//

var s = new stream.Duplex();

s.on('error',function(args)
{
   console.log(args);
});

//
// Now lets pipe it to the filesystem...
//

var f = fs.createWriteStream(outputFileName);

//
// Route the stream t the file...
//

//s.pipe(f);


//
// Now if we output to the pope,, it should output to the stream
//

//s.write('hello cruel world');

f.write('hello world');


//s.flush();
//f.flush();
//s.close();
f.close();




/*
var fileRx = new RegExp(/^terminal-(\d+).rgb$/);

var files = fs.readdirSync('.').sort().filter(
    function (f) { return fileRx.test(f) }
);

function baseName(fileName) {
    return fileName.slice(0, fileName.indexOf('.'));
}

var fixedVideo = new VideoLib.FixedVideo(720, 400); // width, height
fixedVideo.setOutputFile('video-stream.ogv');

var buf = new Buffer(1152000);
files.forEach(function (file) {
    sys.log(file);
    var terminal = fs.readFileSync(file, 'binary');
    buf.write(terminal, 'binary');
    fixedVideo.newFrame(buf);
});

fixedVideo.end();
*/
