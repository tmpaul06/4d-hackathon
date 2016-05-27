import React from "react";
import SceneryPage from "scenery/SceneryPage";
import ProductPage from "product-card/ProductPage";
import DataStore from "../DataStore";

import {
  Appear, BlockQuote, Cite, CodePane, Code, Deck, Fill, Fit,
  Heading, Image, Layout, ListItem, List, Quote, Spectacle, Slide, Text
} from "spectacle";
require("normalize.css");
require("spectacle/lib/themes/default/index.css");

import createTheme from "spectacle/lib/themes/default";

const theme = createTheme({
  primary: "#dddddd"
});

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      childrenLength: 3
    };
  }

  render() {
    let styles = this.getStyle();
    let children = [ <SceneryPage />, <ProductPage /> ];
    return (
      <Spectacle theme={theme}>
        <Deck transitionDuration={500} >
            {children.length > 0 && children.map((item, index) => {
              return (
                <Slide key={index} transition={[ "slide" ]} bgColor="primary" className="stupid">
                    {item}
                </Slide>);
            })}
        </Deck>
      </Spectacle>
    );
  }

  assignIndentation(index, componentStyle) {
    if(index === this.state.activeIndex) {
      componentStyle["left"] = 0;
    } else {
      componentStyle["left"] = index * screen.width;
    }
  }

  getStyle() {
    return {
      component: {
        position: "absolute"
      }
    };
  }
}
