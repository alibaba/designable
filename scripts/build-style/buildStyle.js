"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStyle = void 0;
var fs_extra_1 = require("fs-extra");
var helper_1 = require("./helper");
var importCssCompilerToCss = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var styleFileContent;
    var fileName = _b.fileName, outputFileName = _b.outputFileName, styleEntry = _b.styleEntry, transform = _b.transform;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fs_extra_1.readFile)(fileName)];
            case 1:
                styleFileContent = (_c.sent()).toString();
                if (!styleFileContent) {
                    return [2 /*return*/];
                }
                styleFileContent = styleFileContent.replace(new RegExp("./".concat(styleEntry)), './css.css');
                return [2 /*return*/, (0, fs_extra_1.outputFile)(outputFileName, (transform === null || transform === void 0 ? void 0 : transform(styleFileContent)) || styleFileContent)];
        }
    });
}); };
var getPaths = function (filename, moduleType) {
    var styleFilePath = filename
        .replace(/src\//, "".concat(moduleType, "/"))
        .replace(/\.ts$/, '.js');
    var cssFilePath = styleFilePath.replace(/\/\w+\.js$/, '/css.css');
    var cssSourceMapFilePath = "".concat(cssFilePath, ".map");
    return {
        // esm/array-base/style.js
        styleFilePath: styleFilePath,
        // esm/array-base/css.css
        cssFilePath: cssFilePath,
        // esm/array-base/css.css.map
        cssSourceMapFilePath: cssSourceMapFilePath,
    };
};
var buildCss = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var input;
    var filename = _b.filename, esmPaths = _b.esmPaths, libPaths = _b.libPaths, styleEntry = _b.styleEntry;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                input = filename.replace(/style\.ts$/, styleEntry);
                if (!(0, fs_extra_1.existsSync)(input)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, helper_1.build)({
                        input: input,
                        output: {
                            file: esmPaths.cssFilePath,
                        },
                        plugins: (0, helper_1.getRollupBasePlugin)(),
                    })];
            case 1:
                _c.sent();
                return [2 /*return*/, Promise.all([
                        (0, fs_extra_1.copy)(esmPaths.cssFilePath, libPaths.cssFilePath),
                        (0, fs_extra_1.existsSync)(esmPaths.cssSourceMapFilePath) &&
                            (0, fs_extra_1.copy)(esmPaths.cssSourceMapFilePath, libPaths.cssSourceMapFilePath),
                    ])];
        }
    });
}); };
var buildStyle = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var esmPaths, libPaths;
    var 
    // xxxx/style.ts
    filename = _b.filename, 
    // example: style.less/main.scss
    styleEntry = _b.styleEntry, importCssCompilerToCssTransform = _b.importCssCompilerToCssTransform;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                esmPaths = getPaths(filename, 'esm');
                libPaths = getPaths(filename, 'lib');
                return [4 /*yield*/, buildCss({
                        filename: filename,
                        esmPaths: esmPaths,
                        libPaths: libPaths,
                        styleEntry: styleEntry,
                    })];
            case 1:
                _c.sent();
                return [2 /*return*/, Promise.all([
                        importCssCompilerToCss({
                            fileName: esmPaths.styleFilePath,
                            outputFileName: esmPaths.cssFilePath.replace(/\.css$/, '.js'),
                            styleEntry: styleEntry,
                            transform: importCssCompilerToCssTransform,
                        }),
                        importCssCompilerToCss({
                            fileName: libPaths.styleFilePath,
                            outputFileName: libPaths.cssFilePath.replace(/\.css$/, '.js'),
                            styleEntry: styleEntry,
                            transform: importCssCompilerToCssTransform,
                        }),
                    ])];
        }
    });
}); };
exports.buildStyle = buildStyle;
