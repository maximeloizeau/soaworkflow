function CompositeCode(s, value, x, y) {
    Element.call(this, s);
    
    this.CALL_WIDTH = 100;
    this.CALL_HEIGHT = 40;
    
    this.value = value;
    this.x = x;
    this.y = y;
}

CompositeCode.prototype = Object.create(Element.prototype);
CompositeCode.prototype.constructor = CompositeCode;

CompositeCode.prototype.draw = function() {
    this.rect = this.snap.rect(
       this.x - this.CALL_WIDTH/2,
       this.y - this.CALL_HEIGHT/2,
       this.CALL_WIDTH,
       this.CALL_HEIGHT
    );
      
    this.rect.attr({
        fill: "#d0d683",
        stroke: "#000",
        strokeWidth: 0.5
    });
    
    var size = this.value.length * 3;
    this.text = this.snap.text(
        this.rect.getBBox().cx - size,
        this.rect.getBBox().cy + size / 10,
        this.value
    );
    this.text.attr({
      fontFamily: 'Arial',
      fontSize: 14,
      textAnchor: 'center'
    });

    this.composition.push(this.rect);
};

CompositeCode.prototype.getObject = function() {
    return this.rect;
};

CompositeCode.prototype.getWorkflowCode = function() {
    return this.value;
};

CompositeCode.prototype.toColor = function() {
    this.rect.attr({
        fill: "#d0d683",
        stroke: "#000",
        strokeWidth: 0.5
    });
};
