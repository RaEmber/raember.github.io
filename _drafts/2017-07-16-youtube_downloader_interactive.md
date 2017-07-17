---
layout: post
title: "Interactive YouTube downloader"
author: Raphael Emberger
description: "Poor imitation of a YouTube downloader"
tags: [youtube,api,download,js,itag]
ownstyles: [styleRed]
ownscripts: [jquery-3.2.1.min,jquery.ajax-cross-origin.min,ytdownloader]
scripts: ["https://www.youtube.com/yts/jsbin/scheduler-vfl7wjKSr/scheduler.js"]
---

After writing my posts about downloading YouTube videos, I thought that a small tool to explore the workings of YouTube might be interesting so I wrote this little JS-Downloader:

## URL Analyzer

<input type="text" id="url" style="width: 80%;" valid="true"/><button id="urlBtn">analyze</button>
<table>
  <thead>
    <tr><th style="text-align: left">Property</th><th style="text-align: left">Value</th></tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left">Is valid</td>
      <td style="text-align: left" id="UrlIsValid"></td>
    </tr>
    <tr>
      <td style="text-align: left">Contains video ID</td>
      <td style="text-align: left" id="UrlHasVideoID"></td>
    </tr>
    <tr>
      <td style="text-align: left">Belongs to a video</td>
      <td style="text-align: left" id="UrlIsVideo"></td>
    </tr>
    <tr>
      <td style="text-align: left">Belongs to a playlist</td>
      <td style="text-align: left" id="UrlIsPlaylist"></td>
    </tr>
    <tr>
      <td style="text-align: left">Belongs to an image</td>
      <td style="text-align: left" id="UrlIsImage"></td>
    </tr>
    <tr>
      <td style="text-align: left">Video ID</td>
      <td style="text-align: left" id="UrlVideoId"></td>
    </tr>
    <tr>
      <td style="text-align: left">Playlist ID</td>
      <td style="text-align: left" id="UrlPlaylistId"></td>
    </tr>
  </tbody>
</table>

## Video data

<input type="text" id="videoId" style="width: 80%;" valid="true"/><button id="videoIdBtn">Get data</button>

<button id="testBtn">TEST</button>

<script>
$(function() {
  $("#testBtn").click(function(e) {
    var url = "https://youtube.com/watch?v=" + videoId;
    $.ajax({
      crossOrigin: true,
      url: url,
      success: function(data) {
        $( '#test' ).html(data);
      }
    });
  })
})
</script>
