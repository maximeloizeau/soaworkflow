/* global document: false, parser: true, editor: true, Editor: false */

function Parser() {
    this.TOKENS = {
        START: "START",
        RETURN: "RETURN",
        FOR: "for",
        IF: "if",
        ELSE: "else"
    };

    this.workflow = {
        services: [],
        higherY: 80
    };
    this.stack = [];
}

Parser.prototype.start = function() {
    document.getElementById('parser').style.display = "block";
    document.getElementById('homepage').style.display = "none";


    document.getElementById('startParsing').addEventListener('click', function() {
       parser.startParser(document.getElementById('workflowToParse').value);
    });
};

Parser.prototype.startParser = function(workflow) {
    document.getElementById('parser').style.display = "none";
    document.getElementById('editor').style.display = "block";

    editor = new Editor();
    editor.start();

    parser.workflow.composite = editor.services[0];


    var startsWith = function(str, strToFind) {
        var r = new RegExp("^" + strToFind, "i");
        return r.test(str);
    };

    var isServiceCall = function(str) {
        // TODO authorize 0 parameters ?
        var r = /((?!T)(?!H)(?!I)(?!S)[a-z0-9]+)\.[a-z0-9]+\(([a-z0-9\[\]]+(,[a-z0-9\[\]]+)*)*\)$/i;
        return r.test(str);
    };


    var instructions = workflow.replace(/ /g, "").split('\n');
    instructions.forEach(function(instr) {
        //console.log(instr);

        if(startsWith(instr, parser.TOKENS.START)) {
            parser.workflow.inputParameters = instr.replace(parser.TOKENS.START, "").split(',');
            document.getElementById("inputs").value = parser.workflow.inputParameters;
        } else if(startsWith(instr, parser.TOKENS.RETURN)) {
            parser.workflow.outputParameter = instr.replace(parser.TOKENS.RETURN, "");
            document.getElementById("output").value = parser.workflow.outputParameter;
        } else if(startsWith(instr, parser.TOKENS.FOR)) {
            var forCondition = instr.substring(4, instr.indexOf(")"));

            editor.addFor(forCondition, parser.workflow.higherY);
            parser.workflow.higherY = parser.workflow.higherY + 50;

            //if(instr.indexOf("{") > 0) {
                parser.stack.push(parser.TOKENS.FOR);
            //}
        } else if(startsWith(instr, parser.TOKENS.IF)) {
            var ifCondition = instr.substring(3, instr.indexOf(")"));

            editor.addIf(ifCondition, parser.workflow.higherY);
            parser.workflow.higherY = parser.workflow.higherY + 50;

            //if(instr.indexOf("{") > 0) {
                parser.stack.push(parser.TOKENS.IF);
            //}
        } else if(startsWith(instr, parser.TOKENS.ELSE)) {

            editor.addElse(parser.workflow.higherY);
            parser.workflow.higherY = parser.workflow.higherY + 50;

            //if(instr.indexOf("{") > 0) {
                parser.stack.push(parser.TOKENS.ELSE);
            //}
        } else if(isServiceCall(instr)) {
            var serviceCall = instr.split('.');
            var serviceName = serviceCall[0];
            var serviceMethod = serviceCall[1];
            var affect = "";

            if(serviceName.indexOf("=") > 0) {
                var splitted = serviceName.split("=");
                affect = splitted[0];
                serviceName = splitted[1];
            }

            if(parser.workflow.services.indexOf(serviceName) < 0) {
                parser.workflow.services.push(serviceName);
                editor.addEntity(serviceName);
            }

            parser.workflow.composite.onElementClick(
                parser.workflow.composite,
                {
                    clientX: parser.workflow.composite.getObject().getBBox().cx,
                    clientY: parser.workflow.higherY
                }
            );

            for(var i = 0; i < editor.services.length; i++) {
                if(editor.services[i].name == serviceName) {
                    editor.services[i].onElementClick(
                        editor.services[i],
                        {
                            clientX: editor.services[i].getObject().getBBox().cx,
                            clientY: parser.workflow.higherY
                        },
                        serviceMethod,
                        affect
                    );
                }
            }

            parser.workflow.higherY = parser.workflow.higherY + 100;
        } else if(instr.length > 0 && instr.indexOf("}") < 0 && instr.indexOf("{") < 0) {
            editor.addCompositeCode(instr, parser.workflow.higherY);
            parser.workflow.higherY = parser.workflow.higherY + 50;
        }


        // Detect end of blocks
        for(var i = 0; i < instr.length; i++) {
            if(instr[i] == '}') {
                var block = parser.stack.pop();

                switch(block) {
                    case parser.TOKENS.FOR:
                        editor.addEndFor(parser.workflow.higherY);
                        parser.workflow.higherY = parser.workflow.higherY + 50;
                        break;
                    case parser.TOKENS.IF:
                        editor.addEndIf(parser.workflow.higherY);
                        parser.workflow.higherY = parser.workflow.higherY + 50;
                        break;
                    case parser.TOKENS.ELSE:
                        console.log("ENDELSE");
                        break;
                }
            }
        }
    });
};

Parser.prototype.workflowInExecution = function() {
    editor.services[0].callsFromEntity.forEach(function(service) {
        service.toGrey();
    });
    editor.services.forEach(function(service) {
        service.toGrey();
    });
};

Parser.prototype.highlight = function(name) {
    var startLookingAt = 0;
    if(this.lastHighlight) {
        this.lastHighlight.toGrey();

        startLookingAt = editor.services[0].callsFromEntity.indexOf(this.lastHighlight);
        this.lastHighlight = null;
    }

    var splittedName = name.split('.');
    for(var i = 0; i<editor.services[0].callsFromEntity.length; i++) {
        var e = editor.services[0].callsFromEntity[i];
        if( e instanceof ServiceCall &&
            e.name.split('(')[0] == splittedName[1] &&
            e.serviceParent.name == splittedName[0] ) {
            this.lastHighlight = e;

            break;
        } else if(e instanceof CompositeCode) {
            var r = new RegExp(name.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + "\([a-z0-9,\\[\\]]*\)", "i");

            if(r.test(e.value)) {
                this.lastHighlight = e;

                break;
            }
        }
    }

    if(this.lastHighlight) {
        this.lastHighlight.toColor();
    }
};

Parser.prototype.workflowFinished = function() {
    editor.services[0].callsFromEntity.forEach(function(service) {
        service.toColor();
    });
    editor.services.forEach(function(service) {
        service.toColor();
    });
};
