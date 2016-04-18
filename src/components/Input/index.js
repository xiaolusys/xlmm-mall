import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';

import './index.scss';

export class Input extends Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func,
  };

  static defaultProps = {
    onChange: _.noop,
  }

  constructor(props) {
    super(props);
  }

  state = {
    iconActive: false,
    showPassword: false,
  }

  onInput = (e) => {
    this.setState({
      iconActive: true,
      value: e.target.value,
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
