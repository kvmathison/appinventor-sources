goog.provide('bd.acorn.ctr');

bd.acorn.ctr.isGameblox = false;
bd.acorn.ctr.blockTypesLoaded = false;

var functionNameToBlockName =   {"random":"math_random_int",                //random(1,5)
                                "moveSomeSteps":"move_steps",               //sprite1.moveSomeSteps(5)
                                "defineGlobal":"variables_init",            //defineGlobal(Value, "thing", 5)
                                "whenGameStarts":"game_start_statement",    //whenGameStarts(function(){statements...etc.})
                                "join":"text_join",                         //join("string1","string2",etc)
                                "min":'math_max_min',                       //min(1,2,3,4,...)
                                "arithmetic": "math_arithmetic",
                                "defineProcedure": "procedures_def",
                                "if" : "controls_if",
                                "boolean": 'logic_boolean'
                                };

var keyMappings = {
	"Input.LEFT_ARROW":"37",
	"Input.RIGHT_ARROW":"39",
	"Input.UP_ARROW":"38",
	"Input.DOWN_ARROW":"40",
	"Input.SPACEBAR":"32",
	"Input.ENTER":"13",
	"any":"any",

	"Color.RED":"RED",
	"Color.GREEN":"GREEN",
	"Color.BLUE":"BLUE",
	"Color.HUE":"HUE",
	"Color.SATURATION":"SATURATION",
	"Color.BRIGHTNESS":"BRIGHTNESS",

	"Players.ALL_PLAYERS":"ALL_PLAYERS",
	"Players.ALL_PLAYERS_EXCEPT_CALLER":"ALL_PLAYERS_NO_CALLER"
};


/**
 * replacement for getCurrentBlockly - here for gameblox compatibility
 */
bd.acorn.ctr.getCurrentBlockly = function() {
    var Blockly = (window.Blockly ? window.Blockly : bd.script.ctr.getCurrentBlockly());
    //Blockly.window = window //TODO: remove - here for gameblox compatibility
    return Blockly
};

// replacement for bd.util functions TODO: remove, not necessary for AI
bd.acorn.removePrefix = function(stringWithPrefix,prefix){
    return stringWithPrefix.replace(prefix + ":","")
}

bd.acorn.containsPrefix = function(stringWithPrefix,prefix){
    return (stringWithPrefix + "").substr(0,prefix.length) == prefix;
}


/**
 * loads all blocks in Blockly.Blocks namespace to the functionNameToBlockName dictionary that contain jsBlockInfo's
 */
bd.acorn.ctr.loadBlockTypes = function() {
    if (!bd.acorn.ctr.blockTypesLoaded) {
        var Blockly = bd.acorn.ctr.getCurrentBlockly();
        Blockly.window = window // TODO: remove - here for gameblox compatibility
        for (var blockType in Blockly.Blocks) {
            if (Blockly.Blocks[blockType].jsBlockInfo) {
                var blockInfoMethodName = (Blockly.Blocks[blockType].jsBlockInfo.setMethodName != null ? Blockly.Blocks[blockType].jsBlockInfo.setMethodName() : Blockly.Blocks[blockType].jsBlockInfo.methodName);
                if(blockInfoMethodName instanceof Array){
                    for(var x = 0; x < blockInfoMethodName.length; x++){
                        functionNameToBlockName[blockInfoMethodName[x]] = blockType;
                    }
                } else {
                    functionNameToBlockName[blockInfoMethodName] = blockType;
                }
            }
        }
        bd.acorn.ctr.blockTypesLoaded = true;
    }
};


/*
ok, so I've managed to clear out the preset keywords
now I need to be able to auto-generate all the snippets I want from the jsBlockInfo texts for each block
then I need to be able to figure out how to parse about those strings and format them into the snippet format I want
that way people can auto-generate new blocks they have just added

so in order to do that...I need to pull that sequence of code from all my function calls
in which case, I might as well just start with the transformation of my code from NETU and NRFC to ETU, RFC, and SFB
*/



/**
 * finds all blocks in Blockly.Blocks namespace and returns references to all blocks with jsBlockInfo
 * @return {} - 
 */
bd.acorn.ctr.findAllBlocksWithJSBlockInfo = function() {
    var outputList = [];

    var Blockly = bd.acorn.ctr.getCurrentBlockly();
    for (var blockType in Blockly.Blocks) {
        if (Blockly.Blocks[blockType].jsBlockInfo) {

            outputList.append(blockType);


            // if(Blockly.Blocks[blockType].jsBlockInfo.methodName instanceof Blockly.window.Array){
            //     for(var x = 0; x < Blockly.Blocks[blockType].jsBlockInfo.methodName.length; x++){
            //         functionNameToBlockName[Blockly.Blocks[blockType].jsBlockInfo.methodName[x]] = blockType;
            //     }
            // } else {
            //     functionNameToBlockName[Blockly.Blocks[blockType].jsBlockInfo.methodName] = blockType;
            // }




        }
    }
    return outputList;
};

/**
 *
 */
bd.acorn.ctr.thing = function() {
    var listofBlocks = findAllBlocksWithJSBlockInfo();


    // ok so what this should do is that it should take in all the blockType's and then
    // given that...I can take all of them, and generate the text from them....
    // uuuuhhhhh...how do I do that???
    // ok so I should really be looking at my blockToText thing to see how I generate an empty text from those
    // and then I need to figure out where to put in %1,2,3's...


    // ok so let's say I have all the blocks...what to do now?



};






/**
 * Creates text version of all blocks in the workspace and returns the string
 * @return {string} text that represents all the blocks in the workspace in gamebloxJS format
 */
bd.acorn.ctr.populateTextEditor = function() {
	var blockly = bd.acorn.ctr.getCurrentBlockly();
	var text = "";
	var listOfTopBlocks = blockly.mainWorkspace.getTopBlocks();
	for (var x = 0; x < listOfTopBlocks.length; x++) {
        text += bd.acorn.ctr.createOptionsText(listOfTopBlocks[x]);
		text += bd.acorn.ctr.blockToText(listOfTopBlocks[x]);
		if (listOfTopBlocks[x].outputConnection) {
			text += ";";
		}
		text += "\n";
	}
	return text;
};

/**
 * creates the OPTIONS comment text to add onto top blocks
 * @param {Object} block - the JS block object that contains all the information to generate the XML block
 * @return {string} options - String containing the OPTIONS comment, in the format of '// OPTIONS: ...;...;'
 */
bd.acorn.ctr.createOptionsText = function(blockObject) {
    var optionsText = "// OPTIONS: "
    var result;

    if (result = blockObject.getRelativeToSurfaceXY()) {
        optionsText += "COORDINATES: ";
        optionsText += "x:" + result.x;
        optionsText += ", y:" + result.y;
        optionsText += ";";
    }

    // if you want to add new options to be generated from blocks, add here

    optionsText += "\n";
    return optionsText;
};

bd.acorn.ctr.createBlock = function(text){
    var tree = bd.acorn.ctr.createTree(text);
    var treeObject = bd.toolbox.ctr.blockInfoToBlockObject(tree);
    var treeXML = bd.toolbox.ctr.blockObjectToXML(treeObject);
    var blockly = bd.acorn.ctr.getCurrentBlockly();
    if (bd.acorn.ctr.isGameblox) {
        var block = blockly.Xml.domToBlock(blockly.mainWorkspace, treeXML);
    }
    else {
        var block = blockly.Xml.domToBlock(treeXML, blockly.mainWorkspace);
    }
    //repopulate(block);
};


bd.acorn.ctr.createXmlBlock = function(text){
    var tree = bd.acorn.ctr.createTree(text);
    var treeObject = bd.toolbox.ctr.blockInfoToBlockObject(tree);
    var treeXML = bd.toolbox.ctr.blockObjectToXML(treeObject);
    return treeXML;
};

bd.acorn.ctr.populateDOM = function(treeXML) {
	var blockly = bd.acorn.ctr.getCurrentBlockly();
    if (bd.acorn.ctr.isGameblox) {
        blockly.Xml.domToWorkspace(blockly.mainWorkspace, treeXML);
    }
    else {
        blockly.Xml.domToWorkspace(treeXML, blockly.mainWorkspace);
    }

    //update all titles on script page
    //bd.component.lookup(bd.script.ctr.getSelectedScriptPageId()).updateAllTitles();
};













/**
 * Recursively takes a Blockly block and returns a string representing a block, with possibly other blocks contained within that block
 * @param {Object} block - Blockly block that is being transformed into text
 * @return {String} string that represents the block as some kind of gamebloxJS statement
 */
bd.acorn.ctr.blockToText = function(block){

    var objectName = bd.acorn.ctr.extractObjectName(block);
    var methodName = bd.acorn.ctr.extractMethodName(block);

    // removing namespace prefixes/suffixes and returning the text from the block
    // returns if there was a namespace prefix/suffix
    var textWithoutNamespace;
    if (textWithoutNamespace = bd.acorn.ctr.removeNamespaceMsgJSAndReturnText(block)) {
        return textWithoutNamespace;
    }

    returnObjectOfCreateTextParameterArrays = bd.acorn.ctr.createTextParameterArrays(block, methodName);
    var textParameters = returnObjectOfCreateTextParameterArrays['textParameters'];
    var numberOfTextParameters = returnObjectOfCreateTextParameterArrays['numberOfTextParameters'];
    var callbackParametersFromTPInfo = returnObjectOfCreateTextParameterArrays['callbackParametersFromTPInfo'];

    var input = [];
    bd.acorn.ctr.extractJSBlockInfoText(block, numberOfTextParameters, textParameters, input, methodName);

    var callbackFunctionParameters = [];
    bd.acorn.ctr.identifyCallbackFunctionParameters(block, callbackFunctionParameters, callbackParametersFromTPInfo);

    var text = bd.acorn.ctr.createJSText(block, objectName, methodName, input, callbackFunctionParameters);

    text = bd.acorn.ctr.addNextBlockText(block, textParameters, text);

    return text;

};













// -------------------------------------------- blockToText helper methods --------------------------------------------//


/**
 *  Extracts name of the object for a block,
 *      eg: sprite1 is extracted from a move block
 *  @param {Object} block - the Blockly block information is being extracted from
 *  @return {String} objectName - String that contains the object name
 */
bd.acorn.ctr.extractObjectName = function(block) {
    var blockInfo = block.jsBlockInfo;
    var isEntity = false, isGlobal = false;
    var objectName = null;
    // this block of code checks what the scope is, if the scope is not global, it has some entity and that entity is the object name
    if(blockInfo.scope != null && blockInfo.scope !== "GLOBAL"){
        var fieldValue = block.getFieldValue(blockInfo.scope);

        if (fieldValue != null) {
            if (bd.acorn.containsPrefix(fieldValue, "id")) {
                var id = bd.acorn.removePrefix(fieldValue, "id");
                objectName = bd.component.lookup(id).model.name;
            } else if (bd.acorn.containsPrefix(fieldValue, "msg:")) {
                var msgWithoutNamespace = bd.acorn.removePrefix(fieldValue, "msg");
                if (bd.msg.contextVariables[msgWithoutNamespace + '_JS'] != null) {
                    objectName = bd.msg.contextVariables[msgWithoutNamespace + '_JS'];
                } else {
                    objectName = bd.msg.contextVariables[msgWithoutNamespace];
                }
            } else {
                objectName = fieldValue;
            }
        } else {
            objectName = blockInfo.scope;
        }
        isEntity = true;
    } else if(blockInfo.scope === "GLOBAL"){
        isGlobal = true;
    }

    return objectName;
};

/**
 *  Extracts method name of the current block
 *  @param {Object} block - the Blockly block information is being extracted from
 *  @return {String} methodName - method name of the block
 */
