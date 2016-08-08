import React, { Component } from 'react';
import { Link } from 'react-router';

import './index.scss';

export class Favorite extends Component {

  render() {
    return (<Link className="favorite" to="/favorite/list"><i className="icon-favorite-no icon-yellow"></i></Link>);
  }
}
