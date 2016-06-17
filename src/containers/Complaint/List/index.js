import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import * as utils from 'utils';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';
import * as complaintListAction from 'actions/complaint/list';
import * as userProfileAction from 'actions/user/profile';

import './index.scss';

const actionCreators = _.extend(complaintListAction, userProfileAction);

@connect(
  state => ({
    complaint: state.complaintHistory,
    profile: state.profile,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    complaint: React.PropTypes.any,
    profile: React.PropTypes.any,
    error: React.PropTypes.bool,
    fetchComplaints: React.PropTypes.func,
    fetchProfile: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    pageIndex: 0,
    pageSize: 10,
  }

  componentWillMount() {
    const { pageIndex, pageSize } = this.state;
    this.props.fetchComplaints(pageIndex + 1, pageSize);
    this.props.fetchProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.complaint.isLoading || nextProps.profile.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  render() {
    const data = this.props.complaint.data && this.props.complaint.data.results || [];
    const profileData = this.props.profile.data && this.props.profile.data || [];
    return (
      <div>
        <Header title="历史记录" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content">
          <ul className="complaint-reply-list">
            {data.map((complaint) => {
              if (complaint.com_content) {
                return (
                  <li className="row no-margin margin-bottom-xs" key={complaint.id}>
                    <div className="col-xs-12 padding-top-xxs">
                      <div className="col-xs-2 no-padding">
                      <Image src={profileData.thumbnail}/>
                      </div>
                      <div className="col-xs-10 no-padding">
                        <p className="no-margin font-md">小鹿妈妈</p>
                        <p className="no-margin font-xs font-grey-light">{complaint.created_time}</p>
                      </div>
                      <p className="col-xs-12 no-margin no-padding padding-top-xxs padding-bottom-xxs font-md text-left text-range">{complaint.com_content}</p>
                    </div>
                    <If condition={complaint.reply}>
                      <div className="col-xs-11 col-xs-offset-1 reply-content">
                        <p className="no-margin padding-top-xxs">
                          <span className="font-md padding-right-xs">小鹿美美</span>
                          <span className="no-margin no-padding font-xs font-grey-light">{complaint.created_time}</span>
                        </p>
                        <p className="col-xs-12 no-margin no-padding padding-top-xxs padding-bottom-xxs font-md text-left text-range">{complaint.com_content}</p>
                      </div>
                    </If>
                  </li>
                );
              }
            })}
          </ul>
          <Footer/>
        </div>
      </div>
    );
  }
}
