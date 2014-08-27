var inherit = require('scripts/inherit');
var Tool    = require('scripts/tool');

var CLONE_OFFSET = 15;

/**
 * Single use tool that clones the currently selected object(s).
 */
function CloneTool(name, drawingTool) {
  Tool.call(this, name, drawingTool);
  this.singleUse = true;
}

inherit(CloneTool, Tool);

/**
 * Clones the currently selected object(s) from the fabricjs canvas.
 */
CloneTool.prototype.use = function () {
  var activeObject = this.canvas.getActiveGroup() || this.canvas.getActiveObject();
  if (!activeObject) {
    return;
  }
  // We don't want to copy control point, but the source object instead.
  // See: line-custom-control-points.js
  if (activeObject._dt_sourceObj) {
    activeObject = activeObject._dt_sourceObj;
  }
  var klass = fabric.util.getKlass(activeObject.type);
  if (klass.async) {
    activeObject.clone(this._processClonedObject.bind(this));
  } else {
    this._processClonedObject(activeObject.clone());
  }
};

CloneTool.prototype._processClonedObject = function (clonedObject) {
  clonedObject.set({
    left: clonedObject.left + CLONE_OFFSET,
    top: clonedObject.top + CLONE_OFFSET
  });
  this.canvas.add(clonedObject);
  this.canvas.deactivateAllWithDispatch();
  if (clonedObject.type === 'group') {
    this.canvas.setActiveGroup(clonedObject);
  } else {
    this.canvas.setActiveObject(clonedObject);
  }
  this.canvas.renderAll();
};

module.exports = CloneTool;