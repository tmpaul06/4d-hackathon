import React from "react";
import DataStore from "DataStore";
import TreeLayer from "./layers/TreeLayer";
import SideMenu from "./SideMenu";
import DataStoreView from "components/DataStoreView";
import AnimationBar from "components/AnimationBar";
import BackgroundTreeLayer from "./layers/BackgroundTreeLayer";

export default class SceneryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: [ new BackgroundTreeLayer(2), new TreeLayer(1) ],
      currLayerInd: 0
    };
    DataStore.callback = () => {
      this.forceUpdate();
      this.renderLayers();
    };
  }

  componentDidMount() {
    // Measure window width and height
    this.setGlobalWidthAndHeight();
    window.onresize = () => this.setGlobalWidthAndHeight();
  }

  renderLayers() {
    this.state.layers.forEach((layer) => {
      let canvas = this.refs["canvas" + layer.id];
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      layer.render(ctx, 0);
    });
  }

  setGlobalWidthAndHeight() {
    DataStore.cache.global.WIDTH = window.innerWidth - 20;
    DataStore.cache.global.HEIGHT = window.innerHeight - 20;
    this.forceUpdate(() => {
      this.renderLayers();
    });
  }

  setCurrentLayer(i) {
    this.setState({
      currLayerInd: i
    });
  }

  updateLayer(layer, shapes, noWipe) {
    let canvas = this.refs["canvas" + layer.id];
    let ctx = canvas.getContext("2d");
    if (!noWipe) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    layer.render(ctx, 0, shapes);
  }

  toggleLayerVisibility(i) {
    let layer = this.state.layers[i];
    layer.visible = !layer.visible;
    this.forceUpdate();
    this.updateLayer(layer, [], false);
  }

  render() {
    return (
       <div>
        <AnimationBar/>
        <div>
          <DataStoreView/>
          {
            /*
              Draw a canvas for each layer
             */
          }
          {this.state.layers.map((layer, i) => {
            return (
              <div key={layer.id} className="row canvas-layer" style={{
                zIndex: i
              }}>
                <div className="twelve columns">
                  <canvas ref={"canvas" + layer.id} id={"layer" + layer.id}
                    width={DataStore.cache.global.WIDTH}
                    height={DataStore.cache.global.HEIGHT}>
                  </canvas>
                </div>
              </div>
            );
          })}
          <SideMenu layers={this.state.layers}
            toggleLayerVisibility={this.toggleLayerVisibility.bind(this)}
            updateLayer={this.updateLayer.bind(this)}
            setCurrentLayer={this.setCurrentLayer.bind(this)}
            currentLayer={this.state.layers[this.state.currLayerInd]}/>
        </div>
      </div>
    );
  }
};