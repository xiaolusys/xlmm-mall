import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as provinceAction from 'actions/addressDB/province';
import * as cityAction from 'actions/addressDB/city';
import * as regionAction from 'actions/addressDB/region';
import * as addressAction from 'actions/user/address';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';

import './index.scss';

const actionCreators = _.extend(provinceAction, cityAction, regionAction, addressAction);

@connect(
  state => ({
    province: {
      data: state.province.data,
      isLoading: state.province.isLoading,
      error: state.province.error,
      success: state.province.success,
    },
    city: {
      data: state.city.data,
      isLoading: state.city.isLoading,
      error: state.city.error,
      success: state.city.success,
    },
    region: {
      data: state.region.data,
      isLoading: state.region.isLoading,
      error: state.region.error,
      success: state.region.success,
    },
    address: {
      data: state.address.data,
      isLoading: state.address.isLoading,
      error: state.address.error,
      success: state.address.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Edit extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.object,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchAddress: React.PropTypes.func,
    getProvinces: React.PropTypes.func,
    getCities: React.PropTypes.func,
    getRegions: React.PropTypes.func,
    address: React.PropTypes.any,
    province: React.PropTypes.any,
    city: React.PropTypes.any,
    region: React.PropTypes.any,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    getVerifyCodeBtnDsiabled: true,
    getVerifyCodeBtnPressed: false,
    nextBtnDisabled: true,
    nextBtnPressed: false,
    setPassword: false,
  }

  componentWillMount() {
    this.props.getProvinces();
    this.props.getCities(1);
    this.props.getRegions(2);
    const paramId = this.props.params.id;
    console.log('marams.id:' + paramId);
    if (paramId === '0') {
      this.setState({
        action: {
          title: '新增收货地址',
          type: 'add',
        },
      });
    } else {
      this.props.fetchAddress(paramId);
      this.setState({
        action: {
          title: '修改收货地址',
          type: 'edit',
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      Toast.show(nextProps.data.msg);
    }
    if (nextProps.success && nextProps.data.rcode === 0 && this.state.setPassword) {
      this.context.router.push('/user/address');
    }
  }

  onNameChange = (value) => {

  }

  render() {
    const props = this.props;
    const { action } = this.state;
    const getVerifyCodeBtnCls = classnames({
      ['button button-light button-sm verify-code-button']: 1,
      ['pressed']: this.state.getVerifyCodeBtnPressed,
    });
    const nextBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.nextBtnPressed,
    });
    const bindPhoneBtnCls = classnames({
      ['col-xs-5 col-xs-offset-1  button button-energized text-center']: 1,
      // ['pressed']: this.state.submitBtnPressed,
    });
    const { province, city, region, address } = this.props;
    console.log(province);
    if (!_.isArray(province.data)) {
      province.data = [];
    }
    if (!_.isArray(city.data)) {
      city.data = [];
    }
    if (!_.isArray(region.data)) {
      region.data = [];
    }
    return (
      <div>
        <Header title={action.title} leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="content has-header no-margin">
          <div className="row no-margin margin-top-xs address-detail">
            <span className="col-xs-3 bottom-border">收货人</span>
            <input className="col-xs-9 bottom-border" type="text" placeholder="请输入收货人姓名" value={address.data.receiver_name} onChange={this.onNameChange}/>
          </div>
          <div className="row no-margin address-detail">
            <span className="col-xs-3 bottom-border">手机号</span>
            <input className="col-xs-9 bottom-border" type="number" placeholder="请输入收货人手机号" value={address.data.receiver_mobile} onChange={this.onPhoneChange}/>
          </div>
          <div className="row no-margin margin-top-xs address-detail">
            <span className="col-xs-3 bottom-border">所在地区</span>
            <div className="address-select bottom-border">
              <select className="margin-left-xxs">
                <option value="volvo">选择省份</option>
                {
                  province.data.map((item, index) => {
                    return (
                      <option value= { item.name } id = { item.id } >{ item.name }</option>
                    );
                  })
                }
              </select>
              <select>
                <option value="volvo">选择城市</option>
                {
                  city.data.map((item, index) => {
                    return (
                      <option value= { item.name } id = { item.id } >{ item.name }</option>
                    );
                  })
                }
              </select>
              <select>
                <option value="volvo">选择地区</option>
                {
                  region.data.map((item, index) => {
                    return (
                      <option value= { item.name } id = { item.id } >{ item.name }</option>
                    );
                  })
                }
              </select>
            </div>
          </div>
          <div className="row no-margin address-detail bottom-border">
            <span className="col-xs-3 bottom-border">详细地址</span>
            <input className="col-xs-9 bottom-border" type="text" placeholder="请输入您的详细地址" value={address.data.receiver_address} onChange={this.onDetailAddressChange}/>
          </div>
          <div className="row no-margin margin-top-xs address-detail">
            <span className="col-xs-10 bottom-border">是否设为常用地址</span>
            <div className="address-default-set bottom-border">
              <input type="checkbox" checked={address.data.default}/>
            </div>
          </div>
          <div className="row no-margin">
            <button className={nextBtnCls} type="button" onCdivck={this.onNextBntCdivck} disabled={this.state.nextBtnPressed}>保存</button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
