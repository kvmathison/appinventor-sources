// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Math blocks for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.Blocks.math');

goog.require('Blockly.Blocks.Utilities');

Blockly.Blocks['math_number'] = {
  // Numeric value.
  category: 'Math',
  jsonObject: {
    "type": "math_number",
    "message0": "%1",
    "args0": [
      {
        "type": "field_number",
        "name": "NUM",
        "value": "0"
      }
    ],
    "output": "Number",
    "category": "Math",
    "colour": Blockly.MATH_CATEGORY_HUE,
    "tooltip": Blockly.Msg.LANG_MATH_NUMBER_TOOLTIP,
    "helpUrl": Blockly.Msg.LANG_MATH_NUMBER_HELPURL
  },
  init: function() {
    this.jsonInit(this.jsonObject);
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "math_number",
    textParameters: ["NUM"],
    blockToText: function(block) {
      return block.getFieldValue("NUM");
    }
  },
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_MUTATOR_ITEM_INPUT_NUMBER}]
};

Blockly.Blocks['math_compare'] = {
  // Basic arithmetic operator.
  // TODO(Andrew): equality block needs to have any on the sockets.
  category: 'Math',
  jsonObject: {
    "type": "math_compare",
    "message0": "%1 %3 %2",
    "args0": [
      {
        "type": "input_value",
        "name": "A"
      },
      {
        "type": "input_value",
        "name": "B"
      },
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          [Blockly.Msg.LANG_MATH_COMPARE_EQ, 'EQ'],
          [Blockly.Msg.LANG_MATH_COMPARE_NEQ, 'NEQ'],
          [Blockly.Msg.LANG_MATH_COMPARE_LT, 'LT'],
          [Blockly.Msg.LANG_MATH_COMPARE_LTE, 'LTE'],
          [Blockly.Msg.LANG_MATH_COMPARE_GT, 'GT'],
          [Blockly.Msg.LANG_MATH_COMPARE_GTE, 'GTE']
        ]
      }
    ],
    "output": "Boolean",
    "category": "Math",
    "inputsInline": true,
    "colour": Blockly.MATH_CATEGORY_HUE
  },
  init: function() {
    this.jsonInit(this.jsonObject);
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_compare.TOOLTIPS()[mode];
    });
    this.setHelpUrl(function () {
      var mode = this.getFieldValue('OP');
      return Blockly.Blocks.math_compare.HELPURLS()[mode];
    });
    this.prevBlocks_ = [null, null];
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "logicCompare",
    textParameters: ["A","B"],
    blockToText: function(block) {
      var operators = {
        'EQ': "===",
        'NEQ': "!==",
        'LT': "<",
        'LTE': "<=",
        'GT': ">",
        'GTE': ">="
      };

      var text = "";

      text += "(";
      text += bd.acorn.ctr.blockToText(block.getInputTargetBlock("A"));
      text += operators[block.getFieldValue("OP")];
      text += bd.acorn.ctr.blockToText(block.getInputTargetBlock("B"));
      text += ")";

      return text;
    }
  },
  onchange: function(e) {
    var blockA = this.getInputTargetBlock('A');
    var blockB = this.getInputTargetBlock('B');
    // Disconnect blocks that existed prior to this change if they don't match.
    if (blockA && blockB &&
        !blockA.outputConnection.checkType_(blockB.outputConnection)) {
      // Mismatch between two inputs.  Disconnect previous and bump it away.
      // Ensure that any disconnections are grouped with the causing event.
      Blockly.Events.setGroup(e.group);
      for (var i = 0; i < this.prevBlocks_.length; i++) {
        var block = this.prevBlocks_[i];
        if (block === blockA || block === blockB) {
          block.unplug();
          block.bumpNeighbours_();
        }
      }
      Blockly.Events.setGroup(false);
    }
    this.prevBlocks_[0] = blockA;
    this.prevBlocks_[1] = blockB;
  }
};

/*
Blockly.Blocks.math_compare.OPERATORS = function () {
  return [[Blockly.Msg.LANG_MATH_COMPARE_EQ, 'EQ'],
    [Blockly.Msg.LANG_MATH_COMPARE_NEQ, 'NEQ'],
    [Blockly.Msg.LANG_MATH_COMPARE_LT, 'LT'],
    [Blockly.Msg.LANG_MATH_COMPARE_LTE, 'LTE'],
    [Blockly.Msg.LANG_MATH_COMPARE_GT, 'GT'],
    [Blockly.Msg.LANG_MATH_COMPARE_GTE, 'GTE']];
};*/

Blockly.Blocks.math_compare.TOOLTIPS = function () {
  return {
    EQ: Blockly.Msg.LANG_MATH_COMPARE_TOOLTIP_EQ,
    NEQ: Blockly.Msg.LANG_MATH_COMPARE_TOOLTIP_NEQ,
    LT: Blockly.Msg.LANG_MATH_COMPARE_TOOLTIP_LT,
    LTE: Blockly.Msg.LANG_MATH_COMPARE_TOOLTIP_LTE,
    GT: Blockly.Msg.LANG_MATH_COMPARE_TOOLTIP_GT,
    GTE: Blockly.Msg.LANG_MATH_COMPARE_TOOLTIP_GTE
  }
};

