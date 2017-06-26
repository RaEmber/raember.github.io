---
layout: post
title: "Universal API key for YouTube?"
author: Raphael Emberger
description: "Some thoughts on the official YouTube Api"
tags: [youtube,api,key,c#]
ownstyles: [styleRed]
---

During studying the data YouTube sends to clients when programming my [YouTube downloader](/2017/06/23/youtube_downloader_1/#network_data), I noticed some calls to the official YouTube Api:

```
www.googleapis.com/youtube/v3/videos?id=DGilp8SwVXA&part=snippet,status,statistics&fields=items/id,items/snippet/title,items/snippet/channelId,items/status/privacyStatus,items/statistics/viewCount&key=AIzaSyA-dlBUjVQeuc4a6ZN4RkNUYDFddrVLxrA
```

What catched my eye was this key variable in the url. Why? Because I know that requests to the official Api have to provide an Api key for authentification and regulation. But even though I'm pretty sure that I never requested one for *my firefox client*, there's still an Api key somewhere on my system.

It turns out that there's an Api key stored in plain text in all the [`base.js` files](/2017/06/23/youtube_downloader_1/#base_js):

{% highlight js linenos %}
Vw = function(a, b, c, d) {
	g.$l(b, "key", "AIzaSyA-dlBUjVQeuc4a6ZN4RkNUYDFddrVLxrA");
	Lw(a, 2E3);
	var e = new g.jm(a);
	om(e, a, "success", function(a) {
		a = a.target;
		var b = a.g ? g.ng(a.g.responseText) : void 0;
		c(b || {});
		e.dispose();
		a.dispose()
	});
	om(e, a, ["error", "timeout"], function(a) {
		a = a.target;
		var b = null;
		0 != a.o && (b = Error(Ew(a.o)));
		d(b);
		e.dispose();
		a.dispose()
	});
	a.send(b)
};
{% endhighlight %}

*From the file <a target="_blank" href="https://www.youtube.com/yts/jsbin/player-vflPHG8dr/de_DE/base.js">https://www.youtube.com/yts/jsbin/player-vflPHG8dr/de_DE/base.js</a>*

This Api key here is universal and gets assigned all over the world and therefore probably isn't restricted to any quota limits. But since there are multiple `base.js` files(different paths), there are others too.

However, I'm pretty sure using this key is against <a target="_blank" href="https://developers.google.com/youtube/terms/api-services-terms-of-service-apac#usage-and-quotas">the agreement of YouTube Api services</a>:

>15\. **Usage and Quotas.** YouTube may set a quota on usage of any YouTube API Services at any time as applied to any specific YouTube API Services user or API Client, category of users or API Clients, or all users or API Clients. **You and your API Client(s) will not, and will not attempt to, exceed or circumvent use or quota restrictions**. YouTube may specify additional requirements relating to use or quotas including in the Developer Policies.

But it's still a bit unclear: If we use the Api key they gave us(which our browsers do anyway), is that still against the terms of service? And even if we use this key, it can hardly be called circumvention or exceeding quota restrictions(or an attempt to do so).
