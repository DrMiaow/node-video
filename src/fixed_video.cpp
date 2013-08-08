#include <node_buffer.h>
#include <node_version.h>
#include "common.h"
#include "fixed_video.h"

using namespace v8;
using namespace node;

FixedVideo::FixedVideo(int width, int height) :
    videoEncoder(width, height) {}

void
FixedVideo::Initialize(Handle<Object> target)
{
    HandleScope scope;

    Local<FunctionTemplate> t = FunctionTemplate::New(New);
    t->InstanceTemplate()->SetInternalFieldCount(1);
    NODE_SET_PROTOTYPE_METHOD(t, "newFrame", NewFrame);
    NODE_SET_PROTOTYPE_METHOD(t, "noiseFrame", NoiseFrame);
    NODE_SET_PROTOTYPE_METHOD(t, "rgbFrame", RGBFrame);
    NODE_SET_PROTOTYPE_METHOD(t, "flush", Flush);
    NODE_SET_PROTOTYPE_METHOD(t, "setCallback", SetCallback);
    NODE_SET_PROTOTYPE_METHOD(t, "setQuality", SetQuality);
    NODE_SET_PROTOTYPE_METHOD(t, "setFrameRate", SetFrameRate);
    NODE_SET_PROTOTYPE_METHOD(t, "setKeyFrameInterval", SetKeyFrameInterval);
    NODE_SET_PROTOTYPE_METHOD(t, "end", End);
    target->Set(String::NewSymbol("FixedVideo"), t->GetFunction());
}

void
FixedVideo::NewFrame(const unsigned char *data)
{
    videoEncoder.newFrame(data);
}

void
FixedVideo::NoiseFrame()
{
    videoEncoder.noiseFrame();
}

void
FixedVideo::RGBFrame(const unsigned char red,const unsigned char green,const unsigned char blue)
{
    videoEncoder.rgbFrame(red,green,blue);
}

void
FixedVideo::Flush()
{
    videoEncoder.flush();
}


void
FixedVideo::SetCallback(Persistent<Function> callback)
{
    videoEncoder.setCallback(callback);
}

void
FixedVideo::SetQuality(int quality)
{
    videoEncoder.setQuality(quality);
}

void
FixedVideo::SetFrameRate(int frameRate)
{
    videoEncoder.setFrameRate(frameRate);
}

void
FixedVideo::SetKeyFrameInterval(int keyFrameInterval)
{
    videoEncoder.setKeyFrameInterval(keyFrameInterval);
}

void
FixedVideo::End()
{
    videoEncoder.end();
}


Handle<Value>
FixedVideo::New(const Arguments &args)
{
    HandleScope scope;

    if (args.Length() != 2)
        return VException("Two arguments required - width and height.");
    if (!args[0]->IsInt32())
        return VException("First argument must be integer width.");
    if (!args[1]->IsInt32())
        return VException("Second argument must be integer height.");

    int w = args[0]->Int32Value();
    int h = args[1]->Int32Value();

    if (w < 0)
        return VException("Width smaller than 0.");
    if (h < 0)
        return VException("Height smaller than 0.");

    FixedVideo *fv = new FixedVideo(w, h);
    fv->Wrap(args.This());
    return args.This();
}

Handle<Value>
FixedVideo::NewFrame(const Arguments &args)
{
    HandleScope scope;

    if (args.Length() != 1)
        return VException("One argument required - Buffer with full frame data.");

    if (!Buffer::HasInstance(args[0])) 
        return VException("First argument must be Buffer.");
#if NODE_VERSION_AT_LEAST(0,3,0)
    v8::Handle<v8::Object> rgb = args[0]->ToObject();
#else
    Buffer *rgb = ObjectWrap::Unwrap<Buffer>(args[0]->ToObject());
#endif

    FixedVideo *fv = ObjectWrap::Unwrap<FixedVideo>(args.This());
#if NODE_VERSION_AT_LEAST(0,3,0)
    fv->NewFrame((unsigned char *) Buffer::Data(rgb));
#else
    fv->NewFrame((unsigned char *)rgb->data());
#endif

    return Undefined();
}


