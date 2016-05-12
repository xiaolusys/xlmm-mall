import React from 'react';
import ReactDOM from 'react-dom';
import FadingCircle from '../FadingCircle';

import './index.scss';

export default class LoadingSpinner {

  constructor() {
    this.prefixCls = 'loading-spinner';
    this.container = document.querySelector('#widget');
  }

  show() {
    ReactDOM.render(
      <div className={`${this.prefixCls}`}>
        <div className="spinner">
          <FadingCircle/>
        </div>
      </div>,
      this.container
    );
  }

  hide() {
    ReactDOM.unmountComponentAtNode(this.container);
  }
}
