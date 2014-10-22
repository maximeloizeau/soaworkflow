function EndFor(s, x, y) {
    Element.call(this, s);

    this.condition = "endFor";
    this.x = x;
    this.y = y;

    this.getWorkflowCode = function() {
        return "}";
    };
}

EndFor.prototype = Object.create(Element.prototype);
EndFor.prototype.constructor = EndFor;

EndFor.prototype.draw = function() {

    // Find the closer loop start
    var minimumDifference = 100000;
    var forloop = null;
    var forloopPosition = -1;

    var elements = services[0].callsFromEntity;
    for(var i = 0; i < elements.length; i++) {
        if(elements[i] instanceof ForLoop && !elements[i].complete) {
            var diff = (this.y - elements[i].getObject().getBBox().y);
            if(diff < minimumDifference) {
                minimumDifference = diff;
                forloop = elements[i];
                forloopPosition = i;
            }
        }
    }

    var extremeX = services[services.length - 1].getObject().getBBox().x + 125;

    if(forloop) {
        forloop.setFrame(extremeX, this.y);
    } else {
        alert('no loop found');
    }
};

