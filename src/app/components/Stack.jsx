import React from "react";
import StackPanel from "./StackPanel";
import RectShapeGroup from "shapes/RectShapeGroup";
import StackGroup from "./StackGroup";
import DataStore from "../DataStore";

export default class Stack extends React.Component {
  render() {
    return (
      <div>
        <StackPanel onShapeClick={(s) => this.handleShapeClick(s)}/>
        <span onClick={() => this.clone()}>CLONE LAST</span>
        {this.props.stack.groups.map((group, i) => {
          return (
              <StackGroup
              key={i}
              groupIndex={i}
              _dPath={this.props._dPath.concat([ "groups", i ])}
              onAttrValueChange={(a, v) => this.props.onAttrValueChange(i, a, v)}
              shape={group}/>);
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

  clone() {
    let groups = this.props.stack.groups;
    let lastGroup = groups[groups.length - 1];
    let newGroup = lastGroup.clone();
    DataStore.set(this.props._dPath.concat([ "groups", groups.length ]), newGroup);
  }
}