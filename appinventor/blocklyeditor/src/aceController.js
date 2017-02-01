goog.provide('bd.ace.ctr');

bd.ace.ctr.editor = null;
bd.ace.ctr.beautify = null;

bd.ace.ctr.aceStart = function() {
	/*if (bd.ace.ctr.inJSEditor()) {
		document.getElementById("editorViewer").style.display = "block";
	}*/

  var editor = ace.edit("aceTextEditorContainer");
  editor.setTheme("ace/theme/textmate");
  editor.getSession().setMode("ace/mode/gameblox");


	ace.require("ace/config").set("workerPath", "path/to/ace");
	// editor.session.setOption("useWorker", true);

  ace.require("ace/ext/language_tools");

	editor.$blockScrolling = Infinity;

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  });



  //  ----------- Attempt #2 ------------
  var snippetManager = ace.require("ace/snippets").snippetManager;
  var config = ace.require("ace/config");

  ace.config.loadModule("ace/snippets/gameblox", function(m) {
    if (m) {
      snippetManager.files.gameblox = m;
      m.snippets = snippetManager.parseSnippetFile(m.snippetText);
      snippetManager.register(m.snippets, m.scope);
    }
  });
  //  -----------------------------------


  editor.setValue("");


 //  var beautify = ace.require("ace/ext/beautify"); // get reference to extension
	// bd.ace.ctr.beautify = beautify;
  bd.ace.ctr.editor = editor;


  // var beautify_js = require('js-beautify');
  bd.ace.ctr.beautify = js_beautify;


  //bd.ace.ctr.editor.setValue(bd.ace.ctr.beautify(bd.ace.ctr.editor.session.getValue()));
  











  // ---- trying to load snippets -----

  // mySnippetText = "# scope: gameblox\n# WWWuuuutttt\nsnippet ha\nhelp ${1} me ${0}";

  // var snippetManager = ace.require("ace/snippets").snippetManager;
  // var config = ace.require("ace/config");

  // ace.config.loadModule("ace/ext/language_tools", function(m) { //"ace/snippets/gameblox"
  //     if (m) {
  //         debugger;
  //         snippetManager.files.gameblox = m;
  //         m.snippetText = "";
  //         m.snippetText += mySnippetText; // if you have snippets in the ace snippet format 
  //         m.snippets = snippetManager.parseSnippetFile(m.snippetText);


  //         snippetManager.register(m.snippets, m.scope);
  //     }
  // });


};

bd.ace.ctr.inJSEditor = function() {
	if (document.getElementById("jsEditor").innerHTML === "True") {
		return true;
	} else {
		return false;
	}
};