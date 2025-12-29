"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gh_release_1 = __importDefault(require("gh-release"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var moment_1 = __importDefault(require("moment"));
var string_similarity_1 = require("string-similarity");
var git_1 = require("./git");
var LernaJSON = fs_extra_1.default.readJSONSync(path_1.default.resolve(__dirname, '../../lerna.json'));
var ReleaseTitle = 'Designable Release 🚀';
var GithubRepo = 'https://github.com/alibaba/designable';
var CommitGroupBy = [
    [':tada: Enhancements', ['feat', 'features', 'feature']],
    [':beetle: Bug Fixes', ['bug', 'bugfix', 'fix']],
    [':boom: Breaking Changes', ['breaking', 'break']],
    [':memo: Documents Changes', ['doc', 'docs']],
    [':rose: Improve code quality', ['refactor', 'redesign']],
    [':rocket: Improve Performance', ['perf']],
    [':hammer_and_wrench: Update Workflow Scripts', ['build']],
    [':construction: Add/Update Test Cases', ['test']],
    [':blush: Other Changes', ['chore']],
];
var isPublishMessage = function (str) {
    if (/chore\(\s*(?:versions?|publish)\s*\)/.test(str))
        return true;
    return /publish v?(?:\d+)\.(?:\d+)\.(?:\d+)/.test(str);
};
var getCurrentChanges = function (from, to) {
    if (from === void 0) { from = (0, git_1.lastTag)(); }
    if (to === void 0) { to = 'HEAD'; }
    var summarys = [];
    return (0, git_1.listCommits)(from, to).filter(function (_a) {
        var summary = _a.summary;
        if (summarys.some(function (target) { return (0, string_similarity_1.compareTwoStrings)(target, summary) > 0.5; }))
            return false;
        if (isPublishMessage(summary))
            return false;
        summarys.push(summary);
        return true;
    });
};
var getGroupChanges = function (from, to) {
    if (from === void 0) { from = (0, git_1.lastTag)(); }
    if (to === void 0) { to = 'HEAD'; }
    var changes = getCurrentChanges(from, to);
    var results = CommitGroupBy.map(function (_a) {
        var _b = __read(_a, 1), group = _b[0];
        return [
            group,
            [],
        ];
    });
    changes.forEach(function (_a) {
        var e_1, _b;
        var summary = _a.summary, author = _a.author, sha = _a.sha;
        var _loop_1 = function (group, value) {
            if (value.some(function (target) { return new RegExp(target).test(summary); })) {
                results.forEach(function (item) {
                    if (item[0] === group) {
                        item[1].push("[".concat(summary, "](").concat(GithubRepo, "/commit/").concat(sha, ") :point_right: ( [").concat(author, "](https://github.com/").concat(author, ") )"));
                    }
                });
            }
        };
        try {
            for (var CommitGroupBy_1 = __values(CommitGroupBy), CommitGroupBy_1_1 = CommitGroupBy_1.next(); !CommitGroupBy_1_1.done; CommitGroupBy_1_1 = CommitGroupBy_1.next()) {
                var _c = __read(CommitGroupBy_1_1.value, 2), group = _c[0], value = _c[1];
                _loop_1(group, value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (CommitGroupBy_1_1 && !CommitGroupBy_1_1.done && (_b = CommitGroupBy_1.return)) _b.call(CommitGroupBy_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    return results.filter(function (_a) {
        var _b = __read(_a, 2), value = _b[1];
        return value.length > 0;
    });
};
var createChangelog = function (from, to) {
    if (from === void 0) { from = (0, git_1.lastTag)(); }
    if (to === void 0) { to = 'HEAD'; }
    var isHead = to === 'HEAD';
    var headVersion = isHead ? LernaJSON === null || LernaJSON === void 0 ? void 0 : LernaJSON.version : to;
    var changes = getGroupChanges(from, to);
    var nowDate = isHead
        ? (0, moment_1.default)().format('YYYY-MM-DD')
        : (0, moment_1.default)((0, git_1.getTaggedTime)(to), 'YYYY-MM-DD').format('YYYY-MM-DD');
    var log = changes
        .map(function (_a) {
        var _b = __read(_a, 2), group = _b[0], contents = _b[1];
        return "\n### ".concat(group, "\n").concat(contents
            .map(function (content) {
            return "\n1. ".concat(content, "    \n");
        })
            .join(''), "  \n");
    })
        .join('');
    return "\n## ".concat(headVersion, "(").concat(nowDate, ")\n\n").concat(log ? log : '### No Change Log', "\n");
};
var isPrerelease = function (tag) {
    return /(?:beta|rc|alpha)/.test(tag);
};
var createReleaseNote = function () {
    var to = (0, git_1.lastTag)();
    var from = (0, git_1.getPreviousTag)(to);
    var body = createChangelog(from, to);
    var branch = (0, git_1.getCurrentBranch)();
    var token = (0, git_1.getGithubToken)();
    return new Promise(function (resolve, reject) {
        (0, gh_release_1.default)({
            cli: true,
            tag_name: to,
            target_commitish: branch,
            name: "".concat(ReleaseTitle, " - ").concat(to),
            body: body,
            draft: false,
            prerelease: isPrerelease(to),
            owner: 'alibaba',
            repo: 'designable',
            endpoint: 'https://api.github.com',
            auth: {
                token: token,
            },
        }, function (err, response) {
            if (err) {
                reject();
            }
            else {
                resolve(response);
            }
        });
    });
};
var generateChangeLogFile = function () {
    var tags = (0, git_1.getSortableAllTags)();
    var file = "\n# Changelog\n".concat(tags
        .slice(0, 40)
        .map(function (newer, index) {
        var older = tags[index + 1];
        if (older) {
            return createChangelog(older, newer);
        }
        return '';
    })
        .join(''), "  \n");
    fs_extra_1.default.writeFileSync(path_1.default.resolve(__dirname, '../../CHANGELOG.md'), file, 'utf8');
};
if (process.argv.includes('release')) {
    createReleaseNote();
    console.log('🎉：Release Note upload success!');
}
else if (process.argv.includes('changelog')) {
    generateChangeLogFile();
    console.log('🎉：Changelog generate success!');
}
