import Tree from "drawings/Tree";

export default class TreeLayer {
  constructor(id) {
    this.id = id;
    let newTree = new Tree(1);
    this.shapes = [ newTree ];
  }

  clone() {
    let n = this.shapes.length;
    let tree = new Tree(n + 1);
    this.shapes.push(tree);
  }

  render(ctx, t, shapes) {
    shapes = shapes || this.shapes;
    // Render each shape into the canvas
    shapes.forEach(function(shape) {
      shape.renderToCanvas(ctx, t);
    });
  }
};