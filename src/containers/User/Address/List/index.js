import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as actionCreators from 'actions/user/address';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';

import './index.scss';

@connect(
  state => ({
    data: state.address_list.data,
    isLoading: state.address.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    data: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchAddressList: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchAddressList();
  }

  onAdrressClick = (e) => {
    const { id } = e.currentTarget.dataset;
    const { query } = this.props.location;
    if (!query.next) {
      return false;
    }
    this.context.router.replace(query.next.indexOf('?') > 0 ? `${query.next}&addressId=${id}` : `${query.next}?addressId=${id}`);
    e.preventDefault();
  }

  render() {
    const props = this.props;
    const { children, isLoading, error } = this.props;
    const { query } = this.props.location;
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
        <Header title="收货地址" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
          {isLoading ? <Loader/> : null}
          <ul className="address-list">
            {
              data.map((address, index) => {
                return (
                  <li className="bottom-border row no-margin" key={index}>
                      <div className="col-xs-10 no-padding" data-id={address.id} onClick={this.onAdrressClick}>
                        <p className="text-left font-sm no-margin">
                        <If condition={ address.default }>
                          <span className="font-xxs margin-right-xs address-mark">默认地址</span>
                        </If>
                          <span className="address-font-color">{address.receiver_name}</span>
                          <span className="margin-left-xs address-font-color">{address.receiver_mobile}</span>
                        </p>
                        <p className="font-xs text-left no-margin address-text">{address.receiver_state + address.receiver_city + address.receiver_district + address.receiver_address}</p>
                      </div>
                      <div className="col-xs-2 no-padding margin-top-xxs">
                        <Link className="button button-sm button-light" to={'/user/address/edit/' + address.id + (query.source_type ? '?source_type=' + query.source_type : '')}>编辑</Link>
                      </div>
                  </li>
                );
              })
            }
          </ul>
          <div className="row no-margin">
              <Link className={bindPhoneBtnCls} to="/user/address/edit/0" disabled={false}>添加地址</Link>
          </div>
        </div>
      </div>
    );
  }
}
