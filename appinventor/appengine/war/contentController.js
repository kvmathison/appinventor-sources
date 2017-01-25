goog.provide("bd.content.ctr");

goog.require("bd.overlay.ctr");

bd.content.ctr.unselectedButtonImage = "lg-circ-blue-up.png";
bd.content.ctr.selectedButtonImage = "lg-circ-blue-active.png";

bd.content.ctr.getPanelInfo = function() {
  return {design:{containerId: "headerDesignButtonContainer",
                  backgroundId: "headerDesignButtonBackground",
                  imageId: "headerDesignButton",
                  showContentPanelFxn: bd.content.ctr.showDesignPanel,
                  hideContentPanelFxn: bd.content.ctr.hideDesignPanel},
          script:{containerId: "headerScriptButtonContainer",
                  backgroundId: "headerScriptButtonBackground",
                  imageId: "headerScriptButton",
                  showContentPanelFxn: bd.content.ctr.showScriptPanel,
                  hideContentPanelFxn: bd.content.ctr.hideScriptPanel},
          play:{containerId: "headerPlayButtonContainer",
                backgroundId: "headerPlayButtonBackground",
                imageId: "headerPlayButton",
                showContentPanelFxn: bd.content.ctr.showGamePreviewPanel,
                hideContentPanelFxn: bd.content.ctr.hideGamePreviewPanel}
         };
}

//ignore for now, important for level editor
bd.content.ctr.initializeContentTabs = function() {
  if(document.getElementById("levelEditingMode").innerHTML == "restrict") {
    //show level editor tab
    document.getElementById("levelEditorTab").style.display = "block";
  }
}

bd.content.ctr.setupGameNameInput = function() {
  var gameInfo = bd.model.currentGame.gameInfos[0];
  var gameNameInputElement = document.getElementById("headerGameNameInput");
  gameNameInputElement.value = gameInfo.gameName;

  bd.util.setTextInputChangeEventHandlers(gameNameInputElement,{entityId:gameInfo.id,propertyName:"gameName"},null,bd.sideBar.ctr.textUpdateSuccess,null);

}

bd.content.ctr.switchContentPanel = function(panelName){
  var panelInfo = bd.content.ctr.getPanelInfo();
  bd.editorSettings.currentContentTab = panelName;

  var headerButtonBackground, buttonContainer;

  for(var loopPanelName in panelInfo) {
    //make all buttons unselected
    buttonContainer = document.getElementById(panelInfo[loopPanelName].containerId);
    headerButtonBackground = buttonContainer.getElementsByClassName("headerButtonBackground")[0];
    headerButtonBackground.src = bd.model.getImagePath() + bd.content.ctr.unselectedButtonImage;

    if(panelInfo[loopPanelName].hideContentPanelFxn) {
      panelInfo[loopPanelName].hideContentPanelFxn();
    }
  }

  //make new panel selected
  var buttonContainer = document.getElementById(panelInfo[panelName].containerId)
  var buttonBackground = buttonContainer.getElementsByClassName("headerButtonBackground")[0];
  buttonBackground.src = bd.model.getImagePath() + bd.content.ctr.selectedButtonImage;

  //call function to show content panel
  if(panelInfo[panelName].showContentPanelFxn) {
    panelInfo[panelName].showContentPanelFxn();
  }

}

bd.content.ctr.showScriptPanel = function() {

  document.getElementById("scriptFrame" + bd.script.ctr.getSelectedScriptPageId()).style.display = "block"
  bd.componentViewer.ctr.show();
  //    var pageObject = (bd.script.ctr.switchMode == 4 ? bd.backpack.ctr.currentBackpack :
  //                                                    bd.component.lookup(bd.script.ctr.getSelectedScriptPageId()));
  //  pageObject.show();

  document.getElementById("scriptContentTabPanel").style.display = "block";
  var scriptPageComponentObject = bd.component.lookup(bd.script.ctr.getSelectedScriptPageId());
  if(!scriptPageComponentObject.isInitialized) {
    var Blockly = scriptPageComponentObject.getBlockly();
    if(Blockly) {
      Blockly.mainWorkspace.render();
    }
    scriptPageComponentObject.isInitialized = true;
  }
  document.getElementById("componentViewerTableCell").style.display = "table-cell"
  document.getElementById("componentViewer").style.height = window.innerHeight - 94; //60 from header, 10 from body margin-top, 24 from survey link
  document.getElementById("scriptPanelTableCell").style.display = "table-cell"

}

