import React from "react";
import SceneryPage from "scenery/SceneryPage";
import DataStore from "../DataStore";


export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SceneryPage/>
    );
  }
}