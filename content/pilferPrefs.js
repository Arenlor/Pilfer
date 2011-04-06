pilfer.preferences = {

  service : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),

  range : function() {
    return eval(pilfer.preferences.service.getCharPref('extensions.pilfer.range'));
	},

  custom : function() {
    return eval(pilfer.preferences.service.getCharPref('extensions.pilfer.custom'));
  },

  leading : function(val) {
    if (val!==undefined) {
      pilfer.preferences.service.setBoolPref('extensions.pilfer.leading', val)
    }
    return pilfer.preferences.service.getBoolPref('extensions.pilfer.leading');
  },

  parseQuery : function(val) {
    if (val!==undefined) {
      pilfer.preferences.service.setBoolPref('extensions.pilfer.parseQuery', val)
    }
    return pilfer.preferences.service.getBoolPref('extensions.pilfer.parseQuery');
  },

  quicknode : function() {
    return pilfer.preferences.service.getIntPref('extensions.pilfer.quicknode');
  },

  installed : function() {
    return pilfer.preferences.service.getBoolPref('extensions.pilfer.installed');
  }

}
