import React from 'react';

import NotFound404 from 'components/common/NotFound';
import UtilError from 'components/common/UtilError';

import _ from 'lodash';

export default class ErrorHandler extends React.Component {

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  // stateの変更を実施する
  static getDerivedStateFromError(error) {
    return { error: error };
  }

  // エラーのログを出力する
  componentDidCatch(error, errorInfo) {
    console.log(error);
    console.log(errorInfo); 
  }

  render() {
    const errorStatus = _.get(this.state, "error.statusCode");
    const errorMessage = _.get(this.state, "error.message");
    if (this.state.error) {
      switch(errorStatus) {
        case 404: {
          return <NotFound404 />;
        }
        default: {
          return <UtilError errorMessage={errorMessage} />;
        }
      }
    }
    return this.props.children;
  }
}