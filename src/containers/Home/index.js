import React, { Component } from 'react';
import DocumentMeta from 'react-document-meta';
import metaUtil from '../../utils/meta';

const metaData = metaUtil('小鹿美美 - 外贸原单，天天惊喜！');

export class Home extends Component {
  render() {
    return (
      <section>
        <DocumentMeta {...metaData} />
      </section>
    );
  }
}
