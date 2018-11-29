import Geocode from 'react-geocode';

export const getCurrentLocation = () => {
  // let location = {
  //   streetAddress: '',
  //   latitude: '',
  //   longitude: '',
  // };

  // if ('geolocation' in navigator) {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const geoAddress = await addressFromGeo(
        position.coords.latitude,
        position.coords.longitude,
      );

      resolve({
        streetAddress: geoAddress,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  });
};

export const defaultLocation = () => {
  return { lat: 39.7599499, lng: -104.9838489 };
};

export const addressFromGeo = (lat, lng) => {
  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);

  return Geocode.fromLatLng(lat, lng).then(
    (response) => {
      return response.results[0].formatted_address;
    },
    (error) => {
      console.error(error);
      return '';
    },
  );
};
