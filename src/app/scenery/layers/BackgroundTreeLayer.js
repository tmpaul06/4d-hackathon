import Tree from "drawings/Tree";
import { randomInt, random } from "FuncRegistry";

function drawBranches(context, startX, startY, trunkWidth, level) {
        if(level < 8) {
          var changeX = 100 / (level + 1);
          var changeY = 300 / (level + 1);

          var topRightX = startX + Math.random() * changeX;
          var topRightY = startY - Math.random() * changeY;

          var topLeftX = startX - Math.random() * changeX;
          var topLeftY = startY - Math.random() * changeY;

          // draw right branch
          context.beginPath();
          context.moveTo(startX + trunkWidth / 4, startY);
          context.quadraticCurveTo(startX + trunkWidth / 4, startY - trunkWidth, topRightX, topRightY);
          context.lineWidth = trunkWidth;
          context.lineCap = 'round';
          context.stroke();

          // draw left branch
          context.beginPath();
          context.moveTo(startX - trunkWidth / 4, startY);
          context.quadraticCurveTo(startX - trunkWidth / 4, startY - trunkWidth, topLeftX, topLeftY);
          context.lineWidth = trunkWidth;
          context.lineCap = 'round';
          context.stroke();

          drawBranches(context, topRightX, topRightY, trunkWidth * 0.7, level + 1);
          drawBranches(context, topLeftX, topLeftY, trunkWidth * 0.7, level + 1);
        }
      }


  function drawFractalTree(context){
    drawTree(context, 800, 800, -90, 11);
  }
  function drawTree(context, x1, y1, angle, depth){
    var BRANCH_LENGTH = random(0, 20);
    if (depth != 0){
      var x2 = x1 + (cos(angle) * depth * BRANCH_LENGTH);
      var y2 = y1 + (sin(angle) * depth * BRANCH_LENGTH);
      
      drawLine(context, x1, y1, x2, y2, depth);
      drawTree(context, x2, y2, angle - randomInt(15,20), depth - 1);
      drawTree(context, x2, y2, angle + randomInt(20,25), depth - 1);
    }
  }
  function drawLine(context, x1, y1, x2, y2, thickness){
    context.fillStyle   = '#000';
    // if(thickness > 6) 
    //   context.strokeStyle = 'rgb(139,126, 102)'; //Brown    
    // else
    //   context.strokeStyle = 'rgb(34,139,34)'; //Green
    context.lineWidth = thickness * 1.5;
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
  }
  function cos (angle) {
    return Math.cos(deg_to_rad(angle));
  }
  function sin (angle) {
    return Math.sin(deg_to_rad(angle));
  }
  function deg_to_rad(angle){
    return angle*(Math.PI/180.0);
  }

export default class BackgroundTreeLayer {
  constructor(id) {
    this.id = id;
    this.visible = true;
    this.shapes = [];
  }

  createTrees(ctx) {
    // We need to create a forest like appeareance by using parallax
    let N = randomInt(4, 5);
    let trees = [];
    ctx.strokeStyle = "#2B2B2B";
    for (let i = 0; i < N; i++) {
      // drawBranches(ctx, i * 150 + 150, 600, 30, 0);
      drawTree(ctx, i * 150 + 150, 600, -90, 8);
      // let tree = new Tree(i + 1);
      // tree.props = Object.assign(tree.props, {
      //   x: i * 150 + 150,
      //   y: 600,
      //   lineWidth: randomInt(30, 40),
      //   height: randomInt(900, 1000),
      //   initialAngle: randomInt(85, 98),
      //   heightFraction: random(0.5, 0.6),
      //   maxDepth: randomInt(5, 7),
      //   branchFill: "#212121"
      // });
      // trees.push(tree);
    }
    return trees;
  }

  render(ctx, t) {
    if (this.visible) {
      this.createTrees(ctx);
      // let shapes = this.shapes;
      // // Render each shape into the canvas
      // shapes.forEach(function(shape) {
      //   shape.renderToCanvas(ctx, t);
      // });
    }
  }
};