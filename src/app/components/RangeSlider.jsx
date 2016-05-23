import React from "react";
import Draggable from "utils/Draggable";

let DSpan = Draggable("span");
export default class RangeSlider extends React.Component {

  static defaultProps = {
    invert: false
  };

  constructor(props) {
    super();
    this.state = {
      zeroValue: props.zeroValue,
      dx: 0
    };
  }

  handleDrag(result) {
    let maxRange = isFinite(this.props.range[1]) ? this.props.range[1] : 1000;
    let scale = (maxRange - this.props.range[0]) / (this.props.width);
    let delta = result.x * (this.props.invert ? -1 : 1) * scale;
    let newValue = this.state.zeroValue + delta;
    if ((newValue < (this.props.range[0])) || (newValue > maxRange)) {
      return;
    }
    if (Math.abs(this.state.dx + result.dx) > this.props.width / 2) {
      return;
    }
    this.setState({
      dx: this.state.dx + result.dx
    });
    // if (this.props.range[2]) {
    //   if (Math.abs(delta) < this.props.range[2]) {
    //     return;
    //   } else {
    //     // Roundoff to nearest step
    //     delta = Math.round(delta / this.props.range[2]) * this.props.range[2];
    //   }
    // }
    newValue = Math.round((this.state.zeroValue + delta) * 8) / 8;
    this.props.onValueChange(newValue);
  }
 
  render() {
    let width = this.props.width;
    return (
      <div className="range-slider" style={{
        width: this.props.width
      }}>
        <DSpan restrictY={true} onDrag={(e) => this.handleDrag(e)} className="range-slider-handle" style={{
          left: (this.props.width / 2 + this.state.dx)
        }} ></DSpan>
      </div>
    );
  }
}