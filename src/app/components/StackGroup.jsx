import React from "react";
import RangeSlider from "./RangeSlider";
import DataStore from "../DataStore";

export default class StackGroup extends React.Component {
  constructor() {
    super();
    this.state = {
      slider: undefined,
      open: false
    };
  }

  render() {
    let shape = this.props.shape;
    return (
      <div className="group-container">
        <div className="heading">
          {"Group " + this.props.groupIndex }
          <i className={this.state.open ? "fa fa-chevron-up" : "fa fa-chevron-down"}
            onClick={() => this.setState({
            open: !this.state.open
          }) }/>
        </div>
        <div className={"stack-group " + (this.state.open ? " open" : "")}>
          {
            /*
              Attributes
             */
          }
          {shape.getAttrs().map((attr, i) => {
            return (
              <div key={i}>
                {this.state.slider === attr.name && (
                  <RangeSlider
                    range={attr.range}
                    decimalAllowed={attr.decimalAllowed}
                    invert={attr.invert}
                    onValueChange={(v) => 
                      DataStore.set(this.props._dPath.concat([ "attributes", attr.name ]), v)}
                    value={attr.value}
                    zeroValue={attr.value}
                    width={280}/>
                )}
                <span className="stack-attr">
                  {attr.name}
                </span>
                <span className="stack-attr">
                  {attr.value}
                </span>
                <i onClick={() => this.changeAttr(attr)} className="fa fa-arrows-alt"/>
                <i className="fa fa-exchange"/>
              </div>
            );
          })}
        </div>
      </div>
    );
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