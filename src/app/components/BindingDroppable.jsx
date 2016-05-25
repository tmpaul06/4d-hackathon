import React from "react";
import DataStore from "../DataStore";

export default class BindingDroppable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bindPath: undefined
    };
  }

  getBoundVars(path) {
    if (!path) {
      return [];
    }
    let pathArr = path.split(".");
    let lastKey = pathArr[pathArr.length - 1];
    let boundVars = [];
    let parsedLastKey = parseInt(lastKey);
    if (!isNaN(parsedLastKey)) {
      boundVars.push({
        name: "listIndex",
        value: parsedLastKey
      });
    }
    let value = DataStore.get(path);
    if (!value) {
      this.setState({
        bindPath: undefined
      });
      return [];
    }
    Object.keys(value).forEach(function(k) {
      boundVars.push({
        name: k,
        value: value[k]
      });
    });
    return boundVars;
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

  render() {
    let boundVars = this.getBoundVars(this.state.bindPath);
    return (
      <div>
        <hr/>
        {!boundVars.length && (
          <div className="binding-droppable">
            <i style={{
              cursor: "crosshair"
            }} onClick={(e) => this.handleDrop(e)} className="fa fa-download"/>
          </div>
        )}
        {boundVars.map((boundVar, i) => {
          return (
            <span key={i} className="bindable-var">
              <span data-path={this.state.bindPath + "." + boundVar.name}
                className="stack-attr bindable-var-label">{boundVar.name}</span>
              <span className="stack-attr">{boundVar.value}</span>
            </span>
          );
        })}
        <hr style={{
          clear: "both"
        }}/>
        {React.Children.map(this.props.children, (child) => {
          if (this.state.bindPath) {
            return React.cloneElement(child, {
              boundVars
            });
          }
          return child;
        })}
      </div>
    );
  }
};