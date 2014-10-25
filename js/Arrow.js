function Arrow(s, x1, y1, x2, y2) {
    this.snap = editor.snap;

    this.composition = [];
    
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

Arrow.prototype.draw = function() {
    
    var points;
    if(this.y1 != this.y2) {
        points = [
            this.x1,
            this.y1,
            this.x1,
            this.y1 + (this.y2 - this.y1),
            this.x2,
            this.y2
        ];
    } else {
        points = [
            this.x1,
            this.y1,
            this.x2,
            this.y2
        ];
    }
    this.line = this.snap.polyline(
        points
    );
    this.line.attr({
        fillOpacity: 0,
        stroke: "#9d9d9d",
        strokeWidth: 0.5
    });
    
    points = [];
    if(this.x2 > this.x1) {
        points = [
            this.x2, this.y2,
            this.x2 - 10, this.y2 - 10,
            this.x2 - 10, this.y2 + 10,
        ];
    } else {
        points = [
            this.x2, this.y2,
            this.x2 + 10, this.y2 - 10,
            this.x2 + 10, this.y2 + 10,
        ];
    }
    
    this.arrow = this.snap.polygon(points);
    this.arrow.attr({
        fill: "#9d9d9d"
    });

    this.composition.push(this.arrow);
    this.composition.push(this.line);
};

Arrow.prototype.getObject = function() {
    return this.line;
};

Arrow.prototype.toGrey = function() {

};

Arrow.prototype.toColor = function() {

};
