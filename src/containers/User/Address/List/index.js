import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as actionCreators from 'actions/user/address';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

import './index.scss';

@connect(
  state => ({
    data: state.address.data,
    isLoading: state.address.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchAddress: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchAddress();
  }

  render() {
    const props = this.props;
    const { children, isLoading, error } = this.props;
    const bindPhoneBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized text-center']: 1,
      // ['pressed']: this.state.submitBtnPressed,
    });
    let { data } = this.props;
    if (!_.isArray(data)) {
      data = [];
    }
    return (
      <div>
        <Header title="收货地址" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="has-header content">
          {isLoading ? <span>loading...</span> : children}
          <ul className="address-list">
            {
              data.map((addr, index) => {
                return (
                  <li className="bottom-border row no-margin" key={index}>
                    <a className="font-black" href={ '/#/user/address/edit/' + addr.id }>
                      <div className="col-xs-11">
                        <p className="text-left font-sm no-margin">
                        <If condition={ addr.default }>
                          <span className="font-xxs margin-right-xs sp-1">默认地址</span>
                        </If>
                          <span className="sp-2">{addr.receiver_name}</span>
                          <span className="margin-left-xs sp-2">{addr.receiver_mobile}</span>
                        </p>
                        <p className="font-xs text-left no-margin sp-3">{addr.receiver_state + addr.receiver_city + addr.receiver_district + addr.receiver_address}</p>
                      </div>
                      <i className="icon-angle-right"></i>
                    </a>
                  </li>
                );
              })
            }
          </ul>
          <div className="row no-margin">
              <a className={bindPhoneBtnCls} href="/#/user/address/edit" disabled={false}>添加地址</a>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}
