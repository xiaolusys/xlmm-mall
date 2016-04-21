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
    rules: React.PropTypes.object,
  };

  static defaultProps = {
    onChange: _.noop,
    onValid: _.noop,
    onInvalid: _.noop,
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
    this.checkRules(value);
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
    const valid = true;
    this.setState({ valid: valid });
    if (valid) {
      this.props.onValid();
      return;
    }
    this.props.onInvalid();
  }

  render() {
    const { type, placeholder, onChange } = this.props;
    const inputBoxCls = classnames({
      ['input-box row no-margin bottom-border']: 1,
      ['valid']: this.state.valid,
      ['invalid']: !this.state.valid,
    });
    const clearBtnCls = classnames({
      ['fa fa-close']: 1,
      ['hide']: !this.state.iconActive,
    });
    return (
      <div className={inputBoxCls}>
      <input className="col-xs-10 float-left" type={type} value={this.state.value} placeholder={placeholder} onInput={this.onInput} onChange={this.onChange}/>
      <div className="col-xs-2 text-center">
        <i className={clearBtnCls} onClick={this.onClearClick}></i>
      </div>
     </div>
    );
  }
}
