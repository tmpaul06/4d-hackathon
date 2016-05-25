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
  }

  render() {
    return (
      <div className="datastore-view">
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
    );
  }
}