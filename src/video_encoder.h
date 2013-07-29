#ifndef VIDEO_ENCODER_H
#define VIDEO_ENCODER_H

#include <string>
#include <theora/theoraenc.h>

#include <node_buffer.h>
#include <node_version.h>

using namespace v8;
using namespace node;


class VideoEncoder {
    int width, height, quality, frameRate, keyFrameInterval;
    std::string outputFileName;

    FILE *ogg_fp;
    th_info ti;
    th_enc_ctx *td;
    th_comment tc;
    ogg_packet op;
    ogg_page og;
    ogg_stream_state *ogg_os;
    Persistent<Function> cb;

    unsigned long frameCount;

    void writeData(const unsigned char *data,int length);

public:
    VideoEncoder(int wwidth, int hheight);
    ~VideoEncoder();

    void newFrame(const unsigned char *data);
    void dupFrame(const unsigned char *data, int time);
    void setOutputFile(const char *fileName);
    void setCallback(Persistent<Function> callback);
    void setQuality(int qquality);
    void setFrameRate(int fframeRate);
    void setKeyFrameInterval(int kkeyFrameInterval);
    void end();

private:
    void InitTheora();
    void WriteHeaders();
    void WriteFrame(const unsigned char *rgb, int dupCount=0);
};

#endif

