package com.tamina.npmlib.io;
class JsonFile {

    static public function GetModule( ):JsonFileModule {
        return untyped __js__("require('jsonfile')");
    }

}

extern class JsonFileModule
{
    function readFileSync(path:String):Dynamic;
}
