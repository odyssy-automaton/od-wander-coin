import uuid from 'uuid/v1';

export default class OdJsonService {
  apiBaseURL = 'https://exav81qxa6.execute-api.us-east-1.amazonaws.com/dev';
  jsonBaseUrl = 'https://s3.amazonaws.com/odyssy-json/';

  verifyBaseURL(uri) {
    return uri.indexOf(this.jsonBaseUrl) === 0;
  }

  getUri(erc721Meta) {
    const uniqueName = uuid() + '.json';

    const jsonse = JSON.stringify(erc721Meta);
    const blob = new Blob([jsonse], { type: 'application/json' });

    return fetch(this.apiBaseURL + '/requestUploadURL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: uniqueName,
        type: 'application/json',
      }),
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        return fetch(json.uploadURL, {
          method: 'PUT',
          body: blob,
        });
      })
      .then(() => {
        const uri = this.jsonBaseUrl + uniqueName;
        console.log('uri', uri);

        return uri;
      });
  }
}
