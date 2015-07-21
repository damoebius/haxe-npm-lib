package com.tamina.server.controler;
import php.Lib;
import sys.io.File;
import php.Web;
import com.tamina.server.web.Action;
import com.tamina.server.model.Route;
class LibController {

    private var _route:Route;

    public function new(route:Route) {
        this._route = route;
    }

    public function run():Void{

        if(_route.action == Action.VIEW){
            this.view();
        } else {
            Lib.print("unsuported action");
            Web.setReturnCode(400);
        }
    }

    private function view():Void{
        Web.setHeader("Content-Type","application/json");
        Lib.print(File.getContent("config.json"));
    }
}
