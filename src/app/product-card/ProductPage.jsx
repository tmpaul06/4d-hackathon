import DataStore from "../DataStore";
import ProductCardTemplate from "./ProductCardTemplate";
import ProductListView from "./ProductListView";
import ProductGridView from "./ProductGridView";
import React from "react";
import AnimationBar from "components/AnimationBar";
import DataStoreView from "components/DataStoreView";
import ProductCardSideMenu from "./ProductCardSideMenu";
import BindingDroppable from "components/BindingDroppable";
import ListBindingDroppable from "./ListBindingDroppable";
import FuncRegistry from "../FuncRegistry";
import ProductCardDescCoverTemplate from "./ProductCardDescCoverTemplate";

const TEMPLATE_TABLE = {
  ProductCardTemplate,
  ProductCardDescCoverTemplate
};

export default class ProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTemplate: "ProductCardTemplate",
      productDataPath: undefined,
      templateProps: {
        ProductCardDescCoverTemplate: {
          imageWidth: 50,
          imageHeight: 50,
          containerWidth: 200,
          containerHeight: 150,
          rotate: 15,
          translate: 20
        },
        ProductCardTemplate: {
          imageWidth: 50,
          imageHeight: 50,
          containerWidth: 200,
          containerHeight: 150
        }
      }
    };
    DataStore.callback = () => {
      this.forceUpdate();
    };
  }

  getProducts(path) {
    let products = DataStore.get(path);
    return products || [];
  }

  render() {
    return (
      <div>
        <AnimationBar/>
        <DataStoreView/>
        <div className="product-page">
          {
            /*
              Render each template
             */
          }
          <div>
            <h4>TEMPLATES</h4>
            <span onClick={() => this.setState({
              viewType: "list"
            })}>List View</span>
            <span onClick={() => this.setState({
              viewType: "grid"
            })}>Grid View</span>
          </div>
          <div className="row">
            <div className="six columns">
              <span onClick={() => this.setState({ 
                selectedTemplate: "ProductCardTemplate"
              })}>Template 1</span>
              <span onClick={() => this.setState({ 
                selectedTemplate: "ProductCardDescCoverTemplate"
              })}>Template 2</span>
            </div>
          </div>
          {this.state.viewType === "list" && (
            <ListBindingDroppable>
              <ProductListView
                templateProps={this.state.templateProps[this.state.selectedTemplate]}
                productComponent={TEMPLATE_TABLE[this.state.selectedTemplate]}/>
            </ListBindingDroppable>
          )}
          {this.state.viewType === "grid" && (
            <ListBindingDroppable>
              <ProductGridView
                templateProps={this.state.templateProps[this.state.selectedTemplate]}
                productComponent={TEMPLATE_TABLE[this.state.selectedTemplate]}/>
            </ListBindingDroppable>
          )}
          {
            /*
              SideMenu
             */
          }
          <div className="sidemenu">
            <BindingDroppable>
              <ProductCardSideMenu
                attrValueChange={this.handleAttrValueChange.bind(this)}
                templateProps={this.state.templateProps[this.state.selectedTemplate]}/>
            </BindingDroppable>
          </div>
        </div>
      </div>
    );
  }

  handleAttrValueChange(attr, v) {
    let templateProps = this.state.templateProps;
    let props = templateProps[this.state.selectedTemplate];
    props[attr.name] = v;
    templateProps[this.state.selectedTemplate] = props;
    this.setState({
      templateProps
    });
  }
}