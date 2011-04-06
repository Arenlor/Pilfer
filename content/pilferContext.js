/*
	Pilfer - A Firefox extension for searching for sequentially named images.
	Copyright (C) 2008 - 2010  Nicholas Ortenzio
	nicholas.ortenzio@gmail.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

var pilferContext = {
		 
	/*
	 **********************************
   * EVENTS
	 **********************************
	 */	
	
	onLoad : function() {
		this.initialized = true;
		pilferContext.firstRun();
		pilferContext.populateRangeMenus();
		pilferContext.populateCustomMenu();
		pilferContext.initializeContextMenu();
	},
	
	onContextShowing : function(event) {
		pilferContext.showContextMenu(event.target);
	},
			
	onDirectoryCommand : function(event) {
		pilferUtilities.openImageDirectory(pilferContext.target);
	},

	onLeadingCommand : function(e) {
		var isChecked = (e.target.getAttribute("checked")) ? true : false;
		this.pref.setBoolPref(pilferID.leadingPref, isChecked);
	},		

	onParseCommand : function(e) {
		var isChecked = (e.target.getAttribute("checked")) ? true : false;
		this.pref.setBoolPref(pilferID.parsePref, isChecked);
	},				
		
	onQuickNodeCommand : function() {
		var pfa = pilferUtilities.getPiflerFormattedAddress(
			pilferContext.target, 
			pilferContext.quicknode, 
			3, 
			pilferContext.leading
		);
		
		pilferUtilities.openPilferViewer(pfa);
	},
  
	onManualCommand : function(event) {
		var pfa = pilferUtilities.promptManual(
			pilferContext.target, 
			pilferContext.getString("manualDialogTitle"), 
			pilferContext.getString("manualDialogQuestion")
		);
		
		pilferUtilities.openPilferViewer(pfa);
	},
		
	onCustomCommand : function(event) {
		var pfa = pilferUtilities.promptManual(
			pilferUtilities.getParentDirectory(pilferContext.target) + event.target.label,
			pilferContext.getString("manualDialogTitle"), 
			pilferContext.getString("manualDialogQuestion")
		);
		pilferUtilities.openPilferViewer(pfa);
	},
		
	onOtherCommand : function(direction) {
		var pfa = pilferUtilities.promptOther(
			pilferContext.target, 
			direction, 
			pilferContext.leading,
			pilferContext.getString("otherDialogTitle"), 
			pilferContext.getString("otherDialogQuestion")
		);
		pilferUtilities.openPilferViewer(pfa);
	},
			
	onRangeCommand : function(event, direction) { 
		var pfa = pilferUtilities.getPiflerFormattedAddress(
			pilferContext.target, 
			event.target.label, 
			direction, 
			pilferContext.leading
		);
		pilferUtilities.openPilferViewer(pfa);
	},
		
	/*
	 **********************************
	 * GETTERS
	 **********************************
	 */
	
	'pref' : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
	'target' getter: ( function() { return document.getElementById(pilferID.context).getAttribute("value"); }),
	'leading' getter: ( function() { return this.pref.getBoolPref(pilferID.leadingPref); }),
	'parseQuery' getter: ( function() { return this.pref.getBoolPref(pilferID.parsePref); }),
  'parentDirectory' getter: ( function() { var match = /(^.*\/)(?:.+)/.exec(this.target); return (match) ? match[1] : false; }), 
	'quicknode' getter: ( function() { return this.pref.getIntPref(pilferID.quickPref); }),
	
	/*
	 **********************************
   * UTILITY METHODS
	 **********************************
	 */		
						
	getString : function(str) { 
		return document.getElementById(pilferID.strings).getString(str); 
	},
	
	getPrefArray : function(p) {
		return eval(this.pref.getCharPref(p));
	},
					
	setQuickNodeAttributes : function(target) { 
		var quicknode = document.getElementById(pilferID.quicknode);
		if (quicknode){	
			quicknode.setAttribute("label", target.match(/.*\/(.*)$/)[1]);			
			quicknode.setAttribute("oncommand", "pilferContext.onQuickNodeCommand();");
		}
	},
		
	/*
	 **********************************
   * INITIALIZATION METHODS
	 **********************************
	 */		
		
	firstRun : function() {
			if(this.pref.getBoolPref('extensions.pilfer.installed')) return;
			pilferUtilities.createPilferBookmark();
			this.pref.setBoolPref('extensions.pilfer.installed', true);		 
	},
	 
	initializeContextMenu : function() {
		document.getElementById(pilferID.ffContext).addEventListener("popupshowing", pilferContext.onContextShowing, false);		
		document.getElementById(pilferID.leading).setAttribute("checked", pilferContext.leading);
		document.getElementById(pilferID.parseQuery).setAttribute("checked", pilferContext.parseQuery);
	},
	 
	populateRangeMenus : function () {
		var arr = pilferContext.getPrefArray(pilferID.rangePref);
		var rangeItems = [];
		
		rangeItems.push(document.getElementById(pilferID.plusPop));
		rangeItems.push(document.getElementById(pilferID.minusPop));
		rangeItems.push(document.getElementById(pilferID.bothPop));
		
		for (var x=0; x<3; ++x) {
			while(rangeItems[x].hasChildNodes()){rangeItems[x].removeChild(rangeItems[x].firstChild);}
			    
			for (var y=0; y<arr.length; ++y) {
				var m = document.createElement('menuitem');
				m.setAttribute('label', arr[y]);
				m.setAttribute('oncommand', 'pilferContext.onRangeCommand(event, ' + (x+1) + ');');
				rangeItems[x].appendChild(m);
			}
			
			var n = document.createElement('menuitem');
			n.setAttribute('oncommand', 'pilferContext.onOtherCommand(' + (x+1) + ');');
			n.setAttribute('label', pilferContext.getString("otherContextLabel"));
			n.setAttribute('accesskey', pilferContext.getString("otherContextAccesskey"));
			rangeItems[x].appendChild(n);
		}	
	},
		
	populateCustomMenu : function () { 
		var arr = pilferContext.getPrefArray(pilferID.customPref);
		var cust = document.getElementById(pilferID.customPop);
    
    while(cust.hasChildNodes()){cust.removeChild(cust.firstChild);}
    
		for (var x=0; x<arr.length; ++x) {
			var m = document.createElement('menuitem');
			m.setAttribute('label', arr[x][1]);
			m.setAttribute('description', arr[x][0]);
			m.setAttribute('oncommand', 'pilferContext.onCustomCommand(event);');
			cust.appendChild(m);
		}
	},
		 	 
	showContextMenu : function(elm) {
		var context = document.getElementById(pilferID.ffContext);
		var proot = document.getElementById(pilferID.context);
		
		if (elm != context) return;

		proot.hidden = true;

		if (!pilferUtilities.isProperContextType()) return;
		var tar = pilferUtilities.getContextTarget(this.parseQuery).toString() || '';

		if (!pilferUtilities.isImageLink(tar)) return;
		pilferContext.setQuickNodeAttributes(tar);
		proot.setAttribute("value", tar);
		proot.hidden = false;
    
    if (this.pref.getBoolPref(pilferID.custAltPref)) {
      pilferContext.populateCustomMenu();
      this.pref.setBoolPref(pilferID.custAltPref, false)
    }
    
    if (this.pref.getBoolPref(pilferID.rangeAltPref)) {
      pilferContext.populateRangeMenus();
      this.pref.setBoolPref(pilferID.rangeAltPref, false)
    }
	},
	
};

window.addEventListener("load", pilferContext.onLoad, false);