var CLICK_STATE = {
    NO_CLICK: {},
    FIRST_CLICK: {}
};

function addEntryPoint(entity) {
    var entrypoint = s.circle(entity.lifeLine.getBBox().x, entity.lifeLine.getBBox().y + 40, 20);
    entrypoint.attr({
       fill: "#ea0e0e" 
    });
    
    entrypoint.click(onElementClickListener.bind(this, entrypoint));
    
    return entrypoint;
}

function draw() {   
    s = Snap(1000, 1000);
    
    var composite = new Entity(s, "Composite");
    composite.draw();
    var bet = new Entity(s, "Bet Service", composite);
    bet.draw();
    var odds = new Entity(s, "Odds Service", bet);
    odds.draw();

    
    //addEntryPoint(composite);
}

var s;
var clickState = {
    state: CLICK_STATE.NO_CLICK
};
window.onload = draw;