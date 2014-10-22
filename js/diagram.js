var CLICK_STATE = {
    NO_CLICK: 1,
    FIRST_CLICK: 2
};

var OBJECT_TYPE = {
    SERVICE_CALL: "serviceCall",
    COMPOSITE_CODE: "compositeCode",
    IF: "if",
    ELSE: "else",
    ENDIF: "endIf",
    FORLOOP: "forLoop",
    ENDFOR: "endFor"
}

function addEntryPoint(entity) {
    var entrypoint = s.circle(entity.lifeLine.getBBox().x, entity.lifeLine.getBBox().y + 40, 20);
    entrypoint.attr({
       fill: "#ea0e0e" 
    });
    
    entrypoint.click(onElementClickListener.bind(this, entrypoint));
    
    return entrypoint;
}

function draw() {   
    s = Snap("#svg");
    
    services = [];

    var composite = new Entity(s, "Composite");
    composite.draw();
    services.push(composite);
    
    addEntity("OddsService");
    
    document.getElementById("generate").addEventListener('click', function() {
        var workflowText = generateWorkflow(composite);
        console.log(workflowText);
        document.getElementById("generated-workflow").value = workflowText;
    });
    
    document.addEventListener("keypress", function(key) {   
        if(key.which == 178) { // key "²"
            if(objectType == OBJECT_TYPE.SERVICE_CALL) {
                document.querySelector('input[value="' + OBJECT_TYPE.COMPOSITE_CODE + '"]').checked = "checked";
                objectType = OBJECT_TYPE.COMPOSITE_CODE;
            } else if(objectType == OBJECT_TYPE.COMPOSITE_CODE) {
                document.querySelector('input[value="' + OBJECT_TYPE.IF + '"]').checked = "checked";
                objectType = OBJECT_TYPE.IF;
            } else if(objectType == OBJECT_TYPE.IF) {
                document.querySelector('input[value="' + OBJECT_TYPE.ELSE + '"]').checked = "checked";
                objectType = OBJECT_TYPE.ELSE;
            }  else if(objectType == OBJECT_TYPE.ELSE) {
                document.querySelector('input[value="' + OBJECT_TYPE.ENDIF + '"]').checked = "checked";
                objectType = OBJECT_TYPE.ENDIF;
            } else if(objectType == OBJECT_TYPE.ENDIF) {
                document.querySelector('input[value="' + OBJECT_TYPE.FORLOOP + '"]').checked = "checked";
                objectType = OBJECT_TYPE.FORLOOP;
            } else if(objectType == OBJECT_TYPE.FORLOOP) {
                document.querySelector('input[value="' + OBJECT_TYPE.ENDFOR + '"]').checked = "checked";
                objectType = OBJECT_TYPE.ENDFOR;
            } else if(objectType == OBJECT_TYPE.ENDFOR) {
                document.querySelector('input[value="' + OBJECT_TYPE.SERVICE_CALL + '"]').checked = "checked";
                objectType = OBJECT_TYPE.SERVICE_CALL;
            }
        }
    });
    

    document.getElementById("addEntity").addEventListener("click", function() {
        addEntity(document.getElementById("entityName").value);
        document.getElementById("entityName").value = "";
    });
    document.getElementById("entityName").addEventListener("keydown", function(event) {
        if(event.keyCode == 13) {
            addEntity(document.getElementById("entityName").value);
            document.getElementById("entityName").value = "";
        }
    });
    //addEntryPoint(composite);
}

function generateWorkflow(composite) {
    var tempValue = "";
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
}

function addEntity(name) {
    var entity = new Entity(s, name, services[services.length-1]);
    entity.draw();

    services.push(entity);
}

var s, services;
var clickState = {
    state: CLICK_STATE.NO_CLICK
};
var objectType = OBJECT_TYPE.SERVICE_CALL;
var chainStart = undefined;
window.onload = draw;
