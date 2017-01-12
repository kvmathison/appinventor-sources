goog.provide('bd.ace.ctr');



jQuery(document).ready(function() {

    var editor = ace.edit("aceTextEditorContainer");
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/javascript");

});
