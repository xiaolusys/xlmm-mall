import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as profileAction from 'actions/user/profile';
import * as logoutAction from 'actions/user/logout';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Toast } from 'components/Toast';
import { If } from 'jsx-control-statements';
import classnames from 'classnames';

import './index.scss';

const actionCreators = _.extend(profileAction, logoutAction);

@connect(
  state => ({
    profile: {
      data: state.profile.data,
      isLoading: state.profile.isLoading,
      error: state.profile.error,
      success: state.profile.success,
    },
    logout: {
      data: state.logout.data,
      isLoading: state.logout.isLoading,
      error: state.logout.error,
      success: state.logout.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Profile extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    profile: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchProfile: React.PropTypes.func,
    logout: React.PropTypes.any,
    userLogout: React.PropTypes.func,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchProfile();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.logout.success && nextProps.logout.data.code === 0) {
      Toast.show(nextProps.logout.data.result);
      this.context.router.push('/user/login');
    }
  }

  onLogoutBtnClick = (e) => {
    this.props.userLogout();
  }

  render() {
    const props = this.props;
    const { children, error } = this.props;
    const profile = this.props.profile.data;
    console.log(profile);
    const logoutBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
    });

    return (
      <div>
        <Header title="个人信息" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="has-header content">
          {this.props.profile.isLoading ? <span>loading...</span> : children}
          <ul className="user-info-list">
            <li className="bottom-border row no-margin">
              <a className="font-black" href="/#/user/nickname" >
                <p className="col-xs-6 text-left">账户昵称</p>
                <p className="col-xs-6 text-right">
                  <span>{profile.nick}</span>
                  <i className="icon-angle-right"></i>
                </p>
              </a>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black" href="/#/user/profile/phone">
                <p className="col-xs-6 text-left">绑定手机</p>
                <p className="col-xs-6 text-right">
                  <span>{profile.mobile}</span>
                  <i className="icon-angle-right"></i>
                </p>
              </a>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black" href="/#/user/password/set">
                <p className="col-xs-6 text-left">修改密码</p>
                <p className="col-xs-6 text-right">
                  <i className="icon-angle-right"></i>
                </p>
              </a>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black">
                <p className="col-xs-6 text-left">第三方账户绑定</p>
                <p className="col-xs-6 text-right">
                  <i className="icon-angle-right"></i>
                </p>
              </a>
            </li>
            <li className="bottom-border row no-margin margin-top-xs">
              <a className="font-black" href="/#/user/address">
                <p className="col-xs-6 text-left">地址管理</p>
                <p className="col-xs-6 text-right">
                  <i className="icon-angle-right"></i>
                </p>
              </a>
            </li>
            <li className="bottom-border row no-margin margin-top-xs">
              <a className="font-black">
                <p className="col-xs-6 text-left">清除缓存</p>
                <p className="col-xs-6 text-right">
                  <i className="icon-angle-right no-padding"></i>
                </p>
              </a>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black">
                <p className="col-xs-6 text-left">关于小鹿美美</p>
                <p className="col-xs-6 text-right">
                  <i className="icon-angle-right no-padding"></i>
                </p>
              </a>
            </li>
          </ul>
          <div className="row no-margin">
              <button className={logoutBtnCls} type="button" onClick={this.onLogoutBtnClick}>退出</button>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}
