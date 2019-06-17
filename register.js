const { json, send, createError, run } = require('micro');
const sha512 = require('js-sha512');
const fetch = require('isomorphic-unfetch');

const register = async (req, res) => {
  const {
    fname,
    lname,
    mname,
    pass:password,
    email,
    countryiso3,
    mobileno,
    businessname,
    regtype,
    issubscribe,
  } = await json(req);
  const url = `${process.env.BASE_URL}/RetailAccessRegister`;
  const payload = {
    fname,
    lname,
    mname,
    pass: sha512(`${email.toLowerCase()}${password}`),
    email,
    countryiso3,
    mobileno,
    businessname,
    regtype,
    issubscribe,
    apikey: process.env.API_KEY,
    randomguid: process.env.GUID,
    hash: sha512(
      `${process.env.GUID}${process.env.PRIVATE_KEY}${
        process.env.API_KEY
      }${email}${countryiso3.toLowerCase()}`
    ),
  };

  try {
    console.log(payload)
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

module.exports = (req, res) => run(req, res, register);
