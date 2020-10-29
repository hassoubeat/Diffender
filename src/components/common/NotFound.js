import React from 'react';
import UtilError from 'components/common/UtilError';

export default function NotFound(props = null) {
  // props setup
  const errorMessage = props.errorMessage || "URLに対応するページは存在しません。";

  return (
    <UtilError 
      errorTitle="NotFound(404)"
      errorMessage={errorMessage}
    />
  );
}
