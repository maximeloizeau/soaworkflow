function Element(s) {
    this.snap = s;
    
    this.previous = undefined;
    this.next = undefined;
}

Element.prototype.onElementClick = function(entity, mouseevent) {
    // Get the selected object type
    objectType = document.querySelector('input[name="objectType"]:checked').value;
    
    if(objectType == OBJECT_TYPE.SERVICE_CALL) {
        if(clickState.state == CLICK_STATE.NO_CLICK) {
            clickState.target = entity;
            clickState.targetMouse = mouseevent;
            clickState.state = CLICK_STATE.FIRST_CLICK;
        } else if(clickState.state == CLICK_STATE.FIRST_CLICK) {
            clickState.dest = entity;
            clickState.destMouse = mouseevent;
            this.link();
        }
    } else if(objectType == OBJECT_TYPE.COMPOSITE_CODE) {
        
        var codeText = prompt("Enter the code you want");
        var compositeCode = new CompositeCode(
            this.snap,
            codeText,
            entity.getObject().getBBox().cx,
            mouseevent.clientY
        );
        compositeCode.draw();
        
        entity.callsFromEntity.push(compositeCode);
        
    } else if(objectType == OBJECT_TYPE.IF_ELSE) {
        
    }
}

Element.prototype.link = function() {
    var serviceName = prompt("Enter method name and its argument", "method(arg1, arg2)");
        
    // Create service call rectangle
    var sCall = new ServiceCall(
        this.snap,
        serviceName,
        clickState.dest,
        clickState.dest.getObject().getBBox().cx,
        clickState.destMouse.clientY
    );
    sCall.draw();
    
    // Create link
    var endX;
    if(clickState.target.getObject().getBBox().cx > sCall.getObject().getBBox().x) {
        endX = sCall.getObject().getBBox().x2;
    } else {
        endX = sCall.getObject().getBBox().x;
    }
    
    var startX;
    var f = Math.abs(clickState.target.getObject().getBBox().x - endX),
        e = Math.abs(clickState.target.getObject().getBBox().x2 - endX);
    if(f > e) {
        startX = clickState.target.getObject().getBBox().x2;
    } else {
        startX = clickState.target.getObject().getBBox().x;
    }
    var sArrow = new Arrow(
        this.snap,
        startX, 
        clickState.destMouse.clientY,
        endX,
        clickState.destMouse.clientY
    );
    sArrow.draw();
    
    
    // Create assignment box
    var serviceName = prompt("Enter variable name", "var1");
    var assignment = new Assignment(
        this.snap,
        serviceName,
        clickState.target.getObject().getBBox().cx,
        clickState.destMouse.clientY + sCall.getObject().getBBox().height
    );
    assignment.draw();
    
    // Create arrow from service call to assignment
    f = Math.abs(assignment.getObject().getBBox().x2 - sCall.getObject().getBBox().x2);
    e = Math.abs(assignment.getObject().getBBox().x - sCall.getObject().getBBox().x2);
    if(f > e) {
        endX = assignment.getObject().getBBox().x;
    } else {
        endX = assignment.getObject().getBBox().x2;
    }
    var returnArrow = new Arrow(
        this.snap,
        sCall.getObject().getBBox().x2 - sCall.getObject().getBBox().width/2,
        sCall.getObject().getBBox().y + sCall.getObject().getBBox().height,
        endX,
        assignment.getObject().getBBox().y + assignment.getObject().getBBox().height/2
    );
    returnArrow.draw();
    
    sCall.previous = clickState.dest;
    sCall.next = assignment;
    assignment.previous = sCall;
    
    if(clickState.target instanceof Entity) {
        clickState.target.callsFromEntity.push(sCall);
    }
    
    if(!chainStart) {
        chainStart = sCall;
    }
    

    // Reset click state
    clickState.state = CLICK_STATE.NO_CLICK;
    clickState.target = undefined;
    clickState.dest = undefined;
}
