"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCopy = void 0;
exports.build = build;
var copy_js_1 = require("./copy.js");
Object.defineProperty(exports, "runCopy", { enumerable: true, get: function () { return copy_js_1.runCopy; } });
var buildAllStyles_js_1 = require("./buildAllStyles.js");
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function build(_a) {
    var allStylesOutputFile = _a.allStylesOutputFile, opts = __rest(_a, ["allStylesOutputFile"]);
    return Promise.all([(0, buildAllStyles_js_1.buildAllStyles)(allStylesOutputFile), (0, copy_js_1.runCopy)(opts)]);
}
