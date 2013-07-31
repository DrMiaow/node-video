var VideoLib = require('../..');
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var sys = require('sys');
var stream = require('stream');


var outputFileName = 'full-frames-stream.ogv';
var outputFileNameBuffer = 'full-frames-stream-buffer.ogv';

//
// First let's make the target stream.
//

// http://loose-bits.com/2012/08/02/nodejs-read-write-streams-pipes.html
// https://groups.google.com/forum/#!topic/nodejs/0uUgncIKApc
// http://luismreis.github.io/node-bindings-guide/docs/calling-native.html

var s = new stream.Duplex();

s.on('error',function(args)
{
   console.log(args);
});

//
// Now lets pipe it to the filesystem...
//

var writeStream  = fs.createWriteStream(outputFileNameBuffer);

//
// Route the stream t the file...
//

//s.pipe(f);


//
// Now if we output to the pope,, it should output to the stream
//

//s.write('hello cruel world');

//f.write('hello world');


//s.flush();
//f.flush();
//s.close();
//f.close();

var fileRx = new RegExp(/^terminal-(\d+).rgb$/);

var files = fs.readdirSync('.').sort().filter(
    function (f) { return fileRx.test(f) }
);

function baseName(fileName) {
    return fileName.slice(0, fileName.indexOf('.'));
}

var fixedVideo = new VideoLib.FixedVideo(720, 400); // width, height
//fixedVideo.setOutputFile('video-stream.ogv');

fixedVideo.setOutputFile(outputFileName);

fixedVideo.setCallback(function(buffer){
   console.log("callback called with buffer.length = " + buffer.length);
   if (!writeStream.write(buffer))
   {
	console.log("WRITESTREAM BUFFERED");

        //writeStream.once('drain', function(){
       	//	 console.log("DRAINED");
	//	});

   }
  // 
  // for(var i = 0;i< buffer.length;i++)
  // {
  //   console.log("file.bytesWritten = " + buffer[i]);	
  // }
  // 

   //writeStream.write("Hello Cruel World",'binary');
   //console.log("file.bytesWritten = " + writeStream.bytesWritten);
});

var buf = new Buffer(864000);

//var buf = new Buffer();

for(var x = 0;x<10;x++)
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
