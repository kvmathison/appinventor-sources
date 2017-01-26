goog.provide('bd.toolbox.ctr');

bd.toolbox.ctr.blockInfoToBlockObject = function(blockInfo) {
  var inputNameToInputTypeAndBlock = {};
  if(blockInfo.input) {
    for(var inputName in blockInfo.input) {
      var innerBlockInfo = blockInfo.input[inputName].blockInfo;

      var innerBlockObject = bd.toolbox.ctr.blockInfoToBlockObject(innerBlockInfo);
      inputNameToInputTypeAndBlock[inputName] = {};
      inputNameToInputTypeAndBlock[inputName].inputType = blockInfo.input[inputName].inputType;
      inputNameToInputTypeAndBlock[inputName].blockObject = innerBlockObject;
    }
  }
  if(blockInfo.next) {
      var nextBlockObject = bd.toolbox.ctr.blockInfoToBlockObject(blockInfo.next);
  }
  if (blockInfo.x && blockInfo.y) {
    var coordinateX = blockInfo.x;
    var coordinateY = blockInfo.y;
  }
  var blockObject = new bd.toolbox.ctr.blockObject(blockInfo.type,blockInfo.fieldNameToValue,inputNameToInputTypeAndBlock,blockInfo.mutatorNameToValue,nextBlockObject,coordinateX,coordinateY);
  return blockObject;
}

bd.toolbox.ctr.blockObject = function(type,fieldNameToValue,inputNameToInputTypeAndBlock,mutatorNameToValue,next,x,y) {
  this.type = type;
  this.inputNameToInputTypeAndBlock = (typeof inputNameToInputTypeAndBlock == "undefined" ? null : inputNameToInputTypeAndBlock);
  this.fieldNameToValue = (typeof fieldNameToValue == "undefined" ? null : fieldNameToValue);
  this.mutatorNameToValue = (typeof mutatorNameToValue == "undefined" ? null : mutatorNameToValue);
  this.next = (typeof next == "undefined" ? null : next);
  this.x = (typeof x == "undefined" ? null : x);
  this.y = (typeof y == "undefined" ? null : y);
}

bd.toolbox.ctr.blockObjectToXML = function(block,withXMLTag) {
  var element = goog.dom.createDom('block');
  element.setAttribute('type', block.type);

  if(block.mutatorNameToValue != null) {
    var container = document.createElement('mutation');
    for(mutatorName in block.mutatorNameToValue) {
      container.setAttribute(mutatorName, block.mutatorNameToValue[mutatorName]);
    }
    element.appendChild(container);
  }

  if(block.fieldNameToValue != null) {
    for(var fieldName in block.fieldNameToValue) {
      var container = goog.dom.createDom('field', null, block.fieldNameToValue[fieldName]);
      container.setAttribute('name', fieldName);
      element.appendChild(container);
    }
  }
  if(block.inputNameToInputTypeAndBlock != null) {
    for(var inputName in block.inputNameToInputTypeAndBlock) {
      var inputTypeNameAndBlock = block.inputNameToInputTypeAndBlock[inputName];
      var container = document.createElement(inputTypeNameAndBlock.inputType);
      container.appendChild(bd.toolbox.ctr.blockObjectToXML(inputTypeNameAndBlock.blockObject));
      container.setAttribute('name', inputName);
      element.appendChild(container);
    }
  }
  if(block.next != null){
    var container = document.createElement('next');
    container.appendChild(bd.toolbox.ctr.blockObjectToXML(block.next));
    element.appendChild(container);
  }
  if (block.x != null && block.y != null) {
    element.setAttribute('x', block.x);
    element.setAttribute('y', block.y);
  }

  if(typeof withXMLTag != "undefined" && withXMLTag) {
    var xmlWrap = goog.dom.createDom('xml');
    xmlWrap.setAttribute('id', 'toolbox');
    xmlWrap.appendChild(element);
    return xmlWrap;
  }
  return element;
}