const { json, send, createError, run } = require('micro');
const sha512 = require('js-sha512');
const fetch = require('isomorphic-unfetch');

const login = async (req, res) => {
  const { pass: password, email } = await json(req);
  const url = `${process.env.BASE_URL}/RetailAccessLogin`;
  const payload = {
    Pass: sha512(`${email.toLowerCase()}${password}`),
    Email: email,
    apikey: process.env.API_KEY,
    randomguid: process.env.GUID,
    hash: sha512(
      `${process.env.GUID}${process.env.PRIVATE_KEY}${
        process.env.API_KEY
      }${email}`
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
      const { RetailApiResponse } = data;
      send(res, 200, RetailApiResponse);
    } else {
      send(res, response.status, response.statusText);
    }
  } catch (error) {
    throw createError(error.statusCode, error.statusText);
  }
};

module.exports = (req, res) => run(req, res, login);
