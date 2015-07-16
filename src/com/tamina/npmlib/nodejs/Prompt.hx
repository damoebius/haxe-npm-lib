package com.tamina.npmlib.nodejs;

/**
 * Class that gives access to the 'prompt' module.
 */

@:native("(require('prompt'))")
extern class Prompt {
    static function start():Void;
    static function get(params:Array<String>,callback:String->Dynamic->Void):Void;
}
