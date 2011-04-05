/*
	Pilfer - A Firefox extension for searching for sequentially named images.
	Copyright (C) 2008 - 2010  Nicholas Ortenzio
	nicholas.ortenzio@gmail.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

var pilferEngine = {

	detoken : function(pfa) {
		return this.detokenAlpha(this.detokenNumeric(pfa))
	},

	detokenNumeric : function(pfa) {
		var arr = [];

		for (var i in pfa) {
			var matches = /.*(\[(\d+)-(\d+)\]).*/.exec(pfa[i]); 
			if (!matches) return pfa;

			var range = [parseInt(matches[2],10), parseInt(matches[3],10)];
			for (var x=range[0]; x<=range[1]; ++x) {
				var y = x + '';
				while (y.length<matches[2].toString().length){ y = '0' + y; }
				arr.push(pfa[i].replace(/(.*)(\[\d+-\d+\])(.*)/, '$1' + y + '$3'));
			}
		}

		return this.detokenNumeric(arr);
	},

	detokenAlpha : function(pfa) {
		var arr = [];

		for (var i in pfa) {
			var matches = /(.*)\[([a-zA-Z])-([a-zA-Z])\](.*)/.exec(pfa[i]);	
			if (!matches) return pfa;
		
			var range = [this.ALPHABET.indexOf(matches[2]), this.ALPHABET.indexOf(matches[3])];
			for (var x=range[0]; x<=range[1]; ++x) {
				arr.push(pfa[i].replace(/(.*)\[([a-zA-Z]-[a-zA-Z])\](.*)/, '$1' + this.ALPHABET[x] + '$3'));
			}
		}

		return this.detokenAlpha(arr);
	},

	ALPHABET : [
		'a','b','c','d','e','f','g','h','i','j','k','l','m',
		'n','o','p','q','r','s','t','u','v','w','x','y','z',
		'A','B','C','D','E','F','G','H','I','J','K','L','M',
		'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
	],

};
