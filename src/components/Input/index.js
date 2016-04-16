import React, { Component } from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import './index.scss';

export class Input extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };


  constructor(props) {
    super(props);
  }

  render() {
    return (
     <div>
      <input type="text" />
     </div>
    );
  }
}
