import React from "react";
import Stack from "./Stack";

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let layer = this.props.currentLayer;
    let stacks = layer ? (layer.stacks) || [] : [];
    return (
      <div className="sidemenu">
        <div>
          <span>Clone</span>
        </div>
        <ul className="stack">
          {stacks.map((stack, i) => {
            return (
              <li style={{
                minHeight: 100
              }} className="stack-item" key={i}>
                <span className="stack-number">{stack.id}</span>
                <Stack stack={stack} onAddGroup={this.props.handleAddGroup.bind(this, layer, i)}/>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}