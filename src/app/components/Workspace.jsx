import React from "react";
import SideMenu from "./SideMenu";
import DataStore from "../DataStore";

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.currentLayer = DataStore.cache.layers[0];
  }

  componentDidMount() {
    // Measure window width and height
    this.setGlobalWidthAndHeight();
    window.onresize = () => this.setGlobalWidthAndHeight;
  }

  setGlobalWidthAndHeight() {
    DataStore.cache.global.WIDTH = window.innerWidth;
    DataStore.cache.global.HEIGHT = window.innerHeight;
  }

  render() {
    let layers = DataStore.cache.layers;
    return (
      <div>
        {layers.map((layer, i) => {
          return (
            <div key={layer.id} className="row canvas-layer full-height"
              style={{
                zIndex: i
              }}
            >
              <div className="twelve columns">
                <canvas id={layer.id} style={{
                  width: "inherit"
                }} height="100%">
                </canvas>
              </div>
            </div>
          );
        })}
        <SideMenu handleAddGroup={this.handleAddGroup} currentLayer={this.state.currentLayer}/>
      </div>
    );
  }

  handleAddGroup(layer, stackIndex, group) {
    layer.stacks[stackIndex].groups.push(group);
    this.forceUpdate();
  }
}