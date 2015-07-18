package com.tamina.npmlib.config;
@:enum abstract ProcessArgument(String) from String to String  {
    var BUILD = 'publish';
    var ADD = 'add';
    var UPDATE = 'update';
    var HELP = 'help';
}
