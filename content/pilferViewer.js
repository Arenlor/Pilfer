/*
	Pilfer - A Firefox extension for searching for sequentially named images.
	Copyright (C) 2008 - 2010  Nicholas Ortenzio
	nicholas.ortenzio@gmail.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

$(function() {

  // Get PFA from document location
  var pfa = document.location.href.match(/pfa=(.*)$/);
      pfa = (pfa) ? decodeURIComponent(pfa[1]) : null;
 
  if (!pfa) return;

  // Set Document Title
	document.title = 'pilfer: ' + pfa;

  // Detoken Pilfer Formatted Address into array of urls
  var urls = pilferEngine.detoken([pfa]);

  if (!urls) return;

  // DOM nodes
  var $navfirst = $("#nav_first");
  var $navlast = $("#nav_last");
  var $content = $("#image_content");
  var $completed = $("#completed");

  // Some useful variables
  var completed = 0;
  var length = urls.length;
  var first = urls[0]; 
  var last = urls[length-1];
  
	// Create the pages navigation bar from Pilfer Array
  $navfirst.attr('href', first).html(first);
  $navlast.attr('href', last).html(last);

  // increment percentage
  var increment = function(){
    completed++;
    var percent = ~~(completed/length*100)
    $completed.html(percent + "%");
  };

  // image load successful event handler
  var onLoad = function(e){
    increment();
    var $div = $('<div />').append(e.target).append('<span>' + e.target.src.substr(e.target.src.lastIndexOf('/')+1) +'</span>')
    $content.append($div);
  };

  // image load unsuccessful event handler
  var onError = function(e){
    increment();
  };
 
  requests = [];

  // XHR
  var ajaxImage = function(i,url) {
	requests[i] = [{ url:url, time:(new Date()).getTime() }];

	var xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, true);	
	xhr.onreadystatechange = function(){
		var obj = {time:(new Date()).getTime(), state:xhr.readyState, status:xhr.status}
		if (xhr.status==404) { increment(); obj.abort=true; xhr.abort();}
		requests[i].push(obj);
		if (xhr.status==200 && xhr.readyState==4) {
			var $img = $('<img />').attr('src', url);
			var $div = $('<div />').append($img).append('<span>' + url.substr(url.lastIndexOf('/')+1) +'</span>')
		}
		$content.append($div);
		increment();
	}
	
	xhr.send()
  };
  
  // Create Image tags
  $.each(urls, function(i,n) { 
	ajaxImage(i,n);  
  });

})