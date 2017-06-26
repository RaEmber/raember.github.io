---
layout: post
title: "Downloading YouTube videos"
author: Raphael Emberger
description: "Inner workings of YouTube revealed from the outside. Sort of..."
tags: [youtube,download,c#,itag]
ownstyles: [styleRed]
---

# Why yet another YouTube downloader?
I started studying computer science and gained a lot of valuable skills which lead me to further understand how YouTube transfers data between server and client. Before starting majoring in CS I already built a YouTube downloader once and it worked fine back then. However, it was horrible. I crammed all my classes into one big file back then which had almost 8000 lines of code - not that much(for a total at least - I'm not talking about the fact that I had that all in just one file), but for the unexperienced me back then still a rather big amount. But that sin pales in comparison to my coding style: I had extremely tight coupling because I loved having very finely defined parameters instead of having parameters with high level of compatibility. To clarify: I had methods like:

{% highlight vb linenos %}
Public Async Function Download(IHasDownloadableFilePath downloadable) As Task<Mp3File>
    'Download file
End Function
{% endhighlight %}

So I figured reprogramming it with my new knowledge could be a good thing.

**TL;DR:** Because I can.

# So, how does YouTube work now?
Exactly. "now". That's the point. I'm definitely not the only one programming a YouTube downloader and one of the challenges is **maintainability**. But we'll come to that later.

## Figuring out how the website works
Grab yourself your web browser of trust and open a new tab. Navigate to [YouTube](https://www.youtube.com/) and search for "Cutest Cats Compilation 2017 | Best Cute Cat Videos Ever"(Trust me with this - it'll work). In case you're as lazy as I am: [Here](https://www.youtube.com/watch?v=rNSnfXl1ZjU)'s the link.

Watch the video 5-6 times(important!), then open up the developer tools and change to a view which shows you the network traffic of this very tab. Maybe you'll have to reload the page to clear the previous entries. Now you should see entries like:

<a name="network_data"></a>

| Status | Method | Domain                                | File                                                                                |
|:------:| ------ | -------------------------------------:|:----------------------------------------------------------------------------------- |
| 200    | GET    | www.youtube.com                       | /watch?v=rNSnfXl1ZjU                                                                |
| 200    | POST   | www.youtube.com                       | /youtubei/v1/log_event?alt=json&key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8         |
| 499    | GET    | s.youtube.com                         | /api/stats/watchtime?ns=yt&el=detailpage&cpn=GS_JfBXhmDuUP4B-&docid=rNSnfXl1ZjU&... |
| 499    | GET    | s.youtube.com                         | /api/stats/qoe?event=streamingstats&fmt=248&afmt=251&cpn=GS_JfBXhmDuUP4B-&...       |
| 304    | GET    | www.youtube.com                       | /yts/cssbin/www-core-vflEw3T4V.css                                                  |
| 200    | GET    | www.youtube.com                       | /yts/jsbin/scheduler-vflFMss6b/scheduler.js                                         |
| 304    | GET    | www.youtube.com                       | /yts/jsbin/player-vflmgXZN3/de_DE/base.js                                           |
| 304    | GET    | www.youtube.com                       | /yts/cssbin/player-vfldNZ2yp/www-player.css                                         |
| 304    | GET    | www.youtube.com                       | /yts/cssbin/www-pageframe-vflvmMK_J.css                                             |
| 304    | GET    | www.youtube.com                       | /yts/cssbin/www-watch-transcript-vflp9_n_i.css                                      |
| 304    | GET    | www.youtube.com                       | /yts/img/pixel-vfl3z5WfW.gif                                                        |
| 304    | GET    | yt3.ggpht.com                         | /.../photo.jpg                                                                      |
| 200    | GET    | www.youtube.com                       | /yts/jsbin/spf-vflktUosI/spf.js                                                     |
| 304    | GET    | www.youtube.com                       | /yts/jsbin/www-en_US-vflNi-csa/base.js                                              |
| 204    | GET    | r7---sn-nfpnnjvh-9anz.googlevideo.com | /generate_204?conn2                                                                 |
| 204    | GET    | r7---sn-nfpnnjvh-9anz.googlevideo.com | /generate_204                                                                       |
| 499    | GET    | s.youtube.com                         | /api/stats/qoe?event=streamingstats&fmt=248&afmt=251&cpn=rV7I2hNtggAhESMv&...       |
| 200    | GET    | r7---sn-nfpnnjvh-9anz.googlevideo.com | /videoplayback?itag=248&ipbits=0&signature=...                                      |
| 200    | GET    | r7---sn-nfpnnjvh-9anz.googlevideo.com | /videoplayback?itag=251&ipbits=0&signature=...                                      |
| 200    | GET    | s.ytimg.com                           | /yts/imgbin/www-hitchhiker-vfl-Nn88d.png                                            |
| 200    | GET    | s.ytimg.com                           | /yts/img/icn_loading_animated-vflff1Mjj.gif                                         |
| 304    | GET    | www.youtube.com                       | /yts/jsbin/player-vflmgXZN3/de_DE/captions.js                                       |
| 304    | GET    | www.youtube.com                       | /yts/jsbin/player-vflmgXZN3/de_DE/endscreen.js                                      |
| 304    | GET    | www.youtube.com                       | /yts/jsbin/player-vflmgXZN3/de_DE/annotations_module.js                             |
| 304    | GET    | www.youtube.com                       | /yts/jsbin/player-vflmgXZN3/de_DE/remote.js                                         |
| 304    | GET    | www.youtube.com                       | /yts/jsbin/player-vflmgXZN3/de_DE/annotations_module.js                             |
| 499    | GET    | www.youtube.com                       | /api/stats/ads?ver=2&ns=1&event=5&device=1&content_v=rNSnfXl1ZjU&el=detailpageP&... |
| 200    | GET    | www.googleapis.com                    | /youtube/v3/videos?id=DGilp8SwVXA&part=snippet,status,statistics&...                |
| 200    | GET    | www.youtube.com                       | /get_video_metadata?video_id=DGilp8SwVXA&html5=1&page_subscribe=0&authuser=0        |
| 304    | GET    | i1.ytimg.com                          | /vi/rNSnfXl1ZjU/mqdefault.jpg                                                       |
| 499    | GET    | www.youtube.com                       | /api/stats/ads?ver=2&ns=1&event=5&device=1&content_v=rNSnfXl1ZjU&...                |
| 200    | POST   | www.youtube.com                       | /annotations_invideo?cap_hist=1&video_id=rNSnfXl1ZjU&client=1&...                   |
| 204    | POST   | www.youtube.com                       | /get_endscreen?v=rNSnfXl1ZjU&ei=SDZOWdSuNMWmWKy5jLAP&client=1                       |
| 304    | GET    | www.youtube.com                       | /mac_204?action_fcts=1                                                              |
| 200    | GET    | r7---sn-nfpnnjvh-9anz.googlevideo.com | /videoplayback?itag=248&ipbits=0&signature=...                                      |
| 204    | GET    | s.youtube.com                         | /api/stats/playback?ns=yt&el=detailpage&cpn=rV7I2hNtggAhESMv&docid=rNSnfXl1ZjU&...  |
| 499    | GET    | www.youtube.com                       | /ptracking?html5=1&video_id=rNSnfXl1ZjU&cpn=rV7I2hNtggAhESMv&plid=...               |
| 200    | GET    | r7---sn-nfpnnjvh-9anz.googlevideo.com | /videoplayback?itag=251&ipbits=0&signature=...                                      |
| 200    | GET    | yt3.ggpht.com                         | /proxy/_b7z2mMA2Pu7_OvgnFQpciztYnnWR3c6r7yxU8UhwUOnSvFooNPP3ILI9...                 |
| 200    | GET    | yt3.ggpht.com                         | /proxy/P7rR4kPFGWDO7-1De2dy0dt6LsxYjKiEAR3QBU6KF8uOr0y4zcUb-Codg...                 |
| 200    | GET    | yt3.ggpht.com                         | /proxy/qDqcmyBYm6z6nH2PHKUAgQq3HgZRAJ2yJ1Z4JyAUQH4YmlCeFATtjVp2e...                 |
| 200    | GET    | yt3.ggpht.com                         | /proxy/2r2ORz4a8RzuPT3jMWIXY2Too0wzVwIvQEi8RJoZCPcfaMWscT3lS1jLc...                 |

Now, those requests interesting to us are the video playbacks which normally go to the nearest stream server. In my case that was `r7---sn-nfpnnjvh-9anz.googlevideo.com`. The request goes to `/videoplayback` with the following queries:

| Query       | Value                                                                                                    |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| itag        | 248                                                                                                      |
| ipbits      | 0                                                                                                        |
| signature   | 433FE0E9FF5840DBF0F3F0B36850FAEFE87C9871.B996B69BC9875122EC16D5F518BD1571C4EBB9AA                        |
| ms          | au                                                                                                       |
| mv          | m                                                                                                        |
| mt          | 1498297837                                                                                               |
| keepalive   | yes                                                                                                      |
| source      | youtube                                                                                                  |
| requiressl  | yes                                                                                                      |
| clen        | 177291236                                                                                                |
| key         | yt6                                                                                                      |
| mn          | sn-nfpnnjvh-9anz                                                                                         |
| mm          | 31                                                                                                       |
| ei          | SDZOWdSuNMWmWKy5jLAP                                                                                     |
| id          | o-AJL6xVtQH6NhA7g0PkCTaxNiOjSV2rmWpEDfaN5Pmuym                                                           |
| initcwndbps | 6528750                                                                                                  |
| mime        | video/webm                                                                                               |
| lmt         | 1490303207744796                                                                                         |
| ip          | *IPv4/IPv6 address of client*                                                                            |
| sparams     | clen,dur,ei,gir,id,initcwndbps,ip,ipbits,itag,keepalive,lmt,mime,mm,mn,ms,mv,pl,requiressl,source,expire |
| gir         | yes                                                                                                      |
| expire      | 1498319529                                                                                               |
| dur         | 614.833                                                                                                  |
| pl          | 45                                                                                                       |
| alr         | yes                                                                                                      |
| ratebypass  | yes                                                                                                      |
| cpn         | rV7I2hNtggAhESMv                                                                                         |
| c           | WEB                                                                                                      |
| cver        | 1.20170622                                                                                               |
| range       | 0-766271                                                                                                 |
| rn          | 0                                                                                                        |
| rbuf        | 0                                                                                                        |

I go into greater detail about all of those queries in [another post](/2017/06/24/youtube_formats/).

What is important however, is that we distinguish between various formats via their `itag`'s. Let's find out where this information comes from, shall we? It turns out, there's a big Json object in the main html file which contains all these format information in `args.adaptive_fmts` and `args.url_encoded_fmt_stream_map`. Here's the one from the example above:

| Key                | Value |
| ------------------ | ----- |
| url                | *too long*
| itag               | 248
| bitrate            | 3055840
| size               | 1920x1080
| lmt                | 1490303207744796
| type               | video/webm; codecs="vp9"
| init               | 0-242
| projection_type    | 1
| xtags              |
| index              | 243-2311
| clen               | 177291236
| fps                | 30
| quality_label      | 1080p

url: `https://r7---sn-nfpnnjvh-9anz.googlevideo.com/videoplayback?itag=248&ipbits=0&signature=433FE0E9FF5840DBF0F3F0B36850FAEFE87C9871.B996B69BC9875122EC16D5F518BD1571C4EBB9AA&ms=au&mv=m&mt=1498297837&keepalive=yes&source=youtube&requiressl=yes&clen=177291236&key=yt6&mn=sn-nfpnnjvh-9anz&mm=31&ei=SDZOWdSuNMWmWKy5jLAP&id=o-AJL6xVtQH6NhA7g0PkCTaxNiOjSV2rmWpEDfaN5Pmuym&initcwndbps=6528750&mime=video%2Fwebm&lmt=1490303207744796&ip=XXXX&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&gir=yes&expire=1498319529&dur=614.833&pl=45`

Again: What those keys and values mean is something I address in [another post](/2017/06/24/youtube_formats/). Now, to make this download link work, we have to add a `&ratebypass=yes` query and we're done.

<a name="base_js"></a>At least in this simple case. Most of the times we have to deal with formats having an `s`-key with a value that resembles a signature. However, we can't just add it to our download link - we have do some manipulation on it to turn it into a valid signature. This is where it gets nasty, because the algorithm to *decipher* this string is in a JavaScript file named `base.js` which is shortened and therefore barely readable. It's exact path can be found in the Json object at `assets.js`. In there, one can find a call which sets the `signature` to the result of another method call:

{% highlight js %}
.set("signature",yE(c)
{% endhighlight %}

This method can look different for every version of `base.js`. This one for example looks like this:

{% highlight js linenos %}
yE = function(a) {
	a = a.split("");
	xE.hI(a, 2);
	xE.iF(a, 33);
	xE.iF(a, 16);
	xE.iF(a, 44);
	xE.hI(a, 1);
	xE.iF(a, 12);
	xE.dy(a, 23);
	xE.iF(a, 19);
	return a.join("")
};
{% endhighlight %}

We have three different methods here. One splices, one reverses and the last one swaps chars of the `s`-array. To find out which one does what, we have to identify them. In this case, the setup is as follows:

{% highlight js linenos %}
var xE = {
	dy: function(a) {
		a.reverse()
	},
	hI: function(a, b) {
		a.splice(0, b)
	},
	iF: function(a, b) {
		var c = a[0];
		a[0] = a[b % a.length];
		a[b] = c
	}
};
{% endhighlight %}

Now it is pretty much clear which one does what. Now we can rebuild this function `yE` and finally get our `signature` query complete.

---

So that's basically how you get to the download link. As I already mentioned in the beginning, I'm currently programming the whole thing and you can find the repository [here](https://github.com/RaEmber/youtuber).
