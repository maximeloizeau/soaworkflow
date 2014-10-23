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
    
    this.callsFromEntity = [];
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
    this.lifeLine.addClass("clickable");
    
    this.lifeLine.click(this.onElementClick.bind(this, this));
    
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
};

Entity.prototype.getObject = function() {
    return this.lifeLine;
};

Entity.prototype.getWorkflowCode = function() {
    return "";
};

Entity.prototype.getServiceName = function() {
    return this.name;
};

Entity.prototype.push = function(el) {
    var compare = function(p1, p2) {
        console.log(p1, p2);
        var x1 = p1.getObject().getBBox().x,
            y1 = p1.getObject().getBBox().y,
            x2 = p2.getObject().getBBox().x,
            y2 = p2.getObject().getBBox().y;

        if(x1 <= x2 && y1 <= y2 ||
           y1 <= y2 && x1 >= x2) {
            console.log('p1 higher than p2');
            return 1;
        } else {
            console.log('p1 lower than p2');
            return -1;
        }
    };

    var locationOf = function (element, array, start, end) {
        start = start || 0;
        end = end || array.length;
        var pivot = parseInt(start + (end - start) / 2, 10);

        //if (array[pivot] === element) return pivot;

        if (end - start <= 1) {
            return compare(array[pivot], element) == -1 ? pivot - 1 : pivot;
        } else if (compare(array[pivot], element) == 1) {
            return locationOf(element, array, pivot, end);
        } else {
            return locationOf(element, array, start, pivot);
        }
    };

    if(this.callsFromEntity.length == 0) {
        this.callsFromEntity.push(el);
    } else {
        this.callsFromEntity.splice(locationOf(el, this.callsFromEntity) + 1, 0, el);
    }
};
