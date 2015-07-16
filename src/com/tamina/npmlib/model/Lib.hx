package com.tamina.npmlib.model;
import com.tamina.npmlib.model.IHaxeLib.INpmData;
class Lib implements IHaxeLib {

    public var name:String;

    public var git:String;

    public var gitRevision:String;

    public var npm:INpmData;

    public function new(name:String, description:String, author:String, git:String) {
        this.name = name;
        this.git = git;
        this.gitRevision="";
        this.npm = new NpmData(name,description,author,git);
    }
}
