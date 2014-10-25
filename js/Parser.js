/* global document: false, parser: true, editor: false */

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
            parser.workflow.inputParameters = instr.replace("START", "").split(',');
        } else if(startsWith(instr, parser.TOKENS.RETURN)) {
            parser.workflow.outputParameter = instr.replace("RETURN", "");
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
