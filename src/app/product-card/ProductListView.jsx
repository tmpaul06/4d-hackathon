import React from "react";
import { extend } from "utils/ObjectUtils";
import DataStore from "../DataStore";

export default class ProductListView extends React.Component {
  constructor(props) {
    super(props);
  }

  resolveTemplateProps(product, i,  templateProps) {
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
    let ProductComponent = this.props.productComponent;
    return (
      <div className="product-list-container">
        {ProductComponent && products.map((p, i) => {
          let propsForProduct = this.resolveTemplateProps(p, i, this.props.templateProps);
          return (
            <div key={i} 
              style={{ margin: "15px 0px", 
                width: propsForProduct.containerWidth,
                height: propsForProduct.containerHeight }}>
              <ProductComponent
                product={p}
                templateProps={propsForProduct}     
              />
            </div>
          );
        })}        
      </div>
    );
  };
}