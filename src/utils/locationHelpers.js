import Geocode from 'react-geocode';

export const getCurrentLocation = () => {
  const location = {
    streetAddress: '',
    latitude: '',
    longitude: '',
  };

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      return {
        streetAddress: addressFromGeo(
          position.coords.latitude,
          position.coords.longitude,
        ),
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        autolocated: true,
      };
    });
  }

  return location;
};

export const defaultLocation = () => {
  return { lat: 39.7599499, lng: -104.9838489 };
};

export const addressFromGeo = (lat, lng) => {
  Geocode.setApiKey('AIzaSyC5UNPRmxLtv-42ZBHnArD6msTp5aiEAGc');

  Geocode.fromLatLng(lat, lng).then(
    (response) => {
      return response.results[0].formatted_address;
    },
    (error) => {
      console.error(error);
      return '';
    },
  );
};
