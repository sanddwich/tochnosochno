import React, { Component } from 'react'; // let's also import Component

type RadioButtonState = {};

export class RadioButton extends Component<{}, RadioButtonState> {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    return <p>Radio Button</p>;
  }
}
