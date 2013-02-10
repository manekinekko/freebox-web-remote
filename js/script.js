/*jslint nomen:true,sloppy:false,plusplus:true,devel:true,validthis:true*/
/*globals document:true,localStorage:true,XMLHttpRequest:true*/
(function () {
	'use strict';

	var long_press_timer = null, long_press_delay = null;

	function send_xhr(remote_id, key, onload, onerror) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://hd1.freebox.fr/pub/remote_control?code=' + remote_id + '&key=' + key, true);
		xhr.onload = onload || function () {};
		xhr.onerror = onerror || function () {};
		xhr.send();
	}

	function check_remote_id(remote_id, onsuccess, onerror) {
		xhr(remote_id, 'blue', function (e) {
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

	function run_key(e) {
		e.preventDefault();
		var long_keys = ['vol_inc', 'vol_dec', 'up', 'down', 'left', 'right'],
			remote_id = localStorage.getItem('remote_id'),
			key = this.getAttribute('data-key');

		send_xhr(remote_id, key);

		if (long_keys.indexOf(key) != -1) {
			long_press_delay = setTimeout(function () {
				long_press_timer = setInterval(function () {
					send_xhr(remote_id, key);
				}, 250);
			}, 250);
		}

	}

	function clear_long_press() {
		clearInterval(long_press_timer);
		clearTimeout(long_press_delay);
	}

	(function init () {
		var i,
		remote_id_dom = document.querySelector('#remote-id'),
		keys_dom = document.querySelectorAll('a[data-key]');
		remote_id_dom.value = localStorage.getItem('remote_id')  || '';
		remote_id_dom.addEventListener('keyup', store_remote_id);
		remote_id_dom.addEventListener('change', store_remote_id);

		for (i = 0; i < keys_dom.length; i++) {
			keys_dom[i].addEventListener('mousedown', run_key);
			keys_dom[i].addEventListener('mouseup', clear_long_press);
		}
	}());

}());