Handle<Value>
FixedVideo::NoiseFrame(const Arguments &args)
{
    HandleScope scope;

    FixedVideo *fv = ObjectWrap::Unwrap<FixedVideo>(args.This());

    fv->NoiseFrame();

    return Undefined();
}



Handle<Value>
FixedVideo::RGBFrame(const Arguments &args)
{
    HandleScope scope;

    if (args.Length() != 3)
        return VException("Three argument required - Red Green and Blue numbers with values 0-255.");

     if (!args[0]->IsInt32())
        return VException("First argument must be a number.");

     if (!args[1]->IsInt32())
        return VException("Second argument must be a number.");

     if (!args[2]->IsInt32())
        return VException("Third argument must be a number.");

    unsigned char red = (unsigned char) args[0]->Uint32Value();
    unsigned char green = (unsigned char) args[1]->Uint32Value();
    unsigned char blue = (unsigned char) args[2]->Uint32Value();

    FixedVideo *fv = ObjectWrap::Unwrap<FixedVideo>(args.This());

    fv->RGBFrame(red,green,blue);

    return Undefined();
}


Handle<Value>
FixedVideo::Flush(const Arguments &args)
{
    HandleScope scope;

    FixedVideo *fv = ObjectWrap::Unwrap<FixedVideo>(args.This());

    fv->Flush();

    return Undefined();
}


Handle<Value>
FixedVideo::SetCallback(const Arguments &args)
{
    HandleScope scope;

    if (args.Length() != 1)
        return VException("One argument required - output file name.");

    if (!args[0]->IsFunction())
        return VException("First argument must be  function.");


    
    Local<Function> callback; 

    callback = Local<Function>::Cast(args[0]);   


    FixedVideo *fv = ObjectWrap::Unwrap<FixedVideo>(args.This());

    fv->SetCallback(Persistent<Function>::New(callback));

    return Undefined();
}


Handle<Value>
FixedVideo::SetQuality(const Arguments &args)
{
    HandleScope scope;

    if (args.Length() != 1) 
        return VException("One argument required - video quality.");

    if (!args[0]->IsInt32())
        return VException("Quality must be integer.");

    int q = args[0]->Int32Value();

    if (q < 0) return VException("Quality smaller than 0.");
    if (q > 63) return VException("Quality greater than 63.");

    FixedVideo *fv = ObjectWrap::Unwrap<FixedVideo>(args.This());
    fv->SetQuality(q);

    return Undefined();
}

Handle<Value>
FixedVideo::SetFrameRate(const Arguments &args)
{
    HandleScope scope;

    if (args.Length() != 1) 
        return VException("One argument required - frame rate.");

    if (!args[0]->IsInt32())
        return VException("Frame rate must be integer.");

    int rate = args[0]->Int32Value();
    
    if (rate < 0)
        return VException("Frame rate must be positive.");

    FixedVideo *fv = ObjectWrap::Unwrap<FixedVideo>(args.This());
    fv->SetFrameRate(rate);

    return Undefined();
}

Handle<Value>
FixedVideo::SetKeyFrameInterval(const Arguments &args)
{
    HandleScope scope;

    if (args.Length() != 1) 
        return VException("One argument required - keyframe interval.");

    if (!args[0]->IsInt32())
        return VException("Keyframe interval must be integer.");

    int interval = args[0]->Int32Value();

    if (interval < 0)
        return VException("Keyframe interval must be positive.");

    if ((interval & (interval - 1)) != 0)
        return VException("Keyframe interval must be a power of two.");

    FixedVideo *fv = ObjectWrap::Unwrap<FixedVideo>(args.This());
    fv->SetKeyFrameInterval(interval);

    return Undefined();
}

Handle<Value>
FixedVideo::End(const Arguments &args)
{
    HandleScope scope;

    FixedVideo *fv = ObjectWrap::Unwrap<FixedVideo>(args.This());
    fv->End();

    return Undefined();
}