Blockly.Blocks.math_compare.HELPURLS = function () {
  return {
    EQ: Blockly.Msg.LANG_MATH_COMPARE_HELPURL_EQ,
    NEQ: Blockly.Msg.LANG_MATH_COMPARE_HELPURL_NEQ,
    LT: Blockly.Msg.LANG_MATH_COMPARE_HELPURL_LT,
    LTE: Blockly.Msg.LANG_MATH_COMPARE_HELPURL_LTE,
    GT: Blockly.Msg.LANG_MATH_COMPARE_HELPURL_GT,
    GTE: Blockly.Msg.LANG_MATH_COMPARE_HELPURL_GTE
  }
};

Blockly.Blocks['math_add'] = {
  // Basic arithmetic operator.
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_ARITHMETIC_HELPURL_ADD,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM0')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    // append the title on a separate line to avoid overly long lines
    this.appendValueInput('NUM1')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Msg.LANG_MATH_ARITHMETIC_ADD);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      return Blockly.Msg.LANG_MATH_ARITHMETIC_TOOLTIP_ADD;
    });
    this.setMutator(new Blockly.Mutator(['math_mutator_item']));
    this.emptyInputName = 'EMPTY';
    this.repeatingInputName = 'NUM';
    this.itemCount_ = 2;
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "math_add",
    blockToText: function(block) {
      var text = "";
      text += "(";
      for (var i=0; i<(block.itemCount_-1); i++) {
        text+=bd.acorn.ctr.blockToText(block.getInputTargetBlock(block.repeatingInputName+i.toString()));
        text+="+";
      }
      text+=bd.acorn.ctr.blockToText(block.getInputTargetBlock(block.repeatingInputName+(block.itemCount_-1).toString()));
      text += ")";

      return text;
    }
  },
  getParametersBTT: function(){
    var params = [];
    var value = new Blockly.ParameterValue('NUM0', Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT), null); // todo
    params.push(value);
    var value = new Blockly.ParameterValue('NUM1', Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT), null); // todo
    params.push(value);
    return params;
  },
  textParameters: ["NUM0", "NUM1"],
  mutationToDom: Blockly.mutationToDom,
  domToMutation: Blockly.domToMutation,
  decompose: function (workspace) {
    return Blockly.decompose(workspace, 'math_mutator_item', this);
  },
  compose: Blockly.compose,
  saveConnections: Blockly.saveConnections,
  addEmptyInput: function () {
    var input = this.appendDummyInput(this.emptyInputName);
  },
  addInput: function (inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum)
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    if (inputNum !== 0) {
      input.appendField(Blockly.Msg.LANG_MATH_ARITHMETIC_ADD);
    }
    return input;
  },
  updateContainerBlock: function (containerBlock) {
    containerBlock.setFieldValue("+", "CONTAINER_TEXT");
  },
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_ARITHMETIC_ADD}]
};

Blockly.Blocks['math_mutator_item'] = {
  // Add items.
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.appendDummyInput()
      //.appendField(Blockly.Msg.LANG_LISTS_CREATE_WITH_ITEM_TITLE);
        .appendField("number");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    //this.setTooltip(Blockly.Msg.LANG_LISTS_CREATE_WITH_ITEM_TOOLTIP_1);
    this.contextMenu = false;
  }
};

Blockly.Blocks['math_subtract'] = {
  // Basic arithmetic operator.
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_ARITHMETIC_HELPURL_MINUS,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('A')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    this.appendValueInput('B')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Msg.LANG_MATH_ARITHMETIC_MINUS);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    this.setTooltip(Blockly.Msg.LANG_MATH_ARITHMETIC_TOOLTIP_MINUS);
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "math_subtract",
    blockToText: function(block) {
      var text = "";

      text += "(";
      text += bd.acorn.ctr.blockToText(block.getInputTargetBlock("A"));
      text += "-";
      text += bd.acorn.ctr.blockToText(block.getInputTargetBlock("B"));
      text += ")";

      return text;
    }
  },
  getParametersBTT: function(){
    var params = [];
    var value = new Blockly.ParameterValue('A', 'Number', null); // todo
    params.push(value);
    var value = new Blockly.ParameterValue('B', 'Number', null); // todo
    params.push(value);
    return params;
  },
  textParameters: ["A", "B"],
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_ARITHMETIC_MINUS}]
};

