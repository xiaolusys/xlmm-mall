import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/user/users';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

import './index.scss';

@connect(
  state => ({
    data: state.users.data,
    isLoading: state.users.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class UserInfo extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchUsers: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchUsers();
  }

  render() {
    const props = this.props;
    const { children, data, isLoading, error } = this.props;
    let user = {};
    if (data && data.results) {
      user = data.results[0];
    }
    return (
      <div>
        <Header title="个人信息" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="has-header content">
        {isLoading ? <span>loading...</span> : children}
          <ul className="user-info-list">
            <li className="bottom-border row no-margin">
              <p className="col-xs-4">头像</p>
              {
                if(user.thumbnail == '') {

                }else {

                }
              }
              <i className="col-xs-1 icon-angle-right"></i>
            </li>
            <li className="bottom-border row no-margin">
              <p className="col-xs-4">昵称</p>
              <p className="col-xs-7 text-right">{user.nick}</p>
              <i className="col-xs-1 icon-angle-right"></i>
            </li>
            <li className="bottom-border row no-margin">
              <p className="col-xs-4">绑定手机</p>
              <p className="col-xs-7 text-right">{user.mobile}</p>
              <i className="col-xs-1 icon-angle-right"></i>
            </li>
            <li className="bottom-border row no-margin">
              <p className="col-xs-4">修改密码</p>
              <p className="col-xs-7 text-right"></p>
              <i className="col-xs-1 icon-angle-right"></i>
            </li>
            <li className="bottom-border row no-margin">
              <p className="col-xs-4">地址管理</p>
              <p className="col-xs-7 text-right"></p>
              <i className="col-xs-1 icon-angle-right"></i>
            </li>
            <li className="bottom-border row no-margin">
              <p className="col-xs-4">设置</p>
              <p className="col-xs-7 text-right"></p>
              <i className="col-xs-1 icon-angle-right"></i>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black">
                <p className="col-xs-4">退出账户</p>
                <p className="col-xs-7 text-right"></p>
                <i className="col-xs-1 icon-angle-right"></i>
              </a>
            </li>
        </ul>
        <Footer/>
        </div>
      </div>
    );
  }
}
