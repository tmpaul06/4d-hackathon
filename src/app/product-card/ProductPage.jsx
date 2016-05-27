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
          imageWidth: 220,
          imageHeight: 220,
          containerWidth: 390,
          containerHeight: 470,
          borderRadius: 30,
          rotate: 15,
          translate: 20
        },
        ProductCardTemplate: {
          imageWidth: 220,
          imageHeight: 220,
          containerWidth: 390,
          containerHeight: 470,
          binding: {
            title: undefined,
            imageUrl: undefined,
            content: undefined
          }
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
        <DataStoreView/>
        <div className="product-page">
          {
            /*
              Render each template
             */
          }
          <div>
            <h4>TEMPLATES</h4>
            <span className={"product-page-tab " + (this.state.viewType === "list" ? "selected" : "")}
              onClick={() => this.setState({
              viewType: "list"
            })}>List View</span>
            <span className={"product-page-tab " + (this.state.viewType === "grid" ? "selected" : "")} onClick={() => this.setState({
              viewType: "grid"
            })}>Grid View</span>
          </div>
          <div className="row" style={{
            margin: "20px 0px"
          }}>
            <div className="six columns">
              <span onClick={() => this.setState({ 
                selectedTemplate: "ProductCardTemplate"
              })}>
              <ProductCardTemplate 
                isTemplate={true}
                isSelected={this.state.selectedTemplate === "ProductCardTemplate"}
                onBinding={(a, k) => this.setTemplateBinding("ProductCardTemplate", a, k)}
                templateProps={
                this.state.templateProps["ProductCardTemplate"]
              }/>
              </span>
            </div>
            <div className="six columns">
              <span onClick={() => this.setState({ 
                selectedTemplate: "ProductCardDescCoverTemplate"
              })}>
              <ProductCardDescCoverTemplate
                isTemplate={true}
                isSelected={this.state.selectedTemplate === "ProductCardDescCoverTemplate"}
                templateProps={
                  this.state.templateProps["ProductCardDescCoverTemplate"]
                }
              />
              </span>
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

  setTemplateBinding(template, attr, key) {
    let templateProps = this.state.templateProps;
    let props = templateProps[this.state.selectedTemplate];
    props.binding[attr] = key;
    templateProps[this.state.selectedTemplate] = props;
    this.setState({
      templateProps
    });  
  }
}