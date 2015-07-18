package ;

import com.tamina.npmlib.command.UpdateLibsCommand;
import com.tamina.npmlib.command.HelpCommand;
import com.tamina.npmlib.command.AddLibCommand;
import com.tamina.npmlib.command.BuildLibCommand;
import com.tamina.npmlib.nodejs.NPM;
import js.Error;
import com.tamina.npmlib.io.FileExtra;
import nodejs.fs.File;
import com.tamina.npmlib.model.IHaxeLib;
import nodejs.Console;
import com.tamina.npmlib.config.ProcessArgument;
import nodejs.NodeJS;
import com.tamina.npmlib.config.Config;
import nodejs.Process;
class HaxelibCli {

    private static var _instance:HaxelibCli;

    private var _process:Process;
    private var _config:Config;
    private var _buildCompleteNumber:Int;

    public function new():Void {

        _process = NodeJS.process;
        _config = Config.getInstance();
        NPM.load();

        for (i in 2..._process.argv.length) {
            var arg = _process.argv[i];
            switch arg {
                case ProcessArgument.BUILD:
                    this.build();
                case ProcessArgument.ADD:
                    this.add();
                case ProcessArgument.HELP:
                    this.help();
                case ProcessArgument.UPDATE:
                    this.update();
                default:
                    Console.warn("Unknown argument : " + arg);
            }
        }
    }

    public static function main():Void {
        _instance = new HaxelibCli();
    }

    private function build():Void {
        Console.info("start building libs");
        try{
        if (File.existsSync(NodeJS.dirname+'/../'+_config.packagesPath)) {
            FileExtra.removeSync(NodeJS.dirname+'/../'+_config.packagesPath);
        }
        } catch (e:Error){
            Console.error("error while removing packages");
            _process.exit(0);
        }
        _buildCompleteNumber = 0;
        for (i in 0..._config.libs.length) {
            var lib = _config.libs[i];
            var builder = new BuildLibCommand(lib);
            builder.error.add(buildHandler);
            builder.complete.add(buildHandler);
            builder.run();
        }
    }

    private function add():Void {
        var command = new AddLibCommand();
        command.error.add(addHandler);
        command.complete.add(addHandler);
        command.run();
    }

    private function addHandler():Void {
        _process.exit(0);
    }

    private function buildHandler(lib:IHaxeLib):Void {
        _buildCompleteNumber++;
        if (_buildCompleteNumber >= _config.libs.length) {
            _process.exit(0);
        }
    }

    private function help():Void {
        var cmd = new HelpCommand();
        cmd.run();
    }

    private function update():Void {
        var cmd = new UpdateLibsCommand();
        cmd.run();
    }

}
