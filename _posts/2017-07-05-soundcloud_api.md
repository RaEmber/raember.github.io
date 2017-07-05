---
layout: post
title: "Universal API key for SoundCloud?"
author: Raphael Emberger
description: "Some thoughts on the official SoundCloud Api"
tags: [soundcloud,api,api-key]
ownstyles: [styleSand]
---

After finding out that [YouTube gives away free and unrestricted Api keys](/2017/06/26/youtube_api/), I thought "Maybe it's not only YouTube doing this. What about other platforms? Like SoundCloud?". And as it turns out: SoundCloud makes pretty much the same thing.

After navigating to a song(in my case <a target="\_blank" href="https://soundcloud.com/nettwerkmusicgroup/the-paper-kites-bloom-bonus">The Paper Kites - Bloom (Bonus Track)</a>) SoundCloud the browser sends a GET request to the official SoundCloud Api:

```
https://api-v2.soundcloud.com/tracks/99417762/related?anon_user_id=52548110&client_id=2t9loNQH90kzJcsFCODdigxfp325aq4z&limit=10&offset=0&linked_partitioning=1&app_version=1499251324
```

So I concluded that this `client_id` has to be somewhere. If one searches the html document, one will find a Json string like this in the embedded JavaScript:

{% highlight json %}
{
	"1": "assets/views-53d81ca-0ddd2e9-3.js",
	"2": "assets/app-2b94525-16633a7-3.js",
	"3": "assets/views-al-134e1aa-0ddd2e9-3.js",
	"4": "assets/lib-dc251f1-f7e252d-3.js",
	"5": "assets/5-0758946-7ae9fa8-3.js",
	"6": "assets/6-5104119-1365612-3.js",
	"7": "assets/7-6caf322-887eb04-3.js",
	"8": "assets/8-b88682e-d8e9ca3-3.js",
	"9": "assets/9-730835a-538a881-3.js",
	"10": "assets/10-f42d613-7ae9fa8-3.js",
	"11": "assets/11-315717c-0ddd2e9-3.js",
	"12": "assets/12-bd42a23-7ae9fa8-3.js",
	"13": "assets/13-ee17569-7ae9fa8-3.js",
	"14": "assets/14-c946214-7ae9fa8-3.js",
	"15": "assets/15-d6c23b7-0dba61b-3.js",
	"16": "assets/16-d6bed87-22cf4f3-3.js",
	"17": "assets/17-475a0ac-22cf4f3-3.js",
	"18": "assets/18-bd0ab90-ee49501-3.js",
	"19": "assets/19-bb17fa6-c9fff8d-3.js",
	"20": "assets/20-5393136-1fa1fa3-3.js",
	"21": "assets/21-a85e352-b9f5777-3.js",
	"22": "assets/22-22390b1-d8e9ca3-3.js",
	"23": "assets/23-ea4b84d-7ae9fa8-3.js",
	"24": "assets/24-504d3be-674c7b7-3.js",
	"25": "assets/25-e1e76d5-9c58d73-3.js",
	"26": "assets/26-8608db0-9c58d73-3.js",
	"27": "assets/27-bd998ba-e57f56a-3.js",
	"28": "assets/28-389e6b0-674c7b7-3.js",
	"29": "assets/29-35c649b-5d352f7-3.js",
	"30": "assets/30-b65f388-217bc6b-3.js",
	"31": "assets/31-acc5952-1099a84-3.js",
	"32": "assets/32-db4a96e-a5dcc4b-3.js",
	"33": "assets/33-dfe6810-1365612-3.js",
	"34": "assets/34-7cdac20-99c40b9-3.js",
	"35": "assets/35-5ea1dcd-9f3f7fa-3.js",
	"36": "assets/36-4008bd7-c8f7349-3.js",
	"37": "assets/37-dd6ddc0-1b9d729-3.js",
	"38": "assets/38-08a9771-5809d94-3.js",
	"39": "assets/39-338c982-7ae9fa8-3.js",
	"40": "assets/40-aefc550-db778d9-3.js",
	"41": "assets/41-4fe57ea-9f3f7fa-3.js",
	"42": "assets/42-cf40adb-11356d5-3.js",
	"43": "assets/43-b193429-9f3f7fa-3.js",
	"44": "assets/44-be1803c-ca4be05-3.js",
	"45": "assets/45-cadb9ea-c97be83-3.js",
	"46": "assets/46-4888201-c0b6f17-3.js"
}
{% endhighlight %}

And in the first JavaScript file beginning with `app-`(in this case `assets/app-2b94525-16633a7-3.js`) there's another interesting JavaScript(not Json) object:

{% highlight js %}
n(3).each({
	app_id: 1e3 * String(Date.now()).substr(-8) + Math.floor(1e3 * Math.random()),
	app_version: null,
	public_api_host: "https://api.soundcloud.com/",
	api_v2_host: "https://api-v2.soundcloud.com/",
	auth_ui_host: "https://secure.soundcloud.com/",
	client_application_id: 46941,
	client_id: "2t9loNQH90kzJcsFCODdigxfp325aq4z",
	eventlogger_tracking_url: "https://l9bjkkhaycw6f8f4.soundcloud.com",
	experiments: null,
	geoip: null,
	airbrake_project_key: "04b3f291e3db982608ca3611c0e3f6fe",
	airbrake_project_id: "129825",
	fb_app_id: "19507961798",
	google_client_id: "984739005367.apps.googleusercontent.com",
	recaptcha_public_key: "6LeABsUSAAAAABLOEF92U0unfhlGLynYlhvJRFue",
	adyen_url: "https://test.adyen.com/hpp/cse/js/7814235253800464.shtml",
	playHistoryLength: 50,
	maxComments: 200,
	me: null,
	mixi_api_key: "1403ed11563185e9cff6cfeedf4f2ecf77fa459e",
	notifications: null,
	notificationsUri: "wss://pushers.soundcloud.com/",
	oauth_token: null,
	preferFlashAudio: !0,
	promotedContentServer: "https://promoted.soundcloud.com/promo",
	promotedContentAccessToken: "web",
	rubiconPartnerCode: 16386,
	restoreToSound: null,
	rollouts: null,
	router: null,
	songkick_api_key: "ZWsLr2h7FF5sHG54",
	facebook_api_key: "a7309b9a9a85963579f7e8bcffd36d2a",
	versionUpdateInterval: 36e5,
	visualsQueueHost: "https://visuals-queue.soundcloud.com/visuals",
	wisHost: "https://wis.sndcdn.com",
	systemUserId: 193
}, function(e, t) {
	i.set(t, e, {
		silent: !0
	})
})
{% endhighlight %}

Obviously there are several api keys at our browsers disposal, but only `client_id` is the one intended for the use of the official SoundCloud Api.

Now we have our Api key and can freely access the SoundCloud Api. Keep in mind though that exploiting this *might* <a target="\_blank" href="https://developers.soundcloud.com/docs/api/terms-of-use#quotas">terms of use</a>:

> We reserve the right, at our discretion, to impose restrictions and limitations on the number and frequency of calls made by your app to the SoundCloud® API. **You must not attempt to circumvent any restrictions or limitations that we impose.** Presently, API calls are limited to 15,000 per app per day.
