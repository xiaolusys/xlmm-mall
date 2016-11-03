import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import * as activityAction from 'actions/mama/activity';
import * as courseAction from 'actions/mama/course';

import './index.scss';

const actionCreators = _.extend(activityAction, courseAction);

@connect(
  state => ({
    mamaActivity: state.mamaActivity,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class makemoneyTab extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    mamaActivity: React.PropTypes.any,
    mamaCourse: React.PropTypes.any,
    fetchActivity: React.PropTypes.func,
    fetchCourse: React.PropTypes.func,
    resetCourse: React.PropTypes.func,
    readCourse: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

    sticky: false,
    hasMore: false,

  }

  componentWillMount() {
    const { pageIndex, pageSize, lessonType, orderingBy } = this.state;
    this.props.fetchCourse(pageIndex, pageSize, lessonType, orderingBy);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaActivity, mamaCourse } = nextProps;
    const { fetchCourse, readCourse } = mamaCourse;
    if (mamaActivity.isLoading || fetchCourse.isLoading || readCourse.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    if (fetchCourse.success) {
      const count = fetchCourse.data.count;
      const size = fetchCourse.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
    const { pageIndex, pageSize, lessonType, orderingBy, activeTab, sticky, bottomTab } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    let courseTabOffsetTop = 0;
    if (scrollTop === documentHeight - windowHeight && !this.props.mamaCourse.fetchCourse.isLoading && this.state.hasMore) {
      this.props.fetchCourse(pageIndex + 1, pageSize, lessonType, orderingBy);
    }
    if (bottomTab === 'course') {
      courseTabOffsetTop = utils.dom.offsetTop('.course-tab');
    }
    if (scrollTop > courseTabOffsetTop) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  }

  onLeftBtnClick = (e) => {
    if (utils.detector.isApp()) {
      plugins.invoke({
        method: 'callNativeBack',
      });
      return;
    }
    this.context.router.goBack();
  }

  onTabClick = (e) => {
    const { pageIndex, pageSize, lessonType, orderingBy } = this.state;
    const { id, type } = e.currentTarget.dataset;
    if (type === 'course') {
      this.props.resetCourse();
      switch (id) {
        case 'newb':
          this.setState({
            topTab: id,
            lessonType: 3,
            orderingBy: '',
          });
          this.props.fetchCourse(1, pageSize, 3, '');
          break;
        case 'hot':
          this.setState({
            topTab: id,
            lessonType: '',
            orderingBy: 'num_attender',
          });
          this.props.fetchCourse(1, pageSize, '', 'num_attender,-order_weight');
          break;
        case 'newest':
          this.setState({
            topTab: id,
            lessonType: '',
            orderingBy: 'created',
          });
          this.props.fetchCourse(1, pageSize, '', 'created');
          break;
        default:
      }
    }
    if (type === 'base') {
      this.setState({
        bottomTab: id,
      });
    }
    switch (id) {
      case 'course':
        this.props.fetchCourse(1, pageSize, 3, '');
        break;
      case 'activity':
        this.props.fetchActivity();
        break;
      default:
    }
    e.preventDefault();
  }

  onCourseItemClick = (e) => {
    const { id, to } = e.currentTarget.dataset;
    const appUrl = `com.jimei.xlmm://app/v1/webview?is_native=1&url=${to}`;
    this.props.readCourse(id);
    if (utils.detector.isAndroid() && typeof window.AndroidBridge !== 'undefined') {
      window.AndroidBridge.jumpToNativeLocation(appUrl);
      return;
    }
    if (utils.detector.isIOS()) {
      plugins.invoke({
        method: 'jumpToNativeLocation',
        data: { target_url: appUrl },
        callback: (resp) => {},
      });
      return;
    }
    e.preventDefault();
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderActivities(activities) {
    return (
      <ul className="margin-bottom-lg">
        {activities.map((activity, index) => {
          return (
            <a href={activity.act_link} key={activity.id}>
              <li className="row no-margin margin-top-xs">
                <Image className="col-xs-12 no-padding" src={activity.act_img} key={index}/>
                <p className="col-xs-12 no-margin no-padding padding-top-xs padding-bottom-xs content-white-bg">
                  <span className="col-xs-8 text-left no-wrap">{activity.title}</span>
                  <span className="col-xs-4 text-right font-orange">{activity.total_member_num + '人参与'}</span>
                </p>
              </li>
            </a>
          );
        })}
      </ul>
    );
  }

  render() {
    const { topTab, sticky } = this.state;
    const activityData = this.props.mamaActivity.data || [];
    return (
      <div>
        <div className="content makemoney-container">
        </div>
        { this.renderActivities(activityData) }
      </div>
    );
  }
}
