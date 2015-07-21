package com.tamina.server.controler;
import com.tamina.npmlib.model.IHaxeLib;
import haxe.Json;
import com.tamina.npmlib.config.IConfig;
import php.Lib;
import sys.io.File;
import php.Web;
import com.tamina.server.web.Action;
import com.tamina.server.model.Route;
class LibController {

    private var _route:Route;
    private var _config:IConfig;

    public function new(route:Route) {
        this._route = route;
        var json  = File.getContent("config.json");
        this._config = Json.parse(json);
    }

    public function run():Void{

        if(_route.action == Action.VIEW){
            this.view();
        } else if(_route.action == Action.ADD){
            this.add();
        }else {
            Lib.print("unsuported action");
            Web.setReturnCode(400);
        }
    }

    private function add():Void{
        var postData:String = Web.getPostData();

        var lib:IHaxeLib = Json.parse(postData);
        if(lib != null){
            this._config.libs.push(lib);
            File.saveContent('config.json',Json.stringify(_config));
        } else {
            Lib.print("bad request");
            Web.setReturnCode(400);
        }

    }

    private function view():Void{
        Web.setHeader("Content-Type","application/json");
        var result:String="";
        if(_route.id != null && _route.id.length > 0){
            var lib = getLibByName(_route.id);
            if(lib != null){
                result = Json.stringify(lib);
            } else {
                Lib.print("lib not found");
                Web.setReturnCode(404);
            }
        } else {
            result = Json.stringify(this._config.libs);
        }
        Lib.print(result);
    }

    private function getLibByName(name:String):IHaxeLib{
        var result:IHaxeLib = null;
        for(i in 0..._config.libs.length){
            var lib = _config.libs[i];
            if(lib.name == name){
                result = lib;
                break;
            }
        }
        return result;
    }
}