bd.acorn.ctr.extractMethodName = function(block) {
    //var Blockly = bd.acorn.ctr.getCurrentBlockly();
    //Blockly.window = window //TODO: remove - here for gameblox compatibility
    var blockInfo = block.jsBlockInfo;
    var isMethod = false;

    // figures out what the method name is, depending on whether it there are multiple method names in jsBlockInfo or just one
    var blockInfoMethodName = (blockInfo.setMethodName != null ? blockInfo.setMethodName() : blockInfo.methodName);
    if (blockInfoMethodName != null ){
        
        if (blockInfoMethodName instanceof Array) {

            for (var x = 0; x < blockInfoMethodName.length; x++) {
                var blockInfoMethodNameToBlockValues = (blockInfo.setMethodNameToBlockValues != null ? blockInfo.setMethodNameToBlockValues() : blockInfo.methodNameToBlockValues);
                var fieldNameToValueObject = blockInfoMethodNameToBlockValues[blockInfoMethodName[x]].fieldNameToValue;
                
                if (blockInfoMethodNameToBlockValues[blockInfoMethodName[x]].multipleMutatorNameToValue != null) {
                    var mutatorNameToValueObject = blockInfoMethodNameToBlockValues[blockInfoMethodName[x]].multipleMutatorNameToValue;
                } else {
                    var mutatorNameToValueObject = blockInfoMethodNameToBlockValues[blockInfoMethodName[x]].mutatorNameToValue;
                }

                var checksForFields = true, checksForMutators = true;
                if (fieldNameToValueObject != null) {
                    for (var fieldNames in fieldNameToValueObject) {
                        if (!(block.getFieldValue(fieldNames) === fieldNameToValueObject[fieldNames])) {
                            checksForFields = false;
                            break;
                        }
                    }
                }
                if (mutatorNameToValueObject != null) {
                    if (mutatorNameToValueObject instanceof Array) {
                        for (var y = 0; y < mutatorNameToValueObject.length; y++) {
                            checksForMutators = true;
                            for (var mutatorNames in mutatorNameToValueObject[y]) {
                                if(bd.acorn.ctr.isGameblox) {
                                    if (!(block.mutators[mutatorNames] === mutatorNameToValueObject[y][mutatorNames] || block.mutators[block.getMutatorNameToInfoObject()[mutatorNames].blockVariableName] === mutatorNameToValueObject[y][mutatorNames])) {
                                        checksForMutators = false;
                                        break;
                                    }
                                }
                                else {
                                    if (!(block[block.getMutatorNameToInfoObject()[mutatorNames].blockVariableName] === mutatorNameToValueObject[y][mutatorNames])) {
                                        checksForMutators = false;
                                        break;
                                    }
                                }
                            }
                            if (checksForMutators) {
                                break;
                            }
                        }
                    } else {
                        for (var mutatorNames in mutatorNameToValueObject) {
                            if(bd.acorn.ctr.isGameblox) {
                                if (!(block.mutators[mutatorNames] == mutatorNameToValueObject[mutatorNames] || block.mutators[block.getMutatorNameToInfoObject()[mutatorNames].blockVariableName] == mutatorNameToValueObject[mutatorNames])) {
                                    checksForMutators = false;
                                    break;
                                }
                            }
                            else {
                                if (!(block[block.getMutatorNameToInfoObject()[mutatorNames].blockVariableName] == mutatorNameToValueObject[mutatorNames])) {
                                    checksForMutators = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (checksForFields && checksForMutators) {
                    methodName = blockInfoMethodName[x];
                    break;  // added this break because it seems that it should be right if it reached point...hopefully it is
                }
            }
        } else {
            methodName = blockInfoMethodName;
            isMethod = true;
        }
    }

    return methodName;
};

/**
 *  Removes prefix of "msg:" or suffix of "_JS" from blocks without a blockToText function
 *  @param {Object} block - the Blockly block that is being parsed into text
 *  @return {String} text - only returns if the block text had "msg:" prefix or "_JS" suffix
 */
bd.acorn.ctr.removeNamespaceMsgJSAndReturnText = function (block) {
    var blockInfo = block.jsBlockInfo;

    if (blockInfo.blockToText != null){
        var text = blockInfo.blockToText(block);
        if (bd.acorn.containsPrefix(text, "msg:")) {
             var msgWithoutNamespace = bd.acorn.removePrefix(text, "msg");
             if (bd.msg.contextVariables[msgWithoutNamespace + '_JS'] != null) {
                 text = bd.msg.contextVariables[msgWithoutNamespace + '_JS'];
             } else {
                 text = bd.msg.contextVariables[msgWithoutNamespace];
             }
        }
        if (bd.acorn.containsPrefix(text, "id:")) {
            var id = bd.acorn.removePrefix(text, "id");
            text = bd.component.lookup(id).model.name;
        }
        return text;
    }
};

/**
 *  Determines what the text parameters are based on jsBlockInfo, along with callback function parameters, and the number of parameters
 *  @param {Object} block - the Blockly block information is being extracted from
 *  @param {String} methodName - name of the method in the Blockly block's jsBlockInfo
 *  @return {Object} returnObject - contains three fields that contains the following information
 *      'textParameters' - array containing the names of the regular variable method parameters
 *      'callbackParametersFromTPInfo' - containing the names of the callback function method parameters
 *      'numberOfTextParameters' - integer representing the number of method parameters to deal with
 */
bd.acorn.ctr.createTextParameterArrays = function(block, methodName) {
    var blockInfo = block.jsBlockInfo;

    // return variables
    var returnObject = {};
    var textParameters, numberOfTextParameters, callbackParametersFromTPInfo;
    //------------------//

    var areParameters, argTypes;
    var whatToTreatAsEntity; // is a list
    var blockInfoMethodNameToBlockValues = (blockInfo.setMethodNameToBlockValues != null ? blockInfo.setMethodNameToBlockValues() : blockInfo.methodNameToBlockValues);

    // this block of code determines what the text parameters are based on jsBlockInfo
    // if there are overloaded methods, the second if statement block deals with it
    if (blockInfoMethodNameToBlockValues != null && blockInfoMethodNameToBlockValues[methodName].textParameters != null) {
        textParameters = blockInfoMethodNameToBlockValues[methodName].textParameters;
        numberOfTextParameters = textParameters.length;
    } else if (blockInfo.overloadedTextParameters != null && blockInfo.textParametersInfo != null) {

        for (var x = 0; x < blockInfo.overloadedTextParameters.length; x++) {
            textParameters = [];
            for (var y = 0; y < blockInfo.overloadedTextParameters[x].parameters.length; y++) {
                var nameOfParameter = blockInfo.overloadedTextParameters[x].parameters[y];
                var argTypeOfParameter = blockInfo.overloadedTextParameters[x].overloadingArgTypes[y];

                var hadMutator = false;

                if (blockInfo.textParametersInfo[nameOfParameter] != null && blockInfo.textParametersInfo[nameOfParameter].incrementName === true) {
                    for (var z = 0; (block.getFieldValue(nameOfParameter + z) != null) || (block.getInputTargetBlock(nameOfParameter + z) != null); z++) {
                        areParameters = true;
                        hadMutator = true;

                        if (argTypeOfParameter === "ArrayExpression") {
                            if (typeof textParameters[textParameters.length - 1] === "object") {
                                textParameters[textParameters.length - 1].push(nameOfParameter + z);
                            } else {
                                textParameters.push([nameOfParameter + z]);
                            }
                        } else if (argTypeOfParameter === "ObjectExpression") {
                            if (typeof textParameters[textParameters.length - 1] === "object") {
                                textParameters[textParameters.length - 1][nameOfParameter + z] = blockInfo.textParametersInfo[nameOfParameter].hasValue + z;
                            } else {
                                textParameters.push({});
                                textParameters[textParameters.length - 1][nameOfParameter + z] = blockInfo.textParametersInfo[nameOfParameter].hasValue + z;
                            }
                        } else {
                            textParameters.push(nameOfParameter + z);
                        }


                    }
                    if (!hadMutator) {
                        areParameters = false;
                        break;
                    } else {
                        continue;
                    }

                }

                if (block.getFieldValue(nameOfParameter) != null || block.getInput(nameOfParameter) != null || block.getInputTargetBlock(nameOfParameter) != null) {
                    areParameters = true;

                    textParameters.push(nameOfParameter);
                } else {
                    areParameters = false;
                    break;
                }
            }
            if (areParameters) {
                // textParameters = blockInfo.overloadedTextParameters[x].parameters.slice();
                numberOfTextParameters = textParameters.length;
                argTypes = blockInfo.overloadedTextParameters[x].overloadingArgTypes.slice();
                break;
            }
        }


        for (var attributes in blockInfo.textParametersInfo) {
            if (blockInfo.textParametersInfo[attributes].callbackParameters != null) {
                for (var a = 0; a < blockInfo.textParametersInfo[attributes].callbackParameters.length; a++) {
                    var nameOfParameter = blockInfo.textParametersInfo[attributes].callbackParameters[a].name;

                    if (blockInfo.textParametersInfo[attributes].callbackParameters[a].incrementName) {
                        for (var z = 0; (block.getFieldValue(nameOfParameter + z) != null) || (block.getInputTargetBlock(nameOfParameter + z) != null); z++) {
                            if(callbackParametersFromTPInfo != null) {
                                callbackParametersFromTPInfo.push(nameOfParameter + z);
                            }
                            else {
                                callbackParametersFromTPInfo = [];
                                callbackParametersFromTPInfo.push(nameOfParameter + z);
                            }
                        }
                    } else {
                        if(callbackParametersFromTPInfo != null) {
                            callbackParametersFromTPInfo.push(nameOfParameter);
                        }
                        else {
                            callbackParametersFromTPInfo = [];
                            callbackParametersFromTPInfo.push(nameOfParameter);
                        }
                    }
                }
            }
        }




    } else if (blockInfo.multipleMethodsOverloadedTextParameters != null && blockInfo.textParametersInfo != null) {
        // ok so the steps are...I need to figure out what the right text parameter list is
        // then I can use the generation of my text parameter list to recognize multiple as a thing and then just add on the right number of textParameters in a list
        // then, when I generate the, I can just grab the inputBlocks and the right values....
        // easy peasy

        var overloadedTextParameters = blockInfo.multipleMethodsOverloadedTextParameters[methodName];

        for (var x = 0; x < overloadedTextParameters.length; x++) {
            textParameters = [];
            for (var y = 0; y < overloadedTextParameters[x].parameters.length; y++) {
                var nameOfParameter = overloadedTextParameters[x].parameters[y];
                var argTypeOfParameter = overloadedTextParameters[x].overloadingArgTypes[y];

                var hadMutator = false;

                if (blockInfo.textParametersInfo[nameOfParameter] != null && blockInfo.textParametersInfo[nameOfParameter].incrementName === true) {
                    for (var z = 0; (block.getFieldValue(nameOfParameter + z) != null) || (block.getInputTargetBlock(nameOfParameter + z) != null); z++) {
                        areParameters = true;
                        hadMutator = true;

                        if (argTypeOfParameter === "ArrayExpression") {
                            if (typeof textParameters[textParameters.length - 1] === "object") {
                                textParameters[textParameters.length - 1].push(nameOfParameter + z);
                            } else {
                                textParameters.push([nameOfParameter + z]);
                            }
                        } else if (argTypeOfParameter === "ObjectExpression") {
                            if (typeof textParameters[textParameters.length - 1] === "object") {
                                textParameters[textParameters.length - 1][nameOfParameter + z] = blockInfo.textParametersInfo[nameOfParameter].hasValue + z;
                            } else {
                                textParameters.push({});
                                textParameters[textParameters.length - 1][nameOfParameter + z] = blockInfo.textParametersInfo[nameOfParameter].hasValue + z;
                            }
                        } else {
                            textParameters.push(nameOfParameter + z);
                        }


                    }
                    if (!hadMutator) {
                        areParameters = false;
                        break;
                    } else {
                        continue;
                    }

                }

                if (block.getFieldValue(nameOfParameter) != null || block.getInput(nameOfParameter) != null || block.getInputTargetBlock(nameOfParameter) != null) {
                    areParameters = true;

                    textParameters.push(nameOfParameter);
                } else {
                    areParameters = false;
                    break;
                }
            }
            if (areParameters) {
                numberOfTextParameters = textParameters.length;
                argTypes = overloadedTextParameters[x].overloadingArgTypes.slice();
                break;
            }
        }

        for (var attributes in blockInfo.textParametersInfo) {
            if (blockInfo.textParametersInfo[attributes].callbackParameters != null) {
                for (var a = 0; a < blockInfo.textParametersInfo[attributes].callbackParameters.length; a++) {
                    var nameOfParameter = blockInfo.textParametersInfo[attributes].callbackParameters[a].name;

                    if (blockInfo.textParametersInfo[attributes].callbackParameters[a].incrementName) {
                        for (var z = 0; (block.getFieldValue(nameOfParameter + z) != null) || (block.getInputTargetBlock(nameOfParameter + z) != null); z++) {
                            if(callbackParametersFromTPInfo != null) {
                                callbackParametersFromTPInfo.push(nameOfParameter + z);
                            }
                            else {
                                callbackParametersFromTPInfo = [];
                                callbackParametersFromTPInfo.push(nameOfParameter + z);
                            }
                        }
                    } else {
                        if(callbackParametersFromTPInfo != null) {
                            callbackParametersFromTPInfo.push(nameOfParameter);
                        }
                        else {
                            callbackParametersFromTPInfo = [];
                            callbackParametersFromTPInfo.push(nameOfParameter);
                        }
                    }
                }
            }
        }



    } else if (blockInfo.textParameters != null && blockInfo.textParametersInfo != null) {

        textParameters = [];
        for (var x = 0; x < blockInfo.textParameters.length; x++) {


            if (blockInfo.textParametersInfo[blockInfo.textParameters[x]] != null && blockInfo.textParametersInfo[blockInfo.textParameters[x]].incrementName) {
                var nameOfParameter = blockInfo.textParameters[x];

                for (var z = 0; (block.getFieldValue(nameOfParameter + z) != null) || (block.getInputTargetBlock(nameOfParameter + z) != null) || (block.getInput(nameOfParameter + z) != null); z++) {
                    if (blockInfo.textParametersInfo[blockInfo.textParameters[x]].argType === "ArrayExpression") {
                        if (typeof textParameters[textParameters.length - 1] === "object") {
                            textParameters[textParameters.length - 1].push(nameOfParameter + z);
                        } else {
                            textParameters.push([nameOfParameter + z]);
                        }
                    } else {
                        textParameters.push(nameOfParameter + z);
                    }
                }

            } else {
                textParameters.push(blockInfo.textParameters[x]);
            }
        }
        numberOfTextParameters = blockInfo.textParameters.length;

        for (var attributes in blockInfo.textParametersInfo) {
            if (blockInfo.textParametersInfo[attributes].callbackParameters != null) {
                for (var a = 0; a < blockInfo.textParametersInfo[attributes].callbackParameters.length; a++) {
                    var nameOfParameter = blockInfo.textParametersInfo[attributes].callbackParameters[a].name;

                    if (blockInfo.textParametersInfo[attributes].callbackParameters[a].incrementName) {
                        for (var z = 0; (block.getFieldValue(nameOfParameter + z) != null) || (block.getInputTargetBlock(nameOfParameter + z) != null); z++) {
                            if(callbackParametersFromTPInfo != null) {
                                callbackParametersFromTPInfo.push(nameOfParameter + z);
                            }
                            else {
                                callbackParametersFromTPInfo = [];
                                callbackParametersFromTPInfo.push(nameOfParameter + z);
                            }
                        }
                    } else {
                        if(callbackParametersFromTPInfo != null) {
                            callbackParametersFromTPInfo.push(nameOfParameter);
                        }
                        else {
                            callbackParametersFromTPInfo = [];
                            callbackParametersFromTPInfo.push(nameOfParameter);
                        }
                    }
                }
            }
        }
    } else {
        textParameters = blockInfo.textParameters;
        numberOfTextParameters = blockInfo.textParameters.length;
    }


    returnObject['textParameters'] = textParameters;
    returnObject['numberOfTextParameters'] = numberOfTextParameters;
    returnObject['callbackParametersFromTPInfo'] = callbackParametersFromTPInfo;
    return returnObject;
};

/**
 *  Extracts the parameter data that will go into the text version of the block
 *  Mutates the input array passed in, no return currently
 *  @param {Object} block - the Blockly block that contains the information being extracted
 *  @param {number} numberOfTextParameters - number of text parameters in the text version of the block
 *  @param {Array} textParameters - array of strings containing the text parameters that should correspond to the block's jsBlockInfo data
 *  @param {Array} input - array containing the parameter data that the text version of the block should carry
 *  @param {String} methodName - name of the method corresponding to the current block
 */
bd.acorn.ctr.extractJSBlockInfoText = function (block, numberOfTextParameters, textParameters, input, methodName) {
    //
    if (block.jsonObject == null) {
        var parameters = block.getParametersBTT();
    }
    else {
        var parameters = block.jsonObject["args0"];
    }

    var blockInfo = block.jsBlockInfo;
    var Variables = {
        "value": "Value",
        "color": "Color",
        "label": "Label",
        "boolean": "Boolean",
        "phaserPhysicsPiece": "Sprite"
    };
    //var Blockly = bd.script.ctr.getCurrentBlockly();

    // relevant iff mutators
    var returnObject = bd.acorn.ctr.singleTextParameterSuffixAddition(block, numberOfEdits, whatNameNeedToBeEdited);
    var numberOfEdits = returnObject['numberOfEdits'];
    var whatNameNeedToBeEdited = returnObject['whatNameNeedToBeEdited'];
    var haveToEditParameterNames = returnObject['haveToEditParameterNames'];

    var blockInfoMethodNameToBlockValues= (blockInfo.setMethodNameToBlockValues != null ? blockInfo.setMethodNameToBlockValues() : blockInfo.methodNameToBlockValues);


    // the following if statements extract the literals that will go into the JS version of the block, where the input array holds all the literals
    // the first if statement checks if the text parameters is an Array, which it will then create a JS version of the array to be passed into the input array
    // and if the text parameters is an object, then it'll create a JS version of it as well and pass it into the input array
    // the second if statement chunck checks the parameter types and depending on the type, it will either be a callback function or a literal
    for (var x = 0; x < numberOfTextParameters; x++) {
        for (var y = 0; y < parameters.length; y++) {
            if (block.jsonObject == null) {
                var paramName = parameters[y].name;
                var paramType = parameters[y].type;
            }
            else {
                var paramName = parameters[y]["name"];
                var paramType = parameters[y]["type"];
            }
             
            if (typeof textParameters[x] === "object") {
                if (textParameters[x] instanceof window.Array) {
                    var argArray = [];

                    for (var z = 0; z < textParameters[x].length; z++) {
                        if (bd.acorn.containsPrefix(textParameters[x][z], paramName)) {

                            var fieldValue = block.getFieldValue(textParameters[x][z]);
                            if (fieldValue == null) {
                                fieldValue = bd.acorn.ctr.blockToText(block.getInputTargetBlock(textParameters[x][z]));
                            }

                            var isType = false;
                            var name;
                            /*
                            if (bd.acorn.containsPrefix(fieldValue, "type:")) {
                                id = bd.acorn.removePrefix(fieldValue, "type");
                                name = Variables[id];
                            } else {
                                name = fieldValue;
                            }
                            */
                            name = fieldValue;

                            if (blockInfo.textParametersInfo[paramName] != null && blockInfo.textParametersInfo[paramName].localNestedMethods != null) {
                                var localNestedMethods = blockInfo.textParametersInfo[paramName].localNestedMethods;
                                var methodNameToAdd = localNestedMethods.methodName;
                                // var fieldNameToValueMutator = localNestedMethods.fieldNameToValueMutator;
                                var relatedToMutator = localNestedMethods.relatedToMutator;

                                if (relatedToMutator.match(/#/g).length === 1) {
                                    if (block.getMutatorValue(relatedToMutator.replace('#', z)) != null) {
                                        var numberOfLocalNestedMethods = block.getMutatorValue(relatedToMutator.replace('#', z));
                                        name = bd.acorn.ctr.addLocalNestedMethodToText(name, methodNameToAdd, numberOfLocalNestedMethods);
                                    }
                                }
                            }

                            argArray.push(name);
                        }
                    }
                    if (argArray.length !== 0) {
                        input.push(["text", argArray]);
                        break;
                    }
                    continue;
                } else {
                    var argDictionary = {};

                    for (var key in textParameters[x]) {
                        if (bd.acorn.containsPrefix(key, paramName)) {
                            var keyFieldValue = block.getFieldValue(key);
                            if (keyFieldValue == null) {
                                keyFieldValue = bd.acorn.ctr.blockToText(block.getInputTargetBlock(key));
                            }

                            var isType = false;
                            var name;
                            /*
                            if (bd.acorn.containsPrefix(keyFieldValue, "type:")) {
                                id = bd.acorn.removePrefix(keyFieldValue, "type");
                                name = Variables[id];
                            } else {
                                name = keyFieldValue;
                            }
                            */
                            name = keyFieldValue;

                            var valueFieldValue = block.getFieldValue(textParameters[x][key]);
                            if (valueFieldValue == null) {
                                valueFieldValue = bd.acorn.ctr.blockToText(block.getInputTargetBlock(textParameters[x][key]));
                            }

                            argDictionary[keyFieldValue] = valueFieldValue;
                        }
                    }
                    if (Object.keys(argDictionary).length !== 0) {
                        input.push(["text", argDictionary]);
                        break;
                    }
                    continue;
                }
            }

            // this regex is putting escapes for special characters in the string
            var stringToGoIntoTheRegex = paramName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var regex = new RegExp(stringToGoIntoTheRegex + "\\d+");

            if (textParameters[x].match(regex) != null || textParameters[x] === paramName || textParameters[x] === "NEXT_BLOCK") {
            // if (bd.acorn.containsPrefix(textParameters[x], parameters[y].name) || textParameters[x] === "NEXT_BLOCK") {

                var hasLocalNestedMethod = false;
                var methodNameToAdd, numberOfMethodsToAdd = 0;
                if (blockInfo.textParametersInfo != null) {
                    var listOfMethodNames = Object.keys(Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo);

                    if (listOfMethodNames.indexOf(paramName) != -1 && Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[paramName].localNestedMethods != null) {
                        var localNestedMethods = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[paramName].localNestedMethods;

                        methodNameToAdd = localNestedMethods.methodName;
                        var fieldNameToValueMutator = localNestedMethods.fieldNameToValueMutator;

                        if (blockInfo.textParametersInfo[paramName].localNestedMethods.incrementName) {
                            for (var editNum = 0; block.getFieldValue(fieldNameToValueMutator + editNum) != null || block.getInputTargetBlock(fieldNameToValueMutator + editNum) != null; editNum++) {
                                // numberOfMethodsToAdd = editNum;
                                numberOfMethodsToAdd++;
                            }
                        } else if (block.getFieldValue(fieldNameToValueMutator) != null || block.getInputTargetBlock(fieldNameToValueMutator) != null) {
                            numberOfMethodsToAdd = 1;
                        }
                        hasLocalNestedMethod = true;
                    }
                }


                if (blockInfoMethodNameToBlockValues != null && blockInfoMethodNameToBlockValues[methodName] != null && blockInfoMethodNameToBlockValues[methodName].evaluateAsEntity != null){
                    whatToTreatAsEntity = blockInfoMethodNameToBlockValues[methodName].evaluateAsEntity;

                    if (whatToTreatAsEntity.indexOf(paramName) != -1) {
                        var fieldValue = block.getFieldValue(textParameters[x]);

                        var isType = false, isID = false;
                        var flippedDictionaryOfKeyMappings = {};
                        if (bd.acorn.containsPrefix(fieldValue, "id:")) {
                            id = bd.acorn.removePrefix(fieldValue, "id");
                            isID = true;
                        } else if (bd.acorn.containsPrefix(fieldValue, "type:")) {
                            id = bd.acorn.removePrefix(fieldValue, "type");
                            isType = true;
                        } else {
                            id = fieldValue;

                            // var flippedDictionaryOfKeyMappings = {};
                            for (var a in keyMappings) {
                                flippedDictionaryOfKeyMappings[keyMappings[a]] = a;
                            }
                        }



                        var name;
                        //TODO remove
                        if (isID && bd.component.lookup(id) != null) {
                            name = bd.component.lookup(id).model.name;
                        } else if (isType) {
                            name = Variables[id];
                        } else if(flippedDictionaryOfKeyMappings[id] != null) {
                            name = flippedDictionaryOfKeyMappings[id];
                        } else {
                            name = id;
                        }

                        if (hasLocalNestedMethod) {
                            name = bd.acorn.ctr.addLocalNestedMethodToText(name, methodNameToAdd, numberOfMethodsToAdd);
                        }

                        // this if statement check fixes whether specific types of parameters need to be added as string inputs always
                        if (paramType == Blockly.Parameter.Types.STRING || paramType == Blockly.Parameter.Types.COLOR) {
                            input.push(["text", "\"" + name + "\""]);
                        } else {
                            input.push(["text", name]);
                        }
                        break;
                    }
                }

                if (paramType == Blockly.Parameter.Types.STATEMENT || textParameters[x] === "NEXT_BLOCK") {
                    if (block.getInputTargetBlock(textParameters[x])) {
                        var parameterBlock = bd.acorn.ctr.blockToText(block.getInputTargetBlock(textParameters[x]));
                        input.push(["callback", parameterBlock]);
                    } else if (block.getNextBlock() != null && textParameters[x] === "NEXT_BLOCK") {
                        var parameterBlock = bd.acorn.ctr.blockToText(block.getNextBlock());
                        input.push(["callback", parameterBlock]);
                    } else {
                        input.push(["callback", ""]);
                    }
                    break;
                } else if (paramType == Blockly.Parameter.Types.VALUE) {
                    if(!haveToEditParameterNames){
                        var parameterBlock = bd.acorn.ctr.blockToText(block.getInputTargetBlock(textParameters[x]));
                        input.push(["text", parameterBlock]);
                        break;
                    } else {
                        for (var z = 0; z < numberOfEdits; z++){
                            var parameterBlock = bd.acorn.ctr.blockToText(block.getInputTargetBlock(whatNameNeedToBeEdited + z));
                            input.push(["text", parameterBlock]);
                        }
                        break;
                    }
                } else if (paramType == Blockly.Parameter.Types.DROPDOWN) {

                    var number = block.getFieldValue(textParameters[x]);
                    //TODO remove
                    if (bd.acorn.containsPrefix(number, "msg:")) {
                        var msgWithoutNamespace = bd.acorn.removePrefix(number, "msg");
                        if (bd.msg.contextVariables[msgWithoutNamespace + '_JS'] != null) {
                            number = bd.msg.contextVariables[msgWithoutNamespace + '_JS'];
                        } else {
                            number = bd.msg.contextVariables[msgWithoutNamespace];
                        }
                        name = number;
                    } else if (bd.acorn.containsPrefix(number, "id:")) {
                        var id = bd.acorn.removePrefix(number, "id");
                        number = bd.component.lookup(id).model.name;
                        name = number;
                    } else {
                        name = flippedDictionaryOfKeyMappings[number];
                    }

                    if (hasLocalNestedMethod) {
                        name = bd.acorn.ctr.addLocalNestedMethodToText(name, methodNameToAdd, numberOfMethodsToAdd);
                    }

                    if (paramType == Blockly.Parameter.Types.STRING) {
                        input.push(["text", "\"" + name + "\""]);
                    } else {
                        input.push(["text", name]);
                    }
                    break;
                } else if (paramType == Blockly.Parameter.Types.STRING) {
                    var letter = block.getFieldValue(textParameters[x]);

                    if (hasLocalNestedMethod) {
                        letter = bd.acorn.ctr.addLocalNestedMethodToText(letter, methodNameToAdd, numberOfMethodsToAdd);
                    }

                    if (paramType == Blockly.Parameter.Types.STRING) {
                        input.push(["text", "\"" + letter + "\""]);
                    } else {
                        input.push(["text", letter]);
                    }
                    break;
                }
            }
        }
    }

};

/**
 *  Identifies and fills an array with info if there are callback function parameters in a block definition
 *  @param {Object} block - the Blockly block that information is being extracted from
 *  @param {Array} callbackFunctionParameters - array of strings of callback function parameters, extracted from jsBlockInfo
 *  @param {Array} callbackParametersFromTPInfo - array of strings of callback function parameters, extracted from jsBlockInfo in the case of 
 *      overloaded methods
 */
bd.acorn.ctr.identifyCallbackFunctionParameters = function(block, callbackFunctionParameters, callbackParametersFromTPInfo) {

    var blockInfo = block.jsBlockInfo;

    // deals with callback function parameters in the JS version, the first block deals with callbackParameters that are encoded into the respective jsBlockInfo
    // the second block extracts callbackParameters from overloaded method blocks

    if (blockInfo.callbackParameters != null) {
        for (var y = 0; y < blockInfo.textParameters.length; y++) {
            for (var name in blockInfo.callbackParameters) {
                if (blockInfo.textParameters[y] === name) {

                    for (var x = 0; x < blockInfo.callbackParameters[name].length; x++) {
                        if (block.getInputTargetBlock(blockInfo.callbackParameters[name][x]) != null) {
                            var callbackBlock = block.getInputTargetBlock(blockInfo.callbackParameters[name][x]);
                            callbackFunctionParameters.push(callbackBlock.getFieldValue(callbackBlock.jsBlockInfo.callbackParameters[0]));
                            break;
                        } else if (block.getFieldValue(blockInfo.callbackParameters[name][x]) != null) {
                            callbackFunctionParameters.push(block.getFieldValue(blockInfo.callbackParameters[name][x]));
                            break;
                        } else if (block.contextVariables[blockInfo.callbackParameters[name][x]] != null) {
                            var message = block.contextVariables[blockInfo.callbackParameters[name][x]].jsMsg;
                            callbackFunctionParameters.push(message);
                        }
                    }
                }
            }
        }
    }

    if (callbackParametersFromTPInfo != null) {
        for (var x = 0; x < callbackParametersFromTPInfo.length; x++) {
            if (block.getInputTargetBlock(callbackParametersFromTPInfo[x]) != null) {
                var callbackBlock = block.getInputTargetBlock(callbackParametersFromTPInfo[x]);
                callbackFunctionParameters.push(callbackBlock.getFieldValue(callbackBlock.jsBlockInfo.callbackParameters[0]));
                continue;
            } else if (block.getFieldValue(callbackParametersFromTPInfo[x]) != null) {
                callbackFunctionParameters.push(block.getFieldValue(callbackParametersFromTPInfo[x]));
                continue;
            } else if (block.contextVariables[callbackParametersFromTPInfo[x]] != null) {
                var message = block.contextVariables[callbackParametersFromTPInfo[x]].jsMsg;
                callbackFunctionParameters.push(message);
            }
        }
    }
};

/**
 *  Compiles all extracted information from the block and generates the text version of the block
 *  @param {Object} block - the Blockly block information is being extracted from
 *  @param {String} objectName - name of the object, eg: sprite1 is the object name of the moveSomeSteps block, calling moveSomeSteps()
 *  @param {String} methodName - name of the corresponding method being called, eg: moveSomeSteps() is the method name of the moveSomeSteps block
 *  @param {Array} input - array containing the parameter data that the text version of the block should carry
 *  @param {Array} callbackFunctionParameters - array of strings of callback function parameters, extracted from jsBlockInfo
 *  @return {String} text - text representing the block
 */
bd.acorn.ctr.createJSText = function(block, objectName, methodName, input, callbackFunctionParameters) {
    if (block.jsBlockInfo.notMethod != true) {
        if(objectName != null){
            text = objectName + "." + methodName + "(";
        } else {
            text = methodName + "(";
        }
    } else {
        text = methodName;
    }

    for (var x=0; x < input.length; x++){
        if (input[x][0] === "text"){
            if (typeof input[x][1] !== "object") {
                text += input[x][1];
            } else if (input[x][1] instanceof window.Array) {
                text += "[";
                for (var y = 0; y < input[x][1].length; y++) {
                    text += input[x][1][y];
                    if (input[x][1].length - y > 1) {
                        text += ",";
                    }
                }
                text += "]";
            } else {
                text += "{";
                var limit = Object.keys(input[x][1]).length;
                var counter = 0;
                for (var key in input[x][1]) {
                    text += key + ":" + input[x][1][key];
                    if (limit - counter > 1) {
                        text += ",";
                    }
                    counter++;
                }
                text += "}";
            }
        }
        if (input[x][0] === "callback"){
            text += bd.acorn.ctr.isCallback(input[x][1], callbackFunctionParameters);
        }
        if (input.length - x > 1) {
            text += ",";
        }
    }

    if (block.jsBlockInfo.notMethod != true) {
        text += ")";
    }

    if (!(block.outputConnection)) {
        text += ";";
    }

    return text;
};

/**
 *  Checks if there is a next block following the current block, and generates the text for that next block
 *  @param {Object} block - the Blockly block information is being extracted from
 *  @param {Array} textParameters - array of strings containing the text parameters that should correspond to the block's jsBlockInfo data
 *  @param {String} text - text representing the current block
 *  @return {String} text - text representing the block with all following blocks' respective texts appended to it
 */
bd.acorn.ctr.addNextBlockText = function(block, textParameters, text) {
    // this adds the block that comes after a block to the text
    if(block.getNextBlock() != null && textParameters.indexOf("NEXT_BLOCK") === -1) {
        var nextBlockText = bd.acorn.ctr.blockToText(block.getNextBlock());
        text += nextBlockText;
    }
    return text;
};

/**
 *  Extracts the name of the mutator field and the number of times it should be created with the correct pre/suf-fix counter
 *  @todo - Legacy code, should be unnecessary and eventually deleted once all blocks have been converted to using jsBlockInfo
 *
 *  @param {Object} block - the Blockly block information is being extracted from
 *  @param {number} numberOfEdits - integer representing the number of field mutators that need to be edited
 *  @param {String} whatNameNeedToBeEdited - String of the single name of the field mutator that the suffix number should be added to
 *  @return {Object} returnObject - contains two fields that contains the following information
 *      'numberOfEdits' - integer of the number of field mutators that need to be edited
 *      'whatNameNeedToBeEdited' - containing the single name of the field mutator that the suffix number should be added to
 *      'haveToEditParameterNames' - boolean of whether parameter name must be edited or not
 */
bd.acorn.ctr.singleTextParameterSuffixAddition = function(block, numberOfEdits, whatNameNeedToBeEdited) {
    // old way of dealing with incremented textParameters like min_max where it gets the names from the getMutatorNameToInfoObject method call
    // could probably remove this if you go back through all the blocks that rely on this and shift the information over to jsBlockInfo completely
    var functionReturn = block.getMutatorNameToInfoObject;
    var haveToEditParameterNames = false;
    var result;

    var returnObject = {};

    if (functionReturn != null) {
        isMutator = true;
        result = functionReturn();

        for (var x in result) {
            // this is currently assuming textParameters is a single string, not an array
            whatNameNeedToBeEdited = result[x].textParameters;

            if (result[x].incrementName != null) {
                haveToEditParameterNames = result[x].incrementName;
            } else {
                haveToEditParameterNames = false;   //used to be true bcause assuming that would always have to editParameterNames but now if need to edit names, it depends on whether or not there is an incrementName
            }
            // this is currently assuming only one variable that needs to be edited, if more than one and not unique, will need to store in an array later and loop through them
            if (bd.acorn.ctr.isGameblox) {
                numberOfEdits = block.mutators[result[x].blockVariableName];
            }
            else {
                numberOfEdits = block[result[x].blockVariableName];

            }
        }
    }

    returnObject['numberOfEdits'] = numberOfEdits;
    returnObject['whatNameNeedToBeEdited'] = whatNameNeedToBeEdited;
    returnObject['haveToEditParameterNames'] = haveToEditParameterNames;
    return returnObject;
};

/**
 *  Creates nested local methods calls, such as creating List(List(...))
 *  @param {String} name - name of the local nested method
 *  @param {String} methodNameToAdd - name of the enclosing method call
 *  @param {number} numberOfMethodsToAdd - number of nested local method calls to create
 *  @return {String} name - text representing the entire nested local method call
 */
bd.acorn.ctr.addLocalNestedMethodToText = function(name, methodNameToAdd, numberOfMethodsToAdd) {
    for (var x = 0; x < numberOfMethodsToAdd; x++) {
        name = methodNameToAdd + "(" + name + ")";
    }
    return name;
}

/**
 *  Checks if there are callback function parameters, and if there is, returns the corresponding text
 *  @param {String} input - text representing the body of the callback function
 *  @param {Array} callbackParameters - array of strings of the type of callback function parameters to add
 *  @return {String} output - some string representing the callback function parameter
 */
bd.acorn.ctr.isCallback = function(input, callbackParameters){
    if (callbackParameters != null) {
        var output = "function(";
        for (var x = 0; x < callbackParameters.length; x++) {
            output += callbackParameters[x];
            if (x != callbackParameters.length - 1) {
                output += ", ";
            }
        }
        output += "){" + input + "}";
        return output;
    } else {
        return "function(){" + input + "}";
    }
};


// ------------------------------------- end of blockToText helper methods --------------------------------------------//































/**
 *
 */
bd.acorn.ctr.createTree = function(text) {
    bd.acorn.ctr.loadBlockTypes();
    // console.log(functionNameToBlockName);
    var isText, tree;
    var options = null;
    if (typeof text === "string") {
        var matchingText = text.match(/^\/\/[ *|\t*]*OPTIONS:[ *|\t*]*(.*)\n(.*)/);
        // matchingText is an array that will have 3 elements: 0-contains full string of text, 1-contains the OPTIONS string, 2-contains the actual block code
        if (matchingText != null) {
            options = matchingText[1];
            text = matchingText[2];
        }

        tree = acorn.parse(text);
        isText = true;
    } else {
        //this means the tree is already a node
        tree = text;
        isText = false;
    }



    var block;


    var expressionNode, argumentsNode, calleeNode, objectNode, propertyNode, alternateNode, consequentNode, testNode;
    var elseifNum, elseNum;

    var functionName, entityName, varName;
    var args = [];

    var id;
    var parameters = [];
    var input;

    //are Booleans
    var isObjectFunctionCall;
    var isVariableDefinition = false;

    var nestedBlock, hasNested = false;

    var nestedBlocks = [];

    var fieldType;

    var inputTemp;

    var hasBeenAssigned = false;

    var isIfStatement = false;

    var hasExpressions = true;
    var isTrue = false;
    var isFalse = false;

    var Variables = {
        "Value": "value",
        "Color": "color",
        "Label": "label",
        "Boolean": "boolean",
        "Sprite": "phaserPhysicsPiece",
        "List": "list"
    };

	var comparisonOperators = {
 		'===': 'EQ' ,
		'!==' : 'NEQ',
	    '<' : 'LT',
	    '<=' : 'LTE',
	    '>' : 'GT',
	    '>=' : 'GTE'
	};

	var operationOperators = {
		'&&' : 'AND',
		'||' : 'OR'
	}



	if (isText) {
		var expState = tree.body[0];
		if (expState.type == "ExpressionStatement") {
			expressionNode = expState.expression;
		}
	} 
    else {
		if (tree.type == "ExpressionStatement") {
			expressionNode = tree.expression;
            argumentsNode = expressionNode.arguments;
            calleeNode = expressionNode.callee;
		} else {
			expressionNode = tree;
		}
	}

	if (expressionNode != null) {
		if (expressionNode.type == "CallExpression") {
		    argumentsNode = expressionNode.arguments;
		    calleeNode = expressionNode.callee;
		} else if (expressionNode.type == "BinaryExpression") {
		    if (comparisonOperators[expressionNode.operator] != null) {
		        block = comparisonOperator(expressionNode);
		    } else {
		        // recursive function call
		        block = mathOperator(expressionNode);
		    }

            createOptionsOnBlock(block, options);
		    return block;
		} else if (expressionNode.type == "UnaryExpression") {
		    var unaryOperators = {
		        "!": "!"
		    };
		    functionName = unaryOperators[expressionNode.operator];

		    if (expressionNode.argument != null) {
		        hasExpressions = true;
		        argumentsNode = [expressionNode.argument];
		    } else {
		        hasExpressions = false;
		    }

		} else if (expressionNode.type == "LogicalExpression") {
		    block = operationOperator(expressionNode);
            
            createOptionsOnBlock(block, options);
		    return block;
		} else if (expressionNode.type == "Literal" && typeof expressionNode.value === "number") { //!isNaN(expressionNode.value)
		    hasExpressions = false;
		    functionName = "math_number";
		} else if (expressionNode.type == "Literal" && typeof expressionNode.value === "boolean") {
		    hasExpressions = false;
		    functionName = "boolean";
		    if (expressionNode.value) {
		        isTrue = true;
		    } else {
		        isFalse = true;
		    }
		} else if (expressionNode.type == "Literal" && typeof expressionNode.value === "string") {
		    hasExpressions = false;
		    functionName = "string";
		    block = stringBlock(expressionNode);
            createOptionsOnBlock(block, options);
		    return block;
		} else if (expressionNode.type == "Literal" && expressionNode.value === null) {
		    hasExpressions = false;
		    functionName = "null";
		} else if (expressionNode.type === "Identifier") {
		    return controlsParameter(expressionNode);
		} else if (expressionNode.type === "IfStatement") {
	        args = ifStatement(expressionNode);
	        functionName = "if";
	        isIfStatement = true;
	        var number = args.length;
	        number -= 2;
	        if (number % 2 === 0) {
	            elseNum = 0;
	            elseifNum = number / 2;
	        } else {
	            elseNum = 1;
	            elseifNum = (number - 1) / 2;
	        }
	    }
	}
    else if (expState.type == "IfStatement") {
        args = ifStatement(expState);
        functionName = "if";
        isIfStatement = true;
        var number = args.length;
        number -= 2;
        if (number % 2 === 0) {
            elseNum = 0;
            elseifNum = number / 2;
        } else {
            elseNum = 1;
            elseifNum = (number - 1) / 2;
        }
    }




    isObjectFunctionCall = false;

    var addMsgPrefix = false;
    if (!isIfStatement && hasExpressions && calleeNode != null) {
        if (calleeNode.type === "Identifier") {
            functionName = calleeNode.name;
        } else if (calleeNode.type === "MemberExpression") {
            objectNode = calleeNode.object;
            if (bd.msg.contextVariablesToVariableNames[objectNode.name] != null) {
            	entityName = bd.msg.contextVariablesToVariableNames[objectNode.name];
            	if (entityName.slice(-3) === "_JS") {
            		entityName = entityName.slice(0, -3);
            	}
            	addMsgPrefix = true;
            } else {
	            entityName = objectNode.name;
            }

            propertyNode = calleeNode.property;
            functionName = propertyNode.name;
            isObjectFunctionCall = true;
        }
    }


    block = { type: functionNameToBlockName[functionName] };

    if(hasExpressions){
        block["input"] = {};
        input = block.input;
    }


    Blockly = bd.acorn.ctr.getCurrentBlockly();

    var hasNextBlock = false;
    var nesting = 0;

    if (!isIfStatement && hasExpressions) {
        if (argumentsNode.length !== 0) { //argumentsNode[0].type !== "FunctionExpression"
            for (var i = 0; i < argumentsNode.length; i++) {
                args.push(argumentsNode[i]);
            }
        }
    }


    addingFieldNameToValueFromMethodNameToBlockValuesOnJSBlockInfo(block, functionName);

    // this block of code creates local nested methods in function calls, like List(Value) or List(List(Value))
    if (Blockly.Blocks[block.type].jsBlockInfo != null && Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo != null) {
        var listOfMethodNames = Object.keys(Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo);
        for (var methodNames in Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo) {
            if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[methodNames].localNestedMethods != null) {
                for (var x = 0; x < args.length; x++) {

                	if (args[x].type === "ArrayExpression") {
                		for (var y = 0; y < args[x].elements.length; y++) {
                			if (args[x].elements[y].type === "CallExpression" && Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[methodNames].localNestedMethods.methodName === args[x].elements[y].callee.name) {
		                    
		                        if (block.mutatorNameToValue == null) {
		                            block["mutatorNameToValue"] = {};
		                        }
		                        var nameOfLocalFunction = args[x].elements[y].callee.name
		                        var nameOfMutatorNameToValueVar = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[methodNames].localNestedMethods.relatedToMutator;
		                        var number = numberOfLocalNestedMethodsForBTTArrayExpressions(args[x].elements[y], nameOfLocalFunction, args, x, y);
		                        if (nameOfMutatorNameToValueVar.match(/#/g).length === 1) {
			                        block.mutatorNameToValue[nameOfMutatorNameToValueVar.replace('#', y)] = number;
		                        }

		                        var fieldNameToValueMutatorOfLocalNestedMethod = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[methodNames].localNestedMethods.fieldNameToValueMutator;
		                        if (fieldNameToValueMutatorOfLocalNestedMethod != null) {
		                            for (var z = 0; z < number; z++) {
		                                if (block.fieldNameToValue == null) {
		                                    block["fieldNameToValue"] = {};
		                                }
		                                if (fieldNameToValueMutatorOfLocalNestedMethod.match(/#/g).length === 2) {
		                                	block.fieldNameToValue[fieldNameToValueMutatorOfLocalNestedMethod.replace('#', y).replace('#', z)] = "type:" + Variables[nameOfLocalFunction];
		                                }
		                            }
		                        }
                			}
                		}
                		break;
                	}

                    if (args[x].type === "CallExpression" && Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[methodNames].localNestedMethods.methodName === args[x].callee.name) {

                        if (block.mutatorNameToValue == null) {
                            block["mutatorNameToValue"] = {};
                        }
                        var nameOfLocalFunction = args[x].callee.name
                        var nameOfMutatorNameToValueVar = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[methodNames].localNestedMethods.relatedToMutator;
                        var number = numberOfLocalNestedMethodsForBTT(args[x], nameOfLocalFunction, args, x);
                        block.mutatorNameToValue[nameOfMutatorNameToValueVar] = number;

                        if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[methodNames].localNestedMethods.fieldNameToValueMutator != null) {
                            for (var y = 0; y < number; y++) {
                                if (block.fieldNameToValue == null) {
                                    block["fieldNameToValue"] = {};
                                }
                                block.fieldNameToValue[Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[methodNames].localNestedMethods.fieldNameToValueMutator + y] = "type:" + Variables[nameOfLocalFunction];
                            }
                        }
                        break;
                    }





                }
            }
        }
    }


    parameters = createParametersArray(block, args, isIfStatement, hasExpressions, functionName);



    //checks if it's a variable declaration
    if (isText && functionName === "defineGlobal") {
        isVariableDefinition = true;
        for (var key in Variables) {
            if (args[0].name === key) {
                fieldType = Variables[key];
                varName = args[1].value;
                break;
            }
        }
    }




    // addingFieldNameToValueFromMethodNameToBlockValuesOnJSBlockInfo(block, functionName);



    dealingWithOverloadedMethodLists(block, parameters, args, Variables, functionName);


    var blockInfoMethodNameToBlockValues = (Blockly.Blocks[block.type].jsBlockInfo.setMethodNameToBlockValues != null ? Blockly.Blocks[block.type].jsBlockInfo.setMethodNameToBlockValues() : Blockly.Blocks[block.type].jsBlockInfo.methodNameToBlockValues);

    if (Blockly.Blocks[block.type].jsBlockInfo != null && blockInfoMethodNameToBlockValues != null) {
        var methodNameToBlockValues = blockInfoMethodNameToBlockValues[functionName];
        var importedFromjsBlockInfo = {};
        var whatToTreatAsEntity; // is a list
        var tempParameters = [],
            tempArgs = [];
        var tempParametersToBeRemoved = [],
            tempArgsToBeRemoved = [];

        if (methodNameToBlockValues.textParameters != null) {
            parameters = methodNameToBlockValues.textParameters;
        }
        if (methodNameToBlockValues.evaluateAsEntity != null) {
            whatToTreatAsEntity = methodNameToBlockValues.evaluateAsEntity;

            for (var x = 0; x < parameters.length; x++) {
                for (var y = 0; y < whatToTreatAsEntity.length; y++) {


                    if (parameters[x] === whatToTreatAsEntity[y]) {
                        if (block.fieldNameToValue == null) {
                            block["fieldNameToValue"] = {};
                        }
                        if (args[x].type === "MemberExpression") {
                        	objectNode = args[x].object;
                        	entityName = objectNode.name;
                        	propertyNode = args[x].property;
                        	functionName = propertyNode.name;
                        	var text = entityName + "." + functionName;
                        	// var flippedDictionaryOfKeyMappings = {};
                        	// for (var a in keyMappings) {
                        	//     flippedDictionaryOfKeyMappings[keyMappings[a]] = a;
                        	// }
                        	block["fieldNameToValue"][whatToTreatAsEntity[y]] = keyMappings[text];	// flippedDictionaryOfKeyMappings[text];
                        	tempArgsToBeRemoved.push(args[x]);
                        	tempParametersToBeRemoved.push(parameters[x]);
                        	break;
                        }
                        if (bd.component.getEntityNameToIdDictionary()[args[x].name] != null) {
                            block["fieldNameToValue"][whatToTreatAsEntity[y]] = "id:" + bd.component.getEntityNameToIdDictionary()[args[x].name];
                            tempArgsToBeRemoved.push(args[x].name);
                            tempParametersToBeRemoved.push(parameters[x]);
                            break;
                        } else if (args[x].name != null) {
                            if (Variables[args[x].name] != null) {
								block["fieldNameToValue"][whatToTreatAsEntity[y]] = "type:" + Variables[args[x].name];
                            } else {
                            	block["fieldNameToValue"][whatToTreatAsEntity[y]] = args[x].name;
                            }

                            // block["fieldNameToValue"][whatToTreatAsEntity[y]] = args[x].name;

                            tempArgsToBeRemoved.push(args[x].name);
                            tempParametersToBeRemoved.push(parameters[x]);
                            break;
                        } else {
                            block["fieldNameToValue"][whatToTreatAsEntity[y]] = args[x].value;
                            tempArgsToBeRemoved.push(args[x].value);
                            tempParametersToBeRemoved.push(parameters[x]);
                            break;
                        }
                    }
                }
            }

         //    parameters = removeCertainParameters(parameters, tempParametersToBeRemoved);
	        // args = removeCertainArgs(args, tempArgsToBeRemoved);
	        removeCertainParameters(parameters, tempParametersToBeRemoved);
	        removeCertainArgs(args, tempArgsToBeRemoved);

        }
    }



    var hasMutator = false;
    //this is checking if mutators are needed
    var haveToEditParameterNames = false;
    var whatNamesNeedToBeEdited, numberOfEdits, mutatorName;
    var functionReturn = Blockly.Blocks[block.type].getMutatorNameToInfoObject;
    if (functionReturn != null) {
        hasMutator = true;
        result = functionReturn();

        for (var x in result) {
            // this is currently assuming textParameters is a single string, not an array

            if (result[x].incrementName != null) {
                haveToEditParameterNames = result[x].incrementName;
                whatNamesNeedToBeEdited = result[x].textParameters;
                numberOfEdits = args.length;
                mutatorName = x;
            } else {
                haveToEditParameterNames = false;
            }
            if(isObjectFunctionCall && result[x].scopeToMutatorValue != null) {
                if (block.mutatorNameToValue == null) {
                    block["mutatorNameToValue"] = {};
                }
                block.mutatorNameToValue[x] = result[x].scopeToMutatorValue(entityName);
            }

        }

        // new check on jsBlockInfo for the fieldNameToValue when I found out it is not always "ENTITY"
        // the 2 different if statements are needed right now because not everything is "ENTITY" but also not everything has jsBlockInfo yet
        if (isObjectFunctionCall) {

            if(bd.acorn.ctr.isGameblox) {
                if (addMsgPrefix) {
                	id = "msg:" + entityName;
                } else {
                	id = "id:" + bd.component.getEntityNameToIdDictionary()[entityName];
                }
            } else {
                id = entityName;
            }
            
            if (Blockly.Blocks[block.type].jsBlockInfo != null) {
                var scope = Blockly.Blocks[block.type].jsBlockInfo.scope;
                if (scope !== "ENTITY") {
                    var isInList = false;
                    if (Blockly.Blocks[block.type].jsonObject == null) {
                        for (var x in Blockly.Blocks[block.type].getParametersBTT()){
                            if (scope === x.name) {
                                isInList = true;
                                break;
                            }
                        }
                    }
                    else {
                        for (var x in Blockly.Blocks[block.type].jsonObject["args0"]){
                            if (scope === x["name"]) {
                                isInList = true;
                                break;
                            }
                        }
                    }
                    if (isInList === false) {
                        if (block.fieldNameToValue == null) {
                            block["fieldNameToValue"] = {};
                            block["fieldNameToValue"][scope] = id;
                        } else {
                            block["fieldNameToValue"][scope] = id;
                        }
                    } else if (isInList === true) {
                        if (block.fieldNameToValue != null){
                            block["fieldNameToValue"]["ENTITY"] = id;
                        } else {
                            block["fieldNameToValue"] = { "ENTITY": id };
                        }
                    }
                }
            }
        }


        if (isIfStatement) {
            //always the first "IF" and "DO"
            parameters.push("IF0");
            parameters.push("DO0");
            //checking for else if's
            for (var x = 0; x < elseifNum; x++) {
                parameters.push(result["elseif"].input[0] + (x + result["elseif"].nameSuffixIncrement));
                parameters.push(result["elseif"].input[1] + (x + result["elseif"].nameSuffixIncrement));
            }
            //checking for last else
            if (elseNum === 1) {
                parameters.push(result["else"].input);
            }
            //this is disgustingly hardcoded...oh well
            block["mutatorNameToValue"] = {};
            block["mutatorNameToValue"]["else"] = elseNum;
            block["mutatorNameToValue"]["elseif"] = elseifNum;
        }
    }





    var temp;
    if (haveToEditParameterNames) { //now taking parameters list and modifying each input name
        temp = whatNamesNeedToBeEdited
        // temp = parameters[0];
        parameters = [];
        for (var x = 0; x < numberOfEdits; x++) {
            parameters.push(temp + x);
        }
    }

    var idIsUsed = false;
    if (isObjectFunctionCall) {

        if (Blockly.Blocks[block.type].jsBlockInfo != null) {	// && bd.component.getEntityNameToIdDictionary()[entityName] != null
            
            if(bd.acorn.ctr.isGameblox) {
                if (addMsgPrefix) {
                    id = "msg:" + entityName;
                } else {
                    id = "id:" + bd.component.getEntityNameToIdDictionary()[entityName];
                }
            } else {
                id = entityName;
            }

            var scope = Blockly.Blocks[block.type].jsBlockInfo.scope;

            // if (scope !== "ENTITY") {
                var isInList = false;
                if (Blockly.Blocks[block.type].jsonObject == null) {
                    for (var x in Blockly.Blocks[block.type].getParametersBTT()) {
                        // debugger;
                        if (scope === Blockly.Blocks[block.type].getParametersBTT()[x].name) {
                            isInList = true;
                            break;
                        }
                    }
                }
                else {
                    for (var x in Blockly.Blocks[block.type].jsonObject["args0"]) {
                        // debugger;
                        if (scope === Blockly.Blocks[block.type].jsonObject["args0"][x]["name"]) {
                            isInList = true;
                            break;
                        }
                    }
                }
                if (isInList === true) {   // i'm flipping these around!?
                    idIsUsed = true;
                    if (block.fieldNameToValue == null) {
                        block["fieldNameToValue"] = {};
                        block["fieldNameToValue"][scope] = id;
                    } else {
                        block["fieldNameToValue"][scope] = id;
                    }
                } else if (isInList === false) { // gahhhhh
                    if (block.fieldNameToValue != null) {
                        block["fieldNameToValue"]["ENTITY"] = id;
                    } else {
                        block["fieldNameToValue"] = { "ENTITY": id };
                    }
                }
            // }

        }
    }


    if (!hasExpressions && block.type === "logic_boolean") {
        if (isTrue) {
            block["fieldNameToValue"] = { "BOOL": "TRUE" };
        } else {
            block["fieldNameToValue"] = { "BOOL": "FALSE" };
        }
    } else if (!hasExpressions && block.type === "math_number") {
    	if (expressionNode != null) {
			block["fieldNameToValue"] = { "NUM": expressionNode.raw };
    	} else {
			block["fieldNameToValue"] = { "NUM": tree.raw };
    	}

    }


    if (isVariableDefinition) { //hardcoded as variable name because it's special...for now...
        input[parameters[0]] = { inputType: "value", blockInfo: { type: "iterator_variable", fieldNameToValue: { "VAR": varName }, mutatorNameToValue: { locked_parent_block_type: functionNameToBlockName[functionName] } } };
        // type = "value";
        input[parameters[1]] = { inputType: "value", blockInfo: bd.acorn.ctr.createTree(args[2]) };    // used to have type inside of inputType		//  literals(args[2])
        //mutatorNameToValue is specifically right now for variables...will deal with later when I need to

        block["mutatorNameToValue"] = { num_lists: 0 };
        block["fieldNameToValue"] = { "TYPE": "type:" + fieldType };
    }

    // var hasBeenAssigned = false;
    if (!isVariableDefinition && args.length !== 0) {
        for (var x = 0; x < parameters.length; x++) {

            hasBeenAssigned = false;
            if (Blockly.Blocks[block.type].jsonObject == null) {
                for (var y = 0; y < Blockly.Blocks[block.type].getParametersBTT().length; y++) {
    	            // check if textParameters (aka parameters inside of the method) has a corresponding thing in getParametersBTT() method and then do a .check to see if is variable
    	            // if true, it is an iterator_variable
                    if (parameters[x] === Blockly.Blocks[block.type].getParametersBTT()[y].name && Blockly.Blocks[block.type].getParametersBTT()[y].check === "Variable") {
                        inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
                        input[parameters[x]] = { inputType: inputTemp, blockInfo: { type: "iterator_variable", fieldNameToValue: { "VAR": args[x].value }, mutatorNameToValue: { locked_parent_block_type: functionNameToBlockName[functionName] } } };
                        hasBeenAssigned = true;
                        break;
                    }
                }
            }
            else {
                for (var y = 0; y < Blockly.Blocks[block.type].jsonObject["args0"].length; y++) {
                    // check if textParameters (aka parameters inside of the method) has a corresponding thing in getParametersBTT() method and then do a .check to see if is variable
                    // if true, it is an iterator_variable
                    if (parameters[x] === Blockly.Blocks[block.type].jsonObject["args0"][y]["name"] && Blockly.Blocks[block.type].jsonObject["args0"][y]["check"] === "Variable") {
                        inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
                        input[parameters[x]] = { inputType: inputTemp, blockInfo: { type: "iterator_variable", fieldNameToValue: { "VAR": args[x].value }, mutatorNameToValue: { locked_parent_block_type: functionNameToBlockName[functionName] } } };
                        hasBeenAssigned = true;
                        break;
                    }
                }
            }
            if (hasBeenAssigned) {
                continue;
            }
            if (haveToEditParameterNames) { //for mutators
                inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
                input[parameters[x]] = { inputType: inputTemp, blockInfo: literals(args[x]) };
                if (block["mutatorNameToValue"] == null) {
                    block["mutatorNameToValue"] = {};
                }
                block["mutatorNameToValue"][mutatorName] = numberOfEdits;
            }
            if (isIfStatement){
            	if (args[x] !== "EMPTY") {
	                inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
	                input[parameters[x]] = { inputType: inputTemp, blockInfo: args[x] };
				}
            } else {
                inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);

                if (Blockly.Blocks[block.type].jsBlockInfo != null && Blockly.Blocks[block.type].jsBlockInfo.multipleMethodsOverloadedTextParameters == null && Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo != null) {
	                for (var name in Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo) {
	                	if (parameters[x] === name) {
		                	var info = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].acornTreeNode;
		                	if (info == null) {
		                		break;
		                	}
			                if (args[x][info].type == "Literal") {
			                    input[parameters[x]] = { inputType: inputTemp, blockInfo: literals(args[x][info]) };
			                } else if (args[x][info].type == "CallExpression") {
			                    input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x][info]) };
			                } else if (args[x][info].type == "BinaryExpression") {
			                    input[parameters[x]] = { inputType: inputTemp, blockInfo: mathOperator(args[x][info]) };
			                } else if (args[x][info].type == "FunctionExpression") {
			                    if (parameters[x] === "NEXT_BLOCK") {
			                        block['next'] = callbackFunction(args[x][info]);
			                    } else {
			                        if (callbackFunction(args[x][info]) != null) {
			                            input[parameters[x]] = { inputType: inputTemp, blockInfo: callbackFunction(args[x][info]) };
			                        }
			                    }
			                } else if (args[x][info].type == "Identifier") { // could just make this an OR expression on the callExpression branch probably
			                    input[parameters[x]] = { inputType: inputTemp, blockInfo: controlsParameter(args[x][info]) };
			                }
	                		continue;
	                	}
	                }
	        	}

                if (args[x].type == "Literal") {
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };	// literals(args[x])
                } else if (args[x].type == "CallExpression") {
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };
                } else if (args[x].type == "BinaryExpression") {
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };	// mathOperator(args[x])
                } else if (args[x].type == "FunctionExpression"){
                    if(parameters[x] === "NEXT_BLOCK"){
                        block['next'] = callbackFunction(args[x]);
                    } else {
                        if (callbackFunction(args[x]) != null) {
                            input[parameters[x]] = { inputType: inputTemp, blockInfo: callbackFunction(args[x]) };
                        }
                    }
                } else if (args[x].type == "Identifier"){   // could just make this an OR expression on the callExpression branch probably
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: controlsParameter(args[x])};
                }
            }


        }
    }

    createOptionsOnBlock(block, options);

    return block;

};


