import React from "react";
import SideMenu from "./SideMenu";
import DataStore from "../DataStore";

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.currentLayerIndex = 0;
    this.handleAddGroup = this.handleAddGroup.bind(this);
  }

  componentDidMount() {
    // Measure window width and height
    this.setGlobalWidthAndHeight();
    window.onresize = () => this.setGlobalWidthAndHeight();
    DataStore.callback = (layers) => {
      this.forceUpdate();
      this.updateLayers(layers);
    };
  }

  updateLayers(layers) {
    layers = layers || DataStore.cache.layers;
    layers.forEach((layer) => {
      let canvas = document.getElementById("layer" + layer.id);
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.moveTo(0, 0);
      let stacks = layer.stacks;
      stacks.forEach(function(stack) {
        stack.groups.forEach(function(group) {
          group.renderToCanvas(ctx, 0);
        });
      });
    });
  }

  setGlobalWidthAndHeight() {
    DataStore.cache.global.WIDTH = window.innerWidth - 20;
    DataStore.cache.global.HEIGHT = window.innerHeight - 20;
    this.forceUpdate();
    this.updateLayers();
  }

  render() {
    let layers = DataStore.cache.layers;
    let currentLayer = layers[this.state.currentLayerIndex];
    return (
      <div>
        {layers.map((layer, i) => {
          return (
            <div key={layer.id} className="row canvas-layer"
              style={{
                zIndex: i
              }}
            >
              <div className="twelve columns">
                <canvas ref={"layer" + layer.id} id={"layer" + layer.id}
                  width={DataStore.cache.global.WIDTH} height={DataStore.cache.global.HEIGHT}>
                </canvas>
              </div>
            </div>
          );
        })}
        <SideMenu
          _dPath={[ "layers", this.state.currentLayerIndex ]}
          onAttrValueChange={(...args) => this.onAttrValueChange(...args)}
          handleAddGroup={this.handleAddGroup} 
          currentLayer={currentLayer}/>
      </div>
    );
  }

  handleAddGroup(layer, stackIndex, group) {
    layer.stacks[stackIndex].groups.push(group);
    this.forceUpdate();
    let canvas = document.getElementById("layer" + layer.id);
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(0, 0);
    let stacks = layer.stacks;
    stacks.forEach(function(stack) {
      stack.groups.forEach(function(group) {
        group.renderToCanvas(ctx, 0);
      });
    });
  }

  onAttrValueChange(layer, stackIndex, groupIndex, attr, value) {
    layer.stacks[stackIndex].groups[groupIndex].attributes[attr.name] = value;
    this.forceUpdate();
    let canvas = document.getElementById("layer" + layer.id);
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(0, 0);
    let stacks = layer.stacks;
    stacks.forEach(function(stack) {
      stack.groups.forEach(function(group) {
        group.renderToCanvas(ctx, 0);
      });
    });
  }
}