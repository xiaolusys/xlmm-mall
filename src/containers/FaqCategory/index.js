import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/faq/categories';
import { Header } from 'components/Header';

import './index.scss';

@connect(
  state => ({
    data: state.faqCategories.data,
    isLoading: state.faqCategories.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class FaqCategory extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchCategories: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchCategories();
  }

  render() {
    const props = this.props;
    const { children, data, isLoading, error } = this.props;
    return (
      <div>
        <Header title="常见问题" leftIcon="icon-angle-left" leftBtnClick={props.history.goBack} />
        <div className="has-header content">
        {isLoading ? <span>loading...</span> : children}
        <ul className="faq-list container">
          {
            data.map((item, index) => {
              return (
                <li className="bottom-border row no-margin">
                  <a href={'faq/list/' + item.id} >
                  <img className="col-xs-4" src={item.icon_url} />
                  <div className="col-xs-8">
                    <p className="font-lg font-black">{item.category_name}</p>
                    <p className="font-grey">{item.description}</p>
                  </div>
                  </a>
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
