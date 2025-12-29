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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changedPaths = changedPaths;
exports.getSortableAllTags = getSortableAllTags;
exports.getCurrentBranch = getCurrentBranch;
exports.getTaggedTime = getTaggedTime;
exports.getGithubToken = getGithubToken;
exports.listTagNames = listTagNames;
exports.lastTag = lastTag;
exports.getPreviousTag = getPreviousTag;
exports.parseLogMessage = parseLogMessage;
exports.listCommits = listCommits;
var execa_1 = __importDefault(require("execa"));
var semver_1 = __importDefault(require("semver"));
function changedPaths(sha) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.default)('git', [
                        'show',
                        '-m',
                        '--name-only',
                        '--pretty=format:',
                        '--first-parent',
                        sha,
                    ])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.stdout.split('\n')];
            }
        });
    });
}
function getSortableAllTags() {
    return execa_1.default
        .sync('git', ['tag', '-l'])
        .stdout.split(/\n/)
        .sort(function (a, b) {
        var v1 = a.replace(/^v/, '');
        var v2 = b.replace(/^v/, '');
        return semver_1.default.gte(v1, v2) ? -1 : 1;
    });
}
function getCurrentBranch() {
    return execa_1.default.sync('git', ['branch', '--show-current']).stdout;
}
function getTaggedTime(tag) {
    return execa_1.default.sync('git', ['log', '-1', '--format=%ai', tag]).stdout;
}
function getGithubToken() {
    return process.env.GITHUB_AUTH;
}
/**
 * All existing tags in the repository
 */
function listTagNames() {
    return execa_1.default.sync('git', ['tag']).stdout.split('\n').filter(Boolean);
}
/**
 * The latest reachable tag starting from HEAD
 */
function lastTag() {
    return execa_1.default.sync('git', ['describe', '--abbrev=0', '--tags']).stdout;
}
function getPreviousTag(current) {
    return execa_1.default.sync('git', ['describe', '--abbrev=0', '--tags', current + '^'])
        .stdout;
}
function parseLogMessage(commit) {
    var parts = commit.match(/hash<(.+)> ref<(.*)> message<(.*)> date<(.*)> author<(.*)>/) || [];
    if (!parts || parts.length === 0) {
        return null;
    }
    return {
        sha: parts[1],
        refName: parts[2],
        summary: parts[3],
        date: parts[4],
        author: parts[5],
    };
}
function listCommits(from, to) {
    if (to === void 0) { to = ''; }
    // Prints "hash<short-hash> ref<ref-name> message<summary> date<date>"
    // This format is used in `getCommitInfos` for easily analize the commit.
    return execa_1.default
        .sync('git', [
        'log',
        '--oneline',
        '--pretty="hash<%h> ref<%D> message<%s> date<%cd> author<%an>"',
        '--date=short',
        "".concat(from, "..").concat(to),
    ])
        .stdout.split('\n')
        .filter(Boolean)
        .map(parseLogMessage)
        .filter(Boolean);
}
