"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var _antDesignVue = require("ant-design-vue");

var _router = require("@/router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_axios["default"].defaults.timeout = 10000;
_axios["default"].defaults.baseURL = 'http://localhost:8080/api';
var PREFIX = 'Bearer ';

_axios["default"].interceptors.request.use(function (config) {
  var token = _jsCookie["default"].get('token');

  if (token) {
    config.headers['Authorization'] = PREFIX + token;
  }

  return config;
}, function (error) {
  // Do something with request error
  _antDesignVue.notification.error({
    message: error.message,
    description: '操作成功'
  });

  return Promise.reject(error);
});

_axios["default"].interceptors.response.use(function (response) {
  var headers = response.headers;

  if (headers && headers.authorization) {
    var token = response.headers.authorization;

    _jsCookie["default"].set('token', token);
  }

  var _response$data = response.data,
      code = _response$data.code,
      msg = _response$data.msg;

  if (code === 20000) {
    return Promise.resolve(response.data);
  }

  if (code === 40001) {
    _antDesignVue.message.error(msg);

    _jsCookie["default"].remove('token');

    _router.router.push('/login');
  }

  if (code === 40002) {
    _antDesignVue.message.error(msg);
  }

  if (code == 40003) {
    _antDesignVue.notification.error({
      message: msg,
      duration: null,
      description: '请联系管理员'
    });
  }

  if (code > 40100) {
    _antDesignVue.notification.error({
      message: msg
    });
  }

  if (code >= 40000) {
    _antDesignVue.notification.error({
      message: msg
    });

    return Promise.reject(response.data);
  }
}, function (error) {
  _antDesignVue.notification.error({
    message: error.message,
    description: '请联系管理员1'
  });

  return Promise.reject(error);
});

var _default = _axios["default"];
exports["default"] = _default;