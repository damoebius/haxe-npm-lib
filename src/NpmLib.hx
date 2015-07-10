package ;

import com.tamina.npmlib.nodejs.NPM;
import js.Error;
import com.tamina.npmlib.io.FileExtra;
import nodejs.fs.File;
import com.tamina.npmlib.core.LibBuilder;
import com.tamina.npmlib.model.HaxeLib;
import nodejs.Console;
import com.tamina.npmlib.config.ProcessArgument;
import nodejs.NodeJS;
import com.tamina.npmlib.config.Config;
import nodejs.Process;
class NpmLib {

    private static var _server:NpmLib;

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
                case ProcessArgument.HELP:
                    this.help();
                default:
                    Console.warn("Unknown argument : " + arg);
            }
        }
    }

    public static function main():Void {
        _server = new NpmLib();
    }

    private function build():Void {
        Console.info("start building libs");
        try{
        if (File.existsSync(_config.packagesPath)) {
            FileExtra.removeSync(_config.packagesPath);
        }
        } catch (e:Error){
            Console.error("error while removing packages");
            _process.exit(0);
        }
        _buildCompleteNumber = 0;
        for (i in 0..._config.libs.length) {
            var lib = _config.libs[i];
            var builder = new LibBuilder(lib);
            builder.error.add(buildHandler);
            builder.complete.add(buildHandler);
            builder.build();
        }
    }

    private function buildHandler(lib:HaxeLib):Void {
        _buildCompleteNumber++;
        if (_buildCompleteNumber >= _config.libs.length) {
            _process.exit(0);
        }
    }

    private function help():Void {
        Console.info("Haxe NPM Libs Builder");
        Console.info("Version : " + _config.version);
        Console.info("Usage :");
        Console.info("-? display this message");
        Console.info("-build build all libs to NPM");
    }

}
