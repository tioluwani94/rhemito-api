const { send, createError, run } = require('micro');
const sha512 = require('js-sha512');
const fetch = require('isomorphic-unfetch');

const countries = async (req, res) => {
  const url = `${process.env.BASE_URL}/RetailStaticDataCountries`;
  const payload = {
    apikey: process.env.API_KEY,
    randomguid: process.env.GUID,
    hash: sha512(
      `${process.env.GUID}${process.env.PRIVATE_KEY}${process.env.API_KEY}`
    ),
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      let data = await response.json();
      send(res, 200, data);
    } else {
      send(res, response.status, response.statusText);
    }
  } catch (error) {
    throw createError(error.statusCode, error.statusText);
  }
};

module.exports = (req, res) => run(req, res, countries);
