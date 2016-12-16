'use strict';

var Promise = require('bluebird');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

var bunyan = require('bunyan');
var axios = require('axios');
var serializers = require('../index');

const PORT = 3030;

class CapturingStream {

  constructor(records) {
    this.records = records || [];
  }

  write (record) {
    this.records.push(record);
  }

  get last () {
    return this.records[this.records.length - 1];
  }
}
let stream = new CapturingStream();
let log = bunyan.createLogger({
  name: 'bunyan-axios-serializer test',
  level: 'debug',
  streams: [{
    stream,
    type: 'raw'
  }],
  serializers
});

let requester = axios.create({
  baseURL: `http://127.0.0.1:${PORT}`,
});

let server = require('./server');

describe('bunyan-axios-serializer', function () {

  before(function (done) {
    server.start(PORT, done);
  });

  it ('serialize "res" (response)', function () {

    return requester.get('/')
      .then((res) => {
        log.info({ res, data: res.data }, 'Axios Response');
        ensureSerializedAxiosResponse(stream.last.res);
      });
  });

  it ('serialize "err" (error)', function () {

    return requester.get('/error')
      .catch((err) => {
        log.error({ err, data: err.response.data  }, 'Axios Error');
        ensureSerializedAxiosError(stream.last.err);
      });
  });

  it ('serialize "axios" (response)', function () {

    return requester.get('/')
      .then((res) => {
        log.info({ axios: res, data: res.data }, 'Axios Response');
        ensureSerializedAxiosResponse(stream.last.axios);
      });
  });

  it ('serialize "axios" (error)', function () {

    return requester.get('/error')
      .catch((err) => {
        log.error({ axios: err, data: err.response.data  }, 'Axios Error');
        ensureSerializedAxiosError(stream.last.axios);
      });
  });

});

function ensureSerializedAxiosResponse(res) {
  expect(res).to.have.all.keys('statusCode', 'statusText', 'headers', 'request');
  expect(res.statusCode).to.be.a('number');
  expect(res.statusText).to.be.a('string');
  expect(res.headers).to.be.an('object');
}

function ensureSerializedAxiosError(err) {
  expect(err).to.have.all.keys('response', 'stack', 'message', 'name');
  expect(err.stack).to.be.a('string');
  expect(err.message).to.be.a('string');
  expect(err.name).to.be.a('string');
  ensureSerializedAxiosResponse(err.response);
}
