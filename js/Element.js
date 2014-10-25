/* global document:false, window:false, editor: false, ServiceCall:false, Assignment:false, Arrow:false, MouseEvent:false, Entity:false */

function Element(s) {
    this.snap = s;
    
    this.previous = undefined;
    this.next = undefined;

    this.composition = [];
}

Element.prototype.onElementClick = function(entity, me, methodName, varName) {
    // Get the selected object type
    editor.objectType = document.querySelector('input[name="objectType"]:checked').value;

    if(me instanceof MouseEvent) {
        methodName = undefined;
        varName = undefined;
    }

    var mouseevent = {
        clientX: me.clientX,
        clientY: me.clientY + window.scrollY
    };

    this.expandDrawing(mouseevent);

    if(editor.objectType == editor.OBJECT_TYPE.SERVICE_CALL) {
        if(editor.clickState.state == editor.CLICK_STATE.NO_CLICK) {
            this.addClickPoint(entity.getObject().getBBox().cx, mouseevent.clientY);
            
            editor.clickState.target = entity;
            editor.clickState.targetMouse = mouseevent;
            editor.clickState.state = editor.CLICK_STATE.FIRST_CLICK;
        } else if(editor.clickState.state == editor.CLICK_STATE.FIRST_CLICK) {
            this.removeClickPoint();
            
            editor.clickState.dest = entity;
            editor.clickState.destMouse = mouseevent;
            this.link(methodName, varName);
        }
    } else if(editor.objectType == editor.OBJECT_TYPE.COMPOSITE_CODE) {
        
        var codeText = prompt("Enter the code you want", "a = 3");
        var compositeCode = new CompositeCode(
            this.snap,
            codeText,
            entity.getObject().getBBox().cx,
            mouseevent.clientY
        );
        compositeCode.draw();
        
        //entity.callsFromEntity.push(compositeCode);
        entity.push(compositeCode);
        
    } else if(editor.objectType == editor.OBJECT_TYPE.IF) {
        
        var conditionText = prompt("Enter the full condition for the IF", "var1 != null");
        var conditionnal = new ConditionnalIf(
            this.snap,
            conditionText,
            entity.getObject().getBBox().cx,
            mouseevent.clientY
        );
        conditionnal.draw();
        
        //entity.callsFromEntity.push(conditionnal);
        entity.push(conditionnal);
    } else if(editor.objectType == editor.OBJECT_TYPE.ELSE) {
        
        var conditionnal = new ConditionnalElse(
            this.snap,
            entity.getObject().getBBox().cx,
            mouseevent.clientY
        );
        conditionnal.draw();
        
        //entity.callsFromEntity.push(conditionnal);
        entity.push(conditionnal);
    } else if(editor.objectType == editor.OBJECT_TYPE.ENDIF) {
        
        var conditionnal = new ConditionnalEndIf(
            this.snap,
            entity.getObject().getBBox().cx,
            mouseevent.clientY
        );
        conditionnal.draw();
        
        //entity.callsFromEntity.push(conditionnal);
        entity.push(conditionnal);
    } else if(editor.objectType == editor.OBJECT_TYPE.FORLOOP) {

        var conditionText = prompt("Enter the full condition for FOR loop", "i = 0; i < var1; i++");
        var conditionnal = new ForLoop(
            this.snap,
            conditionText,
            entity.getObject().getBBox().cx,
            mouseevent.clientY
        );
        conditionnal.draw();

        //entity.callsFromEntity.push(conditionnal);
        entity.push(conditionnal);
    } else if(editor.objectType == editor.OBJECT_TYPE.ENDFOR) {

        var endfor = new EndFor(
            this.snap,
            entity.getObject().getBBox().cx,
            mouseevent.clientY
        );
        endfor.draw();

        //entity.callsFromEntity.push(endfor);
        entity.push(endfor);
    }
};

Element.prototype.addClickPoint = function(x, y) {
    this.removeClickPoint();
    
    editor.clickState.clickPoint = this.snap.circle(x, y - 5, 5);
    editor.clickState.clickPoint.attr({
        fill: "#d32101"
    });
};

Element.prototype.removeClickPoint = function() {
    if(editor.clickState.clickPoint) {
        editor.clickState.clickPoint.remove();
    }
};

Element.prototype.link = function(methodName, variableName) {
    var serviceName;

    // Don't ask the user if in parsing mode
    if(methodName) {
        serviceName = methodName;
    } else {
        serviceName = prompt("Enter method name and its argument", "method(arg1, arg2)");
    }
        
    // Create service call rectangle
    var sCall = new ServiceCall(
        this.snap,
        serviceName,
        editor.clickState.dest,
        editor.clickState.dest.getObject().getBBox().cx,
        editor.clickState.destMouse.clientY
    );
    sCall.draw();
    
    // Create link
    var endX;
    if(editor.clickState.target.getObject().getBBox().cx > sCall.getObject().getBBox().x) {
        endX = sCall.getObject().getBBox().x2;
    } else {
        endX = sCall.getObject().getBBox().x;
    }
    
    var startX;
    var f = Math.abs(editor.clickState.target.getObject().getBBox().x - endX),
        e = Math.abs(editor.clickState.target.getObject().getBBox().x2 - endX);
    if(f > e) {
        startX = editor.clickState.target.getObject().getBBox().x2;
    } else {
        startX = editor.clickState.target.getObject().getBBox().x;
    }
    var sArrow = new Arrow(
        this.snap,
        startX, 
        editor.clickState.destMouse.clientY,
        endX,
        editor.clickState.destMouse.clientY
    );
    sArrow.draw();
    
    
    // Create assignment box
    var varName;
    if(variableName) {
        varName = variableName;
    } else {
        varName = prompt("Enter variable name", "var1");
    }
    var assignment = new Assignment(
        this.snap,
        varName,
        editor.clickState.target.getObject().getBBox().cx,
        editor.clickState.destMouse.clientY + sCall.getObject().getBBox().height
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
    
    sCall.previous = editor.clickState.dest;
    sCall.next = assignment;
    assignment.previous = sCall;
    

    if(editor.clickState.target instanceof Entity) {
        editor.clickState.target.push(sCall);
    }
    
    // Create chain start to be able to parse it later
    if(!editor.chainStart) {
        editor.chainStart = sCall;
    }
    
    this.composition.push(sCall);
    this.composition.push(sArrow);
    this.composition.push(assignment);
    this.composition.push(returnArrow);

    // Reset click state
    editor.clickState.state = editor.CLICK_STATE.NO_CLICK;
    editor.clickState.target = undefined;
    editor.clickState.dest = undefined;
};

Element.prototype.toGrey = function() {
    this.composition.forEach(function(element) {
        if(element instanceof Element || element instanceof Arrow) {
            element.toGrey();
        } else {
            element.attr({
                fill: "#FFFFFF"
            });
        }
    });
};

Element.prototype.toColor = function() {
    console.log("--- Not implemented");
};