Blockly.Blocks['math_multiply'] = {
  // Basic arithmetic operator.
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_ARITHMETIC_HELPURL_MULTIPLY,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM0')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    this.appendValueInput('NUM1')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Blocks.Utilities.times_symbol);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      return Blockly.Msg.LANG_MATH_ARITHMETIC_TOOLTIP_MULTIPLY;
    });
    this.setMutator(new Blockly.Mutator(['math_mutator_item']));
    this.emptyInputName = 'EMPTY';
    this.repeatingInputName = 'NUM';
    this.itemCount_ = 2;
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "math_multiply",
    blockToText: function(block) {
      var text = "";
      text += "(";
      for (var i=0; i<(block.itemCount_-1); i++) {
        text+=bd.acorn.ctr.blockToText(block.getInputTargetBlock(block.repeatingInputName+i.toString()));
        text+="*";
      }
      text+=bd.acorn.ctr.blockToText(block.getInputTargetBlock(block.repeatingInputName+(block.itemCount_-1).toString()));
      text += ")";

      return text;
    }
  },
  getParametersBTT: function(){
    var params = [];
    var value = new Blockly.ParameterValue('NUM0', 'Number', null); // todo
    params.push(value);
    var value = new Blockly.ParameterValue('NUM1', 'Number', null); // todo
    params.push(value);
    return params;
  },
  textParameters: ["NUM0", "NUM1"],
  mutationToDom: Blockly.mutationToDom,
  domToMutation: Blockly.domToMutation,
  decompose: function (workspace) {
    return Blockly.decompose(workspace, 'math_mutator_item', this);
  },
  compose: Blockly.compose,
  saveConnections: Blockly.saveConnections,
  addEmptyInput: function () {
    var input = this.appendDummyInput(this.emptyInputName);
  },
  addInput: function (inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum)
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    if (inputNum !== 0) {
      input.appendField(Blockly.Blocks.Utilities.times_symbol);
    }
    return input;
  },
  updateContainerBlock: function (containerBlock) {
    containerBlock.setFieldValue(Blockly.Blocks.Utilities.times_symbol, "CONTAINER_TEXT");
  },
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_ARITHMETIC_MULTIPLY}]
};

Blockly.Blocks['math_division'] = {
  // Basic arithmetic operator.
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_ARITHMETIC_HELPURL_DIVIDE,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('A')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    this.appendValueInput('B')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Msg.LANG_MATH_ARITHMETIC_DIVIDE);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    this.setTooltip(Blockly.Msg.LANG_MATH_ARITHMETIC_TOOLTIP_DIVIDE);
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "math_division",
    blockToText: function(block) {
      var text = "";

      text += "(";
      text += bd.acorn.ctr.blockToText(block.getInputTargetBlock("A"));
      text += "/";
      text += bd.acorn.ctr.blockToText(block.getInputTargetBlock("B"));
      text += ")";

      return text;
    }
  },
  getParametersBTT: function(){
    var params = [];
    var value = new Blockly.ParameterValue('A', 'Number', null); // todo
    params.push(value);
    var value = new Blockly.ParameterValue('B', 'Number', null); // todo
    params.push(value);
    return params;
  },
  textParameters: ["A", "B"],
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_ARITHMETIC_DIVIDE}]
};

Blockly.Blocks['math_power'] = {
  // Basic arithmetic operator.
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_ARITHMETIC_HELPURL_POWER,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('A')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    this.appendValueInput('B')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Msg.LANG_MATH_ARITHMETIC_POWER);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(Blockly.Msg.LANG_MATH_ARITHMETIC_TOOLTIP_POWER);
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "math_power",
    blockToText: function(block) {
      var text = "";

      text += "(";
      text += bd.acorn.ctr.blockToText(block.getInputTargetBlock("A"));
      text += "^";
      text += bd.acorn.ctr.blockToText(block.getInputTargetBlock("B"));
      text += ")";

      return text;
    }
  },
  getParametersBTT: function(){
    var params = [];
    var value = new Blockly.ParameterValue('A', 'Number', null); // todo
    params.push(value);
    var value = new Blockly.ParameterValue('B', 'Number', null); // todo
    params.push(value);
    return params;
  },
  textParameters: ["A", "B"],
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_ARITHMETIC_POWER}]
};

Blockly.Blocks['math_random_int'] = {
  // Random integer between [X] and [Y].
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_RANDOM_INT_HELPURL,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));

    var checkTypeNumber = Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT);
    this.interpolateMsg(Blockly.Msg.LANG_MATH_RANDOM_INT_INPUT,
        ['FROM', checkTypeNumber, Blockly.ALIGN_RIGHT],
        ['TO', checkTypeNumber, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT)
    /*this.appendValueInput('FROM')
     .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number",Blockly.Blocks.Utilities.INPUT))
     .appendField(Blockly.Msg.LANG_MATH_RANDOM_INT_TITLE_RANDOM)
     .appendField(Blockly.Msg.LANG_MATH_RANDOM_INT_INPUT_FROM);
     this.appendValueInput('TO')
     .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number",Blockly.Blocks.Utilities.INPUT))
     .appendField(Blockly.Msg.LANG_MATH_RANDOM_INT_INPUT_TO);*/
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.LANG_MATH_RANDOM_INT_TOOLTIP);
  },
  getParametersBTT: function(){
    var params = []
    params.push(new Blockly.ParameterValue('FROM', 'Number', null)); // todo
    params.push(new Blockly.ParameterValue('TO', 'Number', null)); // todo
    return params;
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "randomInt",
    textParameters: ["FROM","TO"],
  },
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_RANDOM_INT_TITLE_RANDOM}]
};

Blockly.Blocks['math_random_float'] = {
  // Random fraction between 0 and 1.
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_RANDOM_FLOAT_HELPURL,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendDummyInput()
        .appendField(Blockly.Msg.LANG_MATH_RANDOM_FLOAT_TITLE_RANDOM);
    this.setTooltip(Blockly.Msg.LANG_MATH_RANDOM_FLOAT_TOOLTIP);
  },
  getParametersBTT: function(){
    var params = []
    return params;
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "random",
    textParameters: [],
  },
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_RANDOM_FLOAT_TITLE_RANDOM}]
};

