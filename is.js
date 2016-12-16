'use strict';

var isError = require('lodash.iserror');

exports.err = isAxiosError;
exports.res = isAxiosResponse;
exports.config = isAxiosConfig;

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
