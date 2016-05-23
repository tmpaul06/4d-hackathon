import React from "react";
import ReactDOM from "react-dom";
import DomEvents from "utils/DomEvents";

function nonCoreMethods(method) {
  // If a method is a core method, then do not bind it again.
  let whiteList = [
    "constructor",
    "render",
    "componentWillMount",
    "componentDidMount",
    "componentWillReceiveProps",
    "componentWillUpdate",
    "shouldComponentUpdate",
    "componentWillUnmount"
  ];
  return whiteList.indexOf(method) < 0;
}

export default (Component) => {
  class DraggableComponent extends React.Component {
    constructor(props) {
      super(props, { "bind" : true });
      this.state = {
        dragstart: false,
        dragging: false,
        dragend: false,
        x: 0,
        y: 0,
        dragOriginX: 0,
        dragOriginY: 0
      };
      this.autoBind();
    }

    autoBind() {
      let methods = Object.getOwnPropertyNames(this.constructor.prototype)
        .filter(prop => typeof this[prop] === "function");

      methods.filter(nonCoreMethods).forEach(method => {
        this[method] = this[method].bind(this);
      });
    }

    componentWillMount() {
      DomEvents.on(document, "mouseup", this.handleMouseUp);
      DomEvents.on(document, "mousemove", this.handleMouseMove);
    }

    componentDidMount() {
      let node = ReactDOM.findDOMNode(this);
      DomEvents.on(node, "mousedown", this.handleMouseDown);
    }

    componentWillUnmount() {
      DomEvents.off(document, "mouseup", this.handleMouseUp);
      DomEvents.off(document, "mousemove", this.handleMouseMove);
      let node = ReactDOM.findDOMNode(this);
      DomEvents.off(node, "mousedown", this.handleMouseDown);
    }

    handleMouseUp(e) {
      if(this.state.dragging || this.state.dragstart) {
        DomEvents.pauseEvent(e);
        this.props.onDragEnd({
          x: this.state.x,
          y: this.state.y,
          dx: 0,
          dy: 0
        });
        this.setState({
          dragend: true,
          dragging: false,
          dragstart: false,
          x: 0,
          y: 0,
          dragOriginX: 0,
          dragOriginY: 0
        });
      }
    }

    handleMouseMove(e) {
      let { restrictX, restrictY } = this.props;
      if(this.state.dragstart) {
        DomEvents.pauseEvent(e);
        this.setState({
          dragstart: false,
          dragging: true,
          dragend: false,
          x: (restrictX) ? (this.state.x) : (e.clientX - this.state.dragOriginX),
          y: (restrictY) ? (this.state.y) : (e.clientY - this.state.dragOriginY)
        });
      } else if(this.state.dragging) {
        DomEvents.pauseEvent(e);
        // Callback only if diff has changed.
        if((this.state.x !== (e.clientX - this.state.dragOriginX)) || (this.state.y !== (e.clientY - this.state.dragOriginY))) {
          this.props.onDrag({
            x: this.state.x,
            y: this.state.y,
            dx: (restrictX) ? 0 : ((e.clientX - this.state.dragOriginX) - this.state.x),
            dy: (restrictY) ? 0 : ((e.clientY - this.state.dragOriginY) - this.state.y)
          });
        }
        this.setState({
          dragstart: false,
          dragging: true,
          dragend: false,
          x: (restrictX) ? (this.state.x) : (e.clientX - this.state.dragOriginX),
          y: (restrictY) ? (this.state.y) : (e.clientY - this.state.dragOriginY)
        });
      }
    }

    handleMouseDown(e) {
      if(this.state.dragging) {
        DomEvents.pauseEvent(e);
        this.handleMouseUp(e);
        return;
      }
      if(!this.state.dragstart) {
        DomEvents.pauseEvent(e);
        this.setState({
          dragstart: true,
          dragging: false,
          dragend: false,
          dragOriginX: (this.props.originX !== undefined) ? this.props.originX : e.clientX,
          dragOriginY: (this.props.originY !== undefined) ? this.props.originY : e.clientY
        });
        this.props.onDragStart({
          origin: [ this.state.dragOriginX, this.state.dragOriginY ]
        });
      }
    }
    render() {
      return (
        <Component
          {...this.props}/>
      );
    }
  }

  let NOOP = function() {};

  DraggableComponent.defaultProps = {
    restrictX: false,
    restrictY: false,
    onDragStart: NOOP,
    onDrag: NOOP,
    onDragEnd: NOOP
  };

  DraggableComponent.propTypes = {
    restrictX: React.PropTypes.bool,
    restrictY: React.PropTypes.bool,
    originX: React.PropTypes.number,
    originY: React.PropTypes.number,
    onDragStart: React.PropTypes.func,
    onDrag: React.PropTypes.func,
    onDragEnd: React.PropTypes.func
  };

  return DraggableComponent;
};