import React, { Component } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { CirclePicker } from 'react-color';

class TokenLaunch extends Component {
  state = {
    streetAddress: '',
    latitude: '',
    longitude: '',
    journal: '',
    tokenName: '',
    tokenColor: '',
  };

  handleChange = (streetAddress) => {
    this.setState({ streetAddress });
  };

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({
          streetAddress: address,
          latitude: latLng.lat,
          longitude: latLng.lng,
        });
      })
      .catch((error) => console.error('Error', error));
  };

  handleJournalChange = (e) => {
    this.setState({ journal: e.target.value });
  };

  handleTokenNameChange = (e) => {
    this.setState({ tokenName: e.target.value });
  };

  handleColorChange = (color) => {
    this.setState({ tokenColor: color.hex });
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
      tokenName: '',
      tokenColor: '',
    });
  };

  render() {
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
                      placeholder: 'Launch A new token from...',
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
            <div className="step--1">
              <p>
                <strong>2.</strong> Name the coin
              </p>
              <input
                className="Wandering__journal-input"
                type="text"
                placeholder="Enter coin's name 😋"
                value={this.tokenName}
                onChange={this.handleTokenNameChange}
              />
            </div>
            <div className="step--2">
              <p>
                <strong>2.</strong> Share the purpose of this coin. (Optional)
              </p>
              <input
                className="Wandering__journal-input"
                type="text"
                placeholder="Enter coin's purpose 🎩"
                value={this.journal}
                onChange={this.handleJournalChange}
              />
            </div>
            <div className="step--3">
              <p>
                <strong>3.</strong> Give the coin a color
              </p>
              <div>
                <CirclePicker
                  color={this.state.tokenColor}
                  onChange={this.handleColorChange}
                />
              </div>
            </div>
            <div>
              <button onClick={this.handleSubmit}>Launch the Coin</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TokenLaunch;
