---
layout: post
title: "ITags - Or: YouTube video formats"
author: Raphael Emberger
description: "What do itags really mean and what about all the other stuff?"
tags: [youtube,itag]
ownstyles: [styleRed]
---

Revealing the meaning behind `itags` and other cryptic stuff YouTube sends us is crucial to understand how to gather relevant data for [downloading videos](/2017/06/23/youtube_downloader_1/).

# Does the ITag determine the format details?

No. There are so many things which can change within a single itag. Hardcoding format presets based in itags is a **bad idea**.

So, let's get cracking. The following keys are present in all formats one can find in the Json object `args.adaptive_fmts` and `args.url_encoded_fmt_stream_map`:

# Base Format

| Key | Meaning | Possible Values |
| --- | ------- | -------------- |
| itag | format identifier. | 17, 36, 18, 22, 43, 160, 133, 134, 135, 136, 298, 137, 299, 264, 266, 138, 278, 242, ... |
| type | mime type and codecs | 'video/webm\| codecs="vp8.0, vorbis"', 'audio/mp4\| codecs="mp4a.40.2"', 'video/mp4\| codecs="avc1.4d401f"', ... |
| url  | base url for download | *refer to [url query table](#urlquery)* |

There might be an additional key `s` which  points to a ciphered signature. Such formats need to be deciphered before they can be downloaded.

Now the keys of the formats diverge greatly. We can distinguish between **normal videos** and **DASH files**.

# Normal Video

This category is always a video with embedded audio and adds the following key to the pool:

| Key | Meaning | Possible Values |
| --- | ------- | -------------- |
| quality | rough classification of video quality | "small", "medium", "hd720" |

However, one can find additional data regarding the format of normal videos by looking at the Json variable `args.fmt_list`:

| Index | Meaning | Possible Values |
| --- | ------- | -------------- |
| 1 | itag | 17, 36, 18, 22, 43, *maybe more* |
| 2 | width | 176, 204, 240, 242, 296, 300, 306, 314, 318, 320, 360, 362, 384, 426, 442, 450, 470, 476, 480, 492, 540, 572, 576, 610, 638, 640, 720, 724, 886, 942, 952, 960, 1080, 1152, 1276, 1280, *probably more* |
| 3 | height | 144, 172, 180, 200, 202, 214, 216, 234, 240, 288, 346, 358, 360, 720, *probably more* |
| 4 | ? | 9, 99 |
| 5 | ? | 0, 1 |
| 6 | ? | 0, 115 |

# Dash File

Dash files provide us with much more valuable data:

| Key | Meaning | Possible Values |
| --- | ------- | -------------- |
| bitrate | bitrate  | ..., 13543, ..., 25329521, ... |

<a name="urlquery"></a>
