/*
	Pilfer - A Firefox extension for searching for sequentially named images.
	Copyright (C) 2008 - 2010  Nicholas Ortenzio
	nicholas.ortenzio@gmail.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

var pilferOptions = {

	/*
	 **********************************
	 * MEMBERS
	 **********************************
	 */

	id : {
		paneRange 			: "paneRange",
		paneCustom 			: "paneCustom",
		
		rangeListbox 		: "rangeListbox",
		customListbox		:	"customListbox",
		
		quicknodeValue 	: "quicknodeValue",
		rangeValue 			: "rangeValue",
		formatValue 		: "formatValue",
		modelValue 			: "modelValue",
		
		customPref			: "extensions.pilfer.custom",
		rangePref				: "extensions.pilfer.range",
    custAltPref     : "extensions.pilfer.haveCustomItemsChanged",
    rangeAltPref    : "extensions.pilfer.haveRangeItemsChanged",
	}, 

	prefService : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
	
	
	/*
	 **********************************
   * EVENTS
	 **********************************
	 */
	 
	onLoad : function() {
		this.initialized = true;	
		pilferOptions.populateRangeListbox();
		pilferOptions.populateCustomListbox();
	},
	
	onRangeAdd : function(event) {
		pilferOptions.addRangeListboxItem();
	},
	
	onRangeRemove : function(event) {
		pilferOptions.removeRangeListboxItem();
	},
	
	onCustomAdd : function(event) {
		pilferOptions.addCustomListboxItem();
	},
	
	onCustomRemove : function(event) {
		pilferOptions.removeCustomListboxItem();
	},
		
	onCustomSortModel : function(event) {
		pilferOptions.sortCustomListboxItemsByModel();
	},

  onCustomSortFormat : function(event) {
		pilferOptions.sortCustomListboxItemsByFormat();
	},
    
	/*
	 **********************************
	 * Utility Methods
	 **********************************
	 */
	
	getPrefArray : function(pref) {
		return eval(this.prefService.getCharPref(pref));
	},
	
	setPrefArray : function(arr, pref) {
		this.prefService.setCharPref(pref, arr.toSource());
	},
    
  setCustAltPref : function() {
    this.prefService.setBoolPref(this.id.custAltPref, true);
  },
	
  setRangeAltPref : function() {
    this.prefService.setBoolPref(this.id.rangeAltPref, true);
  },
    
	/*
	 **********************************
	 * Range Panel Methods
	 **********************************
	 */	
	
	populateRangeListbox : function () {
		var listbox = document.getElementById(this.id.rangeListbox);
		while (listbox.hasChildNodes()) { listbox.removeChild(listbox.firstChild); }
		var arr = pilferOptions.getPrefArray(this.id.rangePref);
		for (var x=0; x<arr.length; ++x) {
			listbox.appendItem(arr[x], arr[x]);
		}
	},
	
	addRangeListboxItem : function () {
		var listbox = document.getElementById(this.id.rangeListbox);		
		var textbox = document.getElementById(this.id.rangeValue);		
		
		var intreg = /^\d+$/;
		var nr = parseInt(textbox.value.match(intreg), 10);
		
		if (nr) {
			var arr = pilferOptions.getPrefArray(this.id.rangePref);
			arr.push(nr);
			pilferOptions.setPrefArray(arr.sort(function(a,b){return a-b}), this.id.rangePref);
			pilferOptions.populateRangeListbox();
		}
    
    pilferOptions.setRangeAltPref();
	},
	
	removeRangeListboxItem : function() {
		var listbox = document.getElementById(this.id.rangeListbox);
		var index = listbox.selectedIndex;
		var arr = pilferOptions.getPrefArray(this.id.rangePref);
		arr.splice(index,1);
		pilferOptions.setPrefArray(arr, this.id.rangePref);
		listbox.removeItemAt(index);
    
    pilferOptions.setRangeAltPref();
	},

	/*
	 **********************************
	 * CustomType Panel Methods
	 **********************************
	 */	
	 
	populateCustomListbox : function() {
		var listbox = document.getElementById(this.id.customListbox);
		var arr = pilferOptions.getPrefArray(this.id.customPref);
		for (var x=0; x<arr.length; ++x) {
			var item = document.createElement('richlistitem');
			var desc = document.createElement('description');
			var labl = document.createElement('label');
				desc.setAttribute("value", arr[x][0]);
				desc.setAttribute("flex", 1);
				labl.setAttribute("value", arr[x][1]);
				item.appendChild(desc);
				item.appendChild(labl);
				listbox.appendChild(item);
		}
	},
	
	addCustomListboxItem : function() {
		var listbox = document.getElementById(this.id.customListbox);
		var model = document.getElementById(this.id.modelValue).value;
		var format = document.getElementById(this.id.formatValue).value;
		var arr = pilferOptions.getPrefArray(this.id.customPref);
		
		arr.push([model, format]);
		pilferOptions.setPrefArray(arr, this.id.customPref);

		var item = document.createElement('richlistitem');
		var desc = document.createElement('description');
		var labl = document.createElement('label');
			desc.setAttribute("value", model);
			desc.setAttribute("flex", 1);
			labl.setAttribute("value", format);
			item.appendChild(desc);
			item.appendChild(labl);
			listbox.appendChild(item);
      
    pilferOptions.setCustAltPref();
	},
	
	removeCustomListboxItem : function() {
		var listbox = document.getElementById(this.id.customListbox);
		var index = listbox.selectedIndex;
		var arr = pilferOptions.getPrefArray(this.id.customPref);
		arr.splice(index,1);
		pilferOptions.setPrefArray(arr, this.id.customPref);
		listbox.removeItemAt(index);	
    
    pilferOptions.setCustAltPref();
	},

	clearListbox : function(){
		var listbox = document.getElementById(this.id.customListbox);
		var rows = listbox.getRowCount();		
		for (var x=rows-1; x>=0; --x){
			listbox.removeItemAt(x);
		}
	},
		
	sortCustomListboxItemsByModel : function() {
		pilferOptions.clearListbox();
		
		var arr = pilferOptions.getPrefArray(this.id.customPref);
		pilferOptions.setPrefArray(arr.sort(), this.id.customPref);

		pilferOptions.populateCustomListbox();
    pilferOptions.setCustAltPref();
	},
		
  sortCustomListboxItemsByFormat : function() {
		pilferOptions.clearListbox();
		
		var arr = pilferOptions.getPrefArray(this.id.customPref);
		pilferOptions.setPrefArray(arr.sort(function(a,b){return (a[1]<b[1]) ? -1 : ((a[1]>b[1]) ?  1 : 0)}), this.id.customPref);

		pilferOptions.populateCustomListbox();
    pilferOptions.setCustAltPref();
	},  
     
};


window.addEventListener("load", pilferOptions.onLoad, false);