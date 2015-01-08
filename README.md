*Dr Package*
==========

Utility for collecting CommonJS packages for [ColaScript](https://github.com/TrigenSoftware/ColaScript).

## Installation

Firstly, make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

From NPM for use as a command line app:

```
$ npm install dr-package -g
```

From NPM for programmatic use:

```
$ npm install dr-package
```

## Usage

```
Example of usage:
    drp <help | version>
    drp [<path-to-dir-with-packages> [to <path-to-packages-json>]]
        <path-to-dir-with-packages> is "./" by default
        <path-to-packages-json>     is "./packages.json" by default
```
       
Simple example of usage:

```
$ drp ./ to ../packages.json
```