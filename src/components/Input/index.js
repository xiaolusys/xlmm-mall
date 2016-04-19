import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';

import './index.scss';

export class Input extends Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onValid: React.PropTypes.func,
    onInvalid: React.PropTypes.func,
    reuqired: React.PropTypes.bool,
    minLength: React.PropTypes.number,
    maxLength: React.PropTypes.number,
    validator: React.PropTypes.func,
    isPhone: React.PropTypes.bool,
    isEMail: React.PropTypes.bool,
  };

  static defaultProps = {
    onChange: _.noop,
    onValid: _.noop,
    validator: _.noop,
  }

  constructor(props) {
    super(props);
  }

  state = {
    iconActive: false,
    showPassword: false,
    valid: true,
  }

  onInput = (e) => {
    const value = e.target.value;

    this.setState({
      iconActive: true,
      value: value,
    });
    e.preventDefault();
  }

  onChange = (e) => {
    this.props.onChange(e.target.value);
    e.preventDefault();
  }

  onClearClick = (e) => {
    this.setState({
      value: '',
      iconActive: false,
    });
  }

  checkRules = (value) => {
    const validData = {
      reuqired: this.state.reuqired && value.length > 0,
      minLength: this.state.minLength && this.state.minLength >= value.length,
      maxLength: this.state.maxLength && this.state.maxLength >= value.length,
      phone: this.state.isPhone && /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(value),
      email: this.state.type === 'email' && /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value),
      number: this.state.type === 'number' && parseFloat(value),
      regex: this.state.regex && _.isRegExp() && this.state.regex.test(),
    };
    const valid = validData.reuqired && validData.minLength;
  }

  render() {
    const { type, placeholder, onChange } = this.props;
    const clearBtnCls = classnames({
      ['fa fa-close']: 1,
      ['hide']: !this.state.iconActive,
    });
    return (
      <div className="input-box row no-margin bottom-border">
      <input className="col-xs-10 float-left" type={type} value={this.state.value} placeholder={placeholder} onInput={this.onInput} onChange={this.onChange}/>
      <div className="col-xs-2 text-center">
        <i className={clearBtnCls} onClick={this.onClearClick}></i>
      </div>
     </div>
    );
  }
}
