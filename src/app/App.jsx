import polyfill from "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import ReactRouter from "react-router";
// import AppRoutes from "./AppRoutes";
import MainCss from "assets/styles/main.less";
import Workspace from "./components/Workspace";
import AppRoutes from "./AppRoutes";

// Needed for React Developer Tools
window.React = React;
ReactDOM.render(AppRoutes, document.getElementById("roam_main"));
