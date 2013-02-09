(function(){

	var keys = document.querySelectorAll('a[href^="#key-"]');
	for(var i=0; i<keys.length; i++) {
		keys[i].addEventListener("click", function(e){
			e.preventDefault();
			var key = this.getAttribute("href").replace("#key-", "");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://hd1.freebox.fr/pub/remote_control?code=22830809&key=" + key, true);
			xhr.onload = function() {};
			xhr.send();
		});
	}

}());
