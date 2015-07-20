package com.tamina.npmlib.command;
import nodejs.stream.Readable;
import nodejs.NodeJS;
import nodejs.http.ServerResponse;
import nodejs.http.HTTP;
import nodejs.fs.File;
import com.tamina.npmlib.config.Config;
import nodejs.Console;
class UpdateLibsCommand {

    private var _config:Config;


    public function new() {
        _config = Config.getInstance();
    }

    public function run():Void {
        Console.info("Updating libs...");
        HTTP.get(_config.serverConfig,getConfigHandler);

    }

    private function getConfigHandler(response:ServerResponse):Void {
        if (response.statusCode == 200) {
            var file = File.createWriteStream(NodeJS.dirname + '/../config.json');
            var r:Readable = cast response;
            r.pipe(file);
            Console.info("LIBS UP TO DATE");
        } else {
            Console.error("Error : " + response.statusCode);
        }

    }


}
