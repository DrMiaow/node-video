var video = require('../..');
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var sys = require('sys');
var stream = require('stream');
var http = require('http');
var url = require("url");
var path = require("path");
var port = 3000;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);
/*
  var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
  };
*/

   response.writeHead(200, {"Content-Type": "video/ogg"});


  //
  // Route the stream t the file...
  //

  var fileRx = new RegExp(/^terminal-(\d+).rgb$/);

  var files = fs.readdirSync('.').sort().filter(
      function (f) { return fileRx.test(f) }
  );

  function baseName(fileName) {
      return fileName.slice(0, fileName.indexOf('.'));
  }

  var fixedVideo = new video.FixedVideo(720, 400); 

  fixedVideo.setCallback(function(buffer){
    console.log("callback called with buffer.length = " + buffer.length);
    if (!response.write(buffer))
    {
        console.log("WRITESTREAM BUFFERED");
    }
  });

  var buf = new Buffer(864000);

  //var buf = new Buffer();

  //for(var x = 0;x<10;x++)
  while(true)
  {
    files.forEach(function (file) {
      sys.log(file);
      var terminal = fs.readFileSync(file, 'binary');
      if (!buf.write(terminal, 'binary'))
      {
       console.log("WRITE TO FILE BUFFERED");
      }
      fixedVideo.newFrame(buf);
    });
  }

  fixedVideo.end();
  response.end();


  /*
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      var headers = {};
      var contentType = contentTypesByExtension[path.extname(filename)];
      if (contentType) headers["Content-Type"] = contentType;
      response.writeHead(200, headers);
      response.write(file, "binary");
      response.end();
    });
  });
  */



}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
