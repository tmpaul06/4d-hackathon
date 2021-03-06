import React from "react";
import StackGroup from "components/StackGroup";
import BindingDroppable from "components/BindingDroppable";
import ListBindingDroppable from "components/ListBindingDroppable";
import tinycolor from "tinycolor2";

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentShapeIndex: undefined,
      selectedTemplate: undefined
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
    if (attr.type === "color" && typeof v === "function") {
      // Get hsva from hex
      let originalV = v;
      let originalColor = currentShape.props[attr.name];
      v = function(...args) {
        let result = originalV(...args);
        // Use result to linearly get
        let colorValue = tinycolor(originalColor);
        colorValue = colorValue.toHsv();
        // Use result as hue
        let r = tinycolor({
          h: Math.floor(result),
          s: colorValue.s,
          v: colorValue.v
        });
        return r.toHexString();
      };
    }
    currentShape.props[attr.name] = v;
    currentLayer.shapes[this.state.currentShapeIndex] = currentShape;
    this.props.updateLayer(currentLayer);
    this.forceUpdate();
  }

  setCurrentTemplate(index) {
    let currentLayer = this.props.currentLayer;
    let shapes = currentLayer.shapes || [];
    let shape = shapes[index];
    if (shape) {
      this.setState({
        selectedTemplate: shape
      });
    }
  }

  render() {
    let layers = this.props.layers || [];
    let currentLayer = this.props.currentLayer;
    let shapes = currentLayer.shapes || [];
    return (
      <div className="sidemenu" style={{
        display: this.state.hide ? "none" : "block"
      }}>
        <span style={{
          float: "right",
          fontSize: 10,
        }} onClick={() =>
          this.setState({
            hide: true
          })
        }>HIDE</span>
        <div>
          LAYERS
        </div>
        <ul className="stack">
          {layers.map((layer, i) => {
            return (
              <li className="stack-item" key={i}>
                <ListBindingDroppable
                  updateShapes={(shapes) => this.props.updateLayer(layer, shapes, true)}
                  template={this.state.selectedTemplate}/>
                <i onClick={() => this.props.toggleLayerVisibility(i)}
                  className={layer.visible ? "fa fa-eye" : "fa fa-eye-slash"}/>
                <span style={{
                  margin: "0px 10px"
                }} onClick={() => this.props.setCurrentLayer(i)}>{layer.name || layer.constructor.name}</span>
              </li>
            );
          })}
        </ul>
        <div>
          TEMPLATES
        </div>
        <ul className="stack">
          {shapes.map((shape, i) => {
            return (
              <li style={{
                minHeight: 100
              }} className="stack-item" key={i}>
                <span className="stack-number">{i + 1}</span>
                <BindingDroppable>
                <StackGroup
                  updateLayer={() => this.props.updateLayer(this.props.currentLayer)}
                  open={this.state.currentShapeIndex === i}
                  attrValueChange={this.handleAttributeValueChange.bind(this)}
                  setCurrentTemplate={this.setCurrentTemplate.bind(this, i)}
                  onSelect={this.handleShapeSelect.bind(this, i)}
                  shape={shape}/>
                </BindingDroppable>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
