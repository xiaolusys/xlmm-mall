import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
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
    mamaCourse: state.mamaCourse,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    mamaActivity: React.PropTypes.any,
    mamaCourse: React.PropTypes.any,
    fetchActivity: React.PropTypes.func,
    fetchCourse: React.PropTypes.func,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    topTab: 'hot',
    bottomTab: 'course',
  }

  componentWillMount() {
    this.props.fetchActivity();
    this.props.fetchCourse('', 'num_attender');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mamaActivity.isLoading || nextProps.mamaCourse.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  onTabClick = (e) => {
    const { id, type } = e.currentTarget.dataset;
    if (type === 'course') {
      this.setState({
        topTab: id,
      });
      switch (id) {
        case 'newb':
          this.props.fetchCourse(3, '');
          break;
        case 'hot':
          this.props.fetchCourse('', 'num_attender');
          break;
        case 'newest':
          this.props.fetchCourse('', 'created');
          break;
        default:
      }
    }
    if (type === 'base') {
      this.setState({
        bottomTab: id,
      });
    }
    e.preventDefault();
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

  renderCourses(courses) {
    return (
      <ul className="course-list">
        {courses.map((course, index) => {
          return (
            <Link key={index} to={'/mama/university/course/detail?link=' + encodeURIComponent(course.content_link)}>
            <li className="row no-margin bottom-border content-white-bg">
              <div className="col-xs-4">
                <Image className="col-xs-12 no-padding" src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/university/v1/banner.png'}/>
              </div>
              <div className="col-xs-8">
                <p className="col-xs-12 no-margin no-padding no-wrap padding-top-xxs">{course.title}</p>
                <p className="col-xs-12 no-margin no-padding padding-top-xxs font-xxs font-grey-light">
                  <span className="col-xs-7 no-padding text-left no-wrap">{course.num_attender + '人阅读'}</span>
                  <span className="col-xs-5 no-padding text-right">小鹿美美</span>
                </p>
              </div>
            </li>
            </Link>
            );
        })}
      </ul>
    );
  }

  render() {
    const { topTab, bottomTab } = this.state;
    const activityData = this.props.mamaActivity.data || [];
    const courseData = this.props.mamaCourse.data && this.props.mamaCourse.data.results || [];
    return (
      <div>
        <Header title="参加活动" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content university-container">
          <If condition={bottomTab === 'activity'}>
            <div className="activity-container">
              <If condition={!_.isEmpty(activityData)}>
               {this.renderActivities(activityData)}
              </If>
            </div>
          </If>
          <If condition={bottomTab === 'course'}>
            <div className="margin-bottom-lg course-container">
              <div className="row no-margin">
                <img src="http://7xogkj.com1.z0.glb.clouddn.com/mall/university/v1/banner.png"/>
              </div>
              <div className="row no-margin text-center bottom-border tab">
                <div data-type="course" data-id="newb" onClick={this.onTabClick}>
                  <p className={'col-xs-4 no-margin no-padding' + (topTab === 'newb' ? ' active' : '')}>
                    <span>新人</span>
                  </p>
                </div>
                <div data-type="course" data-id="hot" onClick={this.onTabClick}>
                  <p className={'col-xs-4 no-margin no-padding' + (topTab === 'hot' ? ' active' : '')}>
                    <span>热门</span>
                  </p>
                </div>
                <div data-type="course" data-id="newest" onClick={this.onTabClick}>
                  <p className={'col-xs-4 no-margin no-padding' + (topTab === 'newest' ? ' active' : '')}>
                    <span>最新</span>
                  </p>
                </div>
              </div>
              <If condition={!_.isEmpty(courseData)}>
                {this.renderCourses(courseData)}
              </If>
            </div>
          </If>
          <div className="row no-margin text-center top-border tab">
            <div data-type="base" data-id="course" onClick={this.onTabClick}>
              <p className={'col-xs-6 no-margin no-padding' + (bottomTab === 'course' ? ' active' : '')}>
                <span>课堂知识</span>
              </p>
            </div>
            <div data-type="base" data-id="activity" onClick={this.onTabClick}>
              <p className={'col-xs-6 no-margin no-padding' + (bottomTab === 'activity' ? ' active' : '')}>
                <span>参加活动</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
