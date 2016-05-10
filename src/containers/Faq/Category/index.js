import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as actionCreators from 'actions/faq/categories';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';

import './index.scss';

@connect(
  state => ({
    data: state.categories.data,
    isLoading: state.categories.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class FaqCategory extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchCategories: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchCategories();
  }

  render() {
    const props = this.props;
    const { children, isLoading, error } = this.props;
    let { data } = this.props;
    if (!_.isArray(data)) {
      data = [];
    }
    return (
      <div>
        <Header title="常见问题" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
          {isLoading ? <Loader/> : null}
          <ul className="faq-list">
            {
              data.map((item, index) => {
                return (
                  <li className="bottom-border row no-margin" key={index}>
                    <Link to={'/faq/list/' + item.id + '/' + encodeURIComponent(item.category_name)} >
                    <img className="col-xs-4" src={item.icon_url} />
                    <div className="col-xs-8">
                      <p className="font-lg font-black">{item.category_name}</p>
                      <p className="font-grey">{item.description}</p>
                    </div>
                    </Link>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}
