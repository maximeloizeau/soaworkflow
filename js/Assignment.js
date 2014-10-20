function Assignment(s, x, y) {
    Element.call(this, s);
    
    this.WIDTH = 100;
    this.HEIGHT = 40;
    
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
   
    this.rect.click(this.onElementClick.bind(this, this.rect));
   
    this.rect.attr({
        fill: "#e58282",
        stroke: "#000",
        strokeWidth: 0.5
    });
}