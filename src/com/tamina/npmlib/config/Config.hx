package com.tamina.npmlib.config;
import com.tamina.npmlib.io.JsonFile;
class Config {

    public var rootPath:String;
    public var appPort:Int;

    private static var _instance:Config;

    private function new( ) {

    }

    public static function getInstance():Config{
        if(_instance == null){
            var loader = JsonFile.GetModule();
            _instance = cast loader.readFileSync('config.json');
        }
        return _instance;
    }
}
