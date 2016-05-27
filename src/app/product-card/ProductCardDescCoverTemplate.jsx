import React from "react";
import { getCoverShape } from "./DescriptionCover";
import { extend } from "utils/ObjectUtils";

function getImagePath(name) {
  return require("assets/images/" + name + ".jpg");
}

export default class ProductCardDescCoverTemplate extends React.Component {

  static defaultProps = {
    product: {
      name: "{name}",
      description: "{description}",
      imageSrc: "bubbles"
    },
    templateProps: {
      imageWidth: 40,
      imageHeight: 40,
      containerWidth: 200,
      containerHeight: 150,
      rotate: 15,
      translate: 100
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      rotate: props.templateProps.rotate,
      translate : props.templateProps.translate
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.templateProps) {
      this.setState({
        rotate: nextProps.templateProps.rotate
      });
    }
    if (nextProps.templateProps) {
      this.setState({
        translate: nextProps.templateProps.translate
      });
    }
  }

  showHideCover() {
    this.setState({
      rotate: this.state.rotate === this.props.templateProps.rotate ? 0 : this.props.templateProps.rotate,
      translate: this.state.translate === this.props.templateProps.translate ? -700 : this.props.templateProps.translate
    });
  }

  render() {
    let tProps = this.props.templateProps;
    return (
      <div onMouseEnter={() => this.showHideCover()}
        onMouseLeave={() => this.showHideCover()}
        className="product-card-container" style={{
          width: tProps.containerWidth,
          height: tProps.containerHeight,
          overflow: "hidden",
          position: "relative"
        }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: -tProps.containerHeight,
          width: tProps.containerWidth * 2,
          height: tProps.containerHeight * 1.5,
          transition: "transform 1s ease",
          transform: "rotate(" + this.state.rotate + "deg)" +
            "translateY(" + this.state.translate + "px)",
          background: "#FEFEFE"
        }}/>
        <h4 className="product-title">
          {this.props.product.name}
        </h4>
        <img className="product-image"
          style={{
            width: tProps.imageWidth,
            height: tProps.imageHeight
          }}
          src={getImagePath(this.props.product.imageSrc)}/>
        <div className="product-description">
          {this.props.product.description}
        </div>
      </div>
    );
  }
}