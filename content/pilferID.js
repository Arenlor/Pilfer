/*
	Pilfer - A Firefox extension for searching for sequentially named images.
	Copyright (C) 2008 - 2010  Nicholas Ortenzio
	nicholas.ortenzio@gmail.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

var pilferID = {
	ffContext			: 'contentAreaContextMenu',
		
	overlay				: 'pilfer-overlay-root',
	strings				: 'pilfer-overlay-strings',
	
	context 			: 'pilfer-context-root',
	quicknode 			: 'pilfer-context-quicknode',
	
	plusminus 			: 'pilfer-context-plusminus',
	plus 				: 'pilfer-context-plus',
	minus 				: 'pilfer-context-minus',

	bothPop 			: 'pilfer-context-plusminus-pop',
	plusPop 			: 'pilfer-context-plus-pop',
	minusPop 			: 'pilfer-context-minus-pop',
	
	bothOther 			: 'pilfer-context-plusminus-other',
	plusOther			: 'pilfer-context-plus-other',
	minusOther			: 'pilfer-context-minus-other',
	
	manual 				: 'pilfer-context-manual',
	custom 				: 'pilfer-context-custom', 
	customPop			: 'pilfer-context-custom-pop',
	directory			: 'pilfer-context-directory',
	leading				: 'pilfer-context-leading',
	parseQuery			: 'pilfer-context-parse',

	quickPref 			: "extensions.pilfer.quicknode",
	leadingPref 		: "extensions.pilfer.leading",
	parsePref			: "extensions.pilfer.parseQuery",
	customPref			: "extensions.pilfer.customJSON",
	rangePref			: "extensions.pilfer.rangeJSON",
	custAltPref   		: "extensions.pilfer.haveCustomItemsChanged",
	rangeAltPref  		: "extensions.pilfer.haveRangeItemsChanged"  
};