import React, { Component } from 'react';
import { Image } from 'components/Image';

export class Brand extends Component {

  static propTypes = {
    data: React.PropTypes.object,
  };

  static defualtProps = {

  }

  render() {
    const { data } = this.props;
    return (
      <li style={{ padding: '10px 0px' }} className="bottom-border brand-item">
        <a href={data.act_link}>
          <div style={{ height: '24px', lineHeight: '24px' }}>
            <div style={{ padding: '0px 10px' }} className="pull-left">
              <img style={{ height: '100%' }} src={data.act_logo} />
              <span style={{ color: '#4a4a4a' }}>{data.title}</span>
            </div>
            <div style={{ padding: '0px 10px' }} className="pull-right text-right">
              <span style={{ color: '#faac14' }}>{data.extras.brandinfo.tail_title}</span>
              <i className="icon-angle-right icon-grey"></i>
            </div>
          </div>
          <Image style={{ width: '100%' }} src={data.act_img} />
        </a>
      </li>
    );
  }

}
