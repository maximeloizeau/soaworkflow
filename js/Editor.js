function Editor() {
    // Constants
    this.CLICK_STATE = {
        NO_CLICK: 1,
        FIRST_CLICK: 2
    };

    this.OBJECT_TYPE = {
        SERVICE_CALL: "serviceCall",
        COMPOSITE_CODE: "compositeCode",
        IF: "if",
        ELSE: "else",
        ENDIF: "endIf",
        FORLOOP: "forLoop",
        ENDFOR: "endFor"
    };
}

Editor.prototype.start = function() {
    this.snap = Snap("#svg");
    this.services = [];

    this.clickState = {
        state: this.CLICK_STATE.NO_CLICK
    };
    this.objectType = this.OBJECT_TYPE.SERVICE_CALL;

    this.lowerLayer = this.snap.g();
    this.higherLayer = this.snap.g();

    var composite = new Entity(this.snap, "Composite");
    composite.draw();

    this.services.push(composite);

    //this.addEntity("OddsService");


    // ###
    // Place listeners in user interface
    // ###

    document.getElementById("generate").addEventListener('click', function() {
        var workflowText = editor.generateWorkflow(composite);
        document.getElementById("generated-workflow").value = workflowText;
    });

    document.addEventListener("keypress", function(key) {
        if(key.which == 178) { // key "²"
            if(editor.objectType == editor.OBJECT_TYPE.SERVICE_CALL) {
                document.querySelector('input[value="' + editor.OBJECT_TYPE.COMPOSITE_CODE + '"]').checked = "checked";
                editor.objectType = editor.OBJECT_TYPE.COMPOSITE_CODE;
            } else if(editor.objectType == editor.OBJECT_TYPE.COMPOSITE_CODE) {
                document.querySelector('input[value="' + editor.OBJECT_TYPE.IF + '"]').checked = "checked";
                editor.objectType = editor.OBJECT_TYPE.IF;
            } else if(editor.objectType == editor.OBJECT_TYPE.IF) {
                document.querySelector('input[value="' + editor.OBJECT_TYPE.ELSE + '"]').checked = "checked";
                editor.objectType = editor.OBJECT_TYPE.ELSE;
            }  else if(editor.objectType == editor.OBJECT_TYPE.ELSE) {
                document.querySelector('input[value="' + editor.OBJECT_TYPE.ENDIF + '"]').checked = "checked";
                editor.objectType = editor.OBJECT_TYPE.ENDIF;
            } else if(editor.objectType == editor.OBJECT_TYPE.ENDIF) {
                document.querySelector('input[value="' + editor.OBJECT_TYPE.FORLOOP + '"]').checked = "checked";
                editor.objectType = editor.OBJECT_TYPE.FORLOOP;
            } else if(editor.objectType == editor.OBJECT_TYPE.FORLOOP) {
                document.querySelector('input[value="' + editor.OBJECT_TYPE.ENDFOR + '"]').checked = "checked";
                editor.objectType = editor.OBJECT_TYPE.ENDFOR;
            } else if(editor.objectType == editor.OBJECT_TYPE.ENDFOR) {
                document.querySelector('input[value="' + editor.OBJECT_TYPE.SERVICE_CALL + '"]').checked = "checked";
                editor.objectType = editor.OBJECT_TYPE.SERVICE_CALL;
            }
        }
    });


    document.getElementById("addEntity").addEventListener("click", function() {
        editor.addEntity(document.getElementById("entityName").value);
        document.getElementById("entityName").value = "";
    });
    document.getElementById("entityName").addEventListener("keydown", function(event) {
        if(event.keyCode == 13) {
            editor.addEntity(document.getElementById("entityName").value);
            document.getElementById("entityName").value = "";
        }
    });

    document.getElementById('editor').style.display = "block";
    document.getElementById('homepage').style.display = "none";
};

Editor.prototype.generateWorkflow = function(composite) {
    var endValue = "";

    endValue = endValue + "START " + document.getElementById("inputs").value;

    for(var i = 0; i < composite.callsFromEntity.length; i++) {
        var node = composite.callsFromEntity[i];

        while(node) {
            var code = node.getWorkflowCode();

            if(code.length > 0) {
                endValue = endValue + "\n" + node.getWorkflowCode();
            }

            node = node.next;
        }
    }

    endValue = endValue + "\nRETURN " + document.getElementById("output").value;

    return endValue;
};

Editor.prototype.addEntity = function(name) {
    var entity = new Entity(this.snap, name, this.services[this.services.length-1]);
    entity.draw();

    this.services.push(entity);
};

Editor.prototype.addCompositeCode = function(value, y) {
    var cc = new CompositeCode(this.snap, value, this.services[0].getObject().getBBox().cx, y);
    cc.draw();

    this.services[0].push(cc);
};

Editor.prototype.addFor = function(value, y) {
  var ff = new ForLoop(this.snap, value, this.services[0].getObject().getBBox().cx, y);
    ff.draw();

    this.services[0].push(ff);
};

Editor.prototype.addEndFor = function(y) {
    var ff = new EndFor(this.snap, this.services[0].getObject().getBBox().cx, y);
    ff.draw();

    this.services[0].push(ff);
};

Editor.prototype.addIf = function(value, y) {
  var ff = new ConditionnalIf(this.snap, value, this.services[0].getObject().getBBox().cx, y);
    ff.draw();

    this.services[0].push(ff);
};

Editor.prototype.addElse = function(y) {
    var ff = new ConditionnalEkse(this.snap, this.services[0].getObject().getBBox().cx, y);
    ff.draw();

    this.services[0].push(ff);
};

Editor.prototype.addEndIf = function(y) {
    var ff = new ConditionnalEndIf(this.snap, this.services[0].getObject().getBBox().cx, y);
    ff.draw();

    this.services[0].push(ff);
};
