var video = require('../..');
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var sys = require('sys');
var stream = require('stream');
var http = require('http');
var url = require("url");
var path = require("path");
var port = 3000;
var frameRate = 30;
var fpf = 1;

//var dimensions = {Width:1920,Height:1080}
//var dimensions = {Width:1280,Height:720}
//var dimensions = {Width:640,Height:360}
var dimensions = {Width:320,Height:180}
//var dimensions = {Width:160,Height:90}

// Static Files
var index = fs.readFileSync(__dirname + '/client.html');

 var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
  };


http.createServer(function(request, response) {

  var uriFilename = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uriFilename);
  var contentType = contentTypesByExtension[path.extname(filename)];

  console.log(uriFilename);

  if (uriFilename == "/full-frames-stream-server-random.html")
  {
    response.writeHead(200, {"Content-type" : contentType});
    response.end(index);
    return;
  }
  else
  if  (uriFilename == "/video.ogv")
  {

    response.writeHead(200, {"Content-Type": "video/ogg"});

    var fixedVideo = new video.FixedVideo(dimensions.Width, dimensions.Height); 

    fixedVideo.setFrameRate(frameRate);

    fixedVideo.setCallback(function(buffer){

    if ( buffer.length != 0)
    {
        console.log("callback called with buffer.length = " + buffer.length);
        if (!response.write(buffer))
        {
          console.log("WRITESTREAM BUFFERED");
        }
      }
      else
      {
        console.log("callback called with empty buffer");
      }
    });


 var frame = 0;

  //fixedVideo.noiseFrame();

  function render()
  {
    //fixedVideo.noiseFrame();
    //fixedVideo.rgbFrame(255,0,0);
    //fixedVideo.rgbFrame(frame % 256,255 - (frame % 256), (frame + 128) % 256);
    fixedVideo.noiseFrame();

    //var red = Math.floor((Math.random()*256));
    //var green = Math.floor((Math.random()*256));
    //var blue = Math.floor((Math.random()*256));

    //var red = Math.abs(Math.floor(255*Math.sin((Math.PI*2)*((frame % 256)/255) )));
    //var green = red;
    //var blue = red;

    //console.log(red);
    //fixedVideo.rgbFrame(red,green,blue);
    
    fixedVideo.flush();

    frame++;
  }

  interval = setInterval(render, 1000/(frameRate*fpf));




  }
 else
    {

      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }




}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
