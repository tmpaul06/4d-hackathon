import React from "react";
import StackGroup from "components/StackGroup";

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentShapeIndex: undefined
    };
  }

  handleShapeSelect(shapeIndex) {
    this.setState({
      currentShapeIndex: this.state.currentShapeIndex === shapeIndex ? undefined : shapeIndex
    });
  }

  handleAttributeValueChange(attr, v) {
    let currentLayer = this.props.currentLayer;
    let shapes = currentLayer.shapes || [];
    let currentShape = shapes[this.state.currentShapeIndex];
    if (typeof v === "number") {
      v = parseFloat(v.toFixed(2));
    }
    if (currentShape.isTemplate) {
      currentShape.constructor.props[attr.name] = v;
    }
    currentShape.props[attr.name] = v;
    currentLayer.shapes[this.state.currentShapeIndex] = currentShape;
    this.props.updateLayer(currentLayer);
    this.forceUpdate();
  }

  render() {
    let layers = this.props.layers || [];
    let currentLayer = this.props.currentLayer;
    let shapes = currentLayer.shapes || [];
    return (
      <div className="sidemenu">
        <div>
          LAYERS
        </div>
        <ul className="stack">
          {layers.map((layer, i) => {
            return (
              <li style={{
                minHeight: 100
              }} className="stack-item" key={i}>
                <i className="fa fa-eye"/>
                <span onClick={() => this.props.setCurrentLayer(i)}>{"Layer " + layer.id}</span>
              </li>
            );
          })}
        </ul>
        <ul className="stack">
          {shapes.map((shape, i) => {
            return (
              <li style={{
                minHeight: 100
              }} className="stack-item" key={i}>
                <span className="stack-number">{i + 1}</span>
                <StackGroup
                  open={this.state.currentShapeIndex === i}
                  attrValueChange={this.handleAttributeValueChange.bind(this)}
                  onSelect={this.handleShapeSelect.bind(this, i)}
                  shape={shape}/>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