bd.content.ctr.hideScriptPanel = function() {
  //hide all script pages
  var scriptPages = bd.model.getEntityList("scriptPage");
  for(var i=0;i<scriptPages.length;i++) {
    document.getElementById("scriptFrame" + scriptPages[i].id).style.display = "none";
  }
  //backpacks are unused
  /*
  for(var i=0, backpack;backpack = bd.backpack.ctr.backpackObjs[i];i++) {
    backpack.hide();
  }*/

  //hide component viewer used on script page
  //bd.componentViewer.ctr.hide();
  document.getElementById("scriptContentTabPanel").style.display = "none";

  document.getElementById("componentViewerTableCell").style.display = "none"
  document.getElementById("scriptPanelTableCell").style.display = "none"

  document.getElementById("aceTextEditorCell").style.display = "none";

}

bd.content.ctr.showDesignPanel = function() {
  //TEMPORARY HACK
  //getting the page to be centered when the scripts are visible
  /*
  var layerPanelWidth;
  if (bd.editor.ctr.isFlexidor()){
    layerPanelWidth = bd.flexidorSettings.layerPanelWidth;
  } else {
    layerPanelWidth = bd.editorSettings.layerPanelWidth;
  }
  document.getElementById("gameWorkspace").style.width = bd.component.lookup(bd.model.getCurrentViewId()).stage.width() + layerPanelWidth + 'px'; */
  //document.getElementById("designContentTabPanel").style.display = "block";
  document.getElementById("entitySelectionTableCell").style.display = "table-cell";
  document.getElementById("designStageFlexibleContainer").style.display = "table-cell";
  document.getElementById("componentSelectionTableCell").style.display = "table-cell";
  document.getElementById("layerPanelTableCell").style.display = "table-cell";
}

bd.content.ctr.hideDesignPanel = function() {
  //document.getElementById("designContentTabPanel").style.display = "none";
  document.getElementById("entitySelectionTableCell").style.display = "none";
  document.getElementById("componentSelectionTableCell").style.display = "none";
  document.getElementById("designStageFlexibleContainer").style.display = "none";
  document.getElementById("layerPanelTableCell").style.display = "none";
}




bd.content.ctr.showAceEditor = function() {
  // debugger;
  document.getElementById("aceTextEditorCell").style.display = "table-cell";
  document.getElementById("scriptPanelTableCell").style.display = "none";
  bd.ace.ctr.editor.setValue(bd.acorn.ctr.populateTextEditor());
  
  // bd.ace.ctr.beautify.beautify(bd.ace.ctr.editor.session);
  bd.ace.ctr.editor.setValue(bd.ace.ctr.beautify(bd.ace.ctr.editor.session.getValue()));
  
};

bd.content.ctr.beautifyEditor = function() {
  // bd.ace.ctr.beautify.beautify(bd.ace.ctr.editor.session);
  bd.ace.ctr.editor.setValue(bd.ace.ctr.beautify(bd.ace.ctr.editor.session.getValue()));
};