/**
 * parsing string of options and mutating JS block to add options, such as xy coordinates
 * @param {Object} block - the JS block object that contains all the information to generate the XML block
 * @param {string} options - String containing the options, separated by semicolons ";", if no options, equals null
 */
function createOptionsOnBlock(block, options) {
    if (options != null) {
        arrayOfOptions = options.split(";");
        var results;
        for (option in arrayOfOptions) {
            // fixed regex to accept negative numbers
            if (results = arrayOfOptions[option].match(/^[ *|\t*]*COORDINATES:[ *|\t*]*x[ *|\t*]*:[ *|\t*]*(-?\d+)[ *|\t*]*,[ *|\t*]*y[ *|\t*]*:[ *|\t*]*(-?\d+)/)) {
                block['x'] = results[1];
                block['y'] = results[2];
            }
            // if you want to add more options, create a new if branch below here where you capture the regex expressions and set to the block
        }
    }
}

/**
 *
 */
function numberOfLocalNestedMethodsForBTT(node, functionName, originalArgNode, originalArgIndex) {
	var count = 0;
	if (node.callee != null && node.callee.name === functionName) {
		count++;
		count += numberOfLocalNestedMethodsForBTT(node.arguments[0], functionName, originalArgNode, originalArgIndex);
	} else {
		originalArgNode[originalArgIndex] = node;
	}
	return count;
}

