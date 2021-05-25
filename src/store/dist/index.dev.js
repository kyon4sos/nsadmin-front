"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vuex = require("vuex");

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  activeTab: null,
  routes: ['Home', 'About'],
  tabs: [],
  userInfo: null,
  token: null
};
var mutations = {
  SET_ACTIVE_TAB: function SET_ACTIVE_TAB(state, playload) {
    state.activeTab = playload;
  },
  SET_TABS: function SET_TABS(state, playload) {
    var index = state.tabs.findIndex(function (t) {
      return t.key == playload.key;
    });

    if (index === -1) {
      state.tabs.push(playload);
    }

    mutations['SET_ACTIVE_TAB'](playload);
  },
  SET_USER_INFO: function SET_USER_INFO(state, user) {
    if (user) {
      _jsCookie["default"].set('user', JSON.stringify(user));
    }

    state.userInfo = user;
  },
  SET_TOKEN: function SET_TOKEN(state, token) {
    if (token) {
      _jsCookie["default"].set('token', token);
    }

    state.token = token;
  },
  LOGOUT: function LOGOUT(state) {
    _jsCookie["default"].remove('user');

    _jsCookie["default"].remove('token');

    state.token = null, state.userInfo = null;
  }
};
var getters = {
  getActiveTab: function getActiveTab(state) {
    return state.activeTab;
  },
  getUserInfo: function getUserInfo(state) {
    return state.userInfo;
  }
};
var actions = {
  SET_USER_INFO: function SET_USER_INFO(context, data) {
    context.commit('SET_USER_INFO', data);
  },
  SET_TOKEN: function SET_TOKEN(context, data) {
    context.commit('SET_TOKEN', data);
  },
  LOGOUT: function LOGOUT(context) {
    context.commit('LOGOUT');
  }
};

var _default = (0, _vuex.createStore)({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
});

exports["default"] = _default;