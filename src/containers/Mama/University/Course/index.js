import React, { Component } from 'react';
import { Header } from 'components/Header';

import './index.scss';

export default class Course extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  render() {
    const { link } = this.props.location.query;
    return (
      <div>
        <Header title="课程详情" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content course-detail-container">
          <iframe src={decodeURIComponent(link)} />
        </div>
      </div>
    );
  }
}
