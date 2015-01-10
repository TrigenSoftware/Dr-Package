#!/usr/bin/env node
var arguments;

const Promise = require("promise");

function _ColaRuntime$$promise(_promise, _then, _this) {
    if (!_promise.then) throw new Error("Function is not async.");
    _promise.then(_then.bind(_this));
}

const drp = require("./dr-package");

const cli = require("argue-cli");

const cs = require("colors");

const fs = require("fs");

const path = require("path");

try {
    var firstArg = cli.args[0] ? cli.read() : "./";
    switch (firstArg) {
      case "help":
        console.log('Example of usage:\n    drp <help | version>\n    drp [<path-to-dir-with-packages> [to <path-to-packages-json>]]\n        <path-to-dir-with-packages> is "./" by default\n        <path-to-packages-json>     is "./packages.json" by default');
        process.exit();
        break;

      case "version":
        var json = require("./package.json");
        console.log(json.name + " " + json.version);
        process.exit();
        break;

      default:
        var _ColaRuntime$$arguments = arguments;
        _ColaRuntime$$promise(drp.installShim(firstArg), function(_ColaRuntime$$fulfilled0, _ColaRuntime$$rejected0) {
            arguments = _ColaRuntime$$arguments;
            var output = "./packages.json", packages = JSON.stringify(_ColaRuntime$$fulfilled0, null, "	");
            if (cli.args[0] == "to") {
                cli.read();
                output = cli.read();
                fs.writeFileSync(/\/$/.test(output) ? "" + output + "/packages.json" : output, packages, "utf8");
            } else {
                fs.writeFileSync(output, packages, "utf8");
            }
            cli.end();
        }, this);
    }
} catch (e) {
    console.log("❗️  " + e.message.red);
    process.exit();
}