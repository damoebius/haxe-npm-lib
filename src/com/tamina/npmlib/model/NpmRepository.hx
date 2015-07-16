package com.tamina.npmlib.model;
import com.tamina.npmlib.model.IHaxeLib.INpmRepository;
class NpmRepository implements INpmRepository {

    public var type:String;

    public var url:String;

    public function new(git:String) {
        this.type="git";
        this.url = git;
    }
}
