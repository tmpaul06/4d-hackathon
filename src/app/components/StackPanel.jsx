import React from "react";

export default class StackPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shapes: [ {
        icon: "fa fa-circle",
        shape: "circle"
      }, {
        icon: "fa fa-square",
        shape: "rect"
      } ]
    };
  }

  render() {
    return (
      <div className="row">
        <span className="ten columns">
        </span>
        {this.state.shapes.map((shape, i) => {
          return (
            <span key={i} className="one column" style={{
              cursor: "pointer"
            }} onClick={() => this.props.onShapeClick(shape.shape)}>
              <i className={shape.icon}/>
            </span>
          );
        })}
      </div>
    );
  }
}