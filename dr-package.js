const Promise = require("promise");

function _ColaRuntime$$error(_error) {
    throw new Error(_error);
}

function _ColaRuntime$$clone(_item) {
    if (_item === undefined || _item === null) return _item;
    if (_item.__clone__ instanceof Function) return _item.__clone__();
    if (typeof _item == "number") return Number(_item);
    if (typeof _item == "string") return String(_item);
    if (typeof _item == "boolean") return Boolean(_item);
    var result;
    if (!(_item instanceof Object)) return _item;
    if (_item.nodeType && _item.cloneNode instanceof Function) return _item.cloneNode(true);
    if (!_item.prototype) {
        if (_item instanceof Date) return new Date(_item);
        if (_item instanceof Function) return _item;
        result = new (Object.getPrototypeOf(_item).constructor)();
        for (var i in _item) result[i] = _ColaRuntime$$clone(_item[i]);
        return result;
    }
    return _item;
}

"use strict";

const FS = require("fs");

const Path = require("path");

const NPM = require("npm");

NPM.load(function() {});

var shimModules = {
    process: "process",
    buffer: "buffer",
    "browserify-zlib": "zlib",
    "vm-browserify": "vm",
    util: "util",
    url: "vm",
    "tty-browserify": "tty",
    "timers-browserify": "timers",
    string_decoder: "string_decoder",
    "stream-browserify": "stream",
    querystring: "querystring",
    punycode: "punycode",
    "path-browserify": "path",
    "os-browserify": "os",
    "https-browserify": "https",
    "http-browserify": "http",
    events: "events",
    "domain-browser": "domain",
    "crypto-browserify": "crypto",
    "constants-browserify": "constants",
    "console-browserify": "console",
    assert: "assert"
};

var emptyModules = {
    child_process: "empty.js",
    dgram: "empty.js",
    dns: "empty.js",
    cluster: "empty.js",
    fs: "empty.js",
    module: "empty.js",
    net: "empty.js",
    readline: "empty.js",
    repl: "empty.js",
    tls: "empty.js"
};

function getJson() {
    var filename = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `filename` is required!");
    var jsonSource = FS.readFileSync(filename, "utf8");
    return jsonSource ? JSON.parse(jsonSource) : {};
}

function tryToFindSource() {
    var filename = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `filename` is required!"), strict = arguments[1] !== undefined ? arguments[1] : false;
    var result;
    if (FS.existsSync(filename)) {
        return filename;
    }
    if (!strict && FS.existsSync(result = "" + filename + ".js")) {
        return result;
    }
    return "";
}

function handlePackage() {
    var file = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `file` is required!"), modules = arguments[1] !== undefined ? arguments[1] : _ColaRuntime$$error("Argument `modules` is required!");
    var pkg = getJson(file), path = Path.dirname(file), index;
    if ((pkg.browser === String || String.prototype && (pkg.browser instanceof String || typeof pkg.browser === typeof String())) && (index = tryToFindSource(Path.join(path, pkg.browser)))) {
        return modules[shimModules[pkg.name] || pkg.name] = index;
    }
    if ((pkg.main === String || String.prototype && (pkg.main instanceof String || typeof pkg.main === typeof String())) && (index = tryToFindSource(Path.join(path, pkg.main)))) {
        return modules[shimModules[pkg.name] || pkg.name] = index;
    }
    if ((pkg.scripts === Array || Array.prototype && (pkg.scripts instanceof Array || typeof pkg.scripts === typeof Array())) && pkg.scripts[0] && (index = tryToFindSource(Path.join(path, pkg.scripts[0])))) {
        return modules[shimModules[pkg.name] || pkg.name] = index;
    }
    if (index = tryToFindSource("" + path + "/index.js", true)) {
        return modules[shimModules[pkg.name] || pkg.name] = index;
    }
    return false;
}

function collect() {
    var path = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `path` is required!"), modules = arguments[1] !== undefined ? arguments[1] : {};
    var ls = FS.readdirSync(path);
    var jsonPath = Path.join(path, "package.json");
    if (FS.existsSync(jsonPath)) {
        handled = handlePackage(jsonPath, modules);
    } else if (FS.existsSync(jsonPath = Path.join(path, "component.json"))) {
        handled = handlePackage(jsonPath, modules);
    }
    ls.forEach(function() {
        var file = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `file` is required!");
        if (file.indexOf(".") == 0) {
            return;
        }
        if (FS.statSync(file = Path.join(path, file)).isDirectory()) {
            collect(file, modules);
        }
    });
    return modules;
}

function install() {
    var path = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `path` is required!");
    var _ColaRuntime$$arguments = arguments;
    return new Promise(function(_ColaRuntime$$resolve, _ColaRuntime$$reject) {
        arguments = _ColaRuntime$$arguments;
        var shimPath = Path.join(path, "./browser-shim");
        if (FS.existsSync(shimPath)) {
            return _ColaRuntime$$resolve(collect(path));
        }
        Object.keys(emptyModules).forEach(function() {
            var key = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `key` is required!");
            emptyModules[key] = Path.join(shimPath, emptyModules[key]);
        });
        NPM.load(function() {
            var err = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `err` is required!");
            if (err) {
                return _ColaRuntime$$resolve(collect(path));
            }
            NPM.commands.install(shimPath, Object.keys(shimModules), function() {
                FS.writeFileSync(Path.join(shimPath, "empty.js"), "");
                return _ColaRuntime$$resolve(collect(path, _ColaRuntime$$clone(emptyModules)));
            });
        });
    }.bind(this));
}

exports.installShim = install;