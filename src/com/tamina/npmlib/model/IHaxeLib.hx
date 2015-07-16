package com.tamina.npmlib.model;
import Array;
interface IHaxeLib {
    var name:String;
    var git:String;
    var gitRevision:String;
    var npm:INpmData;
}

interface INpmData {
    var name:String;
    var description:String;
    var keywords:Array<String>;
    var author:String;
    var version:String;
    var license:String;
    var config:INpmConfig;
    var repository:INpmRepository;
}

interface INpmConfig{
    var build:String;
}

interface INpmRepository{
    var type:String;
    var url:String;
}
