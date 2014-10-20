function Element(s) {
    this.snap = s;
}

Element.prototype.onElementClick = function(entity, mouseevent) {
    if(clickState.state == CLICK_STATE.NO_CLICK) {
        clickState.target = entity;
        clickState.targetMouse = mouseevent;
        clickState.state = CLICK_STATE.FIRST_CLICK;
    } else if(clickState.state == CLICK_STATE.FIRST_CLICK) {
        clickState.dest = entity;
        clickState.destMouse = mouseevent;
        this.link();
    }
}

Element.prototype.link = function() {
    var sCall = new ServiceCall(
        this.snap,
        clickState.dest.getBBox().cx,
        clickState.destMouse.clientY
    );
    sCall.draw();
    
    var endX;
    if(clickState.target.getBBox().cx > sCall.rect.getBBox().x) {
        endX = sCall.rect.getBBox().x2;
    } else {
        endX = sCall.rect.getBBox().x;
    }
    
    var startX;
    var f = Math.abs(clickState.target.getBBox().x - endX),
        e = Math.abs(clickState.target.getBBox().x2 - endX);
    if(f > e) {
        startX = clickState.target.getBBox().x2;
    } else {
        startX = clickState.target.getBBox().x;
    }
    var sArrow = new Arrow(
        this.snap,
        startX, 
        clickState.destMouse.clientY,
        endX,
        clickState.destMouse.clientY
    );
    sArrow.draw();
    
    
    var assignment = new Assignment(
        this.snap,
        clickState.target.getBBox().cx,
        clickState.destMouse.clientY + sCall.rect.getBBox().height
    );
    assignment.draw();
    
    f = Math.abs(assignment.rect.getBBox().x2 - sCall.rect.getBBox().x2);
    e = Math.abs(assignment.rect.getBBox().x - sCall.rect.getBBox().x2);
    if(f > e) {
        endX = assignment.rect.getBBox().x;
    } else {
        endX = assignment.rect.getBBox().x2;
    }
    var returnArrow = new Arrow(
        this.snap,
        sCall.rect.getBBox().x2 - sCall.rect.getBBox().width/2,
        sCall.rect.getBBox().y + sCall.rect.getBBox().height,
        endX,
        assignment.rect.getBBox().y + assignment.rect.getBBox().height/2
    );
    returnArrow.draw();

    
    clickState.state = CLICK_STATE.NO_CLICK;
    clickState.target = undefined;
    clickState.dest = undefined;
}