bd.content.ctr.hideAceEditor = function() {

  var backedUpText = bd.ace.ctr.editor.getValue();

  try {

    // --------- dirty hack going on here to add a return between all empty curly braces --------
    bd.ace.ctr.editor.setValue(backedUpText.replace(/(\{)\s*(\})/g, "$1\r\r$2"));
    // ------------------------------------------------------------------------------------------

    var session = bd.ace.ctr.editor.getSession();
    session.foldAll();
    // var allFolds = session.getAllFolds();
    // session.unfold();
    var allFolds = session.unfold();

    var Range = ace.require('ace/range').Range;

    var allXmlBlocks = [];
    var codeLinesArray = [];


    var fullCodeLine, range;
    var startColumnPosition = 0, endColumnPosition;

    while (allFolds != null) {  // don't believe I need to check for if length greater than 0 as well
      var startRow = allFolds[0].start.row;
      var endRow = allFolds[0].end.row;

      var hasOptionRow = false;
      var commentRow;
      if (startRow > 0) {
        commentRow = session.getLine(startRow - 1);
        if (commentRow.match(/^\/\/ OPTIONS:/) != null) {
          hasOptionRow = true;
        }
      }

      var arrayOfCodeBlockLines = session.getLines(startRow, endRow);

      fullCodeLine = "";
      for (var y = 0; y < arrayOfCodeBlockLines.length; y++) {
        fullCodeLine += arrayOfCodeBlockLines[y];
      }
      
      if (fullCodeLine.match(/^\}\s*else\s*/) == null) {
        if (hasOptionRow) {
          fullCodeLine = commentRow + "\n" + fullCodeLine;
          startRow--;
        }
        codeLinesArray.push(fullCodeLine);
      } else {
        codeLinesArray[codeLinesArray.length -1] += fullCodeLine;
      }
      

      endColumnPosition = session.getLine(endRow).length;
      range = new Range(startRow, startColumnPosition, endRow, endColumnPosition);
      session.remove(range);

      session.foldAll();
      allFolds = session.unfold();
    }

    for (var x = 0; x < codeLinesArray.length; x++) {
      allXmlBlocks.push(bd.acorn.ctr.createXmlBlock(codeLinesArray[x]));
    }


    var textWithoutCodeBlocks = bd.ace.ctr.editor.getValue();

    var regex = new RegExp(/\/\/[ *|\t*]*OPTIONS:[ *|\t*]*.*\n.*;/g);
    var results;
    if (results = textWithoutCodeBlocks.match(regex)) {
      for (var index = 0; index < results.length; index++) {
        allXmlBlocks.push(bd.acorn.ctr.createXmlBlock(results[index]))
        textWithoutCodeBlocks = textWithoutCodeBlocks.replace(results[index], "");
      }
    }

    // possible bug fix here: if there is an OPTIONS comment without any code after it, an error will be thrown
    // not sure if this should be a bug or not, but if it shouldn't be a bug...just run throught the code here
    // matching OPTIONS and remove from textWithoutCodeBlocks

    textWithoutCodeBlocks = textWithoutCodeBlocks.replace(/(\r\n|\n|\r)/gm,"");
    var splitRemainingLines = textWithoutCodeBlocks.split(";");
    for (var x = 0; x < splitRemainingLines.length; x++) {
      if (splitRemainingLines[x] !== "") {
        allXmlBlocks.push(bd.acorn.ctr.createXmlBlock(splitRemainingLines[x]));
      }
    }








    document.getElementById("aceTextEditorCell").style.display = "none";
    document.getElementById("scriptPanelTableCell").style.display = "table-cell";

    var blockly = bd.script.ctr.getCurrentBlockly();
    blockly.mainWorkspace.clear();



    var xmlWrap = goog.dom.createDom('xml');
    for (var x = 0; x < allXmlBlocks.length; x++) {
      // bd.acorn.ctr.populateDOM(allXmlBlocks[x]);
      xmlWrap.appendChild(allXmlBlocks[x]);
    }
    bd.acorn.ctr.populateDOM(xmlWrap);


  } catch (error) {
    bd.ace.ctr.editor.setValue(backedUpText);

    alert("Whoop!\n" + error);
  }
};

bd.content.ctr.showGamePreviewPanel = function() {
  document.getElementById("playPanelTableCell").style.display = "table-cell";
  if(bd.preview.ctr.autoReset) {
    bd.preview.ctr.previewGame()
  } else {
    document.getElementById("testingAreaContainer").style.display = "block";
  }
}

bd.content.ctr.hideGamePreviewPanel = function() {
  document.getElementById("playPanelTableCell").style.display = "none";
  if(bd.preview.ctr.autoReset) {
    bd.preview.ctr.clearInstanceFromPreview();
  }
  document.getElementById("testingAreaContainer").style.display = "none";
}

jQuery(document).ready(function() {
  var panelInfo = bd.content.ctr.getPanelInfo();
  document.getElementById(panelInfo['design'].containerId).onclick = function() {
    bd.content.ctr.switchContentPanel('design');
  }
  document.getElementById(panelInfo['script'].containerId).onclick = function() {
    bd.content.ctr.switchContentPanel('script');
  }
  document.getElementById(panelInfo['play'].containerId).onclick = function() {
    bd.content.ctr.switchContentPanel('play');
  }

  document.getElementById("headerFlexidorButtonContainer").onclick = function(e) {
    bd.overlay.ctr.showOverlay("flexidor");
  }
});