Blockly.Blocks['math_random_set_seed'] = {
  // Set the seed of the radom number generator
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_RANDOM_SEED_HELPURL,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(false, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Msg.LANG_MATH_RANDOM_SEED_TITLE_RANDOM)
        .appendField(Blockly.Msg.LANG_MATH_RANDOM_SEED_INPUT_TO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LANG_MATH_RANDOM_SEED_TOOLTIP);
  },
  getParametersBTT: function(){
    var params = []
    params.push(new Blockly.ParameterValue('NUM', 'Number', null)); // todo
    return params;
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: "randomSetSeed",
    textParameters: ["NUM"],
  },
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_RANDOM_SEED_TITLE_RANDOM}]
};

Blockly.Blocks['math_on_list'] = {
  // Evaluate a list of numbers to return sum, average, min, max, etc.
  // Some functions also work on text (min, max, mode, median).
  category: 'Math',
  helpUrl: '',
  init: function () {
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM0')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    this.appendValueInput('NUM1')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    this.setInputsInline(false);
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_on_list.TOOLTIPS()[mode];
    });
    this.setMutator(new Blockly.Mutator(['math_mutator_item']));
    this.itemCount_ = 2;
    this.valuesToSave = {'OP': null};
    this.emptyInputName = 'EMPTY';
    this.repeatingInputName = 'NUM';
  },
  mutationToDom: Blockly.mutationToDom,
  domToMutation: Blockly.domToMutation,
  decompose: function (workspace) {
    return Blockly.decompose(workspace, 'math_mutator_item', this);
  },
  compose: Blockly.compose,
  saveConnections: Blockly.saveConnections,
  addEmptyInput: function () {
    var input = this.appendDummyInput(this.emptyInputName);
    input.appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    this.setFieldValue(this.valuesToSave['OP'], 'OP');
  },
  addInput: function (inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum)
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    if (inputNum == 0) {
      input.appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
      this.setFieldValue(this.valuesToSave['OP'], 'OP');
    }
    return input;
  },
  updateContainerBlock: function (containerBlock) {

    for (var i = 0; i < Blockly.Blocks.math_on_list.OPERATORS.length; i++) {
      if (Blockly.Blocks.math_on_list.OPERATORS[i][1] == this.getFieldValue("OP")) {
        containerBlock.setFieldValue(Blockly.Blocks.math_on_list.OPERATORS[i][0], "CONTAINER_TEXT");
      }
    }

  },
  typeblock: [{
    translatedName: Blockly.Msg.LANG_MATH_ONLIST_OPERATOR_MIN,
    dropDown: {
      titleName: 'OP',
      value: 'MIN'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_ONLIST_OPERATOR_MAX,
    dropDown: {
      titleName: 'OP',
      value: 'MAX'
    }
  }]
};

Blockly.Blocks.math_on_list.OPERATORS = function () {
  return [[Blockly.Msg.LANG_MATH_ONLIST_OPERATOR_MIN, 'MIN'],
    [Blockly.Msg.LANG_MATH_ONLIST_OPERATOR_MAX, 'MAX']]
};

Blockly.Blocks.math_on_list.TOOLTIPS = function () {
  return {
    MIN: Blockly.Msg.LANG_MATH_ONLIST_TOOLTIP_MIN,
    MAX: Blockly.Msg.LANG_MATH_ONLIST_TOOLTIP_MAX
  }
};

