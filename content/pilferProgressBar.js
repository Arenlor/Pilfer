/*
	Pilfer - A Firefox extension for searching for sequentially named images.
	Copyright (C) 2008 - 2010  Nicholas Ortenzio
	nicholas.ortenzio@gmail.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

var pilferProgressBar = {

	initialize : function (stepCount, blockCount, containerElement) {
		this.stepCount = stepCount;
		this.currentStep = 0;
		this.blockCount = blockCount;
		this.blockArray = [];
		this.currentBlock = -1;
		this.containerElement = containerElement;

		pilferProgressBar.create();
	},

	increment : function() {
		this.currentStep++;
		var nextBlock = Math.floor((this.currentStep / this.stepCount) * this.blockCount);
		if (nextBlock > this.currentBlock) 
		{
			for (var bl = (this.currentBlock < 0 ? 0 : this.currentBlock);  bl < nextBlock; bl++ )
			{
				this.blockArray[bl].style.backgroundColor = "#ffffff";
			}
			this.currentBlock = nextBlock;
		}
	},

	create : function() {
		var div = document.createElement('div');
		div.id = 'pilfer-progress-bar';

		for (var x=0; x<this.blockCount; ++x) {
			var block = document.createElement('div');
			div.appendChild(block);
			this.blockArray.push(block);
		}
		
		document.getElementById(this.containerElement).appendChild(div);
	},

}