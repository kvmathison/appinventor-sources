goog.provide('Blockly.Parameter');

goog.provide('Blockly.ParameterValue');
goog.provide('Blockly.ParameterStatement');
goog.provide('Blockly.ParameterDropdown');
goog.provide('Blockly.ParameterEntity');
goog.provide('Blockly.ParameterText');
goog.provide('Blockly.ParameterImage');


/**
 * Class for an parameter.
 *
 * @constructor
 */
Blockly.Parameter = function(name) {
  this.name = name;
}

Blockly.Parameter.prototype.getNameWithSuffix = function(nameSuffix) {
  var name = this.name;
  if(this.name == null) {
    return null;
  }
  if(typeof nameSuffix != "undefined" && nameSuffix != null) {
    name = name + nameSuffix;
  }
  return name;
}

//For each parameter, get its main function from type
Blockly.Parameter.getParameterFromType = function(type){
  var parameterDictionary = {
    value:Blockly.ParameterValue,
    statement:Blockly.ParameterStatement,
    dropdown:Blockly.ParameterDropdown,
    entity:Blockly.ParameterEntity,
    text:Blockly.ParameterText,
    image:Blockly.ParameterImage,
    label:Blockly.ParameterLabel,
    color:Blockly.ParameterColor
  };
  return parameterDictionary[type]
}

Blockly.Parameter.Types = {
  VALUE: 1,
  STATEMENT: 2,
  DROPDOWN: 3,
  LABEL: 4,
  ENTITY: 5,
  ENTITY_FIELD: 6,
  STRING: 7,
  IMAGE: 8,
  COLOR: 9
}

/**
 * Class for a value input parameter.
 *
 * @extends {Blockly.Parameter}
 * @constructor
 */
Blockly.ParameterValue = function(name, check, alignment) {
  this.type = Blockly.Parameter.Types.VALUE;
  this.check = check;
  this.alignment = alignment;
  this.isField = false;
  this.isInput = true;
  Blockly.ParameterValue.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterValue, Blockly.Parameter);

Blockly.ParameterValue.prototype.addInputToBlock = function(block,nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  return block.appendValueInput(name)
    .setCheck(this.check)
    .setAlign(this.alignment);
}
Blockly.ParameterValue.prototype.getTextFromBlock = function(block) {
  return block.getInputTargetBlock(this.name).getBlockText();
}

Blockly.ParameterValue.prototype.getTextFromBlock = function(block, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  var targetBlock = block.getInputTargetBlock(name);
  if(targetBlock) {
    return targetBlock.getBlockText();
  }
  return "";
}

Blockly.ParameterValue.getParameterFromParamInfoObject = function(parameterInfoObject){
  var name = parameterInfoObject.name;
  var check = parameterInfoObject.check;
  var alignment = parameterInfoObject.alignment;
  return new Blockly.ParameterValue(name,check,alignment);
}

/**
 * Class for a statement input parameter.
 *
 * @extends {Blockly.Parameter}
 * @constructor
 */
Blockly.ParameterStatement = function(name) {
  this.type = Blockly.Parameter.Types.STATEMENT;
  this.isField = false;
  this.isInput = true;
  Blockly.ParameterStatement.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterStatement, Blockly.Parameter);

Blockly.ParameterStatement.prototype.addInputToBlock = function(block, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  return block.appendStatementInput(name);
}

Blockly.ParameterStatement.prototype.getTextFromBlock = function(block, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  var targetBlock = block.getInputTargetBlock(name);
  if(targetBlock) {
    return targetBlock.getBlockText();
  }
  return "";
}

Blockly.ParameterStatement.getParameterFromParamInfoObject = function(parameterInfoObject){
  var name = parameterInfoObject.name;
  return new Blockly.ParameterStatement(name);
}

//menu generators need to work on certain assumptions...
//including value of previous fields, and/or mutators

/**
 * Class for an parameter.
 *
 * @extends {Blockly.Parameter}
 * @constructor
 */
Blockly.ParameterDropdown = function(name, menuGenerator, changeHandler) {
  this.type = Blockly.Parameter.Types.DROPDOWN;
  this.menuGenerator_ = menuGenerator;
  this.changeHandler_ = changeHandler;
  this.isField = true;
  this.isInput = false;
  Blockly.ParameterDropdown.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterDropdown, Blockly.Parameter);

