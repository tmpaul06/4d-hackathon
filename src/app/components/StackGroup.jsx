import React from "react";

export default class StackGroup extends React.Component {
  render() {
    let shape = this.props.shape;
    return (
      <div>
        {
          /*
            Attributes
           */
        }
        {shape.getAttrs().map((attr, i) => {
          return (
            <div key={i}>
              <span className="stack-attr">
                {attr.name}
              </span>
              <span className="stack-attr">
                {attr.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}