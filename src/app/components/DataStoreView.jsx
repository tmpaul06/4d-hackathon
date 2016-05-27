import React from "react";
import JSONTree from "react-json-tree";
import DataStore from "../DataStore";

function reverse(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[arr.length - 1 - i]);
  }
  return newArr;
}

export default class DataStoreView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false
    };
  }

  render() {
    let dataStorestyle = !this.state.status ? { display: "none" } : {};
    return (
      <div className="datastore-view" >
        <div style={dataStorestyle}>
          <JSONTree
            hideRoot={true}
            data={DataStore.cache}
            labelRenderer={(raw, ...keys) => (
              <span onClick={(e) => {
                if (e.ctrlKey) {
                  if (e.target) {
                    let path = e.target.getAttribute("data-path");
                    if (path !== null) {
                      document.body.classList.add("highlight-droppable");
                      DataStore.path = path;
                      console.log("Setting path", path);
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                  }
                }
              }} data-path={reverse(keys).join(".") + "." + raw}>
                {raw}
              </span>
            )}
            />
        </div>
        {(<i className="fa fa-bars" style={this.getStyle().iconStyle} aria-hidden="true" onClick={this.handleDataStorView.bind(this)}></i>)}
      </div>
    );
  }

  handleDataStorView() {
    let def = this.state.status;
    this.setState({
      status: !def
    });
  }

  getStyle() {
    return {
      iconStyle: {
        fontSize:"36px",
        color: "#FFF",
        position: "absolute",
        right: this.state.status ? "-35px" : undefined,
        left: this.state.status ? undefined : "10px",
        top: "10px",
        color: "black",
        background: "#FAFAFA",
        padding: "5px 6px",
        fontSize: "20px",
        borderRadius: "50%",
        cursor: "pointer"
      }
    };
  }
}
