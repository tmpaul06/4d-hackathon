import React from "react";
import RangeSlider from "./RangeSlider";
import DataStore from "../DataStore";
import InputRange from "react-input-range";
import BindingExpression from "./BindingExpression";
import { SliderPicker } from "react-color";


export default class StackGroup extends React.Component {
  constructor() {
    super();
    this.state = {
      slider: undefined
    };
  }
 
  render() {
    let shape = this.props.shape;
    let attrs = shape.getAttrs();
    return (
      <div className="group-container">
        <div style={{
          background: shape.isTemplate ? "#43AAFF" : "#ECECEC"
        }} className="heading" onClick={() => this.props.onSelect() }>
          { shape.name }
        </div>
        <div className={"stack-group " + (this.props.open ? " open" : "")}>
          {
            /*
              Attributes
             */
          }
          {attrs.map((attr, i) => {
            return (
              <div key={i}>
                {/*this.state.slider === attr.name && (
                  <RangeSlider
                    range={attr.range}
                    onValueChange={(v) => 
                      this.props.attrValueChange(attr, v)}
                    value={attr.value}
                    zeroValue={attr.value}
                    width={280}/>
                )*/}
                {
                  this.state.binding === attr.name && (
                    <BindingExpression
                      shape={shape}
                    />
                  )
                }
                {this.state.slider === attr.name && (attr.type === "color") && (
                  <div className="range-slider">
                    <SliderPicker
                      color={attr.value}
                      onChangeComplete={(v) => this.props.attrValueChange(attr, v.hex)}
                    />
                  </div>
                )}
                {this.state.slider === attr.name && (attr.type !== "color") && (
                  <div className="range-slider">
                    <InputRange
                      maxValue={attr.range[1]}
                      minValue={attr.range[0]}
                      step={attr.range[2]}
                      value={attr.value}
                      onChange={(c, v) => this.props.attrValueChange(attr, v)}
                    />
                  </div>
                )}
                <span className="stack-attr">
                  {attr.name}
                </span>
                <span className="stack-attr">
                  {attr.value}
                </span>
                <i onClick={() => this.changeAttr(attr)} className="fa fa-arrows-alt"/>
                <i onClick={() => this.createBinding(attr)} className="fa fa-exchange"/>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  createBinding(attr) {
    this.setState({
      slider: this.state.slider === attr.name ? undefined : this.state.slider,
      binding: attr.name
    });
  }

  changeAttr(attr) {
    // Set state so that a slider will be visible
    if (attr.name === this.state.slider) {
      this.setState({
        slider: undefined
      });
      return;
    }
    this.setState({
      slider: attr.name
    });
  }
}