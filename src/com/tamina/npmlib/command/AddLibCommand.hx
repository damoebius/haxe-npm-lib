package com.tamina.npmlib.command;
import com.tamina.npmlib.io.FileExtra;
import com.tamina.npmlib.config.Config;
import com.tamina.npmlib.model.Lib;
import nodejs.Console;
import com.tamina.npmlib.nodejs.Prompt;
class AddLibCommand {

    private var _config:Config;

    public function new() {
        _config = Config.getInstance();
    }

    public function run():Void{
        Console.info("Add a new Lib : ");
        Prompt.start();
        Prompt.get(['name','description','author','git'],addLibHandler);
    }

    private function addLibHandler(err:String,result:Dynamic):Void{
        var promptResult:PromptResult = cast result;
        var a = new Lib(promptResult.name,promptResult.description,promptResult.author,promptResult.git);
        _config.libs.push(a);
        FileExtra.writeJsonSync('config.json',_config);
    }
}

typedef PromptResult = {
    var name:String;
    var description:String;
    var author:String;
    var git:String;
}
