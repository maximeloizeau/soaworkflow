function ConditionnalEndIf(s, x, y) {
    Element.call(this, s);
    
    this.CALL_WIDTH = 30;
    
    this.condition = "endif";
    this.x = x;
    this.y = y;
    
    
    this.getWorkflowCode = function() {
        return "}";
    }
}

ConditionnalEndIf.prototype = Object.create(ConditionnalIf.prototype);
ConditionnalEndIf.prototype.constructor = ConditionnalEndIf;