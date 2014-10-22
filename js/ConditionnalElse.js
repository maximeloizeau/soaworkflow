function ConditionnalElse(s, x, y) {
    ConditionnalIf.call(this, s);

    this.condition = "else";
    this.x = x;
    this.y = y;
    
    this.getWorkflowCode = function() {
        return "} " + this.condition + " { ";
    }
}

ConditionnalElse.prototype = Object.create(ConditionnalIf.prototype);
ConditionnalElse.prototype.constructor = ConditionnalElse;
