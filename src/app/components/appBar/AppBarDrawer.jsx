import React from "react";
import ReactDOM from "react-dom";
import ReactShared from "@roam/react-shared";
import { Link } from "react-router";

let { BaseComponent, SearchBar, AppBar, AutoCompleter } = ReactShared;
let { StyleUtils } = ReactShared.Utils;

class AppBarDrawer extends BaseComponent {

  // ***********************************************
  // Constructors
  // ***********************************************
  constructor(props) {
    super(props, { "bind" : true });
    this.state = this._getState();
    this.stringTermHash = {};
  }

  render() {
    let styles = this.props.theme;
    let searchStyles = this.getSearchInputStyles();
    styles = StyleUtils.merge(styles, this.props.styles || {});

    return (
      <div>
        <AppBar style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "none"
        }}>
          <div className="container row" style={{ height: "100%" }}>
            <div className="two columns">
              <Link to="/"><img src={ require("../../../assets/images/logo2.png") } style={searchStyles.appLogo} /></Link>
            </div>
            <div className="eight columns"></div>
            <div className="two columns"></div>
          </div>
        </AppBar>

      </div>
    );
  }

  // ***********************************************
  // Private methods, event handlers
  // ***********************************************
  getSearchInputStyles() {
    return {
      appLogo: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        height: "35px"
      }
    };
  }

  _getState() {
    return {
      user: {
        isLoggedIn: true,
        orgId: "AAAA",
        isAdmin: true,
        isSuperAdmin: false,
        username: "KG-DEMO",
        firstName: "KG",
        lastName: "DEMO"
      },
      matches: []
    };
  }
}

AppBarDrawer.contextTypes = {
  theme: React.PropTypes.object
};

export default AppBarDrawer;
