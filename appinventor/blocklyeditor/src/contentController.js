goog.provide("bd.content.ctr");

bd.content.ctr.showAceEditor = function() {
  // debugger;
  document.getElementById("aceTextEditorCell").style.display = "block";
  //document.getElementById("scriptPanelTableCell").style.display = "none";
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
    //document.getElementById("scriptPanelTableCell").style.display = "table-cell";

    var blockly = bd.acorn.ctr.getCurrentBlockly();

    blockly.mainWorkspace.clear();

    //var xmlWrap = goog.dom.createDom('xml');
    for (var x = 0; x < allXmlBlocks.length; x++) {
      //xmlWrap.appendChild(allXmlBlocks[x]);

      // messy temp fix - domToWorkspace breaks blockly?
      var block = blockly.Xml.domToBlock(allXmlBlocks[x], blockly.mainWorkspace);
      var blockX = parseInt(allXmlBlocks[x].getAttribute('x'), 10);
      var blockY = parseInt(allXmlBlocks[x].getAttribute('y'), 10);
      if (!isNaN(blockX) && !isNaN(blockY)) {
        block.moveBy(blockX, blockY);
      }
      
    }
    //bd.acorn.ctr.populateDOM(xmlWrap);


  } catch (error) {
    bd.ace.ctr.editor.setValue(backedUpText);

    alert("Whoop!\n" + error);
  }
};
