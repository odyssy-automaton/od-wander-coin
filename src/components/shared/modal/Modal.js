import React, { Component } from 'react';

import './Modal.scss';

class Modal extends Component {
  render() {
    const showHideClassname = this.props.show
      ? 'modal display-block'
      : 'modal display-none';
    const children = this.props.children;
    const handleClose = this.props.handleClose;

    return (
      <div className={showHideClassname}>
        <section className="modal-main">
          <div className="header">
            <button className="button transparent" onClick={handleClose}>X</button>
          </div>
          <div className="contents">
            {children}
            <div className="footer">
              <button className="button" onClick={handleClose}>Close</button>
            </div>
          </div>
        </section>
        <div className="Modal__backdrop" onClick={handleClose}></div>
      </div>
    );
  }
}

export default Modal;
