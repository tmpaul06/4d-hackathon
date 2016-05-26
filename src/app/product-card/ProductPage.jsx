import DataStore from "../DataStore";
import ProductCardTemplate from "./ProductCardTemplate";
import ProductListView from "./ProductListView";
import ProductGridView from "./ProductGridView";
import React from "react";
import AnimationBar from "components/AnimationBar";
import DataStoreView from "components/DataStoreView";
import ProductCardSideMenu from "./ProductCardSideMenu";
import BindingDroppable from "components/BindingDroppable";
import FuncRegistry from "../FuncRegistry";

const TEMPLATE_TABLE = {
  ProductCardTemplate
};

export default class ProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTemplate: "ProductCardTemplate",
      productDataPath: undefined,
      templateProps: {
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
          {/*<div className="row">
            <div className="six columns">
              <ProductCardTemplate 
              templateProps={this.state.templateProps[this.state.selectedTemplate]}
              onSelect={() => this.setState({ 
                selectedTemplate: "ProductCardTemplate"
              })}/>
            </div>
          </div>*/}
          {this.state.viewType === "list" && (
            <ProductListView
              templateProps={this.state.templateProps[this.state.selectedTemplate]}
              productComponent={TEMPLATE_TABLE[this.state.selectedTemplate]}/>
          )}
          {this.state.viewType === "grid" && (
            <ProductGridView
              templateProps={this.state.templateProps[this.state.selectedTemplate]}
              productComponent={TEMPLATE_TABLE[this.state.selectedTemplate]}/>
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
    templateProps[this.state.selectedTemplate][attr.name] = v;
    this.setState({
      templateProps
    });
  }
}