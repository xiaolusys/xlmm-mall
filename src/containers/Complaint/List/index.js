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
import * as actionCreators from 'actions/complaint/list';

import './index.scss';

@connect(
  state => ({
    complaint: {
      data: state.complaintHistory.data,
      isLoading: state.complaintHistory.isLoading,
      error: state.complaintHistory.error,
      success: state.complaintHistory.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    complaint: React.PropTypes.any,
    error: React.PropTypes.bool,
    fetchComplaints: React.PropTypes.func,
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.complaint.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  render() {
    const data = this.props.complaint.data && this.props.complaint.data.results || [];
    return (
      <div>
        <Header title="反馈回复" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content">
          <ul className="complaint-reply-list">
            {data.map((complaint) => {
              return (
                <If condition= {complaint.com_content}>
                  <li className="bottom-border row no-margin margin-bottom-xs" key={complaint.id}>
                    <p className="col-xs-12 text-left no-margin text-range padding-top-xxs padding-bottom-xxs">{'反馈问题: ' + complaint.com_content}</p>
                    <If condition= {complaint.reply}>
                      <div className="col-xs-12 no-margin margin-bottom-xs margin-top-xs">
                        <p className="no-margin padding-bottom-xxs">
                          <i className="icon-xiaolu font-grey-light margin-right-xs"></i>
                          <span>鹿小美</span>
                        </p>
                        <div className="col-xs-11 col-xs-offset-1 complaint-content">{complaint.reply}</div>
                      </div>
                    </If>
                  </li>
                </If>
              );
            })}
          </ul>
          <Footer/>
        </div>
      </div>
    );
  }
}