Blockly.Blocks['math_single'] = {
  // Advanced math operators with single operand.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_single.HELPURLS()[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_single.TOOLTIPS()[mode];
    });
  },
  getParametersBTT: function(){
    var params = [];
    var OPERATORS =
        [[Blockly.Msg.MATH_SINGLE_OP_ROOT, 'ROOT'],
        [Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE, 'ABS'],
        ['-', 'NEG'],
        ['ln', 'LN'],
        ['e^', 'EXP'],
        [Blockly.Msg.MATH_ROUND_OPERATOR_ROUND, 'ROUND'],
        [Blockly.Msg.LANG_MATH_ROUND_OPERATOR_CEILING, 'CEILING'],
        [Blockly.Msg.LANG_MATH_ROUND_OPERATOR_FLOOR, 'FLOOR']];

    var op = new Blockly.ParameterDropdown('OP',OPERATORS, null);
    params.push(op);
    var num = new Blockly.ParameterValue('NUM', 'Number', null);
    params.push(num);
    return params
  },
  jsBlockInfo: {
    scope: "GLOBAL",
    methodName: ["sqrt", "abs", "neg", "ln", "exp", "round", "ceil", "floor"],
    textParameters: ["NUM"],
    methodNameToBlockValues: {"sqrt":{fieldNameToValue: {"OP":"ROOT"}},
      "abs":{fieldNameToValue: {"OP":"ABS"}},
      "neg":{fieldNameToValue: {"OP":"NEG"}},
      "ln":{fieldNameToValue: {"OP":"LN"}},
      "exp":{fieldNameToValue: {"OP":"EXP"}},
      "round":{fieldNameToValue: {"OP":"ROUND"}},
      "ceil":{fieldNameToValue: {"OP":"CEILING"}},
      "floor":{fieldNameToValue: {"OP":"FLOOR"}}}
  },
  typeblock: [{
    translatedName: Blockly.Msg.LANG_MATH_SINGLE_OP_ROOT,
    dropDown: {
      titleName: 'OP',
      value: 'ROOT'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_SINGLE_OP_ABSOLUTE,
    dropDown: {
      titleName: 'OP',
      value: 'ABS'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_SINGLE_OP_NEG,
    dropDown: {
      titleName: 'OP',
      value: 'NEG'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_SINGLE_OP_LN,
    dropDown: {
      titleName: 'OP',
      value: 'LN'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_SINGLE_OP_EXP,
    dropDown: {
      titleName: 'OP',
      value: 'EXP'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_ROUND_OPERATOR_ROUND,
    dropDown: {
      titleName: 'OP',
      value: 'ROUND'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_ROUND_OPERATOR_CEILING,
    dropDown: {
      titleName: 'OP',
      value: 'CEILING'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_ROUND_OPERATOR_FLOOR,
    dropDown: {
      titleName: 'OP',
      value: 'FLOOR'
    }
  }]
};

Blockly.Blocks.math_single.OPERATORS = function () {
  return [[Blockly.Msg.LANG_MATH_SINGLE_OP_ROOT, 'ROOT'],
    [Blockly.Msg.LANG_MATH_SINGLE_OP_ABSOLUTE, 'ABS'],
    [Blockly.Msg.LANG_MATH_SINGLE_OP_NEG, 'NEG'],
    [Blockly.Msg.LANG_MATH_SINGLE_OP_LN, 'LN'],
    [Blockly.Msg.LANG_MATH_SINGLE_OP_EXP, 'EXP'],
    [Blockly.Msg.LANG_MATH_ROUND_OPERATOR_ROUND, 'ROUND'],
    [Blockly.Msg.LANG_MATH_ROUND_OPERATOR_CEILING, 'CEILING'],
    [Blockly.Msg.LANG_MATH_ROUND_OPERATOR_FLOOR, 'FLOOR']];
};

Blockly.Blocks.math_single.TOOLTIPS = function () {
  return {
    ROOT: Blockly.Msg.LANG_MATH_SINGLE_TOOLTIP_ROOT,
    ABS: Blockly.Msg.LANG_MATH_SINGLE_TOOLTIP_ABS,
    NEG: Blockly.Msg.LANG_MATH_SINGLE_TOOLTIP_NEG,
    LN: Blockly.Msg.LANG_MATH_SINGLE_TOOLTIP_LN,
    EXP: Blockly.Msg.LANG_MATH_SINGLE_TOOLTIP_EXP,
    ROUND: Blockly.Msg.LANG_MATH_ROUND_TOOLTIP_ROUND,
    CEILING: Blockly.Msg.LANG_MATH_ROUND_TOOLTIP_CEILING,
    FLOOR: Blockly.Msg.LANG_MATH_ROUND_TOOLTIP_FLOOR
  }
};

Blockly.Blocks.math_single.HELPURLS = function () {
  return {
    ROOT: Blockly.Msg.LANG_MATH_SINGLE_HELPURL_ROOT,
    ABS: Blockly.Msg.LANG_MATH_SINGLE_HELPURL_ABS,
    NEG: Blockly.Msg.LANG_MATH_SINGLE_HELPURL_NEG,
    LN: Blockly.Msg.LANG_MATH_SINGLE_HELPURL_LN,
    EXP: Blockly.Msg.LANG_MATH_SINGLE_HELPURL_EXP,
    ROUND: Blockly.Msg.LANG_MATH_ROUND_HELPURL_ROUND,
    CEILING: Blockly.Msg.LANG_MATH_ROUND_HELPURL_CEILING,
    FLOOR: Blockly.Msg.LANG_MATH_ROUND_HELPURL_FLOOR
  }
};

Blockly.Blocks['math_abs'] = {
  // Advanced math operators with single operand.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_single.HELPURLS[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('ABS', "OP");
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_single.TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_neg'] = {
  // Advanced math operators with single operand.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_single.HELPURLS[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('NEG', "OP");
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_single.TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_round'] = {
  // Advanced math operators with single operand.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_single.HELPURLS[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('ROUND', "OP");
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_single.TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_ceiling'] = {
  // Advanced math operators with single operand.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_single.HELPURLS[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('CEILING', "OP");
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_single.TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_floor'] = {
  // Advanced math operators with single operand.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_single.HELPURLS[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('FLOOR', "OP");
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_single.TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_divide'] = {
  // Remainder or quotient of a division.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_divide.HELPURLS()[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('DIVIDEND')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    this.appendValueInput('DIVISOR')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Msg.LANG_MATH_DIVIDE);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_divide.TOOLTIPS()[mode];
    });
  },
  typeblock: [{
    translatedName: Blockly.Msg.LANG_MATH_DIVIDE_OPERATOR_MODULO,
    dropDown: {
      titleName: 'OP',
      value: 'MODULO'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_DIVIDE_OPERATOR_REMAINDER,
    dropDown: {
      titleName: 'OP',
      value: 'REMAINDER'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_DIVIDE_OPERATOR_QUOTIENT,
    dropDown: {
      titleName: 'OP',
      value: 'QUOTIENT'
    }
  }]
};

Blockly.Blocks.math_divide.OPERATORS = function () {
  return [[Blockly.Msg.LANG_MATH_DIVIDE_OPERATOR_MODULO, 'MODULO'],
    [Blockly.Msg.LANG_MATH_DIVIDE_OPERATOR_REMAINDER, 'REMAINDER'],
    [Blockly.Msg.LANG_MATH_DIVIDE_OPERATOR_QUOTIENT, 'QUOTIENT']];
};

Blockly.Blocks.math_divide.TOOLTIPS = function () {
  return {
    MODULO: Blockly.Msg.LANG_MATH_DIVIDE_TOOLTIP_MODULO,
    REMAINDER: Blockly.Msg.LANG_MATH_DIVIDE_TOOLTIP_REMAINDER,
    QUOTIENT: Blockly.Msg.LANG_MATH_DIVIDE_TOOLTIP_QUOTIENT
  }
};

Blockly.Blocks.math_divide.HELPURLS = function () {
  return {
    MODULO: Blockly.Msg.LANG_MATH_DIVIDE_HELPURL_MODULO,
    REMAINDER: Blockly.Msg.LANG_MATH_DIVIDE_HELPURL_REMAINDER,
    QUOTIENT: Blockly.Msg.LANG_MATH_DIVIDE_HELPURL_QUOTIENT
  }
};

Blockly.Blocks['math_trig'] = {
  // Trigonometry operators.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_trig.HELPURLS()[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_trig.TOOLTIPS()[mode];
    });
  },
  typeblock: [{
    translatedName: Blockly.Msg.LANG_MATH_TRIG_SIN,
    dropDown: {
      titleName: 'OP',
      value: 'SIN'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_TRIG_COS,
    dropDown: {
      titleName: 'OP',
      value: 'COS'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_TRIG_TAN,
    dropDown: {
      titleName: 'OP',
      value: 'TAN'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_TRIG_ASIN,
    dropDown: {
      titleName: 'OP',
      value: 'ASIN'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_TRIG_ACOS,
    dropDown: {
      titleName: 'OP',
      value: 'ACOS'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_TRIG_ATAN,
    dropDown: {
      titleName: 'OP',
      value: 'ATAN'
    }
  }]
};

Blockly.Blocks.math_trig.OPERATORS = function () {
  return [[Blockly.Msg.LANG_MATH_TRIG_SIN, 'SIN'],
    [Blockly.Msg.LANG_MATH_TRIG_COS, 'COS'],
    [Blockly.Msg.LANG_MATH_TRIG_TAN, 'TAN'],
    [Blockly.Msg.LANG_MATH_TRIG_ASIN, 'ASIN'],
    [Blockly.Msg.LANG_MATH_TRIG_ACOS, 'ACOS'],
    [Blockly.Msg.LANG_MATH_TRIG_ATAN, 'ATAN']];
}

Blockly.Blocks.math_trig.TOOLTIPS = function () {
  return {
    SIN: Blockly.Msg.LANG_MATH_TRIG_TOOLTIP_SIN,
    COS: Blockly.Msg.LANG_MATH_TRIG_TOOLTIP_COS,
    TAN: Blockly.Msg.LANG_MATH_TRIG_TOOLTIP_TAN,
    ASIN: Blockly.Msg.LANG_MATH_TRIG_TOOLTIP_ASIN,
    ACOS: Blockly.Msg.LANG_MATH_TRIG_TOOLTIP_ACOS,
    ATAN: Blockly.Msg.LANG_MATH_TRIG_TOOLTIP_ATAN
  }
};

Blockly.Blocks.math_trig.HELPURLS = function () {
  return {
    SIN: Blockly.Msg.LANG_MATH_TRIG_HELPURL_SIN,
    COS: Blockly.Msg.LANG_MATH_TRIG_HELPURL_COS,
    TAN: Blockly.Msg.LANG_MATH_TRIG_HELPURL_TAN,
    ASIN: Blockly.Msg.LANG_MATH_TRIG_HELPURL_ASIN,
    ACOS: Blockly.Msg.LANG_MATH_TRIG_HELPURL_ACOS,
    ATAN: Blockly.Msg.LANG_MATH_TRIG_HELPURL_ATAN
  }
};

Blockly.Blocks['math_cos'] = {
  // Trigonometry operators.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_trig.HELPURLS()[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_trig.OPERATORS), 'OP');
    this.setFieldValue('COS', "OP");
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_trig.TOOLTIPS()[mode];
    });
  }
};

Blockly.Blocks['math_tan'] = {
  // Trigonometry operators.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_trig.HELPURLS()[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_trig.OPERATORS), 'OP');
    this.setFieldValue('TAN', "OP");
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_trig.TOOLTIPS()[mode];
    });
  }
};

Blockly.Blocks['math_atan2'] = {
  // Trigonometry operators.
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_TRIG_HELPURL_ATAN2,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendDummyInput().appendField(Blockly.Msg.LANG_MATH_TRIG_ATAN2);
    this.appendValueInput('Y')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Msg.LANG_MATH_TRIG_ATAN2_Y)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('X')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Msg.LANG_MATH_TRIG_ATAN2_X)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(false);
    this.setTooltip(Blockly.Msg.LANG_MATH_TRIG_TOOLTIP_ATAN2);
  },
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_TRIG_ATAN2}]
};

