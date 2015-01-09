#!/usr/bin/env node
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
        var output = "./packages.json", packages = JSON.stringify(drp.resolve(firstArg), null, "	");
        if (cli.args[0] == "to") {
            cli.read();
            output = cli.read();
            drp.installShim(path.dirname(output));
            fs.writeFileSync(/\/$/.test(output) ? "" + output + "/packages.json" : output, packages, "utf8");
        } else {
            drp.installShim(path.dirname(output));
            fs.writeFileSync(output, packages, "utf8");
        }
        cli.end();
    }
} catch (e) {
    console.log("❗️  " + e.message.red);
    process.exit();
}