/**
 *
 */
function numberOfLocalNestedMethodsForBTTArrayExpressions(node, functionName, originalArgs, originalArgsXNum, originalArgsYNum) {
	var count = 0;
	if (node.callee != null && node.callee.name === functionName) {
		count++;
		count += numberOfLocalNestedMethodsForBTTArrayExpressions(node.arguments[0], functionName, originalArgs, originalArgsXNum, originalArgsYNum);
	} else {
		originalArgs[originalArgsXNum].elements[originalArgsYNum] = node;
	}
	return count;
}

/**
 *
 */
function addingFieldNameToValueFromMethodNameToBlockValuesOnJSBlockInfo(block, functionName){
	if (Blockly.Blocks[block.type].jsBlockInfo != null && Blockly.Blocks[block.type].jsBlockInfo.multipleMethodsOverloadedTextParameters != null && Blockly.Blocks[block.type].jsBlockInfo.multipleMethodsOverloadedTextParameters[functionName].mutatorNameToValue != null) {
		var mutatorNameToValueObject = Blockly.Blocks[block.type].jsBlockInfo.multipleMethodsOverloadedTextParameters[functionName].mutatorNameToValue
		var importedFromjsBlockInfo = {};
		for (var x in methodNameToBlockValueObject) {
			importedFromjsBlockInfo[x] = methodNameToBlockValueObject[x];
		}
		goog.mixin(block, importedFromjsBlockInfo);
	}

    var blockInfoMethodNameToBlockValues = (Blockly.Blocks[block.type].jsBlockInfo.setMethodNameToBlockValues != null ? Blockly.Blocks[block.type].jsBlockInfo.setMethodNameToBlockValues() : Blockly.Blocks[block.type].jsBlockInfo.methodNameToBlockValues);

    if (Blockly.Blocks[block.type].jsBlockInfo != null && blockInfoMethodNameToBlockValues != null) {
        var methodNameToBlockValues = blockInfoMethodNameToBlockValues[functionName];
        var importedFromjsBlockInfo = {};
        for (var x in methodNameToBlockValues) {
            if (x !== "textParameters" && x !== "evaluateAsEntity") {
                // importedFromjsBlockInfo[x] = methodNameToBlockValues[x];
                for (var y in methodNameToBlockValues[x]) {
                    if (importedFromjsBlockInfo[x] == null) {
                        importedFromjsBlockInfo[x] = {};
                    }
                    importedFromjsBlockInfo[x][y] = methodNameToBlockValues[x][y];
                }

            }
        }

        goog.mixin(block, importedFromjsBlockInfo);
    }
}

