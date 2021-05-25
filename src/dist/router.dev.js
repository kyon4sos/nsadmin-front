"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = exports.router = void 0;

var _vueRouter = require("vue-router");

var _Login = _interopRequireDefault(require("./views/Login.vue"));

var _DefaultLayout = _interopRequireDefault(require("./layout/DefaultLayout.vue"));

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var _vuex = require("vuex");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var routerHistory = (0, _vueRouter.createWebHistory)();
var routes = [{
  path: '/login',
  component: _Login["default"],
  meta: {
    title: '登录'
  }
}, {
  path: '/',
  component: _DefaultLayout["default"],
  redirect: '/sysuser',
  meta: {
    title: '用户管理'
  },
  children: [{
    name: 'WxUser',
    path: '/wxuser',
    meta: {
      title: '微信用户'
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require('@/views/WxUserList.vue'));
      });
    }
  }, {
    name: 'SysUser',
    path: '/sysuser',
    meta: {
      title: '系统用户'
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require('@/views/SysUserList.vue'));
      });
    }
  }]
}, {
  path: '/system',
  component: _DefaultLayout["default"],
  redirect: '/menu',
  meta: {
    title: '系统管理'
  },
  children: [{
    name: 'Rule',
    path: '/menu',
    meta: {
      title: '菜单管理'
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require('@/views/Menu.vue'));
      });
    }
  }, {
    name: 'Role',
    path: '/role',
    meta: {
      title: '角色管理'
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require('@/views/Role.vue'));
      });
    }
  }, {
    name: 'task',
    path: '/task',
    meta: {
      title: '任务管理'
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require('@/views/Task.vue'));
      });
    }
  }]
}, {
  path: '/audit',
  component: _DefaultLayout["default"],
  redirect: '/record',
  meta: {
    title: '操作记录'
  },
  children: [{
    name: 'Record',
    path: '/record',
    meta: {
      title: '查询记录'
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require('@/views/Audit.vue'));
      });
    }
  }]
}];
exports.routes = routes;
var router = (0, _vueRouter.createRouter)({
  history: routerHistory,
  routes: routes
});
exports.router = router;
var store = _vuex.userStore;
var whiteList = ["/login"];
router.beforeEach(function (to, from, next) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = whiteList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var url = _step.value;

      if (url === to.fullPath) {
        next();
        return;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var token = _jsCookie["default"].get("token");

  if (token) {
    console.log("token", token);
    next();
    return;
  }

  return;
});