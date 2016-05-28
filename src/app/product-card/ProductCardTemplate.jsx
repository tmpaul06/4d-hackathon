import React from "react";
import { getCoverShape } from "./DescriptionCover";
import DataStore from "../DataStore";

function getImagePath(name) {
  if (!name) {
    return "";
  }
  return require("assets/images/" + name + ".jpg");
}

export default class ProductCardTemplate extends React.Component {

  static defaultProps = {
    product: {},
    templateProps: {
      imageWidth: 40,
      imageHeight: 40,
      containerWidth: 200,
      containerHeight: 150,
      binding: {
        title: undefined,
        imageUrl: undefined,
        content: undefined
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  bindObjProperty(bindingKey, e) {
    if (!this.props.isTemplate) {
      return;
    }
    let path = DataStore.path;
    if (path) {
      let pathArr = path.split(".");
      let key = pathArr[pathArr.length - 1];
      this.props.onBinding(bindingKey, key);
    }
  }

  getBindingValue(attribute, tProps, isTemplate) {
    return isTemplate ? ("{" + (tProps.binding[attribute] || attribute) + "}") :
      (this.props.product[tProps.binding[attribute]]);
  }

  render() {
    let tProps = this.props.templateProps;
    let isTemplate = this.props.isTemplate;
    (this.props.product[tProps.binding.title]);
    return (
      <div className="product-card-container" style={{
        width: "inherit",
        height: "inherit",
        border: this.props.isSelected ? "1px solid #629BCA" : "1px solid #ECECEC",
        boxShadow: this.props.isSelected ? "0px 2px 4px #93AEC3" :  "none"
      }}>
        <h4 className="product-title" onClick={(e) => this.bindObjProperty("title", e)}>
          {this.getBindingValue("title", tProps, isTemplate)}
        </h4>
        <div onClick={(e) => this.bindObjProperty("imageUrl", e)} className="product-image template1"
          style={{
            width: tProps.imageWidth,
            height: tProps.imageHeight,
            background: (isTemplate ? (tProps.binding.imageUrl ? "rgb(107, 107, 107)" : "rgb(214, 214, 214)") : (tProps.binding["imageUrl"] ? ("url(" + getImagePath(this.props.product[tProps.binding.imageUrl]) + ")") : "#000")),
            border: (isTemplate ? "1px solid #ddd" : "none")
          }}/>
        <p className="product-description" onClick={(e) => this.bindObjProperty("content", e)}>
          {this.getBindingValue("content", tProps, isTemplate)}
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