/**
 *
 */
function dealingWithOverloadedMethodLists(block, parameters, args, Variables, functionName) {
    var numberOfEdits;
    var tempArgsToBeRemoved = [],
        tempParametersToBeRemoved = [];
    var tempParameters = [],
        tempArgs = [];
    if (Blockly.Blocks[block.type].jsBlockInfo != null && Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo != null) {


        for (var name in Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo) {
            if (parameters.indexOf(name) !== -1) {
                var index = parameters.indexOf(name);
                var info = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].acornTreeNode;
                var incrementName = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].incrementName;
                var evaluateAsEntity = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].evaluateAsEntity;

                var argumentNode = args[index][info];
                if (incrementName) {
                    if (argumentNode instanceof window.Array) {
                        numberOfEdits = argumentNode.length;
                    } else {
                        numberOfEdits = 1;	// assumption
                    }

                    if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].relatedToMutator != null) {
                        if (block["mutatorNameToValue"] == null) {
                            block["mutatorNameToValue"] = {};
                        }
                        block["mutatorNameToValue"][Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].relatedToMutator] = numberOfEdits;
                    }


                    if (block.fieldNameToValue == null) {
                        block["fieldNameToValue"] = {};
                    }
                    for (var x = 0; x < numberOfEdits; x++) {
                        if (argumentNode instanceof window.Array) {                      	
                    		if (evaluateAsEntity && Object.keys(Variables).indexOf(argumentNode[x].name) !== -1) {
                                block.fieldNameToValue[name + x] = "type:" + Variables[argumentNode[x].name];
                                continue;
                    		} else if (evaluateAsEntity && argumentNode[x].type == "Property") {
                    			block.fieldNameToValue[name + x] = argumentNode[x].key.name;

                    			var nameOfValue = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].hasValue;
                    			if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[nameOfValue].incrementName === true) {
                    				if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[nameOfValue].evaluateAsEntity === true && Object.keys(Variables).indexOf(argumentNode[x].value.name) !== -1) {
                    					block.fieldNameToValue[nameOfValue + x] = "type:" + Variables[argumentNode[x].value];
                    				} else {
						                inputTemp = typeOfInput(nameOfValue, Blockly, Blockly.Blocks[block.type]);
                    					block.input[nameOfValue + x] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(argumentNode[x].value) };
                    				}
                    			} else {
                    				if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[nameOfValue].evaluateAsEntity === true && Object.keys(Variables).indexOf(argumentNode[x].value.name) !== -1) {
                    					block.fieldNameToValue[nameOfValue] = "type:" + Variables[argumentNode[x].value];
                    				} else {
						                inputTemp = typeOfInput(nameOfValue, Blockly, Blockly.Blocks[block.type]);
                    					block.input[nameOfValue] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(argumentNode[x].value) };
                    				}
                    			}

                    			if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].linkedTo != null) {
                    				var nameOfLinkedParameter = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].linkedTo;
                    				if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[nameOfLinkedParameter].incrementName === true) {
                    					if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[nameOfLinkedParameter].evaluateAsEntity === true) {
                    						if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[nameOfLinkedParameter].hasStaticValue) {
	                    						block.fieldNameToValue[nameOfLinkedParameter + x] = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[nameOfLinkedParameter].hasStaticValue;
                    						}
                    					}
                    				}
                    			}
                    		} else {
				                inputTemp = typeOfInput(name, Blockly, Blockly.Blocks[block.type]);
				                if (argumentNode[x].type == "Literal") {
				                    block.input[name + x] = { inputType: inputTemp, blockInfo: literals(argumentNode[x]) };
				                } else if (argumentNode[x].type == "CallExpression") {
				                    block.input[name + x] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(argumentNode[x]) };
				                } else if (argumentNode[x].type == "BinaryExpression") {
				                    block.input[name + x] = { inputType: inputTemp, blockInfo: mathOperator(argumentNode[x]) };
				                } else if (argumentNode[x].type == "Identifier") {
				                    block.input[name + x] = { inputType: inputTemp, blockInfo: controlsParameter(argumentNode[x]) };
				                }
				                continue;
                    		}
                        } else if (typeof argumentNode === "string") {
                            for (var key in Variables) {
                                if (argumentNode === key) {
                                    block.fieldNameToValue[name + x] = "type:" + Variables[key];
                                    break;
                                }
                            }
                        }
                    }
                    tempArgsToBeRemoved.push(argumentNode);
                    tempParametersToBeRemoved.push(name);
                }

            }
        }

        removeCertainParameters(parameters, tempParametersToBeRemoved);
        removeCertainArgs(args, tempArgsToBeRemoved);

        parametersInCallbackFunctionCalls(block, parameters, args, functionName);
        // check if any of the textParametersInfo include a callbackParameters


    }


}

