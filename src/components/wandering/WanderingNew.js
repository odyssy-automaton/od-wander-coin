import React, { Component } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import { getCurrentLocation } from '../../utils/locationHelpers';

class WanderingNew extends Component {
  state = {
    streetAddress: '',
    latitude: '',
    longitude: '',
    toAddress: '',
    journal: '',
    autolocated: false,
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
                <div className="Wandering__search-input-container">
                  <input
                    {...getInputProps({
                      placeholder: 'Enter a street address...',
                      className: 'Wandering__search-input',
                    })}
                  />
                  {this.state.streetAddress.length > 0 && (
                    <button
                      className="button Wandering__clear-button"
                      onClick={this.handleCloseClick}
                    >
                      x
                    </button>
                  )}
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
            <p>Lat: {this.state.latitude}</p>
            <p>Lng: {this.state.longitude}</p>
            <div>
              <input
                className="Wandering__address-input"
                type="text"
                placeholder="to address"
                value={this.toAddress}
                onChange={this.handleAddressChange}
              />
            </div>
            {showWarning ? (
              <p>Be sure to double check the address...</p>
            ) : null}
            <div>
              <input
                className="Wandering__journal-input"
                type="text"
                placeholder="Enter your wisdom 🎩"
                value={this.journal}
                onChange={this.handleJournalChange}
              />
            </div>
            <div>
              <button onClick={this.handleSubmit} disabled={invalidToAddress}>
                Send the Coin
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default WanderingNew;
