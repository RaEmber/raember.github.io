function createCORSRequest(method, url){
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr){
      // XHR has 'withCredentials' property only if it supports CORS
      xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined"){ // if IE use XDR
      xhr = new XDomainRequest();
      xhr.open(method, url);
  } else {
      xhr = null;
  }
  return xhr;
}

var videoId;
var playlistId;
var content;
$(function() {
  $("#urlBtn").click(function(e) {
    var url = $("#url").val();
    var result = analyzeUrl(url);
    if (result.isValid) {
      $("#url").attr("valid", "true");
    } else {
      $("#url").attr("valid", "false");
    }
    videoId = "";
    if (result.isValid && result.hasVideoId) {
      videoId = extractVideoId(url);
      $("#videoId").val(videoId);
    }
    playlistId = "";
    if (result.isValid && result.isPlaylist) playlistId = extractPlaylistId(url);
    $("#UrlIsValid").text(result.isValid);
    $("#UrlHasVideoID").text(result.hasVideoId);
    $("#UrlIsVideo").text(result.isVideo);
    $("#UrlIsPlaylist").text(result.isPlaylist);
    $("#UrlIsImage").text(result.isImage);
    $("#UrlVideoId").html("<code class=\"highlighter-rouge\">" + videoId + "</code>");
    $("#UrlPlaylistId").html("<code class=\"highlighter-rouge\">" + playlistId + "</code>");
  })
  $("#videoIdBtn").click(function(e) {
    videoId = $("#videoId").val();
    // $.get("https://youtube.com/watch?v=" + videoId).done(function (data) {
    //   console.log(data);
    // });
    // $.get("https://www.googleapis.com/youtube/v3/videos" +
    //       "?id=7lCDEYXw3mM" +
    //       "&key=AIzaSyA-dlBUjVQeuc4a6ZN4RkNUYDFddrVLxrA" +
    //       "&part=snippet,contentDetails,statistics,status",
    //     function(data) {
    //       alert(data);
    //     });

    // var tcp = TCPSocket.open("https://www.youtube.com/watch?v=" + videoId, 80);
    var data = "GET https://www.youtube.com/watch?v=" + videoId + " HTTP/1.1\n";
    data += "Host: www.youtube.com\n";
    data += "User-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)\n";
    data += "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\n";
    data += "Accept-Language: en-US,en;q=0.5\n";
    data += "Accept-Encoding: gzip, deflate, br\n";
    data += "Connection: Keep-Alive";
    // tcp.send(data);

    // var promise = navigator.tcpPermission.requestPermission({remoteAddress:"127.0.0.1", remotePort:6789});


    // var host = "https://www.youtube.com/watch?v=" + videoId;
    // var port = 80;
    // var socket = new jSocket();
    // socket.onReady = function(){
    //         socket.connect(host, port);
    // }
    // socket.onConnect = function(success, msg){
    //         if(success){
    //                 socket.write(data);
    //         }else{
    //                 alert('Connection to the server could not be estabilished: ' + msg);
    //         }
    // }
    // socket.onData = function(data){
    //         alert('Received from socket: '+data);
    // }


    // var myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'text/html');
    // myHeaders.append('Origin', 'https://www.youtube.com/');
    // myHeaders.append('User-Agent', 'Der Geraet');
    // var myInit = { method: 'GET',
    //                headers: myHeaders,
    //                cache: 'default' };
    // var req = new Request("https://www.youtube.com/watch?v=" + videoId, myInit);
    // var myRequest = new Request("https://www.youtube.com/watch?v=" + videoId, {method: 'POST', body: '{"foo":"bar"}'});
    // myRequest.origin = "";
    // myRequest.referrer = "no-referrer";
    // myRequest.use-CORS-preflight
    // fetch(myRequest).then(function(response) {
    //   alert(response);
    // });

    // req.open("get", "https://youtube.com/watch?v=" + videoId, true);
    // req.setRequestHeader('Content-type','text/html');
    // req.setRequestHeader('Origin', 'https://youtube.com/');
    // req.setRequestHeader('ABC', 'ES TUET NÜME WEH!');
    // req.setRequestHeader('User-Agent', 'Der Geraet');
    // req.onreadystatechange = function () {
    //   alert(req.readyState + " - " + req.status);
    // };
    // req.send();
    // return;
    //
    // $.ajax({
    //   type: "GET",
    //   beforeSend: function(jqXHR, settings) {
    //     jqXHR.setRequestHeader("Origin", "https://youtube.com/");
    //     jqXHR.setRequestHeader("Referer", "https://youtube.com/");
    //   },
    //   url: "https://youtube.com/watch?v=" + videoId,
    //   success: function(msg) {
    //     alert(msg);
    //   }
    // });
    // $.ajax({
    //   url: "https://youtube.com/watch?v=" + videoId,
    //   method: "GET",
    //   crossDomain: true,
    //   dataType: 'html',
    //   headers: {headr};
    //   success: function() {
    //     alert("Success");
    //   },
    //   error: function() {
    //     alert('Failed!');
    //   },
    // })
  })
})


