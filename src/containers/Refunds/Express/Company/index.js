import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import expressCompany from './expressCompany';

import './index.scss';

@connect(
  state => ({
    data: state.refundsDetails.data,
    isLoading: state.refundsDetails.isLoading,
    error: state.refundsDetails.error,
    success: state.refundsDetails.success,
  }),
  dispatch => bindActionCreators(expressCompany, dispatch),
)
export default class ExpressCompany extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    submitBtnDisabled: true,
  }

  onExpressItemClick = (e) => {
    const { refundsid, orderid } = this.props.params;
    const { company } = e.currentTarget.dataset;
    this.context.router.replace(`/refunds/express/order/${refundsid}/${orderid}/${company}?type=fill`);
  }

  render() {
    const companys = expressCompany.companyList;
    return (
      <div className="fill-logistics-info">
        <Header title="物流公司" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content">
          <ul className="company-list">
            {
              companys.map((company, index) => {
                return (
                  <li className="row no-margin no-padding bottom-border" key={index}>
                    <If condition={!((companys[index - 1] && companys[index - 1].type) === companys[index].type)}>
                      <div className="col-xs-12 bottom-border company-type">
                        <p className="text-left font-sm no-margin no-padding">{company.type}</p>
                      </div>
                    </If>
                    <div className="col-xs-12 company-name" data-company={company.name} onClick={this.onExpressItemClick}>
                      <p className="text-left font-sm no-margin no-padding" onClick={this.onCompanySelected}>{company.name}</p>
                    </div>
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
