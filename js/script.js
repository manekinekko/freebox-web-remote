/*jslint nomen:true,sloppy:false,plusplus:true,devel:true,validthis:true*/
/*globals document:true,localStorage:true,XMLHttpRequest:true*/
(function () {
	"use strict";

	function xhr(remote_id, key, onload, onerror) {
		var xhr_ = new XMLHttpRequest();
		xhr_.open("GET", "http://hd1.freebox.fr/pub/remote_control?code=" + remote_id + "&key=" + key, true);
		xhr_.onload = onload || function () {};
		xhr_.onerror = onerror || function () {};
		xhr_.send();
	}

	function check_remote_id(remote_id, onsuccess, onerror) {
		xhr(remote_id, "blue", function (e) {
			(200===this.status) ? onsuccess(remote_id) : onerror();
		});
	}

	function store_remote_id() {
		var value = this.value;
		var cc = document.querySelector('.control-group');
		check_remote_id(value, function(){
			localStorage.setItem('remote_id', value);
			cc.classList.add('success');
			cc.classList.remove('error');
		}, function (){
			cc.classList.remove('success');
			cc.classList.add('error');
		});
	}

	function send_xhr(e) {
		e.preventDefault();
		var remote_id = localStorage.getItem('remote_id'),
			key = this.getAttribute("href");
			key = key.replace("#key-", "");
		xhr(remote_id, key);
	}

	var i,
		remote_id_dom = document.querySelector('#remote-id'),
		keys_dom = document.querySelectorAll('a[href^="#key-"]');
	remote_id_dom.value = localStorage.getItem('remote_id')  || "";
	remote_id_dom.addEventListener('keyup', store_remote_id);
	remote_id_dom.addEventListener('change', store_remote_id);

	for (i = 0; i < keys_dom.length; i++) {
		keys_dom[i].addEventListener("click", send_xhr);
	}

}());
