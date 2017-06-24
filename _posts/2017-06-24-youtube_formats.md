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
| --- | ------- | --------------- |
| `itag` | format identifier. | 17, 36, 18, 22, 43, 160, 133, 134, 135, 136, 298, 137, 299, 264, 266, 138, 278, 242, ... |
| `type` | mime type and codecs | 'video/webm\| codecs="vp8.0, vorbis"', 'audio/mp4\| codecs="mp4a.40.2"', 'video/mp4\| codecs="avc1.4d401f"', ... |
| `url`  | base url for download | *refer to [url query table](#urlquery)* |

There might be an additional key `s` which  points to a ciphered signature. Such formats need to be deciphered before they can be downloaded.

Now the keys of the formats diverge greatly. We can distinguish between **normal videos** and **DASH files**.

# Normal Video

This category is always a video with embedded audio and adds the following key to the pool:

| Key | Meaning | Possible Values |
| --- | ------- | --------------- |
| `quality` | rough classification of video quality | "small", "medium", "hd720" |

However, one can find additional data regarding the format of normal videos by looking at the Json variable `args.fmt_list`:

| Index | Meaning | Possible Values |
| ----- | ------- | --------------- |
| `1` | itag | 17, 36, 18, 22, 43, *maybe more* |
| `2` | width | 176, 204, 240, 242, 296, 300, 306, 314, 318, 320, 360, 362, 384, 426, 442, 450, 470, 476, 480, 492, 540, 572, 576, 610, 638, 640, 720, 724, 886, 942, 952, 960, 1080, 1152, 1276, 1280, *probably more* |
| `3` | height | 144, 172, 180, 200, 202, 214, 216, 234, 240, 288, 346, 358, 360, 720, *probably more* |
| `4` | ? | 9, 99 |
| `5` | ? | 0, 1 |
| `6` | ? | 0, 115 |

# Dash File

Dash files provide us with much more valuable data:

| Key | Meaning | Possible Values |
| --- | ------- | --------------- |
| `bitrate`         | video bitrate in bits/s | ..., 13543, ..., 25329521, ... |
| `projection_type` | ? | 1 |
| `index`           | range of file - something for flow control? | "712-2099", "710-8889", ... |
| `init`            | head of file - something for flow control? (note that the first value of `index` is the increment of the second value) | "0-711", "0-709", ... |
| `clen`            | content length of the file in bytes | ..., 428200, ..., 7186829575, ... |
| `lmt`             | some sort of timestamp in milliseconds - in relation to upload date? | ..., 1394296556508790, ..., 1410228466879710, ... |
| `xtags`           | ? *always empty?* |  |

Dash files divide into to extremist groups: One only provides video and the other one only audio.

## Dash Video

With videos we get additional keys:

| Key | Meaning | Possible Values |
| --- | ------- | --------------- |
| `fps`             | fps in frames/s | 1, 6, 10, 12, 13, 14, 15, 16, 24, 25, 29, 30, 41, 60, ... |
| `quality_label`   | string to display on player control **not always present** | "144p", "240p", "360p", "480p", "720p", "720p48", "720p60", "1080p", "1080p48", "1080p60", "1440p", "1440p60", "2160p", ... |
| `size`            | video dimensions **not always present** | "960x720", "952x720", "426x240", "1920x1080", "1412x1080", ... |

In case the video is 3d, there's always the following key present:

| Key | Meaning | Possible Values |
| --- | ------- | --------------- |
| `stereo_layout` | ? | 1 |

And if it's a live stream, we get:

| Key | Meaning | Possible Values |
| --- | ------- | --------------- |
| `target_duration_sec` | ? | 2, 5, *probably more* |

## Dash Audio

Audio files on the other hand don't have any more keys than the basic Dash files. Only exception: Live streams - they have the same additional key as the video live stream:

| Key | Meaning | Possible Values |
| --- | ------- | --------------- |
| `target_duration_sec` | ? | 2, 5, *probably more* |

---

# <a name="urlquery"></a>URL

Another point I'd like to elaborate on are the urls. They more or less consist of the same parts - independent of the itag/format details. So far I could identify the following queries:

| Query | Meaning | Possible Values |
| ----- | ------- | --------------- |
| `ei`          | ? - *unique per video. maybe related to etag?* | "mr8yWY2VIIX6cOqJrPgJ", "nb8yWbqMK8LEc5_gt5gE", "Ub8yWeLgApnbcaDInoAN", "Nr8yWcetINK_cODKp-gK", ... |
| `expire`      | expiration date in seconds | 1496519674, 1496519597, ... |
| `gir`         | ? - **not always present** | "yes" |
| `id`          | ? - *unique per video* | "o-AFdOwrUtVCOvpyx_fCPCRMHVP73Hd-57-Kz2IBBcMxMz", "o-AA_QavghW8tQaH_IAgxI8AJ191GcFxDA22MNuKdS6mFk", "o-AJDonLmiWDL37b2L_EwwyK-1DSSsxKXSbQYBD8znS5hK", ... |
| `initcwndbps` | ? - *something flow control related?* | 6611250, 6937500, 7410000, ... |
| `ip`          | IPv4/IPv6 address of client | "0000:::::::0000", "0.0.0.0", ... |
| `ipbits`      | ? | 0 |
| `itag`        | itag | 17 |
| `keepalive`   | keep alive request **exclusively for normal videos** | "yes" |
| `key`         | ? | "yt6" |
| `mime`        | mime type of file | "video/3gpp", "video/mp4", "video/webm", "audio/mp4", "audio/webm" |
| `mm`          | ? - *32 on live streams - 31 otherwise* | 31, 32 |
| `mn`          | ? - *the first one seems to appear only on normal videos and non-3d, non-live dash files* | "sn-nfpnnjvh-9ans", "sn-nfpnnjvh-9an6", "sn-nfpnnjvh-9anz" |
| `ms`          | ? - *"lv" is exclusively on live dash files* | "au", "lv" |
| `mt`          | some sort of timestamp in seconds *the first one is exclusively on live streams* | 1496497763, 1496498013, 1496497778, 1496497828, 1496497888, 1496498013 |
| `mv`          | ? | "m" |
| `pl`          | ? | 45 |
| `ratebypass`  | signaling some sort of bypass | "yes" |
| `requiressl`  | signaling the use of ssl | "yes" |
| `signature`   | signature for request | "0EB376F301BFC67A0C545E5FFC34FCE4AF3B3...", ... |
| `source`      | whether static or a live stream | "youtube", "yt_live_broadcast" |
| `sparams`     | param list of GET query | "clen,dur,ei,gir,id,initcwndbps,ip,ipbits,itag,lmt,...", ... |
| `beids`       | ? - **never on live streams** | "[9466591]", "[9466592]", "[9466593]", "[9466594]" |
| `clen`        | content length of file - **not always present** | ..., 22659, ..., 7186829575, ... |
| `noclen`      | no content length? But sometimes this query is missing even though there's no clen given. | 1 |
| `cmbypass`    | some kind of bypass - **only on live streams** | "yes" |
| `compress`    | flag, signaling compression - **only on live streams** | "yes" |
| `hang`        | ? - **only on live streams** | 1 |
| `live`        | flag for live streams | 1 |
| `lmt`         | another timestamp in milliseconds - *in relation to upload date? not present in live streams* | ..., 1280240000000000, ..., 1496480000000000, ... |
| `dur`         | video duration in seconds - *not on live streams* | 0, 158.22, 7776.734, 309.382, ... |
| `gcr`         | ? - locale? | "ch" |
| `hightc`      | ? | *- no data captured -* |
| `pcm2`        | ? - **not always present** | "yes", "no" |
| `pcm2cms`     | ? - **not always present** | "yes" |

I'd like to point out that I got my information from letting one of my integration tests run through over 500 "random videos"(means: going through the recommendations). 2 of them were live streams and 5 were 3d videos. So it's not the best source.
