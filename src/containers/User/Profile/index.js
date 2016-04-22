import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/user/profile';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { If } from 'jsx-control-statements';
import classnames from 'classnames';

import './index.scss';

@connect(
  state => ({
    data: state.profile.data,
    isLoading: state.profile.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Profile extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchProfile: React.PropTypes.func,
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

  onLogoutBtnClick = (e) => {

  }

  render() {
    const props = this.props;
    const { children, data, isLoading, error } = this.props;
    const logoutBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
    });
    console.log(data);

    return (
      <div>
        <Header title="个人信息" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="has-header content">
        {isLoading ? <span>loading...</span> : children}
          <ul className="user-info-list">
            <li className="bottom-border row no-margin">
              <a className="font-black">
                <p className="col-xs-4">头像</p>
                <If condition={data.thumbnail}>
                <div className="col-xs-7 text-right">
                  <img className="avatar" src={data.thumbnail}/>
                </div>
                </If>
                <If condition={!data.thumbnail}>
                  <div className="col-xs-7 text-right">
                    <i className="icon-xiaolu icon-2x"></i>
                  </div>
                </If>
                <i className="col-xs-1 icon-angle-right"></i>
              </a>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black">
                <p className="col-xs-4">账户昵称</p>
                <p className="col-xs-7 text-right">{data.nick}</p>
                <i className="col-xs-1 icon-angle-right"></i>
              </a>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black">
                <p className="col-xs-4">绑定手机</p>
                <p className="col-xs-7 text-right">{data.mobile}</p>
                <i className="col-xs-1 icon-angle-right"></i>
              </a>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black">
                <p className="col-xs-4">修改密码</p>
                <p className="col-xs-7 text-right"></p>
                <i className="col-xs-1 icon-angle-right"></i>
              </a>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black">
                <p className="col-xs-4">第三方账户绑定</p>
                <p className="col-xs-7 text-right"></p>
                <i className="col-xs-1 icon-angle-right"></i>
              </a>
            </li>
            <li className="bottom-border row no-margin">
              <a className="font-black">
                <p className="col-xs-4">地址管理</p>
                <p className="col-xs-7 text-right"></p>
                <i className="col-xs-1 icon-angle-right"></i>
              </a>
            </li>
            <li className="bottom-border row no-margin margin-top-xs">
              <a className="font-black">
                <p className="col-xs-4">设置</p>
                <p className="col-xs-7 text-right"></p>
                <i className="col-xs-1 icon-angle-right"></i>
              </a>
            </li>
            <li className="bottom-border row no-margin margin-top-xs">
              <a className="font-black">
                <p className="col-xs-4">关于小鹿美美</p>
                <p className="col-xs-7 text-right"></p>
                <i className="col-xs-1 icon-angle-right"></i>
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
