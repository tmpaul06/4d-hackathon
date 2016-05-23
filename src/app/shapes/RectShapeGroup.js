import ShapeGroup from "../ShapeGroup";
import DataStore from "../DataStore";

export default class RectShapeGroup extends ShapeGroup {
  constructor() {
    super();
    this.attributes = {
      x: Math.floor(DataStore.get([ "global", "WIDTH" ]) / 2) - 200,
      y: Math.floor(DataStore.get([ "global", "HEIGHT" ]) / 2),
      width: 20,
      height: 20,
      rotate: 0,
      fillStyle: "#000",
      strokeStyle: "#000",
      alpha: 1
    };
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

  renderToCanvas(ctx, timeElapsed) {
    // For a rectangle, get the x and y positions, and width and height
    Object.keys(this.attributes).forEach((attrName) => {
      let attr = this.attributes[attrName];
      if (typeof attr === "function") {
        this.attr[attrName] = attr(timeElapsed, DataStore.get);
      }
    });
    ctx.save();
    ctx.translate(this.attributes.x + this.attributes.width / 2,
          this.attributes.y + this.attributes.height / 2);
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
        ctx.translate(x, y);
      } else if (transform.type === "rotate") {
        let angle;
        if (typeof transform.value === "function") {
          angle = transform.value(this, timeElapsed, DataStore.get);
        }
        ctx.rotate(angle);
      }
    });
    ctx.fillStyle = this.attributes.fillStyle;
    ctx.strokeStyle = this.attributes.strokeStyle;
    ctx.fillRect(-this.attributes.width / 2, -this.attributes.height / 2, this.attributes.width, this.attributes.height);
    ctx.restore();
  }
}