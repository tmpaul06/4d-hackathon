import Tree from "drawings/Tree";

export default class TreeLayer {
  constructor(id) {
    this.id = id;
    this.visible = true;
    let newTree = new Tree(1);
    this.shapes = [ newTree ];
  }

  render(ctx, t, shapes) {
    if (this.visible) {
      shapes = shapes || this.shapes;
      // Render each shape into the canvas
      shapes.forEach(function(shape) {
        shape.renderToCanvas(ctx, t);
      });
    }
  }
};