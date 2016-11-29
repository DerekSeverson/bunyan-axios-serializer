'use strict';

var isError = require('lodash.iserror');

// ---
// Exports

exports.axios = function (o) {
  if (isAxiosResponse(o)) return serializeAxiosResponse(o);
  if (isAxiosError(o)) return serializeAxiosError(o);
  return o;
};

exports.axios.res = function (o) {
  return isAxiosResponse(o) ? serializeAxiosResponse(o) : o;
}

exports.axios.err = function (o) {
  return isAxiosError(o) ? serializeAxiosError(o) : o;
}

exports.axios.is = {};
exports.axios.is.err = isAxiosError;
exports.axios.is.res = isAxiosResponse;
exports.axios.is.config = isAxiosConfig;

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

// ---
// Predicate Functions

function isAxiosResponse(o) {
  return o &&
    has(o, 'status') &&
    has(o, 'statusText') &&
    exists(o.headers) &&
    exists(o.request) &&
    isAxiosConfig(o.config);
}

function isAxiosError(o) {
  return o &&
    isError(o) &&
    isAxiosConfig(o.config) &&
    isAxiosResponse(o.response);
}

function isAxiosConfig(o) {
  return o &&
    has(o, 'method') &&
    has(o, 'url') &&
    exists(o.headers);
    // also: data, transformRequest, transformerResponse, timeout, maxContentLength, xsrfCookieName, xsrfHeaderName, validationStatus
}

function has(o, attr) {
  return o && o.hasOwnProperty && o.hasOwnProperty(attr);
}

function exists(o) {
  return o != null;
}
