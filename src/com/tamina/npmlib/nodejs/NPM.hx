package com.tamina.npmlib.nodejs;
/**
 * Class that gives access to the 'npm' module.
 */
import js.Error;
@:native("(require('npm'))")
extern class NPM
{
    static var commands:NPMCommands;
    static function load():Void;
}

typedef NPMCommands = {
    function view(args:Array<String>, ?silent:Bool, ?callback:NPMError->Dynamic->Void):Void;
}

typedef NPMError = {
    var code:String;
    var message:String;
    var pkgid:String;
}

