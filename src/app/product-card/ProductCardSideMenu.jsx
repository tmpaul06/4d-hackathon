import React from "react";
import BindingExpression from "components/BindingExpression";
import InputRange from "react-input-range";
import { SliderPicker } from "react-color";

export default class ProductCardSideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      binding: undefined,
      slider: undefined
    };
  }

  getRange(key) {
    switch(key) {
      case "borderRadius":
        return [ 0, 100, 5 ];
      case "rotate":
        return [ 0, 90, 5 ];
      case "translate":
        return [ 0, 100, 10 ];
      case "imageWidth":
      case "imageHeight":
        return [ 20, 800, 10 ];
      case "containerWidth":
      case "containerHeight":
        return [ 150, 800, 10 ];
    }
  }

  getAttrs(templateProps = []) {
    return Object.keys(templateProps).map((key) => {
      return {
        name: key,
        value: templateProps[key],
        range: this.getRange(key)
      };
    }).filter((a) => a.name !== "binding");
  }

  render() {
    let templateProps = this.props.templateProps;
    let attrs = this.getAttrs(templateProps);
    return (
      <div className="stack-group open">
        {attrs.map((attr, i) => {
          return (
            <div key={i}>
              {
                this.state.binding === attr.name && (
                  <BindingExpression
                    onChange={(v) => this.props.attrValueChange(attr, v)}
                    boundVars={this.props.boundVars}
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
};