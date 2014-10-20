function ServiceCall(s, x, y) {
    Element.call(this, s);
    
    this.CALL_WIDTH = 100;
    this.CALL_HEIGHT = 40;
    
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
}