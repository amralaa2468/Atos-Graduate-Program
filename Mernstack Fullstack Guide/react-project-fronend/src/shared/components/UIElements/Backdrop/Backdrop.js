import React from 'react';
import PortalReactDOM from 'react-dom';

import './Backdrop.css';

const Backdrop = props => {
  return PortalReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop;
