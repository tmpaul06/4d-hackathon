import React from "react";
import DataStore from "../DataStore";

export default class ListBindingDroppable extends React.Component {
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

  render() {
    let values = this.getListValues(this.state.bindPath);
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
        <hr style={{
          clear: "both"
        }}/>
        {React.Children.map(this.props.children, (child) => {
          if (values.length > 0) {
            return React.cloneElement(child, {
              products: values
            });
          }
          return child;
        })}
      </div>
    );
  }
};