/*
	Pilfer - A Firefox extension for searching for sequentially named images.
	Copyright (C) 2008 - 2010  Nicholas Ortenzio
	nicholas.ortenzio@gmail.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

var pilferGallery = {

  onLoad : function(e) {
    pilferGallery.addImageClickEvents();
    pilferGallery.addFrameClickEvents();
  },
  
  onClick : function(e) {     
    pilferGallery.buildImageFrame(this);
    document.getElementById("pilfer-gal-background").style.display = "block";
  },
    
  onClose : function(e) {
    document.getElementById("pilfer-gal-background").style.display = "none";
  },
  
  onNext : function(e) {
    var img = document.getElementById("pilfer-gal-imag");
    do { img = img.next } while(img.parentNode.style.display == 'none');
    pilferGallery.buildImageFrame(img);
  },
  
  onPrev : function(e) {
    var img = document.getElementById("pilfer-gal-imag");
    do { img = img.prev } while(img.parentNode.style.display == 'none');
    pilferGallery.buildImageFrame(img);
  },
    
  addImageClickEvents : function() {
    var imgs = document.getElementById('image-content').getElementsByTagName('img');
    var len = imgs.length;
    for (var x=0; x<len; ++x) {
      imgs[x].addEventListener('click', pilferGallery.onClick, false);
      imgs[x].next = (x == len-1) ? imgs[0] : imgs[x+1];
      imgs[x].prev = (x == 0) ? imgs[len-1] : imgs[x-1];      
    }
  },

  addFrameClickEvents : function() {      
    document.getElementById("pilfer-gal-clos").addEventListener('click', pilferGallery.onClose, false);    
    document.getElementById("pilfer-gal-prev").addEventListener('click', pilferGallery.onPrev, false);    
    document.getElementById("pilfer-gal-next").addEventListener('click', pilferGallery.onNext, false);    
    document.getElementById("pilfer-gal-imag").addEventListener('click', pilferGallery.onNext, false);    
  },
    
  buildImageFrame : function(curr) {      
    var img = document.getElementById("pilfer-gal-imag");
        img.src = curr.src;
        img.next = curr.next;
        img.prev = curr.prev;
		
	//prepare data
	availH=window.innerHeight - document.getElementById("pilfer-navigation").clientHeight - 80;
	availW=window.innerWidth - 50;

	img.removeAttribute("height");
	img.removeAttribute("width");	
	
	ratio=img.height/img.width;
	imgOrrigH = img.height;
	imgOrrigW = img.width;
	
	imgAdjH = imgOrrigH;
	imgAdjW = imgOrrigW;
	
	//Change image size to fit full screen
	if(availH != imgOrrigH )
	{
		imgAdjH = availH;
		imgAdjW = imgAdjH/ratio;
		if(availW < imgAdjW)
		{
			imgAdjW = availW;
			imgAdjH = imgAdjW * ratio;
		}
	}
	else if(availW != imgOrrigW)
	{
		imgAdjW = availW;
		imgAdjH = imgAdjW * ratio;
		if(availH < imgOrrigH )
		{
			imgAdjH = availH;
			imgAdjW = imgAdjH/ratio;
		}
	}
		
	// apply changes
	img.height = imgAdjH;
	img.width = imgAdjW;

    var name = document.getElementById("pilfer-gal-name");
        name.innerHTML = curr.src;
  },
  
};

window.addEventListener('load', pilferGallery.onLoad, false);