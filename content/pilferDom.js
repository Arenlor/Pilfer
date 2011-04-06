pilfer.dom = {

  openPilferViewer : function(pfa) {
    gBrowser.getBrowserForTab(gBrowser.addTab("chrome://pilfer/content/pilferViewer.html?pfa="+encodeURIComponent(pfa)));
  },

	populateCustomMenus : function() { 
    pilfer.dom.clearCustomMenus();

		var arr = pilfer.preferences.custom();
		var custom = pilfer.elements.custom;
    
		for (var i=0; i<arr.length; ++i) {
			var m = document.createElement('menuitem');
			m.setAttribute('label', arr[i][1]);
			m.setAttribute('description', arr[i][0]);
			m.setAttribute('oncommand', 'pilfer.events.onCustomCommand(event, "' + arr[i][1] + '")');
			custom.appendChild(m);
		}
	},

  populateRangeMenus : function() {
    pilfer.dom.clearRangeMenus();

    var arr = pilfer.preferences.range();

    var ranges = [
      pilfer.elements.plus,
      pilfer.elements.minus,
      pilfer.elements.plusminus
    ];

    for (var i=0; i<ranges.length; ++i) {
      Application.console.log(ranges[i].getAttribute("label"));      
      for (var j=0; j<arr.length; ++j) {
        var m = document.createElement('menuitem');
        m.setAttribute('label', arr[j]);
				m.setAttribute('oncommand', 'pilfer.events.onRangeCommand(event, ' + arr[j] + ', ' + (i+1) + ')');
        ranges[i].appendChild(m);
      }
    }
  },

  clearCustomMenus : function() {
		var custom = pilfer.elements.custom;
    while(custom.hasChildNodes()){
      custom.removeChild(custom.firstChild);
    }    
  },

  clearRangeMenus : function() {
    var ranges = [
      pilfer.elements.plus,
      pilfer.elements.minus,
      pilfer.elements.plusminus
    ];

    for (var i=0; i<ranges.length; ++i) {
      var range = ranges[i];
      while(range.hasChildNodes()){
        range.removeChild(range.firstChild);
      }
    }
  },

  setLeadingMenuItem : function() {
    var leading = pilfer.preferences.leading();
    pilfer.elements.leading.setAttribute('checked', leading);
  },

  setParseQuerymenuItem : function() {
    var parsequery = pilfer.preferences.parseQuery();
    pilfer.elements.parsequery.setAttribute('checked', parsequery);
  },

	createPilferBookmark : function() {
		var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI("chrome://pilfer/content/pilferViewer.html?pfa=%s", null, null);
		var bmid = PlacesUtils.bookmarks.insertBookmark(PlacesUtils.bookmarksMenuFolderId, uri, -1, 'Pilfer');
		PlacesUtils.bookmarks.setKeywordForBookmark(bmid, 'pilfer');
	}
		
}