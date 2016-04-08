import React, { Component } from 'react';

/* global styles for app */
import './styles/app.scss';

import { Footer } from 'components/Footer';

export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };

  render() {
    return (
      <section>
        {this.props.children}
        <Footer />
      </section>
    );
  }
}
