import React from "react";
import InputRange from "react-input-range";
import DataStore from "../DataStore";

export default class AnimationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "slide"
    };
  }

  render() {
    return (
      <div className="animation-bar">
        <InputRange
          maxValue={1000}
          minValue={0}
          step={1}
          value={DataStore.get("T")}
          onChange={(c, v) => DataStore.set("T", v)}
        />
      </div>
    );
  }
}