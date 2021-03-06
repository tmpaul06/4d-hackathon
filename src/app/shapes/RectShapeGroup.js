import ShapeGroup from "../ShapeGroup";
import DataStore from "../DataStore";
import { extend } from "../utils/ObjectUtils";

export default class RectShapeGroup extends ShapeGroup {
  constructor(props) {
    super(props);
    this.attributes = {
      x: Math.floor(DataStore.get([ "global", "WIDTH" ]) / 2) - 200,
      y: Math.floor(DataStore.get([ "global", "HEIGHT" ]) / 2),
      width: 20,
      height: 100,
      rotate: 0,
      fillStyle: "#000",
      strokeStyle: "#000",
      alpha: 1
    };
    this.attributes = extend(this.attributes, props);
    this.transforms = [ {
      type: "rotate",
      value: (self) => {
        return self.attributes.rotate;
      }
    } ];
  }

  getRangeFor(attrName) {
    switch(attrName) {
      case "width":
      case "height":
        return [ 0, Infinity ];
      case "rotate":
        return [ -Math.PI, Math.PI ];
      default:
        return [ 0, Infinity ];
    }
  }

  renderToCanvas(ctx, timeElapsed, props) {
    let attrs = extend(this.attributes, props);
    // For a rectangle, get the x and y positions, and width and height
    Object.keys(attrs).forEach((attrName) => {
      let attr = attrs[attrName];
      if (typeof attr === "function") {
        attrs[attrName] = attr(timeElapsed, DataStore.get);
      }
    });
    ctx.save();
    ctx.translate(attrs.x,
          attrs.y);
    // If there are any transforms defined, use the transforms
    this.transforms.forEach((transform) => {
      // If translate, translate the midpoint.
      if (transform.type === "translate") {
        let x, y;
        if (typeof transform.value === "function") {
          let result = transform.value(timeElapsed, DataStore.get);
          x = result.x, y = result.y;
        } else {
          x = transform.value[0], y = transform.value[1];
        }
      } else if (transform.type === "rotate") {
        let angle;
        if (typeof transform.value === "function") {
          angle = transform.value(this, timeElapsed, DataStore.get);
        }
        ctx.rotate(angle);
      }
    });
    ctx.fillStyle = attrs.fillStyle;
    ctx.strokeStyle = attrs.strokeStyle;
    ctx.fillRect(-attrs.width / 2, -attrs.height / 2, attrs.width, attrs.height);
    ctx.restore();
  }
}