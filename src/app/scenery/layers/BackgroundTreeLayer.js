import Tree from "drawings/Tree";
import { randomInt, random } from "FuncRegistry";

function drawTree(context, x1, y1, angle, depth) {
  if (depth != 0) {
    let BRANCH_LENGTH;
    if (depth < 4) {
      BRANCH_LENGTH = 80 / (1 + depth * 4);
    } else {
      BRANCH_LENGTH = 80 / (1 + depth * 1.25);
    }
    let x2 = x1 + (cos(angle) * depth * BRANCH_LENGTH);
    let y2 = y1 + (sin(angle) * depth * BRANCH_LENGTH);
    
    drawLine(context, x1, y1, x2, y2, depth);
    drawTree(context, x2, y2, angle - 10 - depth, depth - 1);
    drawTree(context, x2, y2, angle + 12 + depth, depth - 1);
  }
  if (depth < 2) {
    // let img = document.getElementById("leaf-image");
    // context.save();
    // context.translate(x1, y1);
    // context.rotate(angle);
    // context.drawImage(img, x1, y1, 10, 10);
    // context.restore();
    // Draw leaves
    context.beginPath();
    context.moveTo(x1, y1);
    context.strokeStyle = "#8cc63f";
    context.lineWidth = 5;
    context.lineTo(x1 + 4 * cos(angle), y1 + 4 * sin(angle));
    context.quadraticCurveTo(x1, y1, x1 - 4 * cos(angle), y1 + 4 * sin(angle));
    context.quadraticCurveTo(x1, y1, x1 - 4 * cos(angle), y1 - 4 * sin(angle));
    context.lineTo(x1, y1);
    context.stroke();
  }
}

function drawLine(context, x1, y1, x2, y2, thickness) {
  context.lineWidth = thickness * 1.5;
  context.strokeStyle = "#2d3621";
  context.beginPath();
  context.moveTo(x1,y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.stroke();
}

function cos(angle) {
  return Math.cos(deg_to_rad(angle));
}

function sin(angle) {
  return Math.sin(deg_to_rad(angle));
}

function deg_to_rad(angle) {
  return angle * (Math.PI / 180.0);
}

export default class BackgroundTreeLayer {
  constructor(id) {
    this.id = id;
    this.visible = true;
    this.shapes = [];
  }

  createTrees(ctx) {
    ctx.strokeStyle = "#2B2B2B";
    drawTree(ctx, -50, 600, -85, 14);
    drawTree(ctx, 1200, 600, -90, 13);
  }

  render(ctx, t) {
    if (this.visible) {
      this.createTrees(ctx);
    }
  }
};