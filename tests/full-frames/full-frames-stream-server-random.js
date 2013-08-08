var video = require('../..');
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var sys = require('sys');
var stream = require('stream');
var http = require('http');
var url = require("url");
var path = require("path");
var port = 3000;
var frameRate = 1;
var fpf = 1;

//var dimensions = {Width:1920,Height:1080}
//var dimensions = {Width:1280,Height:720}
//var dimensions = {Width:640,Height:360}
//var dimensions = {Width:320,Height:180}
var dimensions = {Width:160,Height:90}

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);

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
    //fixedVideo.rgbFrame(frame % 256,255 - frame % 256, (frame  + 128) % 256);
    fixedVideo.noiseFrame();

    var red = Math.floor((Math.random()*256));
    var green = Math.floor((Math.random()*256));
    var blue = Math.floor((Math.random()*256));

    //fixedVideo.rgbFrame(red,green,blue);
    fixedVideo.flush();

    frame++;
  }

  interval = setInterval(render, 1000/(frameRate*fpf));

  //while(true) render();

}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
