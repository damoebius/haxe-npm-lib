![Haxe logo](http://haxe.org/img/haxe-logo.svg)

Haxelib.js
========

## About

Haxelib.js is a tool used to automatically publish haxe libraries to NPM.
It's written in Haxe and run as a command line with nodejs.
THe server side is written in Haxe and published in PHP.

[list of published libs](https://www.npmjs.com/~haxelib.js)

## Installation

If you have the node package manager, npm, installed:

```shell
npm install -g haxelib
```

## Getting Started

### Display information about how to using this module.

```shell
haxelib help
```

### Update local lib list

```shell
haxelib update
```


### Add a new Lib to haxelib

```shell
haxelib add
```

it will prompt for a lib name, description, author, and git url to clone the project



### Publish all libs to NPM

```shell
haxelib publish
```

Do not use this, the server on haxelib.tamina-online.com will publish automatically all new libs.