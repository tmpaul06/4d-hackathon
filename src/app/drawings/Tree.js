import DataStore from "../DataStore";
import { extend } from "../utils/ObjectUtils";

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
    leftBranchAngle(props) {
      let diff = props.initialAngle - 90;
      if (diff > 0) {
        return 30 + Math.min(diff, 10);
      }
      return 30;
    },
    rightBranchAngle(props) {
      let diff = props.initialAngle - 90;
      if (diff < 0) {
        return 30 - Math.max(diff, -10);
      }
      return 30;
    },
    branchFill: "#212121",
    lineWidth: 10,
    leafFill: "orange",
    leafOpacity: 1
  };

  constructor(props) {
    this.id = 1;
    this.props = extend(Tree.props, props);
    this.name  = "Tree";
    this.step = 0;
  }

  getRange(key) {
    switch(key) {
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

  getAttrs() {
    return Object.keys(this.props).map((key) => {
      return {
        name: key,
        range: this.getRange(key),
        type: this.getType(key),
        value: typeof this.props[key] === "function" ? this.props[key](this.props) : this.props[key]
      };
    });
  }

  drawLine(ctx, depth, x1, y1, x2, y2, props) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = props.branchFill;
    ctx.lineWidth = depth * 2;
    ctx.stroke();
  }

  drawTree(ctx, props, x1, y1, angle, height, step, depth) {
    if (depth  > 0) {
      angle += 3 * Math.cos(step) - 2;
      let x2 = x1 + height * Math.cos(angle * Math.PI / 180);
      let y2 = y1 - height * Math.sin(angle * Math.PI / 180);
      this.drawLine(ctx, depth, x1, y1, x2, y2, props);

      height = props.heightFraction * height;
      this.drawTree(ctx, props, x2, y2, angle - 3 * Math.sin(step),
        height, step, depth - 1);
      this.drawTree(ctx, props, x2, y2, angle + props.leftBranchAngle,
        height * props.heightFraction, step, depth - 1);
      this.drawTree(ctx, props, x2, y2, angle - props.rightBranchAngle,
        height * props.heightFraction, step, depth - 1);
    } else {
      ctx.strokeStyle = props.leafFill;
      ctx.globalAlpha = props.leafOpacity;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + random(-2, 0), y1 + random(-2, 0));
      ctx.lineTo(x1 + random(-4, 0), y1 + random(0, 2));
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  renderToCanvas(ctx, timeElapsed) {
    let newProps = extend(Tree.props, this.props);
    // Iterate and fetch any DataStore variables that are to be resolved
    Object.keys(newProps).forEach(function(key) {
      let value = newProps[key];
      if (typeof value === "function") {
        // Execute it
        value = value(newProps, DataStore.get);
      }
      newProps[key] = value;
    });
    this.step = (timeElapsed / 16) * ((Math.PI / 80) % Math.PI);
    this.drawTree(ctx, newProps, newProps.x, newProps.y, newProps.initialAngle, 
      newProps.height / 4, this.step, newProps.maxDepth);
  }
}

export default Tree;