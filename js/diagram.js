/* global Editor: false, window: false */

var editor;

window.onload = function() {
    document.getElementById('startEditor').addEventListener('click', function() {
        editor = new Editor();
        editor.start();
    });
};
