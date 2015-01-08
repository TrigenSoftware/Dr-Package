function _ColaRuntime$$error(_error) {
    throw new Error(_error);
}

"use strict";

const FS = require("fs");

const Path = require("path");

function tryToFindSource() {
    var filename = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `filename` is required!"), strict = arguments[1] !== undefined ? arguments[1] : false;
    var result;
    if (FS.existsSync(filename)) {
        return "./" + filename;
    }
    if (!strict && FS.existsSync(result = "" + filename + ".js")) {
        return "./" + result;
    }
    return false;
}

function handlePackage() {
    var file = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `file` is required!"), modules = arguments[1] !== undefined ? arguments[1] : _ColaRuntime$$error("Argument `modules` is required!");
    var pkg = require("./" + file), path = Path.dirname(file), index;
    if (index = tryToFindSource("" + path + "/index.js", true)) {
        return modules[pkg.name] = index;
    }
    if (pkg.main && (index = tryToFindSource(Path.join(path, pkg.main)))) {
        return modules[pkg.name] = index;
    }
    if ((pkg.scripts === Array || Array.prototype && (pkg.scripts instanceof Array || typeof pkg.scripts === typeof Array())) && pkg.scripts[0] && (index = tryToFindSource(Path.join(path, pkg.scripts[0])))) {
        return modules[pkg.name] = index;
    }
    return false;
}

function _() {
    var path = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `path` is required!"), modules = arguments[1] !== undefined ? arguments[1] : {};
    var ls = FS.readdirSync(path), handled;
    ls.forEach(function() {
        var file = arguments[0] !== undefined ? arguments[0] : _ColaRuntime$$error("Argument `file` is required!");
        if (file.indexOf(".") == 0) {
            return;
        }
        if (!handled && (file == "package.json" || file == "component.json")) {
            handled = handlePackage(Path.join(path, file), modules);
        }
        if (FS.statSync(file = Path.join(path, file)).isDirectory()) {
            _(file, modules);
        }
    });
    return modules;
}

exports.resolve = _;