/**
 *
 */
function parametersInCallbackFunctionCalls(block, parameters, args, functionName) {
	var numberOfEdits;

    for (var name in Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo) {

    	if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters != null) {


            for (var y = 0; y < Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters.length; y++) {

                if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].evaluateAsEntity != null && Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].evaluateAsEntity === true) {


                } else if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].incrementName != null && Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].incrementName === true) {
                    var index = parameters.indexOf(name);
                    var info = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].acornTreeNode;

                    var argumentNode = args[index][info];
                    if (argumentNode instanceof window.Array) {
                        numberOfEdits = argumentNode.length;
                    } else {
                        numberOfEdits = 1; // based on upper if statements, this is an assumption, may change
                    }

                    if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].relatedToMutator != null) {
                        if (block["mutatorNameToValue"] == null) {
                            block["mutatorNameToValue"] = {};
                        }
                        block["mutatorNameToValue"][Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].relatedToMutator] = numberOfEdits;
                    }

                    for (var x = 0; x < numberOfEdits; x++) {
                        if (Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].evaluateAsEntity != null && Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].evaluateAsEntity === true) {
                            // !!!!!!!!!! make this later !!!!!!!!!!!!
                        } else {
                            // currently this else statement means if it's not a fieldNameToValue, the input is going to be an iterator_variable
                            // probably need to change a lot of this to become more flexible for the future
                            if (Blockly.Blocks[block.type].jsonObject == null) {
                                for (var z = 0; z < Blockly.Blocks[block.type].getParametersBTT().length; z++) {
                                    var attributeName = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].name;
                                    if (attributeName === Blockly.Blocks[block.type].getParametersBTT()[z].name && Blockly.Blocks[block.type].getParametersBTT()[z].check === "Variable") {
                                        inputTemp = typeOfInput(attributeName, Blockly, Blockly.Blocks[block.type]);
                                        block.input[attributeName + x] = { inputType: inputTemp, blockInfo: { type: "iterator_variable", fieldNameToValue: { "VAR": argumentNode[x].name }, mutatorNameToValue: { locked_parent_block_type: functionNameToBlockName[functionName] } } };
                                        hasBeenAssigned = true;
                                        break;
                                    }
                                }
                            }
                            else {
                                for (var z = 0; z < Blockly.Blocks[block.type].jsonObject["args0"].length; z++) {
                                    var attributeName = Blockly.Blocks[block.type].jsBlockInfo.textParametersInfo[name].callbackParameters[y].name;
                                    if (attributeName === Blockly.Blocks[block.type].jsonObject["args0"][z]["name"] && Blockly.Blocks[block.type].jsonObject["args0"][z]["check"] === "Variable") {
                                        inputTemp = typeOfInput(attributeName, Blockly, Blockly.Blocks[block.type]);
                                        block.input[attributeName + x] = { inputType: inputTemp, blockInfo: { type: "iterator_variable", fieldNameToValue: { "VAR": argumentNode[x].name }, mutatorNameToValue: { locked_parent_block_type: functionNameToBlockName[functionName] } } };
                                        hasBeenAssigned = true;
                                        break;
                                    }
                                }
                            }

                        }
                    }

                }


            }


    	}

    }
}