Blockly.ParameterDropdown.prototype.addFieldToInput = function(input, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  var field = new Blockly.FieldDropdown(this.menuGenerator_,this.changeHandler_);
  field.setBlock(input.sourceBlock_);
  input.appendField(field,name);
}

Blockly.ParameterDropdown.prototype.getTextFromBlock = function(block, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  return block.getField_(name).getText();
}

Blockly.ParameterDropdown.getParameterFromParamInfoObject = function(parameterInfoObject){
  var name = parameterInfoObject.name;
  var menuGenerator = parameterInfoObject.menuGenerator_;
  return new Blockly.ParameterDropdown(name, menuGenerator);
}

/**
 * Class for an parameter.
 *
 * @extends {Blockly.Parameter}
 * @constructor
 */
Blockly.ParameterLabel = function(name, textOrTextFxn) {
  this.type = Blockly.Parameter.Types.LABEL;
  this.textOrTextFxn = textOrTextFxn;//takes in block and name suffix, returns function that returns text
  this.isField = true;
  this.isInput = false;
  Blockly.ParameterLabel.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterLabel, Blockly.Parameter);

Blockly.ParameterLabel.prototype.addFieldToInput = function(input, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  var text = this.textOrTextFxn;
  if(typeof this.textOrTextFxn == "function") {
    text = this.textOrTextFxn(input.sourceBlock_, nameSuffix);
  }
  if(name != null) {
    input.appendField(new Blockly.FieldLabel(text), name);
  } else {
    input.appendField(new Blockly.FieldLabel(text));
  }
}

Blockly.ParameterLabel.getParameterFromParamInfoObject = function(parameterInfoObject){
  var name = parameterInfoObject.name;
  var text = parameterInfoObject.textOrTextFxn;
  return new Blockly.ParameterLabel(name, text);
}

/**
 * Class for an parameter.
 *
 * @extends {Blockly.Parameter}
 * @constructor
 */
Blockly.ParameterEntity = function(name, dropDownInfo, changeHandler, hasTypeDropDownFields, listDepth) {
  this.type = Blockly.Parameter.Types.ENTITY;
  this.dropDownInfo = dropDownInfo;
  this.changeHandler = changeHandler;
  this.hasTypeDropDownFields = hasTypeDropDownFields;
  this.listDepth = listDepth;
  if (this.listDepth == null){
    this.listDepth = 0;
  }
  this.isMessage = true;
  this.isField = false;
  this.isInput = false;

  Blockly.ParameterEntity.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterEntity, Blockly.Parameter);

Blockly.ParameterEntity.prototype.getBlockMsg = function(nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  var lowerCaseName = name.toLowerCase();
  var rg = /(.*)_list_depth\d+$/;
  if (lowerCaseName.match(rg) != null){
    lowerCaseName = lowerCaseName.match(rg)[1];
  }

  var blockMsgs = [];
  //<value socket>
  var typeInputMsg = "%2";
  if(this.hasTypeDropDownFields) {
    //Sprite Class 1 : <value socket>
    typeInputMsg = "%1 : %2";
  }
  var typeInputMutatorValueObject = {value:typeInputMsg, mutators: {}};
  typeInputMutatorValueObject["mutators"][lowerCaseName + "_block_input"] = "true";
  blockMsgs.push(typeInputMutatorValueObject);

  //player's sprite1
  var playerMutatorValueObject = {value:"%3 's %4", mutators: {}};
  playerMutatorValueObject["mutators"][lowerCaseName + "_entity_player"] = "true";
  blockMsgs.push(playerMutatorValueObject);

  //nested list(list of dropdown)
  var nestedListMutatorValueObject = {value:"%5 of %6", mutators: {}};
  nestedListMutatorValueObject["mutators"][lowerCaseName + "_list_depth"] = bd.validator.ctr.getPropertyValidatorFunction(bd.validator.ctr.matchesNumberComparison,">",this.listDepth)
  blockMsgs.push(nestedListMutatorValueObject);

  //sprite 1
  blockMsgs.push({value:"%4",mutators:{}});

  return blockMsgs;
}

