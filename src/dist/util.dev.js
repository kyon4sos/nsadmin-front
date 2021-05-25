"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listMapTree = exports.sortFirstWord = exports.sortUrl = void 0;

var sortUrl = function sortUrl(a, b) {
  a = a.replace('/', '').split()[0];
  b = b.replace('/', '').split()[0];
  return a.toUpperCase().charCodeAt() - b.toUpperCase().charCodeAt();
};

exports.sortUrl = sortUrl;

var sortFirstWord = function sortFirstWord(a, b) {
  a = a.split()[0];
  b = b.split()[0];
  return a.toUpperCase().charCodeAt() - b.toUpperCase().charCodeAt();
};

exports.sortFirstWord = sortFirstWord;

var listMapTree = function listMapTree(list) {
  if (list instanceof Array) {
    return list.map(function (item) {
      return {
        value: item.id,
        label: item.name,
        children: listMapTree(item.children)
      };
    });
  }

  return [];
};

exports.listMapTree = listMapTree;