function Entity(s, name, nextTo) {
    Element.call(this, s);
    
    this.SERVICE_WIDTH = 150;
    this.SERVICE_HEIGHT = 50;
    this.SERVICE_LIFELINE = 800;
    this.SERVICE_ATTR = {
        fill: "#7a6ece",
        stroke: "#000",
        strokeWidth: 1
    };
    
    this.snap = s;
    this.name = name;
    
    if(!nextTo) {
        this.x = 0;
        this.y = 0;
    } else {
        this.x = nextTo.x + this.SERVICE_WIDTH + 100;
        this.y = nextTo.y;
    }

    this.neighbor = nextTo;
}

Entity.prototype = Object.create(Element.prototype);
Entity.prototype.constructor = Entity;

Entity.prototype.draw = function() {
    var lineX = this.x + (this.SERVICE_WIDTH/2);
    var lineY = this.y + this.SERVICE_HEIGHT;
    this.lifeLine = this.snap.line(
        lineX, lineY,
        lineX, lineY + this.SERVICE_LIFELINE
    );
    this.lifeLine.attr({
        stroke: "#199127",
        strokeWidth: 6
    });
    
    this.lifeLine.click(this.onElementClick.bind(this, this.lifeLine));
    
    this.rect = this.snap.rect(
        this.x, this.y,
        this.SERVICE_WIDTH, this.SERVICE_HEIGHT
    );
    this.rect.attr(this.SERVICE_ATTR);
    
    // TODO : fix the centering
    var size = this.name.length * 5;
    this.text = this.snap.text(
        this.rect.getBBox().cx - size,
        this.rect.getBBox().cy + size / 10,
        this.name
    );
    this.text.attr({
      fontFamily: 'Arial',
      fontSize: 20,
      textAnchor: 'left'
    });
}   