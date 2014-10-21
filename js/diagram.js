var CLICK_STATE = {
    NO_CLICK: 1,
    FIRST_CLICK: 2
};

var OBJECT_TYPE = {
    SERVICE_CALL: "serviceCall",
    COMPOSITE_CODE: "compositeCode",
    IF_ELSE: "ifElse"
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
    var bet = new Entity(s, "BetService", composite);
    bet.draw();
    var odds = new Entity(s, "OddsService", bet);
    odds.draw();

    
    document.getElementById("generate").addEventListener('click', function() {
        var workflowText = generateWorkflow(composite);
        console.log(workflowText);
        document.getElementById("generated-workflow").value = workflowText;
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