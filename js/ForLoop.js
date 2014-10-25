function ForLoop(s, condition, x, y) {
    Element.call(this, s);

    this.CALL_WIDTH = 20;

    this.condition = "for " + condition;
    this.x = x;
    this.y = y;
    this.complete = false;
}

ForLoop.prototype = Object.create(Element.prototype);
ForLoop.prototype.constructor = ForLoop;

ForLoop.prototype.draw = function() {
    this.obj = this.snap.circle(this.x, this.y, this.CALL_WIDTH);
    this.obj.attr({
        fill: "#d3ea57"
    });

    var size = this.condition.length * 4;
    this.text = this.snap.text(
        this.obj.getBBox().x,
        this.obj.getBBox().y + 16,
        "[ " + this.condition + " ]"
    );
    this.text.attr({
      fontFamily: 'Arial',
      fontSize: 14,
      textAnchor: 'center'
    });

};

/**
 * Create a loop frame and replace the forloop circle
 *
 * Input : the position of the opposite point to draw the rectangle
 */
ForLoop.prototype.setFrame = function(endX, endY) {
    var frame = this.snap.rect(
        this.obj.getBBox().x - 50,
        this.obj.getBBox().y,
        endX - this.obj.getBBox().x,
        endY - this.obj.getBBox().y
    );
    frame.attr({
        fillOpacity: 0,
        stroke: "#333",
        strokeWidth: 0.5
    });

    var titleFrame = this.snap.rect(
        this.obj.getBBox().x - 50,
        this.obj.getBBox().y,
        45,
        20
    );
    titleFrame.attr({
        fill: "#333",
        fillOpacity: 0.5,
        stroke: "#333",
        strokeWidth: 0.5
    });

    var titleText = this.snap.text(
        titleFrame.getBBox().x + 5,
        titleFrame.getBBox().y + 13,
        "loop"
    );
    titleText.attr({
        fontFamily: 'Arial',
        fontSize: 12,
        textAnchor: 'left'
    });

    this.obj.remove();
    this.obj = frame;

    editor.lowerLayer.add(this.obj);

    this.complete = true;
};

ForLoop.prototype.getObject = function() {
    return this.obj;
};

ForLoop.prototype.getWorkflowCode = function() {
    return "for(" + this.condition + ") {";
};

