import ShapeGroup from "../ShapeGroup";
import { extend } from "../utils/ObjectUtils";

function drawBranches(ctx, depth, attrs, params, { angle, x, y } = {}, blossomPoints = []) {
  if (depth === 0) {
    // Draw the trunk
    ctx.save();
    ctx.translate(attrs.trunkX, attrs.trunkY);
    ctx.rotate(attrs.trunkAngle);
    ctx.fillRect(- attrs.trunkWidth / 2, -attrs.trunkHeight / 2, attrs.trunkWidth, attrs.trunkHeight);
    ctx.restore();
  }
  return blossomPoints;
}

function drawBlossomPoints() {

}

export default class TreeShape extends ShapeGroup {

  static params = {
    depth: [ 0, 5 ]
  };

  static props = {
    trunkX: 50,
    trunkY: 100,
    trunkHeight: 200,
    trunkWidth: 100,
    trunkAngle: 0,
    scaleX: 0.85,
    scaleY: 0.9,
    branchAngleMin: -0.05,
    branchAngleMax: 0.15
  };

  constructor(props) {
    super();
    this.attributes = extend({}, TreeShape.props, props);
  }

  getAttrs() {

  }

  renderToCanvas(ctx) {
    drawBranches(ctx, 0, this.attributes, TreeShape.params);
  }
};