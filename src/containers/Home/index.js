import React, { Component } from 'react';
import classnames from 'classnames';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Slide } from 'components/Slide';

import './index.scss';

export class Home extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  state = {
    menuActive: false,
  }

  onMenuBtnClick = (e) => {
    this.setState({
      menuActive: this.state.menuActive ? false : true,
    });
  }

  render() {
    const props = this.props;
    const mainCls = classnames({
      ['menu-active']: this.state.menuActive,
    });
    return (
      <div className={mainCls}>
        <Slide />
        <div className="home-container">
          <Header title="小鹿美美" leftIcon="icon-bars" leftBtnClick={this.onMenuBtnClick} />
          <div className="content has-header">
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
