import ShapeGroup from "../ShapeGroup";
import DataStore from "../DataStore";

export default class RectShapeGroup extends ShapeGroup {
  constructor() {
    super();
    this.attributes = {
      x: DataStore.get([ "global", "WIDTH" ]) / 2,
      y: DataStore.get([ "global", "HEIGHT" ]) / 2,
      width: 100,
      height: 100
    };
  }
}