package com.tamina.npmlib.model;
import com.tamina.npmlib.model.IHaxeLib;
class NpmData implements INpmData {

    public var name:String;

    public var description:String;

    public var keywords:Array<String>;

    public var author:String;

    public var version:String;

    public var license:String;

    public var config:INpmConfig;

    public var repository:INpmRepository;

    public function new(name:String, description:String, author:String, git:String) {
        this.name = name;
        this.description = description;
        this.keywords = ["javascript","library","haxe"];
        this.author = author;
        this.version="0.0.1";
        this.license='MIT';
        this.repository = new NpmRepository(git);
    }
}
