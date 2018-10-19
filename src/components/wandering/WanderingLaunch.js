import React, { Component } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class WanderingNew extends Component {
  state = {
    streetAddress: '',
    latitude: '',
    longitude: '',
    toAddress: '',
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
    });
  };

  render() {
    const showWarning = this.state.toAddress.length < 5;

    return (
      <div>
        <h3>You are not the owner. Launch a New Coin.</h3>
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
                      placeholder: 'Launch the coin from...',
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
            <div>
              <button onClick={this.handleSubmit}>Luanch the Coin</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default WanderingNew;
