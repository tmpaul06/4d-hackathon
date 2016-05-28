import React from "react";
import { randomInt } from "../FuncRegistry";
import { extend } from "utils/ObjectUtils";
import DataStore from "../DataStore";

function getStackedLayout(products, propsArray) {
  // Assume that each product item has the image width, height attributes,
  // as well as content description. The user can override containerWidth
  // if necessary, i.e by providing a bound function. If it is a number, a
  // stacked layout will override it
  let totalWidth = 1000;
  let availableWidth = totalWidth;
  let gridPadding = 20;
  let productGrid = [];
  let row = 0, cell = 0, i = 0;
  let map = {};
  // Run through each product adding to first row until available width is all
  // used up
  while(i < products.length) {
    let props = propsArray[i];
    // Push into current row until width is not available anymore
    let productWidth = props.containerWidth;
    let productHeight = props.containerHeight;
    if (productWidth > availableWidth) {
      row++;
      cell = 0;
      availableWidth = totalWidth - (productWidth + gridPadding);
    } else {
      availableWidth -= (productWidth + gridPadding);
    }
    productGrid[row] = productGrid[row] || [];
    productGrid[row][cell] = {};
    let prevLeft = productGrid[row] ? productGrid[row][cell - 1] : productGrid[row][0];
    let prevUpper = productGrid[row - 1] ? productGrid[row - 1][cell] : productGrid[0][cell];
    productGrid[row][cell] = {
      left: (cell === 0 ? gridPadding : (prevLeft.left +
        prevLeft.width + gridPadding)), 
      top: (row === 0 ? gridPadding : (prevUpper.height +
        prevUpper.top + gridPadding)),
      width: props.containerWidth,
      height: props.containerHeight
    };
    map[i] = productGrid[row][cell];
    cell++;
    i++;
  }
  return map;
}

export default class ProductGridView extends React.Component {
  constructor(props) {
    super(props);
  }

  resolveTemplateProps(product,i, templateProps) {
    let props = extend({}, templateProps);
    Object.keys(props).forEach(function(key) {
      let value = props[key];
      if (typeof value === "function") {
        let clone = extend({
          listIndex: i
        }, product);
        props[key] = value(clone, DataStore.get("T"));
      }
    });
    return props;
  }

  render() {
    let products = this.props.products || [];
    // For each product, resolve appropriate templateProps
    let tPropsArray = products.map((p, i) => {
      return this.resolveTemplateProps(p, i, this.props.templateProps);
    });
    let layout = getStackedLayout(products, tPropsArray);
    let ProductComponent = this.props.productComponent;
    return (
      <div style={{
        position: "relative"
      }}>
        {ProductComponent && products.map((p, i) => {
          let l = layout[i];
          let tProps = tPropsArray[i];
          return (
            <div style={{
              position: "absolute",
              top: l.top,
              left: l.left,
              width: l.width,
              height: l.height
            }} key={i}>
              <ProductComponent
                product={p}
                templateProps={tProps}     
              />
            </div>
          );
        })}  
      </div>
    );
  };
}