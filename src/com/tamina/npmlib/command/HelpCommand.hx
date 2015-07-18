package com.tamina.npmlib.command;
import com.tamina.npmlib.config.Config;
import nodejs.Console;
class HelpCommand {

    private var _config:Config;

    public function new() {
        _config = Config.getInstance();
    }

    public function run():Void {
        Console.info("Haxe NPM Libs Builder");
        Console.info("Version : " + _config.version);
        Console.info("Usage :");
        Console.info("-? : display this message");
        Console.info("publish : build all libs to NPM");
        Console.info("add : add a new lib to NPM");
        Console.info("update : update libs list");
    }


}
