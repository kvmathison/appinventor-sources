goog.provide('bd.msg')

bd.msg.contextVariables = {};
bd.msg.contextVariablesToVariableNames = {};

//event parameters
// most of these not used in app inventor
bd.msg.contextVariables.VARIABLE_CLICKED_OBJECT = "clicked object";
bd.msg.contextVariables.VARIABLE_CLICKED_OBJECT_JS = "clickedObject";
bd.msg.contextVariables.VARIABLE_CREATED_OBJECT = "created object";
bd.msg.contextVariables.VARIABLE_PLAYER = "player";
bd.msg.contextVariables.VARIABLE_DROPPED_OBJECT = "dropped object";
bd.msg.contextVariables.VARIABLE_DROPPED_OBJECT_JS = "droppedObject";
bd.msg.contextVariables.VARIABLE_REMOVED_OBJECT = "removed object";
bd.msg.contextVariables.VARIABLE_START_X = "startX";
bd.msg.contextVariables.VARIABLE_START_Y = "startY";
bd.msg.contextVariables.KEY_PRESSED = "key pressed";
bd.msg.contextVariables.KEY_PRESSED_CODE = "key code of pressed key";
bd.msg.contextVariables.VARIABLE_COLLIDEE = "collidee";
bd.msg.contextVariables.VARIABLE_COLLIDEE_1 = "collidee 1";
bd.msg.contextVariables.VARIABLE_COLLIDEE_2 = "collidee 2";
bd.msg.contextVariables.VARIABLE_WATCHED_VIDEO = "watched video";
bd.msg.contextVariables.VARIABLE_PREVIOUS_COLUMN = "previous column";
bd.msg.contextVariables.VARIABLE_PREVIOUS_ROW = "previous row";
bd.msg.contextVariables.VARIABLE_TARGET_COLUMN = "target column";
bd.msg.contextVariables.VARIABLE_TARGET_ROW = "target row";
bd.msg.contextVariables.VARIABLE_TARGET_X = "target x";
bd.msg.contextVariables.VARIABLE_TARGET_Y = "target y";
bd.msg.contextVariables.VARIABLE_PLACED_GRID = "placed grid";
bd.msg.contextVariables.VARIABLE_REMOVED_GRID = "removed grid";
bd.msg.contextVariables.VARIABLE_POINTER = "pointer";
bd.msg.contextVariables.VARIABLE_TRIGGERED_TIMER = "triggered timer";
bd.msg.contextVariables.VARIABLE_PREVIOUS_VALUE = "changed variable's old value";

for (var key in bd.msg.contextVariables) {
	bd.msg[key] = bd.msg.contextVariables[key];
}

for (var key in bd.msg.contextVariables) {
	bd.msg.contextVariablesToVariableNames[bd.msg.contextVariables[key]] = key;
}