Blockly.ParameterEntity.prototype.getParameters = function(nameSuffix) {
  var name_suffixed = this.getNameWithSuffix(nameSuffix);
  var params = [];
  var rg = /(.*)_LIST_DEPTH\d+$/;
  var newname = this.name;
  if (this.name.match(rg) != null){
    newname = this.name.match(rg)[1];
  }
  newname = newname + nameSuffix;

  params.push(new Blockly.ParameterEntityField(this.name + "_TYPE"));
  params.push(new Blockly.ParameterValue(this.name + "_SOCKET", [bd.blocks.ctr.blockInputCxnCheck], Blockly.ALIGN_RIGHT));
  params.push(new Blockly.ParameterEntity(this.name + "_PLAYER")); //should include player dropdown info
  params.push(new Blockly.ParameterEntityField(name_suffixed, this.changeHandler, this.dropDownInfo)); //recursive problem, ignore param mutators?
  params.push(new Blockly.ParameterEntity(newname + "_LIST_DEPTH" + this.listDepth, this.dropDownInfo, null, false, this.listDepth + 1));
  params.push(new Blockly.ParameterEntityField(name_suffixed, this.changeHandler, this.dropDownInfo));
  return params;
}

Blockly.ParameterEntity.getParameterFromParamInfoObject = function(parameterInfoObject){
  var name = parameterInfoObject.name;
  var dropDownInfo = parameterInfoObject.dropDownInfo;
  var hasTypeDropDownFields = parameterInfoObject.hasTypeDropDownFields;
  var listDepth = parameterInfoObject.listDepth;
  return new Blockly.ParameterEntity(name, dropDownInfo,null,hasTypeDropDownFields,listDepth);
}

/**
 * Class for an parameter.
 *
 * @extends {Blockly.Parameter}
 * @constructor
 */
Blockly.ParameterEntityField = function(name, changeHandler, dropDownInfo) {
  this.type = Blockly.Parameter.Types.ENTITY_FIELD;
  this.dropDownInfo = dropDownInfo;
  this.changeHandler = changeHandler;
  this.isField = true;
  this.isInput = false; //needs isInput function, addInput should take in params array to add more fields

  Blockly.ParameterEntityField.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterEntityField, Blockly.Parameter);


Blockly.ParameterEntityField.prototype.getDropDownInfo = function(block) {
  var dropDownInfo;
  //if name ends in player, set to player dropdown info
  if(bd.util.stringHasSuffix(this.name,"_PLAYER")) {;
    dropDownInfo = {
      dropDownEntities:[
        { name:"player",
          selections:["entityList","all"]}
      ],
      switchInput:"toBlock"
    }
  }

  //if name ends in playertype, set to player type
  if(bd.util.stringHasSuffix(this.name,"_PLAYER_TYPE")) {;
    dropDownInfo = {
      dropDownEntities:[
        {name:"types",onlyEntities:true}
      ],
      switchInput:"toDropDown"
    }
  }

  //if name in block, use drop down info from block
  if(block.entityDropDownInfo[this.name]) {
    dropDownInfo = block.entityDropDownInfo[this.name];
  }
  //if dropdown info exist on parameter, use that, unless block says to override
  if (this.dropDownInfo != null){
    dropDownInfo = this.dropDownInfo;
  }
  var rg = /(.*)_LIST_DEPTH\d+$/;
  if (this.name.match(rg) != null){
    while (this.name.match(rg) != null){
      this.name = this.name.match(rg)[1]
    }
    if (block.entityDropDownInfo[this.name]){
      dropDownInfo = block.entityDropDownInfo[this.name];
    }
  }
  return dropDownInfo;
}

Blockly.ParameterEntityField.prototype.addFieldToInput = function(input, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  var block = input.sourceBlock_;

  var dropDownInfo = this.getDropDownInfo(block);
  var varDropDown = bd.blocks.ctr.createEntityDropDown(block,dropDownInfo.dropDownEntities,dropDownInfo.switchInput,this.name);
  varDropDown.changeHandler_ = this.changeHandler;
  input.appendField(varDropDown,name);

}

Blockly.ParameterEntityField.prototype.getTextFromBlock = function(block, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  return block.getField_(name).getText();
}

/**
 * Class for an parameter mutator.
 *
 * @extends {Blockly.Parameter}
 * @constructor
 */
