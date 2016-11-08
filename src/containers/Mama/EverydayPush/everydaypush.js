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

  renderPics(pics) {
    return (
      <ul className="margin-bottom-lg">
        {pics.map((item, index) => {
          return (
            <li className=" no-margin" key={index}>
              <Image className="col-xs-4 no-padding" src={item} />
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const { ninepic } = this.props;
    return (
      <div className="col-xs-12 no-padding">
        <ul className="margin-bottom-lg">
        <If condition={ninepic && ninepic.success && ninepic.data.length > 0}>
          {ninepic.data.map((item, index) => {
            return (
              <li className="row no-margin margin-top-xs bottom-border" key={index}>
                <p className="col-xs-12 no-padding" >{item.title_content}</p>
                <p className="col-xs-6 no-padding" >{item.start_time}</p>
                <p className="col-xs-12 no-padding" >{item.title}</p>
                { this.renderPics(item.pic_arry) }
                <p className="col-xs-12 no-padding" >{'分享次数' + item.save_times}</p>
              </li>
            );
          })}
        </If>
      </ul>
      </div>
    );
  }
}
