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

  changeBoundVar(boundVar, e) {
    if (boundVar.name === "listIndex") {
      if (e.altKey) {
        let keyCode = e.keyCode;
        let value = boundVar.value;
        if (keyCode === 45) {
          // minus
          value = value - 1;
        } else if (keyCode === 43) {
          // plus
          value = value + 1;
        }
        let path = this.state.bindPath.split(".");
        path.splice(path.length - 1, 1);
        let arrValue = DataStore.get(path);
        if (parseInt(value) >= arrValue.length || parseInt(value) < 0) {
          return;
        }
        this.setState({
          bindPath: path.join(".") + "." + value
        });
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
        {boundVars.length !== 0 && (
          <i className="fa fa-close" onClick={() => this.setState({
            bindPath: undefined
          })}/>
        )}
        {boundVars.map((boundVar, i) => {
          return (
            <span key={i} className="bindable-var">
              <span data-path={this.state.bindPath + "." + boundVar.name}
                className="stack-attr bindable-var-label">{boundVar.name}</span>
              {/*boundVar.name === "listIndex" ? (
                <input className="stack-attr"
                  type="number"
                  onChange={(e) => this.changeBoundVar(boundVar, e.target.value)}
                  value={boundVar.value}/>
              ) : <span className="stack-attr">{boundVar.value}</span>*/}
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