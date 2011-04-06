pilfer.events = {

  onLoad : function() {
    // create object containing pilfer chrome elements 
    pilfer.elements.setElements();

    // set leading preference menuitem
    //pilfer.dom.setLeadingMenuItem();

    // set parsequery preference menuitem
    pilfer.dom.setParseQuerymenuItem();

    // add event listener for firefox context menu
    pilfer.elements.context.addEventListener("popupshowing", pilfer.events.onContextMenuShowing, false);
  },

  onContextMenuShowing : function(e) {
    // get the current target
    pilfer.currentTarget = pilfer.utilities.getCurrentTarget();

    // if a target was returned then show the pilfer menu    
    pilfer.elements.pilferContext.hidden = !pilfer.currentTarget;
  },

  onPilferPopupShowing : function(e) {
    // get the filename of the current target
    var filename = pilfer.utilities.getImageFilename(pilfer.currentTarget);
    
    // set quicknode label
    pilfer.elements.quicknode.setAttribute('label', filename);

    // popuplate custom menu
    pilfer.dom.populateCustomMenus();

    // populate range menus
    pilfer.dom.populateRangeMenus();
  },

  onQuickNode : function(e) {
    // get quicknode range pref
    var range = pilfer.preferences.quicknode();

    // get leading pref
    var leading = pilfer.preferences.leading();

    // get pfa for quicknode
    var pfa = pilfer.utilities.getPiflerFormattedAddress(pilfer.currentTarget, range, 3, leading);

    // open pilferViewer tab for pfa
    if (pfa) { pilfer.dom.openPilferViewer(pfa); }
  },

  onCustomCommand : function(event, custom) {
    // get current targets parent directory
    var dir = pilfer.utilities.getImageParentDirectory(pilfer.currentTarget);

    // get the message used for the prompt from localized string
    var message = pilfer.elements.strings.getString('manualDialogQuestion'); 

    // prompt user for a pilfer formatted address
    var pfa = prompt(message, dir + custom);

    // open pilferViewer tab for pfa
    if (pfa) { pilfer.dom.openPilferViewer(pfa); }
  },

  onRangeCommand : function(event, range, dir) {
    // get leading pref
    var leading = pilfer.preferences.leading();

    // get pfa for range
    var pfa = pilfer.utilities.getPiflerFormattedAddress(pilfer.currentTarget, range, dir, leading);

    // open pilferViewer tab for pfa
    if (pfa) { pilfer.dom.openPilferViewer(pfa); }
  },

  onDirectory : function(e) {
    // get current targets parent directory
    var dir = pilfer.utilities.getImageParentDirectory(pilfer.currentTarget);

    // open directory url in a new tab
    if (dir) gBrowser.addTab(dir.replace(/(\w+)\.photobucket\.com/,"photobucket.com"));
  },

  onManual : function(e) {
    // get the message used for the prompt from localized string
    var message = pilfer.elements.strings.getString('manualDialogQuestion'); 

    // prompt user for a pilfer formatted address
    var pfa = prompt(message, pilfer.currentTarget);

    // open pilferViewer tab for pfa
    if (pfa) { pilfer.dom.openPilferViewer(pfa); }
  },

  onLeading : function(e) {
    // get the current state of the element
    var isChecked = (e.target.getAttribute("checked")) ? true:false;
    pilfer.preferences.leading(isChecked);
  },

  onParseQuery : function(e) {
    // get the current state of the element
    var isChecked = (e.target.getAttribute("checked")) ? true:false;
    pilfer.preferences.parseQuery(isChecked);
  }

};
