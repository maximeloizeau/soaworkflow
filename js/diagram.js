/* global Editor: false, Parser : false, window: false, document: false */

var editor, parser;

window.onload = function() {
    document.getElementById('startEditor').addEventListener('click', function() {
        editor = new Editor();
        editor.start();
    });

    document.getElementById('startParser').addEventListener('click', function() {
        parser = new Parser();
        parser.start();
    });
};
