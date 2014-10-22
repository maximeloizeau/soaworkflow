function ConditionnalEndIf(s, x, y) {
    ConditionnalIf.call(this, s);
    
    this.condition = "endif";
    this.x = x;
    this.y = y;
    
    
    this.getWorkflowCode = function() {
        return "}";
    }
}

ConditionnalEndIf.prototype = Object.create(ConditionnalIf.prototype);
ConditionnalEndIf.prototype.constructor = ConditionnalEndIf;
