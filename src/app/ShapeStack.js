export default class ShapeStack {

  constructor(id) {
    this.id = id;
    this.groups = [];
  }

  renderToCanvas(ctx, timeElapsed) {
    this.groups.forEach(function(group) {
      group.renderToCanvas(ctx, timeElapsed);
    });
  }
}