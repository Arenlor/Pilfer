/*
	Pilfer - A Firefox extension for searching for sequentially named images.
	Copyright (C) 2008 - 2010  Nicholas Ortenzio
	nicholas.ortenzio@gmail.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

var pilferUtilities = {

	'prompt' : Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService),

	createPilferBookmark : function() {
		var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI("chrome://pilfer/content/pilferViewer.html?pfa=%s", null, null);
		var bmid = PlacesUtils.bookmarks.insertBookmark(PlacesUtils.bookmarksMenuFolderId, uri, -1, 'Pilfer');
		PlacesUtils.bookmarks.setKeywordForBookmark(bmid, 'pilfer');
	},
		
	isProperContextType : function() {
		return ((gContextMenu.onImage) || (gContextMenu.onLink));
	},
		
	isImageLink : function(target) {
		return (target.toLowerCase().match(/\.(?:jpe?g|png|gif|bmp)/i)) ? true : false;
	},

	getParentDirectory : function(target) {
		// photobucket replace concept/code from firefusk. 
		var match = /(^.*\/)(?:.+)/.exec(target);
		return (match) ? match[1].replace(/(\w+)\.photobucket\.com/,"photobucket.com") : false;
	},		

	openImageDirectory : function(tar) {
		var dir = pilferUtilities.getParentDirectory(tar);
		if(dir) gBrowser.addTab(dir);
	},

	openPilferViewer : function(pfa) {
		if (pfa) gBrowser.getBrowserForTab(gBrowser.addTab("chrome://pilfer/content/pilferViewer.html?pfa="+encodeURIComponent(pfa)));		
	},		
		
	sendPrompt : function(title, text, val) {
		var input = {value: val};
		var check = {value: false};
		return (this.prompt.prompt(window, title, text, input, null, check)) ? input.value : false;
	},

	promptManual : function (target, title, question){
		return pilferUtilities.sendPrompt(title, question, target);
	},
	
	promptOther : function(target, direction, leading, title, question) {
		var range = pilferUtilities.sendPrompt(title, question, "0");
		if (!range) return;
		return pilferUtilities.getPilferFormattedAddress(target, parseInt(range, 10), direction, leading);
	},

	getContextTarget : function(parseQueryPref) {
		var target;
		if (gContextMenu.onImage) { target = gContextMenu.target.src; } 
		else if (gContextMenu.onLink) { target = gContextMenu.link; }
		
		var reg = (parseQueryPref) ? /(.*)/ : /(.*)\?.*/;

		var match = reg.exec(target);
		return (match) ? match[1] : target;
	},		
		
	getPilferFormattedAddress : function(target, range, direction, leading) {
		var match = target.match(/(\d+)\D*$/);
		if (!match) return;
		
		var direction = parseInt(direction, 10);
		var range = parseInt(range, 10);
		var deltaS = match[1];
		var deltaI = parseInt(match[1], 10);
		var alpha, omega;

		if (deltaS.substr(0,1) == 0) leading = true;

		switch (direction) {
			case 1:
				alpha = deltaI;
				omega = deltaI + range;
				break;
			case 2:
				alpha = deltaI - range;
				omega = deltaI;
				break;
			case 3:
				alpha = deltaI - range;
				omega = deltaI + range;
				break;
		}

		alpha = (alpha < 0) ? 0 : alpha;
		omega = (omega < 0) ? 0 : omega;

		if (leading) {
			var length = deltaS.length;
			while (alpha.toString().length < length) alpha = '0' + alpha;
			while (omega.toString().length < length) omega = '0' + omega;
		}

		return target.replace(/\d+(\D*)$/, '[' + alpha + '-' + omega + ']$1');
	},
};