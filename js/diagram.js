var CLICK_STATE = {
    NO_CLICK: 1,
    FIRST_CLICK: 2
};

var OBJECT_TYPE = {
    SERVICE_CALL: "serviceCall",
    COMPOSITE_CODE: "compositeCode",
    IF: "if",
    ELSE: "else",
    ENDIF: "endIf"
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
    
    var composite = new Entity(s, "Composite");
    composite.draw();
    var odds = new Entity(s, "OddsService", composite);
    odds.draw();
    var sports = new Entity(s, "SportsService", odds);
    sports.draw();
    
    
    document.getElementById("generate").addEventListener('click', function() {
        var workflowText = generateWorkflow(composite);
        console.log(workflowText);
        document.getElementById("generated-workflow").value = workflowText;
    });
    
    document.addEventListener("keypress", function(key) {   
        
        if(key.which == 99) { // letter C
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
                document.querySelector('input[value="' + OBJECT_TYPE.SERVICE_CALL + '"]').checked = "checked";
                objectType = OBJECT_TYPE.SERVICE_CALL;
            }
        }
    });
    
    //addEntryPoint(composite);
}

function generateWorkflow(composite) {
    var tempValue = "";
    var endValue = "";
    
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
    
    return endValue;
}

var s;
var clickState = {
    state: CLICK_STATE.NO_CLICK
};
var objectType = OBJECT_TYPE.SERVICE_CALL;
var chainStart = undefined;
window.onload = draw;