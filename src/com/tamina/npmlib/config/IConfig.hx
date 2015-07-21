package com.tamina.npmlib.config;
import com.tamina.npmlib.model.IHaxeLib;
interface IConfig {

    public var libsPath:String;
    public var packagesPath:String;
    public var version:String;
    public var serverName:String;
    public var libs:Array<IHaxeLib>;

}
