import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as addressAction from 'actions/user/address';
import * as provinceAction from 'actions/user/province';
import * as cityAction from 'actions/user/city';
import * as districtAction from 'actions/user/district';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Switch } from 'components/Switch';
import * as utils from 'utils';

import './index.scss';

const actionCreators = _.extend(provinceAction, cityAction, districtAction, addressAction);
const requestAction = {
  create: 'create_address',
  update: 'update',
};

@connect(
  state => ({
    province: {
      data: state.province.data,
      isLoading: state.province.isLoading,
      error: state.province.error,
      success: state.province.success,
    },
    city: {
      data: state.city.data ? state.city.data.data : [],
      isLoading: state.city.isLoading,
      error: state.city.error,
      success: state.city.success,
    },
    district: {
      data: state.district.data.data,
      isLoading: state.district.isLoading,
      error: state.district.error,
      success: state.district.success,
    },
    address: {
      data: state.address.data,
      isLoading: state.address.isLoading,
      error: state.address.error,
      success: state.address.success,
    },
    deleteAddress: {
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
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchAddress: React.PropTypes.func,
    updateAddress: React.PropTypes.func,
    deleteAddress: React.PropTypes.func,
    fetchProvinces: React.PropTypes.func,
    fetchCities: React.PropTypes.func,
    fetchDistricts: React.PropTypes.func,
    address: React.PropTypes.any,
    province: React.PropTypes.any,
    city: React.PropTypes.any,
    district: React.PropTypes.any,
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
    address: this.props.address.data,
  }

  componentWillMount() {
    const id = Number(this.props.params.id);
    if (id !== 0) {
      this.props.fetchAddress(id, true);
    } else {
      this.props.fetchProvinces();
    }
  }

  componentWillReceiveProps(nextProps) {
    let selectedCity = {};
    let selectedProvince = {};
    let selecteDistrict = {};

    if ((nextProps.address.success && typeof(nextProps.address.data.code) !== 'undefined')
      || (nextProps.address.error)) {
      this.setState({ nextBtnPressed: false });
    }

    if (nextProps.address.success && nextProps.address.data.code === 0) {
      this.context.router.goBack();
    }
    if (nextProps.address.success && typeof(nextProps.address.data.code) !== 'undefined'
      && nextProps.address.data.code !== 0 && this.state.nextBtnPressed) {
      Toast.show(nextProps.address.data.info);
    }
    if (nextProps.address.success && _.isObject(nextProps.address.data) && (nextProps.address.data.code === 0)) {
      // fuck,删除是msg，update是info,server has some question
      Toast.show(nextProps.address.data.msg);
    }

    if (nextProps.province.success) {
      // 第一次是使用后台查出来的省，如果后面有修改，要用state里面的省
      let province = '';
      if (this.state.address.receiver_state) {
        province = this.state.address.receiver_state;
      } else {
        province = nextProps.address.data.receiver_state;
      }

      _.each(nextProps.province.data, (item, index) => {

        if (province && province.indexOf(item.name) >= 0) {
          selectedProvince = { receiver_state: item.name, receiverStateId: item.id };
        }
      });

    }

    if (nextProps.city.success) {

      _.each(nextProps.city.data, (item, index) => {
        if (nextProps.address.data.receiver_city && nextProps.address.data.receiver_city.indexOf(item.name) >= 0) {
          selectedCity = { receiver_city: item.name, receiverCityId: item.id };
        }
      });

    }

    if (nextProps.district.success) {

      _.each(nextProps.district.data, (item, index) => {
        if (nextProps.address.data.receiver_district && nextProps.address.data.receiver_district.indexOf(item.name) >= 0) {
          selecteDistrict = { receiver_district: item.name, receiverDistrictId: item.id };
        }
      });
    }
    if (nextProps.address.success && nextProps.province.success && nextProps.city.success && nextProps.district.success) {
      this.setState({ address: _.extend({}, this.state.address, nextProps.address.data, selectedProvince, selectedCity, selecteDistrict) });
    }
  }

  onDeleteClick = (e) => {
    this.props.deleteAddress(this.state.address.id);
  }

  onInpuChange = (e) => {
    const value = e.currentTarget.value;
    const inputName = e.currentTarget.name;
    switch (inputName) {
      case 'name':
        this.setState({ address: _.extend({}, this.state.address, { receiver_name: value }) });
        break;
      case 'phone':
        this.setState({ address: _.extend({}, this.state.address, { receiver_mobile: value }) });
        break;
      case 'address':
        this.setState({ address: _.extend({}, this.state.address, { receiver_address: value }) });
        break;
      case 'identification':
        this.setState({ address: _.extend({}, this.state.address, { identification_no: value }) });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  onSelectChange = (e) => {
    const value = Number(e.currentTarget.value);
    const label = e.currentTarget.selectedOptions[0].label;
    const selectName = e.currentTarget.name;

    if (typeof(label) === 'undefined') {
      return;
    } else if (label === '选择省份' || label === '选择城市' || label === '选择地区') {
      return;
    }

    switch (selectName) {
      case 'province':
        this.setState({ address: _.extend({}, this.state.address, { receiver_state: label, receiverStateId: value }) });
        this.props.fetchCities(value);
        break;
      case 'city':
        this.setState({ address: _.extend({}, this.state.address, { receiver_city: label, receiverCityId: value }) });
        this.props.fetchDistricts(value);
        break;
      case 'region':
        this.setState({ address: _.extend({}, this.state.address, { receiver_district: label, receiverDistrictId: value }) });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  onSwitchChange = (value) => {
    this.setState({ address: _.extend({}, this.state.address, { default: value }) });
  }

  onSaveBntClick = (e) => {
    const id = Number(this.props.params.id);
    const sourceType = this.props.location.query ? Number(this.props.location.query.source_type) : 0;

    if ((typeof(this.state.address.receiver_mobile) !== 'undefined') && this.state.address.receiver_mobile.length !== 11) {
      Toast.show('手机号长度不对，请修改！！！');
      e.preventDefault();
      return;
    }

    if (sourceType > 1) {
      console.log(this.state.address.identification_no);
      if (typeof(this.state.address.identification_no) === 'undefined') {
        Toast.show('身份证号不能为空，请修改！！！');
        return;
      }
      if (this.state.address.identification_no.length !== 18) {
        Toast.show('身份证号长度不对，请修改！！！');
        return;
      }

      const result = utils.identityCodeValid(this.state.address.identification_no);
      if (!result.result) {
        Toast.show(result.info);
        return;
      }
    }

    if (id === 0) {
      this.props.updateAddress(null, requestAction.create, this.state.address);
    } else {
      this.props.updateAddress(id, requestAction.update, this.state.address);
    }
    this.setState({ nextBtnPressed: true });
    e.preventDefault();
  }

  renderProvince() {
    const { province } = this.props;
    if (!_.isArray(province.data)) {
      province.data = [];
    }
    return (
      <select className="col-xs-4 no-padding" name="province" value={this.state.address.receiverStateId} onChange={this.onSelectChange}>
        <option value="选择省份" id="0">选择省份</option>
        {province.data.map((item, index) => {
          return (
            <option value={item.id} key={item.id}>{item.name}</option>
          );
        })}
      </select>
    );
  }

  renderCity() {
    const { city } = this.props;
    if (!_.isArray(city.data)) {
      city.data = [];
    }

    return (
      <select className="col-xs-4 no-padding" name="city" value={this.state.address.receiverCityId} onChange={this.onSelectChange}>
        <option value="选择城市" id="0">选择城市</option>
        {city.data.map((item, index) => {
            return (
              <option value={item.id} key={item.id} key={item.id}>{ item.name }</option>
            );
          })}
      </select>
    );
  }

  renderRegion() {
    const { district } = this.props;
    if (!_.isArray(district.data)) {
      district.data = [];
    }

    return (
      <select className="col-xs-4 no-padding" name="region" value={this.state.address.receiverDistrictId} onChange={this.onSelectChange}>
        <option value="选择地区" id="0">选择地区</option>
        {district.data.map((item, index) => {
            return (
              <option value={item.id} key={item.id} key={item.id}>{item.name}</option>
            );
          })}
      </select>
    );
  }

  render() {
    const { address } = this.state;
    const id = Number(this.props.params.id);
    const saveBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.nextBtnPressed,
    });
    const sourceType = this.props.location.query ? Number(this.props.location.query.source_type) : false;

    return (
      <div>
        <Header title={id === 0 ? '新增收货地址' : '修改收货地址'} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} rightText={id === 0 ? '' : '删除'} onRightBtnClick={this.onDeleteClick} />
        <div className="content no-margin adddress-edit">
          <div className="row no-margin margin-top-xs bottom-border adddress-item">
            <span className="col-xs-4">收货人</span>
            <input type="text" placeholder="请输入收货人姓名" name="name" value={address.receiver_name} onChange={this.onInpuChange} />
          </div>
          <div className="row no-margin  bottom-border adddress-item">
            <span className="col-xs-4">手机号</span>
            <input type="number" placeholder="请输入收货人手机号" name="phone" value={address.receiver_mobile} onChange={this.onInpuChange}/>
          </div>
          <div className="row no-margin bottom-border margin-top-xs adddress-item">
            <span className="col-xs-4">所在地区</span>
            <div className="address-select col-xs-8 no-padding region-at">
              {this.renderProvince()}
              {this.renderCity()}
              {this.renderRegion()}
            </div>
          </div>
          <div className="row no-margin bottom-border adddress-item">
            <span className="col-xs-4">详细地址</span>
            <input type="text" placeholder="请输入您的详细地址" name="address" value={address.receiver_address} onChange={this.onInpuChange}/>
          </div>
          <If condition={ sourceType > 1 }>
            <div className="row no-margin bottom-border adddress-item">
              <span className="col-xs-4">身份证号码</span>
              <input type="text" placeholder="请输入收货人的身份证" name="identification" value={address.identification_no} onChange={this.onInpuChange}/>
            </div>
            <div className="row no-margin bottom-border tips-item">
              <span className="font-xs font-red">温馨提示：订单中包含进口保税区发货商品，根据海关监管要求，需要提供收货人身份证号码，身份证号码必须和收货人一致。此信息加密保存，只用于此订单海关通关。</span>
            </div>
          </If>
          <div className="row no-margin bottom-border margin-top-xs adddress-item">
            <span className="col-xs-9">是否设为默认地址</span>
            <div className="col-xs-3">
              <Switch checked={address.default} value={address.default} onChange={this.onSwitchChange}/>
            </div>
          </div>
          <div className="row no-margin">
            <button className={saveBtnCls} type="button" onClick={this.onSaveBntClick} disabled={this.state.nextBtnPressed}>保存</button>
          </div>
        </div>
      </div>
    );
  }
}
