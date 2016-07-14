import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/activity/summerMat';
import * as utils from 'utils';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';

@connect(
  state => ({
    summerMat: state.summerMat,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Home extends Component {

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.summerMat.success && nextProps.summerMat.data) {
      this.context.router.push('/activity/summer/mat/success');
    } else if (nextProps.summerMat.error) {
      Toast.show('' + nextProps.summerMat.data);
    }
  }

  onSignUpClick = (e) => {
    const administratorId = this.props.location.query.id || '';
    this.props.signUp(administratorId);
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <Header title="7月抢凉席活动" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} hide={utils.detector.isApp()} />
        <div className="content">
          <Image className="col-xs-12 no-padding" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/summerMat/v2/top.png'} />
          <div className="row" onClick={this.onSignUpClick}>
            <Image className="col-xs-12 no-padding" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/summerMat/v2/signUpBtn.png'}/>
          </div>
          <Image className="col-xs-12 no-padding" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/summerMat/v2/footer.png'} />
        </div>
      </div>
    );
  }
}
