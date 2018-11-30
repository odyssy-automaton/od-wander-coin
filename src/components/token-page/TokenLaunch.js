import React, { Component } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class TokenLaunch extends Component {
  state = {
    streetAddress: '',
    latitude: '',
    longitude: '',
    toAddress: '',
    journal: '',
  };

  handleChange = (streetAddress) => {
    this.setState({ streetAddress });
  };

  handleAddressChange = (e) => {
    this.setState({ toAddress: e.target.value });
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
    });
  };

  render() {
    const showWarning = this.state.toAddress.length < 5;

    return (
      <div>
      <h3>Launch a New Token</h3>
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
                <p className="label">Enter a physical address to launch the token from.</p>
                  <input
                    {...getInputProps({
                      placeholder: 'Enter a physical address',
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
            {showWarning ? <p>New coins origin will be...</p> : null}
            <p>Lat: {this.state.latitude}</p>
            <p>Lng: {this.state.longitude}</p>
            <div className="step--1">
              <p>
                <strong>1.</strong> Share the purpose of this token. (Optional)
              </p>
              <input
                className="Wandering__journal-input"
                type="text"
                placeholder="Enter tokens purpose 🎩"
                value={this.journal}
                onChange={this.handleJournalChange}
              />
            </div>
            <div>
              <button onClick={this.handleSubmit}>Luanch the Coin</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TokenLaunch;
