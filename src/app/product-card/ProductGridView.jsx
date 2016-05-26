import React from "react";
import { randomInt } from "../FuncRegistry";
import { extend } from "utils/ObjectUtils";

let imageArray = [ "bubbles", "rainDrops", "chair" ];

function generateProducts(N) {
  let products = [];
  for (let i = 0; i < N; i++) {
    products.push({
      name: "Product " + i,
      imageSrc: imageArray[i % 3],
      imageWidth: 250,
      imageHeight: randomInt(150, 300),
      description: "A very fantastic product to use daily" + imageArray[i % 3]
    });
  }
  return products;
}

function getGridRepresentation(products, nX) {
  let productGrid = [];
  for(let i = 0; i < products.length; i++) {
    let row = Math.floor(i / nX);
    let cell = i % nX;
    productGrid[row] = productGrid[row] || [];
    productGrid[row][cell] = products[i];
  }
  return productGrid;
}

function getStackedLayout(products, props) {
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
    // Push into current row until width is not available anymore
    let productWidth = products[i].imageWidth + 40;
    let productHeight = products[i].imageHeight + 40 + products[i].description.length * 2;
    if (productWidth > availableWidth) {
      row++;
      cell = 0;
      availableWidth = totalWidth;
    } else {
      availableWidth -= (productWidth - gridPadding);
    }
    productGrid[row] = productGrid[row] || [];
    productGrid[row][cell] = {
      left: (cell === 0 ? gridPadding : (productGrid[row][cell - 1].left +
        productGrid[row][cell - 1].width + gridPadding)), 
      top: (row === 0 ? gridPadding : (productGrid[row - 1][cell].height +
        productGrid[row - 1][cell].top + gridPadding)),
      width: productWidth,
      height: productHeight
    };
    map[i] = productGrid[row][cell];
    cell++;
    i++;
  }
  return map;
}

export default class ProductListView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let products = generateProducts(5);
    let layout = getStackedLayout(products, this.props.templateProps);
    let ProductComponent = this.props.productComponent;
    return (
      <div style={{
        position: "relative"
      }}>
        {ProductComponent && products.map((p, i) => {
          let l = layout[i];
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
                templateProps={extend(this.props.templateProps, {
                  imageWidth: p.imageWidth,
                  imageHeight: p.imageHeight
                })}     
              />
            </div>
          );
        })}  
      </div>
    );
  };
}