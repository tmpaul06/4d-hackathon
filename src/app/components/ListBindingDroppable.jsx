import React from "react";
import DataStore from "../DataStore";

export default class BindingDroppable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bindPath: undefined
    };
  }

  getListValues(path) {
    if (!path) {
      return [];
    }
    let value = DataStore.get(path);
    return value || [];
  }

  handleDrop(e) {
    if (e.ctrlKey) {
      if (DataStore.path !== undefined) {
        document.body.classList.remove("highlight-droppable");
        this.setState({
          bindPath: DataStore.path
        });
        DataStore.path = undefined;
      }
    }
  }

  getBoundVars(value) {
    return Object.keys(value).map(function(key) {
      return {
        name: key,
        value: value[key]
      };
    });
  }

  componentDidUpdate() {
    let values = this.getListValues(this.state.bindPath);
    let Template = this.props.template;
    if (Template !== undefined && values.length > 0) {
      let shapes = [];
      for(let i = 0, len = values.length; i < len; i++) {
        let value = values[i];
        let shape = Template.clone();
        let boundVars = this.getBoundVars(value);
        shape.boundVars = boundVars;
        shapes.push(shape);
      }
      this.props.updateShapes(shapes);
    }
  }

  render() {
    let values = this.getListValues(this.state.bindPath);
    let Template = this.props.template;
    return (
      <div>
        <hr/>
        {!values.length && (
          <div className="binding-droppable">
            <i style={{
              cursor: "crosshair"
            }} onClick={(e) => this.handleDrop(e)} className="fa fa-download"/>
          </div>
        )}
        {Template && values.map((value, i) => {
          return (<div key={i}>
            {Template.name + " " +  i}
          </div>);
        })}
        <hr style={{
          clear: "both"
        }}/>
      </div>
    );
  }
};