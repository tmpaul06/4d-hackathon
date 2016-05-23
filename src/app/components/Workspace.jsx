import React from "react";
import SideMenu from "./SideMenu";
import DataStore from "../DataStore";

function random(a, b) {
  return Math.random() * (b - a) + a;
}

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // Measure window width and height
    this.setGlobalWidthAndHeight();
    window.onresize = () => this.setGlobalWidthAndHeight();
  }

  setGlobalWidthAndHeight() {
    DataStore.cache.global.WIDTH = window.innerWidth - 20;
    DataStore.cache.global.HEIGHT = window.innerHeight - 20;
    this.forceUpdate();
  }

  render() {
    let shapes = DataStore.cache.shapes;
    return (
      <div>
        <div className="row canvas-layer" style={{
          zIndex: 0
        }}>
          <div className="twelve columns">
            <canvas id={"shape-editor"}
              width={DataStore.cache.global.WIDTH}
              height={DataStore.cache.global.HEIGHT}>
            </canvas>
          </div>
        </div>

        <SideMenu
          shapes={shapes}
        />
      </div>
    );
  }
}