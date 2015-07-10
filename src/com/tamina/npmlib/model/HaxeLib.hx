package com.tamina.npmlib.model;
import Array;
interface HaxeLib {
    var name:String;
    var git:String;
    var gitRevision:String;
    var npm:NpmData;
}

interface NpmData {
    var name:String;
    var description:String;
    var keywords:Array<String>;
    var author:String;
    var version:String;
    var license:String;
    var config:NpmConfig;
}

interface NpmConfig{
    var build:String;
}
