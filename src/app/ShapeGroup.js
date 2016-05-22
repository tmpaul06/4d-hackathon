import DataStore from "./DataStore";

export default class ShapeGroup {

  constructor() {
    this.attributes = {};
  }

  defineAttrs() {
    // Define all the attributes that can be attributed to this shape.
    // e.g x, y, r or width, height. Each attribute must be associated
    // with a default value.
  }
  getAttrs() {
    // Return a list of attribute and value pairs.
    // An attribute can have either a static property
    // or a variable binding. The variable bindings are
    // made available through a series of paths
    // e.g layer1.stack1.groups.i.x or
    // layer1.stack1.groups.length etc
    return Object.keys(this.attributes).map((attrName) => {
      return {
        name: attrName,
        value: this.attributes[attrName] 
      };
    });
  }

  setVariableBinding(attribute, path) {
    this.attributes[attribute] = function() {
      return DataStore.get(path);
    };
  }
}