Blockly.Blocks['math_convert_angles'] = {
  // Trigonometry operators.
  category: 'Math',
  helpUrl: function () {
    var mode = this.getFieldValue('OP');
    return Blockly.Blocks.math_convert_angles.HELPURLS()[mode];
  },
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT))
        .appendField(Blockly.Msg.LANG_MATH_CONVERT_ANGLES_TITLE_CONVERT)
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_convert_angles.TOOLTIPS()[mode];
    });
  },
  typeblock: [{
    translatedName: Blockly.Msg.LANG_MATH_CONVERT_ANGLES_TITLE_CONVERT +
    ' ' + Blockly.Msg.LANG_MATH_CONVERT_ANGLES_OP_RAD_TO_DEG,
    dropDown: {
      titleName: 'OP',
      value: 'RADIANS_TO_DEGREES'
    }
  }, {
    translatedName: Blockly.Msg.LANG_MATH_CONVERT_ANGLES_TITLE_CONVERT +
    ' ' + Blockly.Msg.LANG_MATH_CONVERT_ANGLES_OP_DEG_TO_RAD,
    dropDown: {
      titleName: 'OP',
      value: 'DEGREES_TO_RADIANS'
    }
  }]
};

Blockly.Blocks.math_convert_angles.OPERATORS = function () {
  return [[Blockly.Msg.LANG_MATH_CONVERT_ANGLES_OP_RAD_TO_DEG, 'RADIANS_TO_DEGREES'],
    [Blockly.Msg.LANG_MATH_CONVERT_ANGLES_OP_DEG_TO_RAD, 'DEGREES_TO_RADIANS']]
};

