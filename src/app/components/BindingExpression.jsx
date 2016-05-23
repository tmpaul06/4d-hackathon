import React from "react";

function evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function() { return eval(js); }.call(context);
}

export default class BindingExpression extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="slider">
        <input ref="input"/>
        <i onClick={() => this.evaluateExpression()} className="fa fa-check"/>
      </div>
    );
  }

  evaluateExpression() {
    let value = this.refs.input.value;
    evalInContext(value, this.props.shape);
  }
}