import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';

export default class QuestionItem extends Component {
  static propTypes = {
    data: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      opening: false,
    };
  }

  openBtnClick = (e) => {
    const self = this;
    this.setState({ open: !this.state.open, opening: true });
    _.delay(() => {
      self.setState({ opening: false });
    }, 100);
  }

  render() {
    const { data } = this.props;
    const btnCls = classnames({
      ['col-xs-1 icon-balck']: 1,
      ['icon-angle-down']: !this.state.open,
      ['icon-angle-up']: this.state.open,
    });
    const answerCls = classnames({
      ['collapse']: !this.state.open && !this.state.opening,
      ['collapse in']: this.state.open && !this.state.opening,
      ['collapsing']: this.state.opening,
    });
    return (
      <li className="font-grey conatiner" onClick={this.openBtnClick}>
        <div className="">
          <p className="col-xs-11 font-md">{data.question}</p>
          <i className={btnCls}></i>
        </div>
        <div className="clearfix top-border">
          <p className={answerCls}>{data.answer}</p>
        </div>
      </li>
    );
  }
}
