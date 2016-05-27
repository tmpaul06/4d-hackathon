import React from "react";

export default class ProductListView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let products = this.props.products || [];
    let ProductComponent = this.props.productComponent;
    return (
      <div className="product-list-container">
        {ProductComponent && products.map((p, i) => {
          return (
            <div key={i} 
              style={{ margin: "15px 0px", 
                width: this.props.templateProps.containerWidth,
                height: this.props.templateProps.containerHeight }}>
              <ProductComponent
                product={p}
                templateProps={this.props.templateProps}     
              />
            </div>
          );
        })}        
      </div>
    );
  };
}