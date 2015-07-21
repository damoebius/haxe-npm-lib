package com.tamina.npmlib.command;
import nodejs.http.ServerResponse;
import haxe.Json;
import nodejs.http.HTTPClientRequest;
import nodejs.http.HTTP;
import com.tamina.npmlib.model.IHaxeLib;
import nodejs.NodeJS;
import msignal.Signal;
import com.tamina.npmlib.io.FileExtra;
import com.tamina.npmlib.config.Config;
import com.tamina.npmlib.model.Lib;
import nodejs.Console;
import com.tamina.npmlib.nodejs.Prompt;
class AddLibCommand {

    public var complete:Signal0;
    public var error:Signal0;

    private var _config:Config;
    private var _lib:IHaxeLib;


    public function new() {
        _config = Config.getInstance();
        this.complete = new Signal0();
        this.error = new Signal0();
    }

    public function run():Void {
        Console.info("Add a new Lib : ");
        Prompt.start();
        Prompt.get(['name', 'description', 'author', 'git'], addLibHandler);
    }

    private function addLibHandler(err:String, result:Dynamic):Void {
        var promptResult:PromptResult = cast result;
        if (!isValid(result)) {
            this.error.dispatch();
        } else {
            _lib = new Lib(promptResult.name, promptResult.description, promptResult.author, promptResult.git);

            var options:HTTPRequestOptions = cast {};
            options.hostname = _config.serverName;
            options.path = "/lib/add";
            options.method = HTTPMethod.Post;

            var req:HTTPClientRequest = HTTP.request(options, addLibToServerHandler);
            req.write(Json.stringify(_lib));
            req.end();

            Console.info("Creating lib  " + _lib.name + '...');

        }
    }

    private function onErrorHandler(error:String):Void {
        Console.error(error);
    }

    private function addLibToServerHandler(response:ServerResponse):Void {

        if (response.statusCode == 200) {
            response.on('end', onErrorHandler);
            _config.libs.push(_lib);
            FileExtra.writeJsonSync(NodeJS.dirname+'/../config.json', _config);
            this.complete.dispatch();
            Console.info("Lib Reeady");
        } else {
            Console.error("Error : " + response.statusCode);
        }

    }

    private function isValid(promptResult:PromptResult):Bool {
        var result = true;
        if(promptResult.name == null || promptResult.name.length == 0  ){
            Console.warn("Error : Bad name");
            result = false;
        }
        if(promptResult.description == null || promptResult.description.length == 0  ){
            Console.warn("Error : Bad description");
            result = false;
        }
        if(promptResult.author == null || promptResult.author.length == 0  ){
            Console.warn("Error : Bad author");
            result = false;
        }
        if(promptResult.git == null || promptResult.git.length == 0 || promptResult.git.indexOf('http') < 0  ){
            Console.warn("Error : Bad git url");
            result = false;
        }
        if( result && exist(promptResult.name.toLowerCase(), promptResult.git)){
            Console.warn("Error : This lib already exists !");
            result = false;
        }
        return result;
    }

    private function exist(name:String, url:String):Bool{
        var result = false;
        for(i in 0..._config.libs.length){
            var lib = _config.libs[i];
            if(lib.name == name || lib.npm.name == name || lib.git == url){
                result = true;
                break;
            }
        }
        return result;
    }
}

typedef PromptResult = {
    var name:String;
    var description:String;
    var author:String;
    var git:String;
}
