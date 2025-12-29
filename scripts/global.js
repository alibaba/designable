"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pretty_format_1 = __importDefault(require("pretty-format"));
global['prettyFormat'] = pretty_format_1.default;
global['sleep'] = function (time) {
    return new Promise(function (resolve) { return setTimeout(resolve, time); });
};
global['requestAnimationFrame'] = function (fn) { return setTimeout(fn); };
global.document.documentElement.style['grid-column-gap'] = true;