function analyzeUrl(uri) {
  var result = {
    isValid: false,
    hasVideoId: false,
    isVideo: false,
    isPlaylist: false,
    isImage: false
  };
  const VIDEO1PATHQUERYVALIDATIONPATTERN = /\/watch\?v\=([\w\d_-]{11})(&list\=[\w\d_-]{13}|)/igm;
  const VIDEO2PATHQUERYVALIDATIONPATTERN = /\/([\w\d_-]{11})$/igm;
  const PLAYLISTPATHQUERYVALIDATIONPATTERN = /\/playlist\?list=([\w\d_-]{34})$/igm;
  const VIDEO3PATHQUERYVALIDATIONPATTERN = /\/embed\/([\w\d_-]{11})$/igm;
  const IMAGEPATHQUERYVALIDATIONPATTERN = /\/vi\/([\w\d_-]{11})\/(0|1|2|3|default|hqdefault|mqdefault|sddefault|maxresdefault).jpg/igm;
  var url = document.createElement("a");
  url.href = uri;
  switch (url.hostname) {
    case "www.youtube.com":
    case "youtube.com":
    case "www.m.youtube.com":
    case "m.youtube.com":
      var match = VIDEO1PATHQUERYVALIDATIONPATTERN.exec(url.href);
      if (match != null) {
        result.isVideo = true;
        result.hasVideoId = true;
        if (match[2].length > 0) result.isPlaylist = true;
        result.isValid = true;
      } else {
        match = PLAYLISTPATHQUERYVALIDATIONPATTERN.exec(url.href);
        if (match != null) {
          result.isPlaylist = true;
          result.isValid = true;
        }
      }
      break;
    case "www.youtu.be":
    case "youtu.be":
      result.isVideo = true;
      var match = VIDEO2PATHQUERYVALIDATIONPATTERN.exec(url.href);
      if (match != null) {
        result.hasVideoId = true;
        if (match[2].length > 0) result.isPlaylist = true;
        result.isValid = true;
      }
      break;
    case "www.youtube-nocookie.com":
    case "youtube-nocookie.com":
      result.isVideo = true;
      var match = VIDEO3PATHQUERYVALIDATIONPATTERN.exec(url.href);
      if (match != null) {
        result.hasVideoId = true;
        if (match[2].length > 0) result.isPlaylist = true;
        result.isValid = true;
      }
      break;
    case "img.youtube.com":
    case "i.ytimg.com":
    case "i1.ytimg.com":
    case "i2.ytimg.com":
    case "i3.ytimg.com":
    case "i4.ytimg.com":
      result.isImage = true;
      var match = IMAGEPATHQUERYVALIDATIONPATTERN.exec(url.href);
      if (match != null) {
        result.hasVideoId = true;
        result.isValid = true;
      }
  }
  return result;
}

function extractVideoId(uri) {
  const REGEX = /(\/watch\?v=|\/embed\/|\/vi\/|\/)([\w\d_-]{11})/igm;
  var url = document.createElement("a");
  url.href = uri;
  return REGEX.exec(url.pathname + url.search)[2];
}

function extractPlaylistId(uri) {
  const REGEX1 = /&list\=([\w\d_-]{13})$/igm;
  const REGEX2 = /\?playlist\=([\w\d_-]{34})$/igm;
  var url = document.createElement("a");
  url.href = uri;
  var match = REGEX1.exec(url.search);
  if (match != null) return match[1];
  return REGEX2.exec(url.search)[1];
}