/**
 *
 */
function createParametersArray(block, args, isIfStatement, hasExpressions, functionName){
	var isParameters, index;
	var parameters;

	if (Blockly.Blocks[block.type].jsBlockInfo != null) {
		if (Blockly.Blocks[block.type].jsBlockInfo.textParameters != null) {
			parameters = Blockly.Blocks[block.type].jsBlockInfo.textParameters.slice();
		} else if (Blockly.Blocks[block.type].jsBlockInfo.overloadedTextParameters != null) {
            for (var x = 0; x < Blockly.Blocks[block.type].jsBlockInfo.overloadedTextParameters.length; x++) {
                for (var y = 0; y < args.length; y++) {
                    if (Blockly.Blocks[block.type].jsBlockInfo.overloadedTextParameters[x].overloadingArgTypes.length !== args.length) {
                        isParameters = false;
                        break;
                    }
                    if (Blockly.Blocks[block.type].jsBlockInfo.overloadedTextParameters[x].overloadingArgTypes[y] === args[y].type) {
                        isParameters = true;
                        index = x;
                    } else {
                        isParameters = false;
                        break;
                    }
                }
                if (isParameters) {
                    parameters = Blockly.Blocks[block.type].jsBlockInfo.overloadedTextParameters[index].parameters.slice();
                    break;
                }
            }
		} else if (Blockly.Blocks[block.type].jsBlockInfo.multipleMethodsOverloadedTextParameters != null) {
			var overloadedTextParameters = Blockly.Blocks[block.type].jsBlockInfo.multipleMethodsOverloadedTextParameters[functionName];


            for (var x = 0; x < overloadedTextParameters.length; x++) {
                for (var y = 0; y < args.length; y++) {

                	if (overloadedTextParameters[x].overloadingArgTypes.indexOf("Multiple") === -1 && overloadedTextParameters[x].overloadingArgTypes.length !== args.length) {
                        isParameters = false;
                        break;
                	} else if (overloadedTextParameters[x].overloadingArgTypes[y] === "Multiple") {
                		// Multiple should probably be at the end...
                		// dunno how I should do the check to get the right text parameters list...
                		// maybe do a block fetching to see if they all exist
                		// and then keep count and compare that full count to the args list length


                	} else if (overloadedTextParameters[x].overloadingArgTypes[y] === args[y].type) {
                        isParameters = true;
                        index = x;
                    } else {
                        isParameters = false;
                        break;
                    }



                }
                if (isParameters) {
                    parameters = overloadedTextParameters[index].parameters.slice();
                    break;
                }
            }



		} else {
			parameters = [];
		}
	} else if (!isIfStatement && hasExpressions === true) { //or maybe check via if it is not null    //!isIfStatement && hasExpressions
	    parameters = Blockly.Blocks[block.type].textParameters.slice();
	} else if (isIfStatement) {
		parameters = [];
	}

	return parameters;
}

/**
 *
 */
function removeCertainParameters(parameters, tempParametersToBeRemoved) {
	var index;
    
	for (var x = 0; x < tempParametersToBeRemoved.length; x++) {
		index = parameters.indexOf(tempParametersToBeRemoved[x]);
		if (index !== -1) {
			parameters.splice(index, 1);
		}
	}
}

/**
 *
 */
function removeCertainArgs(args, tempArgsToBeRemoved) {
	var output = [];
	var mustRemove = false;

    for (var x = 0; x < args.length; x++) {
    	if (mustRemove) {
    		x = 0;
    	}
        mustRemove = false;
        for (var y = 0; y < tempArgsToBeRemoved.length; y++) {
        	if (args[x].type === "MemberExpression" && tempArgsToBeRemoved[y].type === "MemberExpression") {
        		if (equalObjects(args[x], tempArgsToBeRemoved[y])) {
        			mustRemove = true;
        			break;
        		}
        	}
            if (args[x].name === tempArgsToBeRemoved[y] || args[x].value === tempArgsToBeRemoved[y] || equalObjects(args[x].elements, tempArgsToBeRemoved[y])) {
                mustRemove = true;
                break;
            }
        }
        if (mustRemove) {
        	args.splice(x, 1);
        }
    }
}

/**
 *
 */
function equalObjects(obj1, obj2) {
	if (!(typeof obj1 === "object" && typeof obj2 === "object")) {
		return false;
	}
	var attributesInObj1 = Object.getOwnPropertyNames(obj1);
	var attributesInObj2 = Object.getOwnPropertyNames(obj2);

	if (attributesInObj1.length != attributesInObj2.length) {
		return false;
	}

	for (var x = 0; x < attributesInObj1.length; x++) {
		var name = attributesInObj1[x];
		if (typeof obj1[name] === "object" && typeof obj2[name] === "object") {
			if (!equalObjects(obj1[name], obj1[name])) {
				return false;
			}
		}
		if (obj1[name] !== obj2[name]) {
			return false;
		}
	}

	return true;
}

/**
 *
 */
