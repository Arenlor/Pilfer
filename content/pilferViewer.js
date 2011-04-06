/*
	Pilfer - A Firefox extension for searching for sequentially named images.
	Copyright (C) 2008 - 2010  Nicholas Ortenzio
	nicholas.ortenzio@gmail.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

var pilferViewer = {

	onLoad : function() {
		var pfa = pilferViewer.getPFAfromAddress();
			if (!pfa) return;
		pilferViewer.setPageTitle(pfa);

		var arr = pilferEngine.detoken([pfa]);
			if (!arr) return;
		pilferViewer.createNavigationBar(arr);
		pilferViewer.createProgressBar(arr.length);
		pilferViewer.createImageTags(arr);
	},	
	
	// Get the PFA from the pages query string
	// photobucket replacement curteousy of Firefusk
	getPFAfromAddress : function() {
			var url = window.location.href.match(/pfa=(.*)$/);
			return (url) ? decodeURIComponent(url[1]).replace(/(\w+)\.photobucket\.com/,"photobucket.com") : null;
	},

	setPageTitle : function (pfa) {
		document.title = 'pilfer: ' + pfa;
	},
	
	// Create the pages navigation bar from Pilfer Array
	createNavigationBar : function (arr) {
		document.getElementById('first-url').innerHTML = arr[0].link(arr[0]);
		document.getElementById('last-url').innerHTML = arr[arr.length-1].link(arr[arr.length-1]);
	},
		
	// Create the progress bar for pilferViewer
	// <int>steps - the amount of times 'increment' should be called
	// to reach 100%; the full range of the pilfer array
	createProgressBar : function(steps) {
		pilferProgressBar.initialize(steps, 50, 'progress-container');
	},

	// Create Images tags from Pilfer Array
	createImageTags : function(arr) {   
		for (var x=0; x<arr.length; ++x){
			var img = new Image();
			img.src = arr[x];
			img.addEventListener('load', pilferViewer.onImageLoad, false);

			img.addEventListener('load', function(e){pilferProgressBar.increment()}, false);
			img.addEventListener('error',  function(e){pilferProgressBar.increment()}, false);
		}
	},
	
	// On Image Load event, append the element to the page
	// and increment progress bar
	onImageLoad : function(e) {		
		var imageContentDiv = document.getElementById('image-content');
		var div = document.createElement('div');

		div.appendChild(e.target);
		div.appendChild(document.createElement('br'));
		div.appendChild(document.createTextNode(e.target.src.substr(e.target.src.lastIndexOf('/')+1)));

		imageContentDiv.appendChild(div);
	},
		
};