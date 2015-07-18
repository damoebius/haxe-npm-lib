package com.tamina.npmlib.command;
import com.tamina.npmlib.config.Config;
import nodejs.Console;
class UpdateLibsCommand {

    private var _config:Config;


    public function new() {
        _config = Config.getInstance();
    }

    public function run():Void {
        Console.info("Updating libs...");
    }


}
