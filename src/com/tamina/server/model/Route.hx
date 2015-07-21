package com.tamina.server.model;
import com.tamina.server.web.Action;
import com.tamina.server.web.GetParamName;

class Route {

    public var page:String;
    public var action:Action;
    public var id:String;

    public function new(params:Map<String,String>) {
        this.page = params[GetParamName.PAGE];
        this.action = params[GetParamName.ACTION];
        this.id = params[GetParamName.ID];
    }
}