Blockly.Blocks.math_convert_angles.TOOLTIPS = function () {
  return {
    RADIANS_TO_DEGREES: Blockly.Msg.LANG_MATH_CONVERT_ANGLES_TOOLTIP_RAD_TO_DEG,
    DEGREES_TO_RADIANS: Blockly.Msg.LANG_MATH_CONVERT_ANGLES_TOOLTIP_DEG_TO_RAD
  }
};

Blockly.Blocks.math_convert_angles.HELPURLS = function () {
  return {
    RADIANS_TO_DEGREES: Blockly.Msg.LANG_MATH_CONVERT_ANGLES_HELPURL_RAD_TO_DEG,
    DEGREES_TO_RADIANS: Blockly.Msg.LANG_MATH_CONVERT_ANGLES_HELPURL_DEG_TO_RAD
  }
};

Blockly.Blocks['math_format_as_decimal'] = {
  category: 'Math',
  helpUrl: Blockly.Msg.LANG_MATH_FORMAT_AS_DECIMAL_HELPURL,
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.OUTPUT));

    var checkTypeNumber = Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT);
    this.interpolateMsg(Blockly.Msg.LANG_MATH_FORMAT_AS_DECIMAL_INPUT,
        ['NUM', checkTypeNumber, Blockly.ALIGN_RIGHT],
        ['PLACES', checkTypeNumber, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    /*this.appendDummyInput()
      .appendField('format as decimal');
    this.appendValueInput('NUM')
      .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number",Blockly.Blocks.Utilities.INPUT))
      .appendField('number')
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('PLACES')
      .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number",Blockly.Blocks.Utilities.INPUT))
      .appendField('places')
      .setAlign(Blockly.ALIGN_RIGHT);*/
    this.setInputsInline(false);
    this.setTooltip(Blockly.Msg.LANG_MATH_FORMAT_AS_DECIMAL_TOOLTIP);
  },
  typeblock: [{translatedName: Blockly.Msg.LANG_MATH_FORMAT_AS_DECIMAL_TITLE}]
};

Blockly.Blocks['math_is_a_number'] = {
  category : 'Math',
  helpUrl: function() {
      var mode = this.getFieldValue('OP');
      return Blockly.Blocks.math_is_a_number.HELPURLS[mode];
  },
  init : function() {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("boolean",Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_is_a_number.TOOLTIPS[mode];
    });
  },
  typeblock: [{
    translatedName: Blockly.Msg.LANG_MATH_IS_A_NUMBER_INPUT_NUM,
    dropDown: {
      titleName: 'OP',
      value: 'NUMBER'
    }
  },{
    translatedName: Blockly.Msg.LANG_MATH_IS_A_DECIMAL_INPUT_NUM,
    dropDown: {
      titleName: 'OP',
      value: 'BASE10'
    }
  },{
    translatedName: Blockly.Msg.LANG_MATH_IS_A_HEXADECIMAL_INPUT_NUM,
    dropDown: {
      titleName: 'OP',
      value: 'HEXADECIMAL'
    }
  },{
    translatedName: Blockly.Msg.LANG_MATH_IS_A_BINARY_INPUT_NUM,
    dropDown: {
      titleName: 'OP',
      value: 'BINARY'
    }
  }]
};

