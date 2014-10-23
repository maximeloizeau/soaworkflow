function ConditionnalIf(s, condition, x, y) {
    Element.call(this, s);
    
    this.CALL_WIDTH = 20;
    
    this.condition = condition;
    this.x = x;
    this.y = y;
}

ConditionnalIf.prototype = Object.create(Element.prototype);
ConditionnalIf.prototype.constructor = ConditionnalIf;

ConditionnalIf.prototype.draw = function() {
    var points = [
        this.x, this.y - this.CALL_WIDTH,
        this.x - this.CALL_WIDTH, this.y,
        this.x, this.y + this.CALL_WIDTH,
        this.x + this.CALL_WIDTH, this.y
    ];
    this.rect = this.snap.polygon(
       points
    );
      
    this.rect.attr({
        fill: "#50e272"
    });
    
    var size = this.condition.length * 4;
    this.text = this.snap.text(
        this.rect.getBBox().cx - size,
        this.rect.getBBox().cy + size / 10,
        "[ " + this.condition + " ]"
    );
    this.text.attr({
      fontFamily: 'Arial',
      fontSize: 14,
      textAnchor: 'left'
    });
    
};

ConditionnalIf.prototype.getObject = function() {
    return this.rect;
};

ConditionnalIf.prototype.getWorkflowCode = function() {
    return "if(" + this.condition + ") {";
};
