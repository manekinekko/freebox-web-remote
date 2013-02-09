(function(){

	function store_remote_id (){
		localStorage.setItem('remote_id', this.value);
	};

	var remote_id_dom = document.querySelector('#remote-id');
	remote_id_dom.value = localStorage.getItem('remote_id')  || "";
	remote_id_dom.addEventListener('keyup', store_remote_id);
	remote_id_dom.addEventListener('change', store_remote_id);

	var keys_dom = document.querySelectorAll('a[href^="#key-"]');
	for(var i=0; i<keys_dom.length; i++) {
		keys_dom[i].addEventListener("click", function(e){
			e.preventDefault();
			var remote_id = localStorage.getItem('remote_id'); //22830809;
			var key = this.getAttribute("href").replace("#key-", "");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://hd1.freebox.fr/pub/remote_control?code=" + remote_id + "&key=" + key, true);
			xhr.onload = function() {};
			xhr.send();
		});
	};

}());
