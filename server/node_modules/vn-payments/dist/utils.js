'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlRegExp = undefined;
exports.toUpperCase = toUpperCase;
exports.pack = pack;
exports.hashHmac = hashHmac;
exports.to2DigitNumber = to2DigitNumber;
exports.vnPayDateFormat = vnPayDateFormat;
exports.createMd5Hash = createMd5Hash;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const urlRegExp = /https?:\/\/.*/; /* © 2018 NauStud.io
                                    * @author Eric Tran
                                    */
/** @module utils */

exports.urlRegExp = urlRegExp;

/**
 * Global function to convert String to upper case, with type checking
 *
 * @param {string} s
 * @return {string} all upper case string
 */

function toUpperCase(s = '') {
  if (typeof s !== 'string') {
    throw new Error('toUpperCase:param must be string');
  }

  return s.toUpperCase();
}

/**
 * Equivalent to PHP's `pack` function, using Node native Buffer
 * <br>
 * Note: PHP
 * <br>
 * <pre>    <code>pack('H*', data)</code></pre>
 * is equivalent to Node:
 * <br>
 * <pre>    <code>Buffer.from(data, 'hex')</code></pre>
 *
 * @param {*} data
 * @param {*} encoding
 * @return {Buffer} Buffer of data encoded with `encoding` method
 */
function pack(data, encoding = 'hex') {
  return Buffer.from(data, encoding);
}

/**
 * Equivalent to PHP's `hash_hmac` function.
 *
 * @param  {string} algorithm  hashing algorithm
 * @param  {*}      data       data string to be hashed
 * @param  {Buffer} secret     Secret key used to hash data, generated with `pack` method
 * @return {string}            digested hash
 */
function hashHmac(algorithm, data, secret) {
  const hmac = _crypto2.default.createHmac(algorithm, secret);
  hmac.update(data);

  return hmac.digest('hex');
}

/**
 * Convenient function to convert number to 2 digit number string
 * @param {*} number
 * @return {string} formatted number
 */
function to2DigitNumber(number) {
  if (isNaN(number)) {
    throw new Error('to2DigitNumber:param must be a number');
  }
  if (!number) {
    return '00';
  }

  return `0${number}`.substr(-2, 2);
}

/**
 * Convenient function to convert date to format yyyyMMddHHmmss
 *
 * @param {Date} date Date object that need to be formatted
 * @return {string} date string formatted in yyyyMMddHHmmss
 */
function vnPayDateFormat(date) {
  if (date.constructor.name !== 'Date') {
    throw new Error('vnPayDateFormat:param must be a date');
  }

  let result = '';
  result += date.getFullYear().toString();
  result += to2DigitNumber(date.getMonth() + 1);
  result += to2DigitNumber(date.getDate());
  result += to2DigitNumber(date.getHours());
  result += to2DigitNumber(date.getMinutes());
  result += to2DigitNumber(date.getSeconds());

  return result;
}

/**
 * Convenient function to create md5 hash from string.
 *
 * @param {*} data
 * @return {string} md5 hash
 */
function createMd5Hash(data) {
  return _crypto2.default.createHash('md5').update(data).digest('hex');
}
//# sourceMappingURL=utils.js.map