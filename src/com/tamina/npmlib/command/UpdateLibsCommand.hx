package com.tamina.npmlib.command;
import haxe.Json;
import com.tamina.npmlib.model.IHaxeLib;
import com.tamina.npmlib.io.FileExtra;
import nodejs.http.HTTPClientRequest;
import nodejs.stream.Readable;
import nodejs.NodeJS;
import nodejs.http.ServerResponse;
import nodejs.http.HTTP;
import nodejs.fs.File;
import com.tamina.npmlib.config.Config;
import nodejs.Console;
class UpdateLibsCommand {

    private var _config:Config;

    private var _responseBody:String = "";


    public function new() {
        _config = Config.getInstance();
    }

    public function run():Void {
        Console.info("Updating libs...");
        HTTP.get('http://'+_config.serverName+"/lib/view", getConfigHandler);
    }

    private function onErrorHandler(error:String):Void {
        Console.error(error);
    }

    private function onDataHandler(chunk:String):Void {
        _responseBody += chunk;
    }

    private function onEndHandler():Void {
        var libs:Array<IHaxeLib> = Json.parse(_responseBody);
        if (libs != null) {
            _config.libs = libs;
            FileExtra.writeJsonSync(Config.getConfigPath(),_config);
            Console.info("LIBS UP TO DATE ");
        } else {
            Console.error("Parsing error");
        }

    }

    private function getConfigHandler(response:ServerResponse):Void {

        if (response.statusCode == 200) {

            response.on("data", onDataHandler);
            response.on('error', onErrorHandler);
            response.on('end', onEndHandler);


        } else {
            Console.error("Error : " + response.statusCode);
        }

    }


}
