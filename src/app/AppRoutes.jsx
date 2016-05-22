import React from "react"; // eslint-disable-line
import { Router, Route, IndexRoute } from "react-router";
import useScroll from "scroll-behavior/lib/useStandardScroll";
import createHistory from "history/lib/createBrowserHistory";
import Workspace from "./components/Workspace";

const history = useScroll(createHistory)();

export default (
  <Router history={history}>
    <Route path="/" component={Workspace}></Route>
  </Router>
);
