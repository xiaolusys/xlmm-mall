import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/user/users';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

import './index.scss';

@connect(
  state => ({
    data: state.users.data,
    isLoading: state.users.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class ChangeNick extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchUsers: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  // componentWillMount() {
  //   this.props.fetchUsers();
  // }

  render() {
    const props = this.props;
    const { children, data, isLoading, error } = this.props;
    let user = {};
    if (data && data.results) {
      user = data.results[0];
    }
    return (
      <div>
        <Header title="个人信息" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <Footer/>
        </div>
    );
  }
}
