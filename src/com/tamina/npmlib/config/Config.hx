package com.tamina.npmlib.config;
import nodejs.NodeJS;
import com.tamina.npmlib.io.FileExtra;
import com.tamina.npmlib.model.IHaxeLib;

class Config {

    public var libsPath:String;
    public var packagesPath:String;
    public var version:String;
    public var serverConfig:String;
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

    public static function getLibsPath():String{
        return NodeJS.dirname+'/../'+getInstance().libsPath;
    }
}
