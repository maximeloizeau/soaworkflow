function ServiceCall(s, name, x, y) {
    Element.call(this, s);
    
    this.CALL_WIDTH = 100;
    this.CALL_HEIGHT = 40;
    
    this.name = name;
    this.x = x;
    this.y = y;
}

ServiceCall.prototype = Object.create(Element.prototype);
ServiceCall.prototype.constructor = ServiceCall;

ServiceCall.prototype.draw = function() {
   this.rect = this.snap.rect(
       this.x - this.CALL_WIDTH/2,
       this.y - this.CALL_HEIGHT/2,
       this.CALL_WIDTH,
       this.CALL_HEIGHT
   );
   
    this.rect.click(this.onElementClick.bind(this, this.rect));
   
    this.rect.attr({
        fill: "#e3e3e3",
        stroke: "#000",
        strokeWidth: 0.5
    });
    
    this.rect.mouseover(this.mouseover.bind(this));
    this.rect.mouseout(this.mouseout.bind(this));    
    
    this.mouseout();
}

ServiceCall.prototype.mouseover = function() {
    if(this.text)
        this.text.remove();
    
    // TODO : fix the centering
    var size = this.name.length * 5;
    this.text = this.snap.text(
        this.rect.getBBox().cx - 42,
        this.rect.getBBox().cy + size / 10,
        this.name
    );
    this.text.attr({
      fontFamily: 'Arial',
      fontSize: 20,
      textAnchor: 'left'
    });
    
    this.text.mouseover(this.mouseover.bind(this));
    this.text.mouseout(this.mouseout.bind(this));
}

ServiceCall.prototype.mouseout = function() {
    if(this.text)
        this.text.remove();
    
    // TODO : fix the centering
    var size = this.name.length * 5;
    this.text = this.snap.text(
        this.rect.getBBox().cx - 42,
        this.rect.getBBox().cy + size / 10,
        this.name.substr(0, 7) + "..."
    );
    this.text.attr({
      fontFamily: 'Arial',
      fontSize: 20,
      textAnchor: 'left'
    });
    
    this.text.mouseover(this.mouseover.bind(this));
    this.text.mouseout(this.mouseout.bind(this));
}