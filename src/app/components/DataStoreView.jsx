import React from "react";
import JSONTree from "react-json-tree";
import DataStore from "../DataStore";

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
                  DataStore.path = path;
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }
            }
          }} data-path={keys.join(".") + "." + raw}>
            {raw}
          </span>
        )}
        />
      </div>
    );
  }
}