import React from 'react';

export default function noMatch(props) {
  const {
    history: {
      location: { pathname },
    },
  } = props;
  return <div>{`No match for ${pathname}`}</div>;
}
