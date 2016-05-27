import React from "react";
import { getCoverShape } from "./DescriptionCover";
import { extend } from "utils/ObjectUtils";

function getImagePath(name) {
  return require("assets/images/" + name + ".png");
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
      rotate: 0,
      borderRadius: 30,
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
      <div
        onMouseEnter={() => this.showHideCover()}
        onMouseLeave={() => this.showHideCover()}
        className="product-card-container" style={{
          width: tProps.containerWidth,
          height: tProps.containerHeight,
          overflow: "hidden",
          position: "relative",
          border: this.props.isSelected ? "1px solid #629BCA" : "1px solid #ECECEC",
          boxShadow: this.props.isSelected ? "0px 2px 4px #93AEC3" :  "none"
        }}>
        <div style={{
          position: "absolute",
          left: -400,
          bottom: -tProps.containerHeight * 1.2,
          // top: -tProps.containerHeight,
          width: tProps.containerWidth * 2,
          height: tProps.containerHeight * 1.5,
          transition: "transform 1s ease",
          borderRadius: tProps.borderRadius + "%",
          transform: "rotate(" + this.state.rotate + "deg)" +
            "translateY(" + -this.state.translate + "px)",
          background: "#F7F7F7"
        }}>
        </div>
        <div style={{
          background: this.state.rotate === this.props.templateProps.rotate ?  "none": "rgba(33, 33, 33, 0.1)"
        }}>
          <h4 className="product-title vector-heading">
            {this.props.product.title}
          </h4>
          <img className="product-image"
            style={{
              width: tProps.imageWidth,
              height: tProps.imageHeight,
              background: this.props.isTemplate ? "rgb(214, 214, 214)" : ""
            }}
            src={this.props.isTemplate ? "" : getImagePath(this.props.product.url)}/>
          <div className="product-description vector-desc" style={{
            textAlign: "center"
          }}>
            {this.props.product.caption}
          </div>
        </div>
      </div>
    );
  }
}