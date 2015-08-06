package com.tamina.npmlib.config;
import nodejs.NodeJS;
import com.tamina.npmlib.io.FileExtra;
import com.tamina.npmlib.model.IHaxeLib;

class Config implements IConfig {

    public var libsPath:String;
    public var packagesPath:String;
    public var version:String;
    public var serverName:String;
    public var libs:Array<IHaxeLib>;

    private static var _instance:Config;

    private function new( ) {

    }

    public static function getInstance():Config{
        if(_instance == null){
            _instance = FileExtra.readJsonSync(NodeJS.dirname+'/../config.json');
        }
        return _instance;
    }

    public static function getPackagePath():String{
        return NodeJS.dirname+'/../'+getInstance().packagesPath;
    }

    public static function getConfigPath():String{
        return NodeJS.dirname+'/../config.json';
    }

    public static function getLibsPath():String{
        return NodeJS.dirname+'/../'+getInstance().libsPath;
    }

    public static function getLibByName(name:String):IHaxeLib{
        var result:IHaxeLib = null;
        for(i in 0..._instance.libs.length){
            var lib = _instance.libs[i];
            if(lib.name == name){
                result = lib;
                break;
            }
        }
        return result;
    }
}
