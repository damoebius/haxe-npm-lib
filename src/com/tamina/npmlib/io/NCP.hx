package com.tamina.npmlib.io;
/**
 * Class that gives access to the 'ncp' module.
 */
@:native("(require('ncp'))")
extern class NCP
{
    static function ncp(source:String,destination:String,?callback:String->Void):Void;
}
