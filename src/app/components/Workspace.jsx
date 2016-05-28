import React from "react";
import SceneryPage from "scenery/SceneryPage";
import ProductPage from "product-card/ProductPage";
import DataStore from "../DataStore";

import {
  Appear, BlockQuote, Cite, CodePane, Code, Deck, Fill, Fit,
  Heading, Image, Layout, ListItem, List,Link, Quote, Spectacle, Slide, Text
} from "spectacle";
require("normalize.css");
require("spectacle/lib/themes/default/index.css");
import preloader from "spectacle/lib/utils/preloader";
import createTheme from "spectacle/lib/themes/default";

const theme = createTheme({
  primary: "#ff4081",
  display: "block"
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
          <Slide transition={[ "zoom" ]} bgColor="primary">
            <Heading size={1} caps lineHeight={2} textColor="black">
              4D
            </Heading>
            <Heading size={2} fit caps textColor="white">
              Data Driven Dynamic Design
            </Heading>
          </Slide>
          <Slide transition={[ "fade" ]} bgColor="secondary" textColor="primary" >
            <Heading size={1} caps textColor="white">
              What ?
            </Heading>
            <List>
              <Appear><ListItem>Design Component : Look & Behaviour</ListItem></Appear>
            </List>
            <List>
              <Appear><ListItem>Data Driven</ListItem></Appear>
            </List>
            <List>
              <Appear><ListItem>Reusable and Composable</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
            <Heading size={1} caps textColor="white">
              Why ?
            </Heading>
            <List>
              <Appear><ListItem>Expose</ListItem></Appear>
            </List>
            <List>
              <Appear><ListItem>Experiment</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
            <Heading size={1} caps textColor="white">
              Expose
            </Heading>
            <List>
              <Appear><ListItem>Point 1</ListItem></Appear>
            </List>
            <List>
              <Appear><ListItem>Point 2</ListItem></Appear>
            </List>
            <List>
              <Appear><ListItem>Point 3</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
            <Heading size={1} caps textColor="white">
              Explore
            </Heading>
            <List>
              <Appear><ListItem>Point 1</ListItem></Appear>
            </List>
            <List>
              <Appear><ListItem>Point 2</ListItem></Appear>
            </List>
            <List>
              <Appear><ListItem>Point 3</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={[ "fade" ]} bgColor="secondary" textColor="primary">
            <Heading size={1} caps textColor="white">
              Experiment
            </Heading>
            <List>
              <Appear><ListItem>Point 1</ListItem></Appear>
            </List>
            <List>
              <Appear><ListItem>Point 2</ListItem></Appear>
            </List>
            <List>
              <Appear><ListItem>Point 3</ListItem></Appear>
            </List>
          </Slide>
        </Deck>
      </Spectacle>);
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
