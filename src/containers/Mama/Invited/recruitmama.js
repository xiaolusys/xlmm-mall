import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as recruitAction from 'actions/mama/recruit';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Switch } from 'components/Switch';

import './recruitmama.scss';

const actionCreators = _.extend(recruitAction);

@connect(
  state => ({
    recruit: state.recruit,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class RecruitMama extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    params: React.PropTypes.object,
    recruit: React.PropTypes.any,
    recruitMama: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    nextBtnDisabled: true,
    nextBtnPressed: false,
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {

    if ((nextProps.recruit.success && typeof(nextProps.recruit.data.code) !== 'undefined')
      || (nextProps.recruit.error)) {
      this.setState({ nextBtnPressed: false });
    }

    if (nextProps.recruit.success && nextProps.recruit.data.code === 0) {
      this.context.router.goBack();
    }
    if (nextProps.recruit.success && typeof(nextProps.recruit.data.code) !== 'undefined'
      && nextProps.recruit.data.code !== 0 && this.state.nextBtnPressed) {
      Toast.show(nextProps.recruit.data.info);
    }
    if (nextProps.recruit.success && _.isObject(nextProps.recruit.data) && (nextProps.recruit.data.code === 0)) {
      Toast.show(nextProps.recruit.data.msg);
    }
  }

  onInpuChange = (e) => {
    const value = e.currentTarget.value;
    const inputName = e.currentTarget.name;
    switch (inputName) {
      case 'id':
        this.setState({ mamaid: value });
        break;
      case 'phone':
        this.setState({ phone: value });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  onSaveBntClick = (e) => {
    const id = Number(this.props.params.id);
    console.log(this.state.phone, this.state.mamaid);
    if ((typeof(this.state.phone) !== 'undefined') && this.state.phone.length !== 11) {
      Toast.show('手机号长度不对，请修改！！！');
      e.preventDefault();
      return;
    }

    if ((typeof(this.state.mamaid) !== 'undefined') && isNaN(this.state.mamaid)) {
      Toast.show('妈妈ID不对，请修改！！！');
      e.preventDefault();
      return;
    }
    this.props.recruitMama(this.state.mamaid, this.state.phone);
    this.setState({ nextBtnPressed: true });
    e.preventDefault();
  }

  render() {
    const { mamaid, phone } = this.state;
    const saveBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.nextBtnPressed,
    });

    return (
      <div className="rescruit-content">
        <Header title={'招募妈妈'} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="row no-margin margin-top-xs rescruit-tips"><span>加入精英妈妈，用专业成就事业:</span></div>
        <div className="content no-margin rescruit-info">
          <div className="row no-margin margin-top-xs bottom-border rescruit-item">
            <span className="col-xs-4">邀请妈妈ID</span>
            <input type="number" placeholder="请输入邀请妈妈ID" name="id" value={mamaid} onChange={this.onInpuChange} />
          </div>
          <div className="row no-margin  bottom-border rescruit-item">
            <span className="col-xs-4">妈妈手机</span>
            <input type="number" placeholder="请输入邀请妈妈手机号" name="phone" value={phone} onChange={this.onInpuChange}/>
          </div>
          <div className="row no-margin">
            <button className={saveBtnCls} type="button" onClick={this.onSaveBntClick} disabled={this.state.nextBtnPressed}>确定邀请</button>
          </div>
        </div>
      </div>
    );
  }
}
