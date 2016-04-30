import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';


export default class Input extends Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
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
    value: this.props.value,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = (e) => {
    const value = e.target.value;
    this.setState({
      value: value,
    });
    this.props.onChange(value);
    e.preventDefault();
  }

  render() {
    const { type, placeholder } = this.props;
    const { value } = this.state;
    return (
      <div className="col-xs-8 no-padding">
        <input type={type} placeholder={placeholder} value={value} onChange={this.onChange}/>
     </div>
    );
  }
}
