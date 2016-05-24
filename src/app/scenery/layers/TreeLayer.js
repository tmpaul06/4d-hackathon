import Tree from "drawings/Tree";

export default class TreeLayer {
  constructor(id) {
    this.id = id;
    let newTree = new Tree(1);
    newTree.isTemplate = true;
    this.shapes = [ newTree ];
  }

  clone() {
    let n = this.shapes.length;
    let tree = new Tree(n + 1);
    this.shapes.push(tree);
  }

  render(ctx, t) {
    // Render each shape into the canvas
    this.shapes.forEach(function(shape) {
      shape.renderToCanvas(ctx, t);
    });
  }
};