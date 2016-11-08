import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import * as ninepicAction from 'actions/mama/ninepic';

const actionCreators = _.extend(ninepicAction);

@connect(
  state => ({
    ninepic: state.ninepic,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class EverydayPushTab extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    ninepic: React.PropTypes.any,
    fetchNinePic: React.PropTypes.func,
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
    this.props.fetchNinePic('', '');
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { ninepic } = nextProps;

    if (ninepic.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
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

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { ninepic } = this.props;
    console.log(ninepic.data.length);
    return (
      <div className="col-xs-12 no-padding">
        <ul className="margin-bottom-lg">
        <If condition={ninepic && ninepic.success && ninepic.data.length > 0}>
          {ninepic.data.map((item, index) => {
            return (
              <li className="row no-margin margin-top-xs" key={index}>
                <p className="col-xs-12 no-padding" >{item.title_content}</p>
              </li>
            );
          })}
        </If>
      </ul>
      </div>
    );
  }
}
