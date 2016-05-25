import React from "react";

function evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function() { return eval(js); }.call(context);
}

function regexMatch(str, regex) {
  let m;
  let matches = [];
  do {
    m = regex.exec(str);
    if (m) {
      matches.push(m[1]);
    }
  } while (m);
  return matches;
}

export default class BindingExpression extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="slider binding-expression">
        <input className="binding-expression-input" ref="input"/>
        <i onClick={() => this.evaluateExpression()} style={{
          float: "none",
          color: "#8BC34A",
          position: "relative",
          right: -60
        }} className="fa fa-check"/>
      </div>
    );
  }

  evaluateExpression() {
    let value = this.refs.input.value;
    let boundVars = this.props.boundVars || [];
    let boundVarMap = {};
    boundVars.forEach(function(v) {
      boundVarMap[v.name] = v.value;
    });
    // Parse the value
    let boundParams = regexMatch(value, /\{(\w+)\}/g);
    // Replace function calls
    let funcCalls = regexMatch(value, /(\w+)\s*\(.*\)/g);
    funcCalls.forEach(function(funcName) {
      value = value.replace(funcName, "funcRegistry." + funcName);
    });
    let obj = {};
    boundParams.forEach(function(p) {
      obj[p] = boundVarMap[p];
      value = value.replace("{" + p + "}", "obj." + p);
    });
    value = new Function("obj", "T", "funcRegistry", "return " + value);
    this.props.onChange(value);
  }
}