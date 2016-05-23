import React from "react";
import StackGroup from "./StackGroup";

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentShapeIndex: undefined
    };
    // this.renderCurrentShape = throttle(this.renderCurrentShape.bind(this), 16);
  }

  render() {
    let shapes = this.props.shapes || []; 
    return (
      <div className="sidemenu">
        <div>
          SHAPE LIST
        </div>
        <ul className="stack">
          {shapes.map((shape, i) => {
            return (
              <li style={{
                minHeight: 100
              }} className="stack-item" key={i}>
                <span className="stack-number">{i}</span>
                <StackGroup
                  animateShape={this.animateShape.bind(this)}
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

  componentDidMount() {
    let canvas = document.getElementById("shape-editor");
    let context = canvas.getContext("2d");
    this.context = context;
    this.canvas = canvas;
  }

  componentDidUpdate() {
    this.renderCurrentShape(this.props.shapes[this.state.currentShapeIndex]);
  }

  animateShape(shape, stop) {
    if (this.animId !== undefined && stop === undefined) {
      this.stopAnimation();
      this.animId = undefined;
      return;
    }
    let id = window.requestAnimationFrame((t) => {
      this.renderCurrentShape(shape, t);
      this.animateShape(shape, false);
    });
    this.animId = id;
  }

  stopAnimation() {
    window.cancelAnimationFrame(this.animId);
  }

  renderCurrentShape(shape, t = 0) {
    let canvas = document.getElementById("shape-editor");
    let context = canvas.getContext("2d");
    if (shape) {
      let attrs = shape.props;
      context.clearRect(0, 0, canvas.width, canvas.height);
      shape.renderToCanvas(context, undefined, t);
    }
  }

  handleAttributeValueChange(attr, value) {
    let currentShape = this.props.shapes[this.state.currentShapeIndex];
    if (currentShape) {
      if (typeof value === "number") {
        value = parseFloat(value.toFixed(1));
      }
      console.log(value);
      currentShape.props[attr.name] = value;
      this.renderCurrentShape(currentShape);
      this.forceUpdate();
    } 
  }

  handleShapeSelect(shapeIndex) {
    this.setState({
      currentShapeIndex: shapeIndex
    });
  }
}