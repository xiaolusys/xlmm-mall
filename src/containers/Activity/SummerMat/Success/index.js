import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/activity/summerMat';
import * as utils from 'utils';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';

import './index.scss';

@connect(
  state => ({
    summerMat: state.summerMat,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Success extends Component {

  static propTypes = {
    summerMat: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    location: React.PropTypes.object,
    signUp: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.signUp();
  }

  render() {
    const windowHeight = utils.dom.windowHeight();
    const data = this.props.summerMat && this.props.summerMat.data || [];
    return (
      <div>
        <Header title="活动报名成功" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} hide={utils.detector.isApp()} />
        <If condition={data && data.weixin_qr_img}>
          <div className="content activity-mat-success" style={{ height: windowHeight }}>
            <Image className="col-xs-12 no-padding" src={data.weixin_qr_img} />
          </div>
        </If>
      </div>
    );
  }
}
