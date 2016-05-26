import React from "react";

const IMAGE_MAP = {
  bubbles: require("assets/images/bubbles.jpg"),
  chair: require("assets/images/chair.jpg"),
  rainDrops: require("assets/images/rain-drops.jpg")
};

export default class ProductCardTemplate extends React.Component {

  static defaultProps = {
    product: {
      name: "{name}",
      description: "{description}",
      imageSrc: IMAGE_MAP["bubbles"]
    },
    templateProps: {
      imageWidth: 40,
      imageHeight: 40,
      containerWidth: 200,
      containerHeight: 150
    }
  };

  constructor(props) {
    super(props);
  }

  render() {
    let tProps = this.props.templateProps;
    return (
      <div className="product-card-container" style={{
        width: "inherit",
        height: "inherit"
      }}>
        <h4 className="product-title">
          {this.props.product.name}
        </h4>
        <img className="product-image"
          style={{
            width: tProps.imageWidth,
            height: tProps.imageHeight
          }}
          src={IMAGE_MAP[this.props.product.imageSrc]}/>
        <p className="product-description">
          {this.props.product.description}
        </p>
      </div>
    );
  }
}

/*
      <div className="product-card-container" style={{
        width: tProps.containerWidth,
        height: tProps.containerHeight
      }}>
        <h4 className="product-title">
          {this.props.product.name}
        </h4>
        <img className="product-image"
          style={{
            width: tProps.imageWidth,
            height: tProps.imageHeight
          }}
          src={IMAGE_MAP[this.props.product.imageSrc]}/>
        <p style={{
          width: tProps.containerWidth - 30
        }} className="product-description">
          {this.props.product.description}
        </p>
      </div>
 */