Blockly.ParameterMutator = function(name, incrementName, getRepetitionFxn, nameSuffixIncrement) {
  this.incrementName = incrementName;
  this.getRepetitionFxn = getRepetitionFxn;
  this.nameSuffixIncrement = nameSuffixIncrement;
  Blockly.ParameterMutator.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterMutator, Blockly.Parameter);

Blockly.ParameterMutator.prototype.getNumberOfRepetitions = function(block) {
  if(this.getRepetitionFxn) {
    return this.getRepetitionFxn(block);
  }
  var mutatorNameToInfoObject = block.getMutatorNameToInfoObject();
  var mutatorInfoObject = mutatorNameToInfoObject[this.name];
  if(mutatorInfoObject) {
    if(mutatorInfoObject.getRepeatNumFxn) {
      return mutatorInfoObject.getRepeatNumFxn.call(block);
    } else {
      return block.mutators[mutatorInfoObject.blockVariableName]
    }
  }
  return 0;
}

Blockly.ParameterImage = function(name, src, width, height, opt_alt, showEditorFxn) {
  this.type = Blockly.Parameter.Types.IMAGE;
  this.src = src;
  this.width = width;
  this.height = height;
  this.opt_alt = opt_alt;
  this.showEditorFxn = showEditorFxn;

  this.isField = true;
  this.isInput = false;

  Blockly.ParameterImage.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterImage, Blockly.Parameter);

Blockly.ParameterImage.prototype.addFieldToInput = function(input, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);

  if(name != null) {
    input.appendField(new Blockly.FieldImage(this.src, this.width, this.height, this.opt_alt, this.showEditorFxn), name);
  } else {
    input.appendField(new Blockly.FieldImage(this.src, this.width, this.height, this.opt_alt, this.showEditorFxn));
  }
}

Blockly.ParameterImage.getParameterFromParamInfoObject = function(parameterInfoObject){
  var name = parameterInfoObject.name;
  var src = parameterInfoObject.src;
  var width = parameterInfoObject.width;
  var height = parameterInfoObject.height;
  var opt_alt = parameterInfoObject.opt_alt;
  var showEditorFxn = parameterInfoObject.showEditorFxn;
  return new Blockly.ParameterImage(name, src, width, height, opt_alt, showEditorFxn);
}

//mock block
//needs context variables and type (i is a sprite in for loop_
//values of previous fields and mutators
//can go to xml

//context (names & types)
//value, field (name & types & value)
Blockly.MockBlock = function(context,values) {
}


/**
 * Class for a string parameter.
 *
 * @extends {Blockly.Parameter}
 * @constructor
 */
Blockly.ParameterText = function(name, value, changeHandler) {
  this.type = Blockly.Parameter.Types.STRING;
  this.value = value;
  this.isField = true;
  this.changeHandler_ = changeHandler;
  this.isInput = false;
  Blockly.ParameterText.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterText, Blockly.Parameter);

Blockly.ParameterText.prototype.addFieldToInput = function(input, nameSuffix) {
  var name = this.getNameWithSuffix(nameSuffix);
  input.appendField(new Blockly.FieldTextInput(this.value,this.changeHandler_),name);
}

Blockly.ParameterText.prototype.getTextFromBlock = function(block) {
  return block.getField_(this.name).getText();
}

Blockly.ParameterText.getParameterFromParamInfoObject = function(parameterInfoObject){
  var name = parameterInfoObject.name;
  var value = parameterInfoObject.value;
  return new Blockly.ParameterText(name, value);
}

/**
 * Class for a string parameter.
 *
 * @extends {Blockly.Parameter}
 * @constructor
 */
Blockly.ParameterColor = function(name, color, changeHandler) {
  this.type = Blockly.Parameter.Types.COLOR;
  this.color = color;
  this.changeHandler = changeHandler;
  this.isField = true;
  this.isInput = false;
  Blockly.ParameterColor.superClass_.constructor.call(this, name);
}
goog.inherits(Blockly.ParameterColor, Blockly.Parameter);

Blockly.ParameterColor.prototype.addFieldToInput = function(input) {
  input.appendField(new Blockly.FieldColourOverlay(this.color,this.changeHandler),this.name);
}

Blockly.ParameterColor.getParameterFromParamInfoObject = function(parameterInfoObject){
  var name = parameterInfoObject.name;
  var color = parameterInfoObject.color;
  return new Blockly.ParameterColor(name, color);
}