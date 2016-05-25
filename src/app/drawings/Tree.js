import DataStore from "../DataStore";
import { extend } from "../utils/ObjectUtils";
import FuncRegistry from "../FuncRegistry";

/*
    Adapted from
    ------------
    Algorithmic Tree - 1.0.0
    drawing trees algorithmically on the HTML5 canvas

    License       : GPL
    Developer     : Sameer Borate: http://codediesel.com
    Web Site      : http://codediesel.com

 */

function random(a, b) {
  return Math.random() * (b - a) + a;
}


class Tree {

  static props = {
    x: 232,
    y: 400,
    width: 600,
    height: 400,
    initialAngle: 90,
    heightFraction: 0.66,
    maxDepth: 6,
    leftBranchAngle: 30,
    rightBranchAngle: 30,
    branchFill: "#212121",
    lineWidth: 10,
    leafFill: "#FFA500",
    leafDisplacement: 2,
    leafOpacity: 1
  };

  constructor(id) {
    this.id = id;
    this.props = Tree.props;
    this.name  = "Tree";
  }

  getRange(key) {
    switch(key) {
      case "lineWidth":
        return [ 10, 30, 5 ];
      case "leafFill":
        return [ 0, 360, 5 ];
      case "leafDisplacement":
        return [ 1, 5, 1 ];
      case "leafOpacity":
        return [ 0, 1, 0.1 ];
      case "maxDepth":
        return [ 0, 12, 1 ];
      case "initialAngle":
      case "leftBranchAngle":
      case "rightBranchAngle":
        return [ 0, 360 ];
      case "xScale":
      case "yScale":
        return [ 0, 1, 0.01 ];
      case "heightFraction":
        return [ 0, 0.8, 0.02 ];
      default:
        return [ 0, 1000, 20 ];
    }
  }

  getType(key) {
    switch(key) {
      case "leafFill":
      case "branchFill":
        return "color";
      default:
        return;
    }
  }

  getFunctionProps(value) {
    let boundVarMap = {};
    let boundVars = this.boundVars || [];
    boundVars.forEach(function(v) {
      boundVarMap[v.name] = v.value;
    });
    let timeElapsed = DataStore.get("T");
    return value(boundVarMap, timeElapsed, FuncRegistry);
  }

  getAttrs() {
    return Object.keys(this.props).map((key) => {
      return {
        name: key,
        range: this.getRange(key),
        type: this.getType(key),
        value: typeof this.props[key] === "function" ?
           this.getFunctionProps(this.props[key]) : this.props[key]
      };
    });
  }

  drawLine(ctx, depth, x1, y1, x2, y2, props) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = props.branchFill;
    ctx.lineWidth = props.lineWidth * depth / 10;
    ctx.stroke();
  }

  drawTree(ctx, props, x1, y1, angle, height, step, depth) {
    if (depth  > 0) {
      angle += 3 * Math.cos(step) - 2;
      let x2 = x1 + height * Math.cos(angle * Math.PI / 180);
      let y2 = y1 - height * Math.sin(angle * Math.PI / 180);
      this.drawLine(ctx, depth, x1, y1, x2, y2, props);

      height = props.heightFraction * height;
      let leftAngle = props.leftBranchAngle;
      let rightAngle = props.rightBranchAngle;
      if (props.initialAngle < 90) {
        rightAngle += Math.min((90 - props.initialAngle), 10);
      }
      if (props.initialAngle > 90) {
        leftAngle += Math.min((props.initialAngle - 90), 10);
      }
      this.drawTree(ctx, props, x2, y2, angle - 3 * Math.sin(step),
        height, step, depth - 1);
      this.drawTree(ctx, props, x2, y2, angle + leftAngle,
        height * props.heightFraction, step, depth - 1);
      this.drawTree(ctx, props, x2, y2, angle - rightAngle,
        height * props.heightFraction, step, depth - 1);
    } else {
      ctx.strokeStyle = props.leafFill;
      ctx.globalAlpha = props.leafOpacity;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      let delta = props.leafDisplacement;
      ctx.lineTo(x1 + random(-delta, 0), y1 + random(-delta, 0));
      ctx.lineTo(x1 + random(-2 * delta, 0), y1 + random(0, delta));
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  renderToCanvas(ctx) {
    let newProps = extend({}, this.props);
    let timeElapsed = DataStore.get("T");
    // Iterate and fetch any DataStore variables that are to be resolved
    Object.keys(newProps).forEach((key) => {
      let value = newProps[key];
      if (typeof value === "function") {
        // Execute it
        value = this.getFunctionProps(value);
      }
      newProps[key] = value;
    });
    let step = (timeElapsed / 16) * ((Math.PI / 80) % Math.PI);
    this.drawTree(ctx, newProps, newProps.x, newProps.y, newProps.initialAngle, 
      newProps.height / 4, step, newProps.maxDepth);
  }

  clone(id) {
    // Create a copy of this tree, with new id, and a copy of its properties
    // with bindings.
    let clone = new Tree(this.id + "-" + id);
    clone.props = extend({}, this.props);
    return clone;
  }
}

export default Tree;