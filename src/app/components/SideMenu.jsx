import React from "react";
import Stack from "./Stack";
import DataStore from "../DataStore";

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
          <span onClick={() => this.cloneStack()}>CLONE LAST</span>
        </div>
        <ul className="stack">
          {stacks.map((stack, i) => {
            return (
              <li style={{
                minHeight: 100
              }} className="stack-item" key={i}>
                <span className="stack-number">{stack.id}</span>
                <Stack
                  _dPath={this.props._dPath.concat([ "stacks", i ])}
                  onAttrValueChange={(g, a, v) =>
                   this.props.onAttrValueChange(layer, i, g, a, v)}
                  stack={stack} onAddGroup={this.handleAddGroup.bind(this, layer, i)}/>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  handleAddGroup(layer, i, group) {
    this.props.handleAddGroup(layer, i, group);
  }

  cloneStack() {
    let stacks = this.props.currentLayer.stacks;
    let lastStack = stacks[stacks.length - 1];
    let newStack = {
      id: lastStack.id + 1,
      groups: lastStack.groups.map(function(g) {
        return g.clone();
      })
    };
    DataStore.set(this.props._dPath.concat([ "stacks", stacks.length ]), newStack);
  }
}