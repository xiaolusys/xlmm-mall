import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/exam';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';
import * as utils from 'utils';
import moment from 'moment';
import * as plugins from 'plugins';

import './index.scss';

const staticBase = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/exam/';
@connect(
  state => ({
    exam: state.exam,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Home extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    fetchExamInfo: React.PropTypes.func,
    exam: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'activity-exam',
  };

  constructor(props, context) {
    super(props);
    context.router;
    moment.locale('zh-cn');
  }

  state = {

  }

  componentWillMount() {
    this.props.fetchExamInfo();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exam.info.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  onShareBtnClick = (e) => {
    plugins.invoke({

    });
  }

  onInviteBtnClick = (e) => {
    plugins.invoke({

    });
  }

  onTakeExamBtnClick = (e) => {
    const examInfo = this.props.exam.info.data.exam_info || {};
    if (!examInfo.is_xlmm) {
      Toast.show('您不是小鹿妈妈，无法参加此次考试！');
      return;
    }
    if (examInfo.total_point > 0) {
      Toast.show('您已经参加过本次考试！');
      // return;
    }
    this.context.router.push('/activity/exam/question/1/-1');
    e.preventDefault();
  }

  formatDate(beginDateStr, endDateStr) {
    const beginDate = moment(beginDateStr);
    const endDate = moment(endDateStr);
    return beginDate.format('dddd') + '：' + beginDate.format('a') + beginDate.format('h:mm') + '-' + endDate.format('h:mm');
  }

  render() {
    const { prefixCls, exam } = this.props;
    const examInfo = exam.info.data.exam_info || {};
    return (
      <div className={`${prefixCls}`}>
        <Header title="🚄✨VIP2考试✨💪💯" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} hide={utils.detector.isApp()} />
        <Image className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding" src={`${staticBase}banner.png`} />
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding exam-date">
          <Image src={`${staticBase}date-bg.png`} />
          <div>
            <p className="font-lg font-red">考试时间</p>
            <p>{this.formatDate(examInfo.start_time, examInfo.expire_time)}</p>
          </div>
        </div>
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding">
          <Image className="col-xs-4 no-padding" src={`${staticBase}btn-left.png`}/>
          <If condition={!moment().isBetween(examInfo.start_time, examInfo.expire_time, 'seconds')}>
            <Image className="col-xs-4 no-padding" src={`${staticBase}start-exam-btn-disabled.png`}/>
          </If>
          <If condition={moment().isBetween(examInfo.start_time, examInfo.expire_time, 'seconds')}>
            <Image className="col-xs-4 no-padding" src={`${staticBase}start-exam-btn-normal.png`} onClick={this.onTakeExamBtnClick}/>
          </If>
          <Image className="col-xs-4 no-padding" src={`${staticBase}btn-right.png`}/>
        </div>
        <Image className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding" src={`${staticBase}paratice-part.png`} />
        <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding activity-operations">
          <div className="activity-operation-item">
            <p className="pull-left no-padding"><span>邀请好友</span><span className="margin-left-xxs font-red">{examInfo.invite_num || 0}</span><span>/8</span></p>
            <If condition={examInfo.invite_num < 8}>
              <img className="pull-right no-padding" src={`${staticBase}invite-btn.png`} onClick={this.onInviteBtnClick}/>
            </If>
            <If condition={examInfo.invite_num >= 8}>
              <img className="pull-right no-padding stamp" src={`${staticBase}stamp.png`} />
            </If>
          </div>
          <div className="activity-operation-item">
            <p className="pull-left no-padding"><span>分享好友</span><span className="margin-left-xxs font-red">{examInfo.fans_num || 0}</span><span>/20</span></p>
            <If condition={examInfo.fans_num < 20}>
              <img className="pull-right no-padding" src={`${staticBase}share-btn.png`} onClick={this.onShareBtnClick}/>
            </If>
            <If condition={examInfo.fans_num >= 20}>
              <img className="pull-right no-padding stamp" src={`${staticBase}stamp.png`} />
            </If>
          </div>
        </div>
      </div>
    );
  }
}
