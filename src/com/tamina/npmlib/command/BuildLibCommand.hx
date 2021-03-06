package com.tamina.npmlib.command;
import nodejs.NodeJS;
import com.tamina.npmlib.nodejs.NPM;
import com.tamina.npmlib.io.FileExtra;
import js.Error;
import msignal.Signal;
import com.tamina.npmlib.config.Config;
import nodejs.Console;
import nodejs.ChildProcess;
import nodejs.fs.File;
import com.tamina.npmlib.model.IHaxeLib;
class BuildLibCommand {

    public var complete:Signal1<IHaxeLib>;
    public var error:Signal1<IHaxeLib>;

    private var _buildStepList:Array<Void -> Void>;
    private var _currentStep:Int = 0;
    private var _lib:IHaxeLib;
    private var _config:Config;
    private var _publish:Bool = false;

    public function new(lib:IHaxeLib) {
        this._lib = lib;
        _config = Config.getInstance();
        initStepList();
        this.complete = new Signal1<IHaxeLib>();
        this.error = new Signal1<IHaxeLib>();
    }

    public function run():Void {
        Console.info("building : " + _lib.name);
        _currentStep = 0;
        _buildStepList[_currentStep]();
    }

    private function initStepList():Void {
        _buildStepList = new Array<Void -> Void>();
        _buildStepList.push(getLibSource);
        _buildStepList.push(getLibRevision);
        _buildStepList.push(packageLib);
        _buildStepList.push(getNpmVersion);
        _buildStepList.push(createJson);
        _buildStepList.push(publish);
        _buildStepList.push(end);
    }

    private function publish():Void {
        Console.info("publish");
        if (_publish) {
            ChildProcessTool.exec("npm publish ", {cwd:Config.getPackagePath() + _lib.name}, publishHandler);
        } else {
            executeNextStep();
        }
    }

    private function publishHandler(error:String, stdout:String, stderr:String):Void {
        if (error != null) {
            Console.error('publish error : ' + error);
            this.error.dispatch(_lib);
        } else {
            Console.info("PUBLISHED: " + stdout);
            executeNextStep();
        }
    }

    private function getLibRevision():Void {
        Console.info("retrieving git revision");
        ChildProcessTool.exec("git rev-parse --short HEAD ", {cwd:Config.getLibsPath() + _lib.name}, getLibRevisionHandler);
    }



    private function getLibRevisionHandler(error:String, stdout:String, stderr:String):Void {
        if (error != null) {
            Console.error('getLibRevision error : ' + error);
            this.error.dispatch(_lib);
        } else {
            Console.info("revision retrieved : " + stdout);
            _lib.gitRevision = stdout;
            executeNextStep();
        }
    }

    private function getNpmVersion():Void {
        Console.info('Getting current NPM version');
        NPM.commands.view([_lib.npm.name], true, getNpmVersionHandler);
    }

    private function getNpmVersionHandler(error:NPMError, data:Dynamic):Void {
        if (error != null) {
            if (error.code == null || error.code == "E404") {
                Console.info('New package on NPM');
                _publish = true;
                _lib.npm.config = cast {};
                _lib.npm.config.build = _lib.gitRevision;
                executeNextStep();
            } else {
                Console.error("Error while getting npm version : " + error);
            }
        } else {
            var fields = Reflect.fields(data);
            if (fields.length > 0) {
                var npmObj:INpmData = Reflect.field(data, fields[0]);
                if (npmObj.version != null) {
                    Console.info('current npm version : ' + npmObj.version);
                    _lib.npm.version = npmObj.version;
                    if (npmObj.config == null || npmObj.config.build == null || npmObj.config.build != _lib.gitRevision) {
                        Console.info('New version');
                        _publish = true;
                        _lib.npm.config = cast {};
                        _lib.npm.config.build = _lib.gitRevision;
                    } else {
                        Console.info('no changes');
                    }
                    executeNextStep();
                } else {
                    Console.error("Error while getting npm version");
                }
            } else {
                Console.error("Error while getting npm version");
            }

        }

    }

    private function createJson():Void {
        Console.info("createJson");
        if (_publish) {
            var versionNumbers = _lib.npm.version.split('.');
            versionNumbers[2] = cast (Std.parseInt(versionNumbers[2]) + 1);
            _lib.npm.version = versionNumbers.join('.');
        }
        FileExtra.writeJsonSync(Config.getPackagePath() + _lib.name + '/package.json', _lib.npm);
        executeNextStep();
    }

    private function packageLib():Void {
        Console.info("Packaging. " + _lib.name);
        if (!File.existsSync(Config.getPackagePath())) {
            File.mkdirSync(Config.getPackagePath(), "0777");
        }
        if (!File.existsSync(Config.getPackagePath() + _lib.name)) {
            File.mkdirSync(Config.getPackagePath() + _lib.name, "0777");
        }
        try {
            FileExtra.copySync(Config.getLibsPath() + _lib.name, Config.getPackagePath() + _lib.name);
            if (File.existsSync(Config.getPackagePath() + _lib.name + '/package.json')) {
                FileExtra.removeSync(Config.getPackagePath() + _lib.name + '/package.json');
            }
            if (File.existsSync(Config.getPackagePath() + _lib.name + '/.git')) {
                FileExtra.removeSync(Config.getPackagePath() + _lib.name + '/.git');
            }
            Console.info("package complete");
            executeNextStep();
        } catch (e:Error) {
            Console.error('packageLib e : ' + e);
        }
    }

    private function getLibSource():Void {
        Console.info("retrieving source for : " + _lib.name);
        if (File.existsSync(Config.getLibsPath() + _lib.name)) {
            Console.info("updating...");
            ChildProcessTool.exec("git pull " + _lib.git, {cwd:Config.getLibsPath() + _lib.name}, getLibSourceHandler);
        } else {
            Console.info("cloning...");
            ChildProcessTool.exec("git clone " + _lib.git + " " + Config.getLibsPath() + _lib.name, getLibSourceHandler);
        }
    }

    private function getLibSourceHandler(error:String, stdout:String, stderr:String):Void {
        if (error != null) {
            Console.error('getLibSource error : ' + error);
            this.error.dispatch(_lib);
        } else {
            Console.info("source retrieved");
            executeNextStep();
        }
    }

    private function end():Void {
        Console.info("lib complete");
        complete.dispatch(_lib);
    }

    private function executeNextStep():Void {
        _currentStep++;
        try {
            _buildStepList[_currentStep]();
        } catch (e:Error) {
            Console.error("Fatal : " + e);
        }
    }
}
