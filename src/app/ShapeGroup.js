import DataStore from "./DataStore";

export default class ShapeGroup {

  constructor() {
    this.attributes = {};
    this.transforms = [];
  }

  defineAttrs() {
    // Define all the attributes that can be attributed to this shape.
    // e.g x, y, r or width, height. Each attribute must be associated
    // with a default value.
  }

  getRangeFor(attrName) {

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
        value: this.attributes[attrName],
        decimalAllowed: attrName === "rotate" ? true : false,
        range: this.getRangeFor(attrName) || [ 0, 100 ]
      };
    });
  }

  setVariableBinding(attribute, path) {
  }

  clone() {
    let newObj = new this.constructor();
    newObj.attributes = Object.assign({}, this.attributes);
    newObj.transforms = this.transforms.map(function(t) {
      return Object.assign({}, t);
    });
    return newObj;
  }
}