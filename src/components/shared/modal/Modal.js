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
          <div className="contents">
            {children}
          </div>
          <div className="footer">
            <button className="button" onClick={handleClose}>Close</button>
          </div>
        </section>
      </div>
    );
  }
}

export default Modal;
