import React, { Component } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import QrReader from 'react-qr-reader';
import IconQR from '../shared/icon-qr/IconQR';

import { getCurrentLocation } from '../../utils/locationHelpers';

import Modal from '../shared/modal/Modal';

class WanderingNew extends Component {
  state = {
    streetAddress: '',
    latitude: '',
    longitude: '',
    toAddress: '',
    journal: '',
    autolocated: false,
    show: false, // modal
    delay: 300, // qr
    result: 'Scan a QR code to return a wallet address', // qr
  };

  componentWillMount = () => {
    this.setState({
      ...getCurrentLocation(),
    });
  };

  handleChange = (streetAddress) => {
    this.setState({ streetAddress });
  };

  handleAddressChange = (e) => {
    this.setState({ toAddress: e.target.value });
  };

  handleJournalChange = (e) => {
    this.setState({ journal: e.target.value });
  };

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({
          streetAddress: address,
          latitude: latLng.lat,
          longitude: latLng.lng,
          autolocated: false,
        });
      })
      .catch((error) => console.error('Error', error));
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const transfer = { ...this.state };

    onSubmit(transfer);
  };

  handleCloseClick = () => {
    this.setState({
      streetAddress: '',
      latitude: '',
      longitude: '',
      toAddress: '',
      journal: '',
      autolocated: false,
    });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handleScan = (data) => {
    if (data) {
      this.setState({
        result: data,
        toAddress: data.slice(data.indexOf(':') + 1),
      });
    }
  };

  handleError = (err) => {
    console.error(err);
  };

  render() {
    const invalidToAddress = this.state.toAddress.length < 11;
    const showWarning = invalidToAddress && this.state.toAddress.length < 5;

    return (
      <div>
        <PlacesAutocomplete
          onChange={this.handleChange}
          value={this.state.streetAddress}
          onSelect={this.handleSelect}
          shouldFetchSuggestions={this.state.streetAddress.length > 2}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => {
            return (
              <div className="Wandering__search-bar-container">
                <p className="large">
                  You can send the Wander Coin to anyone you like as long as
                  they have never held the coin before. When you send the coin,
                  you can also add a message to your transaction which will also
                  appear on the map along with your transaction. The goal is to
                  pass the coin all the way around the world.
                </p>
                <div className="step--1">
                  <p>
                    <strong>1.</strong> First, check in with your location.
                  </p>
                  <div className="Wandering__search-input-container">
                    <input
                      {...getInputProps({
                        placeholder: 'Enter your street address',
                        className: 'Wandering__search-input',
                      })}
                    />
                    {this.state.streetAddress.length > 0 && (
                      <button
                        className="Wandering__clear-button"
                        onClick={this.handleCloseClick}
                      >
                        x
                      </button>
                    )}
                  </div>
                </div>
                {this.state.autolocated && (
                  <div>
                    <p>Is this where you are?</p>
                    <p>
                      <button
                        onClick={() =>
                          this.handleSelect(this.state.streetAddress)
                        }
                      >
                        Yep
                      </button>
                    </p>
                    <p>
                      <button onClick={this.handleCloseClick}>Nope</button>
                    </p>
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div className="Wandering__autocomplete-container">
                    {suggestions.map((suggestion) => {
                      const className = 'Wandering__suggestion-item';

                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                        >
                          <strong>
                            {suggestion.formattedSuggestion.mainText}
                          </strong>{' '}
                          <small>
                            {suggestion.formattedSuggestion.secondaryText}
                          </small>
                        </div>
                      );
                    })}
                    <div className="Wandering__dropdown-footer" />
                  </div>
                )}
              </div>
            );
          }}
        </PlacesAutocomplete>

        {this.state.latitude && (
          <div>
            <div className="step--2">
              <p>
                <strong>2.</strong> Enter the etheruem wallet address for whom
                you'd like to send the coin. {'heel' + this.state.show}
              </p>
              <Modal show={this.state.show} handleClose={this.hideModal}>
                <h3>Scan a wallet address</h3>
                {this.state.show ? (
                  <div>
                    <QrReader
                      delay={this.state.delay}
                      onError={this.handleError}
                      onScan={this.handleScan}
                      style={{ width: '100%' }}
                    />
                    <p className="result">{this.state.result}</p>
                  </div>
                ) : null}
              </Modal>
              {showWarning ? (
                <p className="tiny">Be sure to double check the address.</p>
              ) : null}
              <div className="Wandering__wallet-address">
                <input
                  className="Wandering__address-input"
                  type="text"
                  placeholder="Enter the wallet address"
                  value={this.state.toAddress}
                  onChange={this.handleAddressChange}
                />
                <button
                  className="button--qr"
                  type="button"
                  onClick={this.showModal}
                >
                  <IconQR />
                </button>
              </div>
            </div>
            <div className="step--3">
              <p>
                <strong>3.</strong> Share some wisdom along with the coin.
                (Optional)
              </p>
              <input
                className="Wandering__journal-input"
                type="text"
                placeholder="Enter your wisdom 🎩"
                value={this.journal}
                onChange={this.handleJournalChange}
              />
            </div>
            <div>
              {!this.props.loading ? (
                <button
                  className="button"
                  onClick={this.handleSubmit}
                  disabled={invalidToAddress}
                >
                  Send the Coin
                </button>
              ) : (
                <p class="tiny">Waiting on tx ...</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default WanderingNew;
