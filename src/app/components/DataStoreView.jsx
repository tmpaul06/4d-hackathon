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


const theme = {
  scheme: 'flat',
  author: 'chris kempson (http://chriskempson.com)',
  base00: '#2C3E50',
  base01: '#34495E',
  base02: '#7F8C8D',
  base03: '#95A5A6',
  base04: '#BDC3C7',
  base05: '#e0e0e0',
  base06: '#f5f5f5',
  base07: '#ECF0F1',
  base08: '#E74C3C',
  base09: '#E67E22',
  base0A: '#F1C40F',
  base0B: '#2ECC71',
  base0C: '#1ABC9C',
  base0D: '#3498DB',
  base0E: '#9B59B6',
  base0F: '#be643c'
};
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
      <div className="datastore-view">
      <div className="datastore-container" style={dataStorestyle}>
      <JSONTree
        theme={theme}
        isLightTheme={true}
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
          }} data-path={reverse(keys).concat([ raw ]).join(".")}>
            {raw}
          </span>
        )}
        />
        </div>
        {(<i className={"fa datastore-hamburger " + (this.state.status ? "fa-chevron-left" : "fa-chevron-right")} style={this.getStyle().iconStyle} aria-hidden="true" onClick={this.handleDataStorView.bind(this)}></i>)}
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
        left: !this.state.status ? "0px" : undefined,
        right: !this.state.status ? undefined : "-20px"
      }
    };
  }
}
