function ConditionnalElse(s, x, y) {
    Element.call(this, s);
    
    this.CALL_WIDTH = 30;
    
    this.condition = "else";
    this.x = x;
    this.y = y;
    
    this.getWorkflowCode = function() {
        return "} " + this.condition + " { ";
    }
}

ConditionnalElse.prototype = Object.create(ConditionnalIf.prototype);
ConditionnalElse.prototype.constructor = ConditionnalElse;