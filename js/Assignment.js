function Assignment(s, name, x, y) {
    Element.call(this, s);
    
    this.WIDTH = 100;
    this.HEIGHT = 40;
    
    this.name = name;
    this.x = x;
    this.y = y;
}

Assignment.prototype = Object.create(Element.prototype);
Assignment.prototype.constructor = Assignment;

Assignment.prototype.draw = function() {
   this.rect = this.snap.rect(
       this.x - this.WIDTH/2,
       this.y - this.HEIGHT/2,
       this.WIDTH,
       this.HEIGHT
   );
   
    this.rect.click(this.onElementClick.bind(this, this));
   
    this.rect.attr({
        fill: "#e58282",
        stroke: "#000",
        strokeWidth: 0.5
    });
    
    // TODO : fix the centering
    var size = this.name.length * 5;
    this.text = this.snap.text(
        this.rect.getBBox().cx - size,
        this.rect.getBBox().cy + size / 7,
        this.name
    );
    this.text.attr({
      fontFamily: 'Arial',
      fontSize: 16,
      textAnchor: 'left'
    });

    this.composition.push(this.rect);
};

Assignment.prototype.getObject = function() {
    return this.rect;
};

Assignment.prototype.getWorkflowCode = function() {
    return "";
};

Assignment.prototype.toColor = function() {
    this.rect.attr({
        fill: "#e58282",
        stroke: "#000",
        strokeWidth: 0.5
    });
};
