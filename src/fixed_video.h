#ifndef FIXED_VIDEO_H
#define FIXED_VIDEO_H

#include <node.h>
#include <node_buffer.h>
#include <node_version.h>
#include "common.h"
#include "video_encoder.h"

using namespace v8;
using namespace node;

class FixedVideo : public node::ObjectWrap {
    VideoEncoder videoEncoder;

public:
    FixedVideo(int width, int height);
    static void Initialize(v8::Handle<v8::Object> target);
    void NewFrame(const unsigned char *data);
    void SetOutputFile(const char *fileName);
    void SetCallback(Persistent<Function> callback);
    void SetQuality(int quality);
    void SetFrameRate(int frameRate);
    void SetKeyFrameInterval(int keyFrameInterval);
    void End();

protected:
    static v8::Handle<v8::Value> New(const v8::Arguments &args);
    static v8::Handle<v8::Value> NewFrame(const v8::Arguments &args);
    static v8::Handle<v8::Value> SetOutputFile(const v8::Arguments &args);
    static v8::Handle<v8::Value> SetCallback(const v8::Arguments &args);
    static v8::Handle<v8::Value> SetQuality(const v8::Arguments &args);
    static v8::Handle<v8::Value> SetFrameRate(const v8::Arguments &args);
    static v8::Handle<v8::Value> SetKeyFrameInterval(const v8::Arguments &args);
    static v8::Handle<v8::Value> End(const v8::Arguments &args);
};

#endif

