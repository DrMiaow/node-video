//var VideoLib = require('video');
var VideoLib = require('../..');

var Buffer = require('buffer').Buffer;
var fs = require('fs');
var sys = require('sys');

var outputFilename = 'stacked-frames-async-stress2.ogv';

var chunkDirs = fs.readdirSync('.').sort().filter(
    function (f) {
        return /^\d+$/.test(f);
    }
);

function baseName(fileName) {
    return fileName.slice(0, fileName.indexOf('.'));
}

function rectDim(fileName) {
    var m = fileName.match(/^\d+-rgb-(\d+)-(\d+)-(\d+)-(\d+).dat$/);
    var dim = [m[1], m[2], m[3], m[4]].map(function (n) {
        return parseInt(n, 10);
    });
    return { x: dim[0], y: dim[1], w: dim[2], h: dim[3] }
}

var stackedVideo = new VideoLib.AsyncStackedVideo(720,400);
stackedVideo.setOutputFile(outputFilename);
stackedVideo.setTmpDir('./temp');


console.log('encoding asynchronously... ');

for(var i=0;i<20;i++)
{
        chunkDirs.forEach(function (dir)
        {
                //console.log(dir);
                var chunkFiles = fs.readdirSync(dir).sort().filter(function (f)
                {
                        return /^\d+-rgb-\d+-\d+-\d+-\d+.dat/.test(f);
                });

                chunkFiles.forEach(function (chunkFile)
                {
                        var dims = rectDim(chunkFile);
                        var rgb = fs.readFileSync(dir + '/' + chunkFile); // returns buffer
                        stackedVideo.push(rgb, dims.x, dims.y, dims.w, dims.h);
                });

                stackedVideo.endPush();
        });
}

stackedVideo.encode(function (status, error) {

    process.stdout.write('\n');
    if (status) {
        console.log('video successfully written to ' + outputFilename);
    }
    else {
        console.log('failed writing video: ' + error);
    }
});

