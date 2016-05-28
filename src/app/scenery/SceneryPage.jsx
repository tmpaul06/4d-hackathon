import React from "react";
import DataStore from "DataStore";
import TreeLayer from "./layers/TreeLayer";
import SideMenu from "./SideMenu";
import DataStoreView from "components/DataStoreView";
import AnimationBar from "components/AnimationBar";
import BackgroundTreeLayer from "./layers/BackgroundTreeLayer";
import MountainLayer from "./layers/MountainLayer";

export default class SceneryPage extends React.Component {
  constructor(props) {
    super(props);
    let boundTreeLayer = new TreeLayer(2);
    boundTreeLayer.shapes = [];
    boundTreeLayer.visible = false;
    this.state = {
      layers: [ new MountainLayer(4), new BackgroundTreeLayer(3), boundTreeLayer,  new TreeLayer(1) ],
      currLayerInd: 0
    };
    DataStore.callback = () => {
      this.forceUpdate();
      this.renderLayers();
    };
    this.animate = this.animate.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);
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
    DataStore.cache.global.WIDTH = document.body.clientWidth || window.innerWidth;
    DataStore.cache.global.HEIGHT = document.body.clientHeight || window.innerHeight;
    this.forceUpdate(() => {
      this.renderLayers();
    });
  }

  setCurrentLayer(i) {
    this.setState({
      currLayerInd: i
    });
  }

  updateLayer(layer, shapes) {
    let canvas = this.refs["canvas" + layer.id];
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (shapes) {
      layer.shapes = shapes;
    }
    layer.render(ctx, 0, shapes);
  }

  startAnimation() {
    this.stopAnim = false;
    this.animate();
  }

  animate() {
    window.requestAnimationFrame((t) => {
      this.renderLayers();
      // this.forceUpdate();
      DataStore.cache.T = t;
      // DataStore.set("T", Math.floor(t / 48));
      if (!this.stopAnim) {
        this.animate();
      }
    });
  }

  stopAnimation() {
    this.stopAnim = true;
    // (90 - {x} * 4) + (10) * cos(T/600)
  }

  toggleLayerVisibility(i) {
    let layer = this.state.layers[i];
    layer.visible = !layer.visible;
    this.forceUpdate();
    this.updateLayer(layer, undefined, false);
  }

  render() {
    return (
       <div>
        <AnimationBar stopAnimation={this.stopAnimation.bind(this)} animate={() => this.startAnimation()}/>
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
