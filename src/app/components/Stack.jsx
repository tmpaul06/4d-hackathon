import React from "react";
import StackPanel from "./StackPanel";
import RectShapeGroup from "shapes/RectShapeGroup";
import StackGroup from "./StackGroup";

export default class Stack extends React.Component {
  render() {
    return (
      <div>
        <StackPanel onShapeClick={(s) => this.handleShapeClick(s)}/>
        {this.props.stack.groups.map((group, i) => {
          return (<StackGroup shape={group}/>);
        })}
      </div>
    );
  }

  handleShapeClick(shape) {
    if (shape === "rect") {
      // Pass a new RectShapeGroup to parent
      this.props.onAddGroup(new RectShapeGroup());
    }
  }
}