const { json, send, createError, run } = require('micro');
const sha512 = require('js-sha512');
const fetch = require('isomorphic-unfetch');

const accountOverview = async (req, res) => {
  const {
    sessiontoken,
    uid,
  } = await json(req);
  const url = `${process.env.BASE_URL}/RetailAccessRegister`;
  const payload = {
    sessiontoken,
    uid,
    apikey: process.env.API_KEY,
    randomguid: process.env.GUID,
    hash: sha512(
      `${process.env.GUID}${process.env.PRIVATE_KEY}${
        process.env.API_KEY
      }${sessiontoken}${uid}`
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

module.exports = (req, res) => run(req, res, accountOverview);