Blockly.Blocks.math_is_a_number.OPERATORS =
  [[ Blockly.Msg.LANG_MATH_IS_A_NUMBER_INPUT_NUM, 'NUMBER' ],
   [ Blockly.Msg.LANG_MATH_IS_A_DECIMAL_INPUT_NUM, 'BASE10' ],
   [ Blockly.Msg.LANG_MATH_IS_A_HEXADECIMAL_INPUT_NUM, 'HEXADECIMAL' ],
   [ Blockly.Msg.LANG_MATH_IS_A_BINARY_INPUT_NUM, 'BINARY' ]];

Blockly.Blocks.math_is_a_number.TOOLTIPS = {
  NUMBER : Blockly.Msg.LANG_MATH_IS_A_NUMBER_TOOLTIP,
  BASE10 : Blockly.Msg.LANG_MATH_IS_A_DECIMAL_TOOLTIP,
  HEXADECIMAL : Blockly.Msg.LANG_MATH_IS_A_HEXADECIMAL_TOOLTIP,
  BINARY : Blockly.Msg.LANG_MATH_IS_A_BINARY_TOOLTIP
};

Blockly.Blocks.math_is_a_number.HELPURLS = {
  NUMBER : Blockly.Msg.LANG_MATH_IS_A_NUMBER_HELPURL,
  BASE10 : Blockly.Msg.LANG_MATH_IS_A_DECIMAL_HELPURL,
  HEXADECIMAL : Blockly.Msg.LANG_MATH_IS_A_HEXADECIMAL_HELPURL,
  BINARY : Blockly.Msg.LANG_MATH_IS_A_BINARY_HELPURL
};

Blockly.Blocks['math_convert_number'] = {
  category : 'Math',
  helpUrl: function() {
      var mode = this.getFieldValue('OP');
      return Blockly.Blocks.math_convert_number.HELPURLS[mode];
  },
  init : function() {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("text",Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('NUM')
        .appendField(Blockly.Msg.LANG_MATH_CONVERT_NUMBER_TITLE_CONVERT)
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      return Blockly.Blocks.math_convert_number.TOOLTIPS[mode];
    });
  },
  typeblock: [{
    translatedName: Blockly.Msg.LANG_MATH_CONVERT_NUMBER_OP_DEC_TO_HEX,
    dropDown: {
      titleName: 'OP',
      value: 'DEC_TO_HEX'
    }
  },{
    translatedName: Blockly.Msg.LANG_MATH_CONVERT_NUMBER_OP_HEX_TO_DEC,
    dropDown: {
      titleName: 'OP',
      value: 'HEX_TO_DEC'
    }
  },{
    translatedName: Blockly.Msg.LANG_MATH_CONVERT_NUMBER_OP_DEC_TO_BIN,
    dropDown: {
      titleName: 'OP',
      value: 'DEC_TO_BIN'
    }
  },{
    translatedName: Blockly.Msg.LANG_MATH_CONVERT_NUMBER_OP_BIN_TO_DEC,
    dropDown: {
      titleName: 'OP',
      value: 'BIN_TO_DEC'
    }
  }]
};

Blockly.Blocks.math_convert_number.OPERATORS =
  [[ Blockly.Msg.LANG_MATH_CONVERT_NUMBER_OP_DEC_TO_HEX, 'DEC_TO_HEX' ],
   [ Blockly.Msg.LANG_MATH_CONVERT_NUMBER_OP_HEX_TO_DEC, 'HEX_TO_DEC' ],
   [ Blockly.Msg.LANG_MATH_CONVERT_NUMBER_OP_DEC_TO_BIN, 'DEC_TO_BIN' ],
   [ Blockly.Msg.LANG_MATH_CONVERT_NUMBER_OP_BIN_TO_DEC, 'BIN_TO_DEC' ]];

Blockly.Blocks.math_convert_number.TOOLTIPS = {
  DEC_TO_HEX : Blockly.Msg.LANG_MATH_CONVERT_NUMBER_TOOLTIP_DEC_TO_HEX,
  HEX_TO_DEC : Blockly.Msg.LANG_MATH_CONVERT_NUMBER_TOOLTIP_HEX_TO_DEC,
  DEC_TO_BIN : Blockly.Msg.LANG_MATH_CONVERT_NUMBER_TOOLTIP_DEC_TO_BIN,
  BIN_TO_DEC : Blockly.Msg.LANG_MATH_CONVERT_NUMBER_TOOLTIP_BIN_TO_DEC
};

Blockly.Blocks.math_convert_number.HELPURLS = {
  DEC_TO_HEX : Blockly.Msg.LANG_MATH_CONVERT_NUMBER_HELPURL_DEC_TO_HEX,
  HEX_TO_DEC : Blockly.Msg.LANG_MATH_CONVERT_NUMBER_HELPURL_HEX_TO_DEC,
  DEC_TO_BIN : Blockly.Msg.LANG_MATH_CONVERT_NUMBER_HELPURL_DEC_TO_BIN,
  BIN_TO_DEC : Blockly.Msg.LANG_MATH_CONVERT_NUMBER_HELPURL_BIN_TO_DEC
};
