import React from "react";
import InputRange from "react-input-range";
import DataStore from "../DataStore";

export default class AnimationBar extends React.Component {

  static defaultProps = {
    animate() {},
    stopAnimation() {}
  };

  constructor(props) {
    super(props);
    this.state = {
      status: "pause"
    };
  }

  togglePlay() {
    this.setState({
      status: this.state.status === "play" ? "pause" : "play"
    }, () => {
      if (this.state.status === "play") {
        this.props.animate();
      } else {
        this.props.stopAnimation();
      }
    });
  }

  render() {
    return (
      <div className="animation-bar">
        <div>
          <i onClick={this.togglePlay.bind(this)} className={"fa play-btn " + (this.state.status !== "play" ? "fa-play" : "fa-pause")}/>
        </div>
        <div style={{
          marginLeft: 50
        }}>
          <InputRange
            maxValue={1000}
            minValue={0}
            step={1}
            value={DataStore.get("T")}
            onChange={(c, v) => DataStore.set("T", v)}
          />
        </div>
      </div>
    );
  }
}