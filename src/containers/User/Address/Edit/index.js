import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as provinceAction from 'actions/address/province';
import * as cityAction from 'actions/address/city';
import * as regionAction from 'actions/address/region';
import * as addressAction from 'actions/user/address';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Toast } from 'components/Toast';
import { Switch } from 'components/Switch';

import './index.scss';

const actionCreators = _.extend(provinceAction, cityAction, regionAction, addressAction);
const requestAction = {
  delete: 'delete_address',
  changeDefault: 'change_default',
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
      data: state.city.data.data,
      isLoading: state.city.isLoading,
      error: state.city.error,
      success: state.city.success,
    },
    region: {
      data: state.region.data.data,
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
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchAddress: React.PropTypes.func,
    createAddress: React.PropTypes.func,
    updateAddress: React.PropTypes.func,
    fetchProvinces: React.PropTypes.func,
    fetchCities: React.PropTypes.func,
    fetchRegions: React.PropTypes.func,
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
    nextBtnDisabled: true,
    nextBtnPressed: false,
    address: this.props.address.data,
  }

  componentWillMount() {
    const id = Number(this.props.params.id);
    if (id !== 0) {
      this.props.fetchAddress(id);
    }
    this.props.fetchProvinces();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address.success && _.isObject(nextProps.address.data) && _.isNumber(nextProps.address.data.code)) {
      Toast.show(nextProps.address.data.info);
    } else if (nextProps.address.success && _.isObject(nextProps.address.data) && !_.isNumber(nextProps.address.data.code)) {
      this.setState({ address: nextProps.address.data });
    }
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
      default:
        break;
    }
    e.preventDefault();
  }

  onSelectChange = (e) => {
    const value = e.currentTarget.value;
    const selectName = e.currentTarget.name;
    switch (selectName) {
      case 'province':
        this.setState({ province: _.extend({}, this.state.province, { receiver_state: value }) });
        this.props.fetchCities(value);
        break;
      case 'city':
        this.setState({ city: _.extend({}, this.state.city, { receiver_city: value }) });
        this.props.fetchRegions(value);
        break;
      case 'region':
        this.setState({ region: _.extend({}, this.state.region, { receiver_district: value }) });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  onSwitchChange = (e) => {
    const value = e.currentTarget.value;
    this.setState({ region: _.extend({}, this.state.region, { default: value }) });
    e.preventDefault();
  }

  onSaveBntClick = (e) => {
    const id = Number(this.props.params.id);
    if (id === 0) {
      this.props.updateAddress(null, requestAction.create, this.state.address);
    } else {
      this.props.updateAddress(id, requestAction.update, this.state.address);
    }
    e.preventDefault();
  }

  renderProvince() {
    const { province, address } = this.props;
    if (!_.isArray(province.data)) {
      province.data = [];
    }

    let selected = 0;
    _.each(province.data, (item, index) => {
      if (address.data.receiver_state && address.data.receiver_state.indexOf(item.name) >= 0) {
        selected = item.id;
        return;
      }
    });

    return (
      <select className="col-xs-4 no-padding" name="province" value={selected} onChange={this.onSelectChange}>
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
    const { city, address } = this.props;
    if (!_.isArray(city.data)) {
      city.data = [];
    }

    let selected = 0;
    _.each(city.data, (item, index) => {
      if (address.data.receiver_state && address.data.receiver_state.indexOf(item.name) >= 0) {
        selected = item.id;
        return;
      }
    });

    return (
      <select className="col-xs-4 no-padding" name="city" value={selected} onChange={this.onSelectChange}>
        <option value="选择城市" id="0">选择城市</option>
        {
          city.data.map((item, index) => {
            return (
              <option value={item.id} key={item.id} key={item.id}>{ item.name }</option>
            );
          })
        }
      </select>
    );
  }

  renderRegion() {
    const { region, address } = this.props;
    if (!_.isArray(region.data)) {
      region.data = [];
    }

    let selected = 0;
    _.each(region.data, (item, index) => {
      if (address.data.receiver_state && address.data.receiver_state.indexOf(item.name) >= 0) {
        selected = item.id;
        return;
      }
    });

    return (
      <select className="col-xs-4 no-padding" name="region" value={selected} onChange={this.onSelectChange}>
        <option value="选择地区" id="0">选择地区</option>
        {
          region.data.map((item, index) => {
            return (
              <option value={item.id} key={item.id} key={item.id}>{item.name}</option>
            );
          })
        }
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
    return (
      <div>
        <Header title={id === 0 ? '新增收货地址' : '修改收货地址'} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} rightText={id === 0 ? '' : '删除'} onRightBtnClick={this.onDeleteClick} />
        <div className="content has-header no-margin adddress-edit">
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
          <div className="row no-margin bottom-border margin-top-xs adddress-item">
            <span className="col-xs-9">是否设为常用地址</span>
            <div className="col-xs-3">
              <Switch defaultChecked={address.default} value={address.default} onChange={this.onSwitchChange}/>
            </div>
          </div>
          <div className="row no-margin">
            <button className={saveBtnCls} type="button" onClick={this.onSaveBntClick} disabled={this.state.nextBtnPressed}>保存</button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
