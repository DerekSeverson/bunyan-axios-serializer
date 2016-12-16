'use strict';

let is = require('./is');

// ---
// Exports

exports.axios = function (o) {
  if (is.res(o)) return serializeAxiosResponse(o);
  if (is.err(o)) return serializeAxiosError(o);
  return o;
};

exports.res = function (o) {
  return is.res(o) ? serializeAxiosResponse(o) : o;
}

exports.err = function (o) {
  return is.err(o) ? serializeAxiosError(o) : o;
}

// ---
// Serializers

function serializeAxiosResponse(o) {
  return {
    statusCode: o.status,
    statusText: o.statusText,
    headers: o.headers,
    request: {
      method: o.config.method,
      url: o.config.url,
      headers: o.config.headers
    }
  };
}

function serializeAxiosError(o) {
  return {
    message: o.message,
    name: o.name,
    stack: o.stack,
    response: serializeAxiosResponse(o.response)
  };
}
