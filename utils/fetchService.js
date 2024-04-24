
const fetch = require('node-fetch');

module.exports = {
    async serverFetch(url, options) {
      console.log('url in fetch service ====>>>>>', url);
      console.log('options in fetch service ====>>>>>>>', options)
        try {
            const response = await fetch(url, options);
            console.log("response : ",response);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const headers = {};
            response.headers.forEach((value, name) => {
              headers[name] = value;
            });

            console.log('headers in fetchService ==>>>>>>>', headers);
        
            const contentType = response.headers.get('content-type');
            let responseBody;
            if (contentType && contentType.includes('application/json')) {
              responseBody = await response.json();
            } else {
              responseBody = await response.text();
            }
        
            return {
              status: response.status,
              headers,
              body: responseBody,
            };
          } catch (error) {
            console.log("ERRORRRRR : ",error);
            console.error('Fetch error:', error.statusText);
            return {
                status: error.status,
                body: error.body,
              };
          }
    }
}