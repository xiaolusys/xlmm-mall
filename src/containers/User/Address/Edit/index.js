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
import Input from './Input';

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
    nextBtnDisabled: true,
    nextBtnPressed: false,
    name: this.props.address.data.receiver_name,
    phone: this.props.address.data.receiver_mobile,
    addrProvince: this.props.address.data.receiver_state,
    addrCity: this.props.address.data.receiver_city,
    addrRegion: this.props.address.data.receiver_district,
    addrDetail: this.props.address.data.receiver_address,
    addrDefault: this.props.address.data.default,
  }

  componentWillMount() {
    this.props.getProvinces();
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
    this.setState({ name: value });
  }
  onPhoneChange = (value) => {
    this.setState({ phone: value });
  }
  onProvinceChange = (e) => {
    this.setState({ addrProvince: e.currentTarget.selectedOptions[0].label });
    this.setState({ addrProvinceId: e.currentTarget.value });
    this.props.getCities(e.currentTarget.value);
    console.log(e);
  }
  onCityChange = (e) => {
    this.setState({ addrCity: e.currentTarget.value });
    this.setState({ addrCityId: e.currentTarget.id });
    this.props.getRegions(e.currentTarget.value);
  }
  onRegionChange = (e) => {
    this.setState({ addrRegion: e.currentTarget.value });
    this.setState({ addrRegionId: e.currentTarget.id });
  }
  onDetailAddrChange = (value) => {
    this.setState({ addrDetail: value });
  }
  onDefaulAddrChange = (e) => {
    this.setState({ addrDefault: e.currentTarget.value });
  }
  onSaveBntClick = (e) => {
    const { action } = this.state;
    if (action.type === 'add') {
      // this.props.createAddress(address);
      this.context.router.push('/user/address');
      console.log('actionType:' + action.type);
    } else {
      // this.props.updateAddress(id, address);
      this.context.router.push('/user/address');
      console.log('actionType:' + action.type);
    }
  }
  renderProvince() {
    const { province, address } = this.props;
    if (!_.isArray(province.data)) {
      province.data = [];
    }

    // let selected = 0;
    // _.each(province.data, (item, index) => {
    //   if (address.data.receiver_state && address.data.receiver_state.indexOf(item.name)) {
    //     console.log(item.name);
    //     selected = index;
    //     return;
    //   }
    // });

    return (
      <select className="col-xs-4 no-padding" onChange={this.onProvinceChange}>
        <option value="选择省份" id="0">选择省份</option>
        {
          province.data.map((item, index) => {
            return (
              <option value={item.id} key={item.id}>{item.name}</option>
            );
          })
        }
      </select>
    );
  }

  renderCity() {
    const { city, address } = this.props;
    if (!_.isArray(city.data)) {
      city.data = [];
    }
    return (
      <select className="col-xs-4 no-padding" onChange={this.onCityChange}>
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
    return (
      <select className="col-xs-4 no-padding" onChange={this.onRegionChange}>
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
    const { address } = this.props;
    const { action } = this.state;
    const saveBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.nextBtnPressed,
    });
    return (
      <div>
        <Header title={action.title} leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="content has-header no-margin adddress-edit">
          <div className="row no-margin margin-top-xs bottom-border adddress-item">
            <span className="col-xs-4">收货人</span>
            <Input type="text" placeholder="请输入收货人姓名" value={address.data.receiver_name} onChange={this.onNameChange} />
          </div>
          <div className="row no-margin  bottom-border adddress-item">
            <span className="col-xs-4">手机号</span>
            <Input type="number" placeholder="请输入收货人手机号" value={address.data.receiver_mobile} onChange={this.onPhoneChange}/>
          </div>
          <div className="row no-margin bottom-border margin-top-xs adddress-item">
            <span className="col-xs-4">所在地区</span>
            <div className="address-select col-xs-8 no-padding region-at">
              {
                this.renderProvince()
              }
              {
                this.renderCity()
              }
              {
                this.renderRegion()
              }
            </div>
          </div>
          <div className="row no-margin bottom-border adddress-item">
            <span className="col-xs-4">详细地址</span>
            <Input type="text" placeholder="请输入您的详细地址" value={address.data.receiver_address} onChange={this.onDetailAddressChange}/>
          </div>
          <div className="row no-margin bottom-border margin-top-xs adddress-item">
            <span className="col-xs-9">是否设为常用地址</span>
            <div className="col-xs-3">
              <Switch defaultChecked={false} />
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
