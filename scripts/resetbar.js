function resetbar(){
	var content = document.getElementById('content');
	var nav = document.getElementById('nav');
	var contentstyle = content.currentStyle || window.getComputedStyle(content);
	var navstyle = nav.currentStyle || window.getComputedStyle(nav);
	if (parseInt(navstyle.height.replace(/px/,"")) < parseInt(contentstyle.height.replace(/px/,""))+130) {
		nav.style.height = content.clientHeight + parseInt(contentstyle.marginTop.replace(/px/,"")) + 50 + "px";
	}
}