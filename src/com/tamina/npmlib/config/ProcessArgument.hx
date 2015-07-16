package com.tamina.npmlib.config;
@:enum abstract ProcessArgument(String) from String to String  {
    var BUILD = '-build';
    var ADD = '-add';
    var HELP = '-?';
}
