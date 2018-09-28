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
    console.log(e);
    // this.setState({ toAddress: e.value });
  };

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log('Success', latLng);
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

    //TODO: might need to reset the form
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
    console.log(this.state.toAddress);
    // console.log(this.state.toAddress.length);

    // const validToAddress = this.state.toAddress.length > 11;

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
                      placeholder: 'Search Places...',
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
            <p>Lat: {this.state.latitude}</p>
            <p>Lng: {this.state.longitude}</p>
            <div>
              <input
                className="Wandering__address-input"
                type="text"
                placeholder="to address"
                onChange={this.handleAddressChange}
              />
              <button
                onClick={(e) => this.handleSubmit}
                // disabled={!validToAddress}
              >
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
