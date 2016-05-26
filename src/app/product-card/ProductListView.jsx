import React from "react";

let imageArray = [ "bubbles", "rainDrops", "chair" ];

function generateProducts(N) {
  let products = [];
  for (let i = 0; i < N; i++) {
    products.push({
      name: "Product " + i,
      imageSrc: imageArray[i % 3],
      description: "A very fantastic product to use daily"
    });
  }
  return products;
}

export default class ProductListView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let products = generateProducts(5);
    let ProductComponent = this.props.productComponent;
    return (
      <div className="product-list-container">
        {ProductComponent && products.map((p, i) => {
          return (
            <ProductComponent
              key={i}
              product={p}
              templateProps={this.props.templateProps}     
            />
          );
        })}        
      </div>
    );
  };
}