function controlsParameter(tree) {
    var block;
    var id;
    var name;

    block = {type: "controls_parameter"};
    // block["fieldNameToValue"] = {"VAR":tree.name};

    if (bd.msg.contextVariablesToVariableNames[tree.name] != null) {
        name = bd.msg.contextVariablesToVariableNames[tree.name];
        if (name.slice(-3) === "_JS") {
            name = name.slice(0, -3);
        }
        block["fieldNameToValue"] = {"VAR":"msg:" + name};
    } else if (bd.component.getEntityNameToIdDictionary()[tree.name] != null) {
    	id = "id:" + bd.component.getEntityNameToIdDictionary()[tree.name];
	    block["fieldNameToValue"] = {"VAR":id};
    } else {
	    block["fieldNameToValue"] = {"VAR":tree.name};
    }

    return block;
}

/**
 *
 */
function stringBlock(tree) {
	block = {type: 'text'};
	block["fieldNameToValue"] = {"TEXT":tree.value};
	return block;
}

/**
 *
 */
function callbackFunction(node) {
    // expressionNode = node.body;
    var tree = node.body;
    var nestedBlock, nestedBlocks = [];
    if (tree.type === "BlockStatement") {
        //if blockstatement, find array length, that's how many statements there are to be nested
        //then create all the blocks, everyone after 0th element is stored in an array and then later just slot them in by adding next to their JSON blocks
        var numberOfNestedStatements = tree.body.length; //this holds the number of statement that are below the first statement
        for (var x = 0; x < numberOfNestedStatements; x++) {
            nestedBlocks.push(bd.acorn.ctr.createTree(tree.body[x])); //remove from innerTree the manual adding of next, regular createTree will handle that
        }

        for (var x = nestedBlocks.length - 1; x > 0; x--) {
            nestedBlocks[x - 1]['next'] = nestedBlocks[x];
        }
        nestedBlock = nestedBlocks[0];
    }
    return nestedBlock;
}

/**
 *
 */
function ifStatement(expState){
    var args = [];
    var alternateNode = expState.alternate;
    var consequentNode = expState.consequent;
    var testNode = expState.test;
    args.push(bd.acorn.ctr.createTree(testNode));
    if (consequentNode.body[0] != null) {
	    doBlock = bd.acorn.ctr.createTree(consequentNode.body[0]);
	    args.push(doBlock);
	} else {
		args.push("EMPTY");
	}

    if(alternateNode == null){
        return args;
    }
    if (alternateNode != null) {
        if (alternateNode.type == "IfStatement") {
            alternateArgs = ifStatement(alternateNode);
            for (var x = 0; x < alternateArgs.length; x++) {
                args.push(alternateArgs[x]);
            }
            return args;
        }
        if (alternateNode.type == "BlockStatement" && alternateNode.body[0] != null) {
            args.push(bd.acorn.ctr.createTree(alternateNode.body[0]));
            return args;
        } else {
			args.push("EMPTY");
			return args;
		}
    }
}

/**
 *
 */
function comparisonOperator(expressionNode) {
	var comparisonOperators = {
 		'===': 'EQ' ,
		'!==' : 'NEQ',
	    '<' : 'LT',
	    '<=' : 'LTE',
	    '>' : 'GT',
	    '>=' : 'GTE'
	};
	var hasLeftNested = false, hasRightNested = false;

	var leftNode = expressionNode.left;
	if (leftNode.type == "BinaryExpression") {
		var leftNested = (comparisonOperators[leftNode.operator] != null) ? comparisonOperator(leftNode) : mathOperator(leftNode);
		hasLeftNested = true;
	}
    if (leftNode.type == "CallExpression"){
        var leftNested = bd.acorn.ctr.createTree(leftNode);
        hasLeftNested = true;
    }
    var rightNode = expressionNode.right;
    if (rightNode.type == "BinaryExpression") {
        var rightNested = (comparisonOperators[rightNode.operator] != null) ? comparisonOperator(rightNode) : mathOperator(rightNode);
        hasRightNested = true;
    }
    if (rightNode.type == "CallExpression"){
        var rightNested = bd.acorn.ctr.createTree(rightNode);
        hasRightNested = true;
    }
    if (hasLeftNested) {
    	leftNode = leftNested;
    }
    if (hasRightNested) {
    	rightNode = rightNested;
    }
    if (hasLeftNested && hasRightNested) {
    	nestedBlocks = [];
        nestedBlocks.push(leftNested);
        nestedBlocks.push(rightNested);
    }

    args = [];
    args.push(leftNode);
    args.push(rightNode);

    functionName = 'logicCompare';
    block = { type: functionNameToBlockName[functionName] };

    Blockly = bd.acorn.ctr.getCurrentBlockly();
    parameters = Blockly.Blocks[block.type].jsBlockInfo.textParameters;

    operation = comparisonOperators[expressionNode.operator];
    block["fieldNameToValue"] = { "OP": operation };

    block["input"] = {};
    input = block.input;


    for (var x = 0; x < parameters.length; x++) {
        if (hasLeftNested && hasRightNested) {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            input[parameters[x]] = { inputType: inputTemp, blockInfo: nestedBlocks[x] };
        }
        else if (hasLeftNested) {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            if (x == 0) {
                input[parameters[x]] = { inputType: inputTemp, blockInfo: leftNested };
            } else {
                if(args[x].type == "Literal"){
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };
                }
                else if(args[x].type == "CallExpression"){
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };	// innerTree
                }
            }
        }
        else if (hasRightNested) {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            if (x == 1) {
                input[parameters[x]] = { inputType: inputTemp, blockInfo: rightNested };
            } else {
                input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };
            }
        }
        else {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };
        }
    }
    return block;
}

/**
 *
 */
function operationOperator(expressionNode) {
	var operationOperators = {
		'&&' : 'AND',
		'||' : 'OR'
	};
	var comparisonOperators = {
 		'===': 'EQ' ,
		'!==' : 'NEQ',
	    '<' : 'LT',
	    '<=' : 'LTE',
	    '>' : 'GT',
	    '>=' : 'GTE'
	};

	var hasLeftNested = false, hasRightNested = false;

	var leftNode = expressionNode.left;
	if (leftNode.type == "BinaryExpression") {
		var leftNested = (operationOperators[leftNode.operator] != null) ? operationOperator(leftNode) : comparisonOperator(leftNode);
		hasLeftNested = true;
	} else if (leftNode.type == "CallExpression"){
        var leftNested = bd.acorn.ctr.createTree(leftNode);
        hasLeftNested = true;
    } else if (leftNode.type == "UnaryExpression") {
    	var leftNested = bd.acorn.ctr.createTree(leftNode);
    	hasLeftNested = true;
    }
    var rightNode = expressionNode.right;
    if (rightNode.type == "BinaryExpression") {
        var rightNested = (operationOperators[rightNode.operator] != null) ? operationOperator(rightNode) : comparisonOperator(rightNode);
        hasRightNested = true;
    } else if (rightNode.type == "CallExpression"){
        var rightNested = bd.acorn.ctr.createTree(rightNode);
        hasRightNested = true;
    } else if (rightNode.type == "UnaryExpression") {
    	var rightNested = bd.acorn.ctr.createTree(rightNode);
    	hasRightNested = true;
    }
    if (hasLeftNested) {
    	leftNode = leftNested;
    }
    if (hasRightNested) {
    	rightNode = rightNested;
    }
    if (hasLeftNested && hasRightNested) {
    	nestedBlocks = [];
        nestedBlocks.push(leftNested);
        nestedBlocks.push(rightNested);
    }

    args = [];
    args.push(leftNode);
    args.push(rightNode);

    functionName = 'logicOperation';
    block = { type: functionNameToBlockName[functionName] };

    Blockly = bd.acorn.ctr.getCurrentBlockly();
    parameters = Blockly.Blocks[block.type].jsBlockInfo.textParameters;

    operation = operationOperators[expressionNode.operator];
    block["fieldNameToValue"] = { "OP": operation };

    block["input"] = {};
    input = block.input;


    for (var x = 0; x < parameters.length; x++) {
        if (hasLeftNested && hasRightNested) {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            input[parameters[x]] = { inputType: inputTemp, blockInfo: nestedBlocks[x] };
        }
        else if (hasLeftNested) {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            if (x == 0) {
                input[parameters[x]] = { inputType: inputTemp, blockInfo: leftNested };
            } else {
                if(args[x].type == "Literal"){
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };
                }
                else if(args[x].type == "CallExpression"){
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };	// innerTree
                }
            }
        }
        else if (hasRightNested) {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            if (x == 1) {
                input[parameters[x]] = { inputType: inputTemp, blockInfo: rightNested };
            } else {
                input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };
            }
        }
        else {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };
        }
    }
    return block;


}

/**
 *
 */
function mathOperator(expressionNode) {
    var Operators = {"+":"ADD", "-":"MINUS", "*":"MULTIPLY", "/":"DIVIDE", "^":"POWER", "%":"MOD"};
    var operatorToBlockName = {"+":"math_add", "-":"math_subtract", "*":"math_multiply", "/":"math_division", "^":"math_power", "%":"math_mod"};
    var hasLeftNested = false, hasRightNested = false;

    var leftNode = expressionNode.left;
    if (leftNode.type == "BinaryExpression") {
        var leftNested = mathOperator(leftNode);
        hasLeftNested = true;
    }
    if (leftNode.type == "CallExpression"){
        var leftNested = bd.acorn.ctr.createTree(leftNode);	//innerTree
        hasLeftNested = true;
    }
    var rightNode = expressionNode.right;
    if (rightNode.type == "BinaryExpression") {
        var rightNested = mathOperator(rightNode);
        hasRightNested = true;
    }
    if (rightNode.type == "CallExpression"){
        var rightNested = bd.acorn.ctr.createTree(rightNode);	// innerTree
        hasRightNested = true;
    }
    if(hasLeftNested){
        leftNode = leftNested;
    }
    if(hasRightNested){
        rightNode = rightNested;
    }
    if (hasLeftNested && hasRightNested) {
        nestedBlocks = [];
        nestedBlocks.push(leftNested);
        nestedBlocks.push(rightNested);
    }

    args = [];
    args.push(leftNode);
    args.push(rightNode);

    // BinaryExpression is currently only used for arithmetic so this is a bit hardcoded
    if (bd.acorn.ctr.isGameblox) {
        functionName = 'arithmetic';
        block = { type: functionNameToBlockName[functionName] };
    }
    else {
        block = { type: operatorToBlockName[expressionNode.operator]}
    }

    Blockly = bd.acorn.ctr.getCurrentBlockly();
    parameters = Blockly.Blocks[block.type].textParameters;

    if (bd.acorn.ctr.isGameblox) {
        operation = Operators[expressionNode.operator];
        block["fieldNameToValue"] = { "OP": operation };
    }

    block["input"] = {};
    input = block.input;


    for (var x = 0; x < parameters.length; x++) {
        if (hasLeftNested && hasRightNested) {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            input[parameters[x]] = { inputType: inputTemp, blockInfo: nestedBlocks[x] };
        }
        else if (hasLeftNested) {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            if (x == 0) {
                input[parameters[x]] = { inputType: inputTemp, blockInfo: leftNested };
            } else {
                if(args[x].type == "Literal"){
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: literals(args[x]) };
                }
                else if(args[x].type == "CallExpression"){
                    input[parameters[x]] = { inputType: inputTemp, blockInfo: bd.acorn.ctr.createTree(args[x]) };	// innerTree
                }
            }
        }
        else if (hasRightNested) {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            if (x == 1) {
                input[parameters[x]] = { inputType: inputTemp, blockInfo: rightNested };
            } else {
                input[parameters[x]] = { inputType: inputTemp, blockInfo: literals(args[x]) };
            }
        }
        else {
            inputTemp = typeOfInput(parameters[x], Blockly, Blockly.Blocks[block.type]);
            input[parameters[x]] = { inputType: inputTemp, blockInfo: literals(args[x]) };
        }
    }
    return block;
}

/**
 *
 */
function typeOfInput(name, block, blockInfo){
    if (blockInfo.jsonObject == null) {
        var param = blockInfo.getParametersBTT();
    }
    else {
        var param = blockInfo.jsonObject["args0"];
    }

    for (var x = 0; x < param.length; x++) {
        if (bd.acorn.containsPrefix(name, param[x].name)) { //param[x].name === name
            if (blockInfo.jsonObject  == null) {
                if (param[x].type == block.Parameter.Types.STATEMENT)
                    type = "statement";
                if (param[x].type == block.Parameter.Types.VALUE)
                    type = "value";
                if (param[x].type == block.Parameter.Types.DROPDOWN)
                	type = "statement";
            }
            else{
                if (param[x].type == "input_statement")
                    type = "statement";
                if (param[x]["type"] == "input_value")
                    type = "value";
                if (param[x].type == "field_dropdown")
                    type = "statement";
            }
        }
    }

    return type;
}

/**
 * literals method takes in an entire node of a literal and returns the block representation of the number
 */
function literals(tree){
    var block;

    if(tree.type === "Literal"){
        literalNode = tree;
        if(typeof literalNode.value === "number"){
            block = {type: "math_number"};
            block["fieldNameToValue"] = {"NUM":String(literalNode.value)};
        }
        else if(typeof literalNode.value === "string"){
            block = {type: "text"};
            block["fieldNameToValue"] = {"TEXT":String(literalNode.value)};
        }
    }
    return block;
}