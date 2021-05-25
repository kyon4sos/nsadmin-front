"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllRecords = exports.addRole = exports.getRoleByUserId = exports.updateRoleState = exports.getSysMenuById = exports.getRoutes = exports.getRoleByName = exports.getUserByPhone = exports.getSysMenuByName = exports.getUsersByPage = exports.updateUser = exports.addUser = exports.getSysMenusByPage = exports.getSysMenusTree = exports.updateRole = exports.getAllRoles = exports.getRoleByPage = exports.addSysMenu = exports.login = exports.delUser = void 0;

var _antDesignVue = require("ant-design-vue");

var _axios = _interopRequireDefault(require("./axios.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var post = function post(url, params) {
  return new Promise(function (resolve) {
    _axios["default"].post(url, params).then(function (res) {
      _antDesignVue.message.info(res.msg);

      resolve(res);
    })["catch"](function () {// notification.error({
      //   message: err.msg,
      // })
    });
  });
};

var put = function put(url, params) {
  return new Promise(function (resolve) {
    _axios["default"].put(url, params).then(function (res) {
      _antDesignVue.message.info(res.msg);

      resolve(res);
    })["catch"](function () {});
  });
};

var del = function del(url) {
  return new Promise(function (resolve) {
    _axios["default"]["delete"](url).then(function (res) {
      resolve(res);
    })["catch"](function (err) {
      return console.log(err);
    });
  });
};

var get = function get(url) {
  return new Promise(function (resolve) {
    _axios["default"].get(url).then(function (res) {
      resolve(res);
    })["catch"](function (err) {
      return console.log(err);
    });
  });
};

var login = function login(params) {
  return post('/login', params);
};

exports.login = login;

var getUserByPhone = function getUserByPhone(phone) {
  return get("/user?phone=".concat(phone));
};

exports.getUserByPhone = getUserByPhone;

var addUser = function addUser(params) {
  return post('/user', params);
};

exports.addUser = addUser;

var addRole = function addRole(params) {
  return post('/role', params);
};

exports.addRole = addRole;

var updateUser = function updateUser(user) {
  return put("/user/".concat(user.id), user);
};

exports.updateUser = updateUser;

var delUser = function delUser(id) {
  return del("/user/".concat(id));
};

exports.delUser = delUser;

var getUsersByPage = function getUsersByPage() {
  var pageInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _pageInfo$pageSize = pageInfo.pageSize,
      pageSize = _pageInfo$pageSize === void 0 ? 10 : _pageInfo$pageSize,
      _pageInfo$current = pageInfo.current,
      current = _pageInfo$current === void 0 ? 1 : _pageInfo$current;
  return get("/users?page_size=".concat(pageSize, "&current=").concat(current), pageInfo);
};

exports.getUsersByPage = getUsersByPage;

var addSysMenu = function addSysMenu(params) {
  return put('/sysmenu', params);
};

exports.addSysMenu = addSysMenu;

var getSysMenuByName = function getSysMenuByName() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var pageInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _pageInfo$pageSize2 = pageInfo.pageSize,
      pageSize = _pageInfo$pageSize2 === void 0 ? 10 : _pageInfo$pageSize2,
      _pageInfo$current2 = pageInfo.current,
      current = _pageInfo$current2 === void 0 ? 1 : _pageInfo$current2;
  return get("/sysmenu?name=".concat(name, "&page_size=").concat(pageSize, "&current=").concat(current));
};

exports.getSysMenuByName = getSysMenuByName;

var getSysMenusByPage = function getSysMenusByPage() {
  var pageInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _pageInfo$pageSize3 = pageInfo.pageSize,
      pageSize = _pageInfo$pageSize3 === void 0 ? 10 : _pageInfo$pageSize3,
      _pageInfo$current3 = pageInfo.current,
      current = _pageInfo$current3 === void 0 ? 1 : _pageInfo$current3;
  return get("/sysmenu?page_size=".concat(pageSize, "&current=").concat(current));
};

exports.getSysMenusByPage = getSysMenusByPage;

var getSysMenusTree = function getSysMenusTree() {
  return get('/sysmenu/treedata');
};

exports.getSysMenusTree = getSysMenusTree;

var getAllRoles = function getAllRoles() {
  return get('/roles');
};

exports.getAllRoles = getAllRoles;

var getSysMenuById = function getSysMenuById(id) {
  return get("/sysmenu?role_id=".concat(id));
};

exports.getSysMenuById = getSysMenuById;

var getRoleByName = function getRoleByName(name) {
  var pageInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _pageInfo$pageSize4 = pageInfo.pageSize,
      pageSize = _pageInfo$pageSize4 === void 0 ? 10 : _pageInfo$pageSize4,
      _pageInfo$current4 = pageInfo.current,
      current = _pageInfo$current4 === void 0 ? 1 : _pageInfo$current4;
  return get("/role?display_name=".concat(name, "&page_size=").concat(pageSize, "&current=").concat(current));
};

exports.getRoleByName = getRoleByName;

var getRoleByUserId = function getRoleByUserId(userId) {
  return get("/user/".concat(userId, "/role"));
};

exports.getRoleByUserId = getRoleByUserId;

var getRoleByPage = function getRoleByPage() {
  var pageInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _pageInfo$pageSize5 = pageInfo.pageSize,
      pageSize = _pageInfo$pageSize5 === void 0 ? 10 : _pageInfo$pageSize5,
      _pageInfo$current5 = pageInfo.current,
      current = _pageInfo$current5 === void 0 ? 1 : _pageInfo$current5;
  return get("/roles?page_size=".concat(pageSize, "&current=").concat(current), pageInfo);
};

exports.getRoleByPage = getRoleByPage;

var updateRole = function updateRole(role) {
  return put("/role/".concat(role.id), _objectSpread({}, role));
};

exports.updateRole = updateRole;

var updateRoleState = function updateRoleState(role) {
  return put("/role/".concat(role.id, "/state"), _objectSpread({}, role));
};

exports.updateRoleState = updateRoleState;

var getAllRecords = function getAllRecords() {
  var pageInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _pageInfo$pageSize6 = pageInfo.pageSize,
      pageSize = _pageInfo$pageSize6 === void 0 ? 10 : _pageInfo$pageSize6,
      _pageInfo$current6 = pageInfo.current,
      current = _pageInfo$current6 === void 0 ? 0 : _pageInfo$current6;
  return get("/audits?page_size=".concat(pageSize, "&current=").concat(current));
};

exports.getAllRecords = getAllRecords;

var getRoutes = function getRoutes() {
  return get('/profile');
};

exports.getRoutes = getRoutes;