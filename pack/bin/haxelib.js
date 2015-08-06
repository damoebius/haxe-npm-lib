(function (console) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HaxelibCli = function() {
	this._process = nodejs_NodeJS.get_process();
	this._config = com_tamina_npmlib_config_Config.getInstance();
	(require('npm')).load();
	var _g1 = 2;
	var _g = this._process.argv.length;
	try {
		while(_g1 < _g) {
			var i = _g1++;
			var arg = this._process.argv[i];
			switch(arg) {
			case "publish":
				var lib = "";
				if(i + 1 < this._process.argv.length) lib = this._process.argv[i + 1];
				this.build(lib);
				throw "__break__";
				break;
			case "add":
				this.add();
				throw "__break__";
				break;
			case "help":
				this.help();
				throw "__break__";
				break;
			case "update":
				this.update();
				throw "__break__";
				break;
			default:
				console.warn("Unknown argument : " + arg);
				throw "__break__";
			}
		}
	} catch( e ) { if( e != "__break__" ) throw e; }
};
HaxelibCli.__name__ = true;
HaxelibCli.main = function() {
	HaxelibCli._instance = new HaxelibCli();
};
HaxelibCli.prototype = {
	build: function(libname) {
		if(libname == null) libname = "";
		try {
			if((require('fs')).existsSync(com_tamina_npmlib_config_Config.getPackagePath())) (require('fs-extra')).removeSync(com_tamina_npmlib_config_Config.getPackagePath());
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				console.error("error while removing packages");
				this._process.exit(0);
			} else throw(e);
		}
		if(libname == "") {
			console.info("start building ALL libs");
			this._buildCompleteNumber = 0;
			var _g1 = 0;
			var _g = this._config.libs.length;
			while(_g1 < _g) {
				var i = _g1++;
				var lib = this._config.libs[i];
				var builder = new com_tamina_npmlib_command_BuildLibCommand(lib);
				builder.error.add($bind(this,this.buildHandler));
				builder.complete.add($bind(this,this.buildHandler));
				builder.run();
			}
		} else {
			console.info("start building " + libname);
			var lib1 = com_tamina_npmlib_config_Config.getLibByName(libname);
			var builder1 = new com_tamina_npmlib_command_BuildLibCommand(lib1);
			builder1.error.add($bind(this,this.singleBuildHandler));
			builder1.complete.add($bind(this,this.singleBuildHandler));
			builder1.run();
		}
	}
	,add: function() {
		var command = new com_tamina_npmlib_command_AddLibCommand();
		command.error.add($bind(this,this.addHandler));
		command.complete.add($bind(this,this.addHandler));
		command.run();
	}
	,addHandler: function() {
		this._process.exit(0);
	}
	,buildHandler: function(lib) {
		this._buildCompleteNumber++;
		if(this._buildCompleteNumber >= this._config.libs.length) this._process.exit(0);
	}
	,singleBuildHandler: function(lib) {
		this._process.exit(0);
	}
	,help: function() {
		var cmd = new com_tamina_npmlib_command_HelpCommand();
		cmd.run();
	}
	,update: function() {
		var cmd = new com_tamina_npmlib_command_UpdateLibsCommand();
		cmd.run();
	}
	,__class__: HaxelibCli
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var com_tamina_npmlib_command_AddLibCommand = function() {
	this._config = com_tamina_npmlib_config_Config.getInstance();
	this.complete = new msignal_Signal0();
	this.error = new msignal_Signal0();
};
com_tamina_npmlib_command_AddLibCommand.__name__ = true;
com_tamina_npmlib_command_AddLibCommand.prototype = {
	run: function() {
		console.info("Add a new Lib : ");
		(require('prompt')).start();
		(require('prompt')).get(["name","description","author","git"],$bind(this,this.addLibHandler));
	}
	,addLibHandler: function(err,result) {
		var promptResult = result;
		if(!this.isValid(result)) this.error.dispatch(); else {
			this._lib = new com_tamina_npmlib_model_Lib(promptResult.name,promptResult.description,promptResult.author,promptResult.git);
			var options = { };
			options.hostname = this._config.serverName;
			options.path = "/lib/add";
			options.method = nodejs_http_HTTPMethod.Post;
			var req = (require('http')).request(options,$bind(this,this.addLibToServerHandler));
			req.write(JSON.stringify(this._lib));
			req.end();
			console.info("Creating lib  " + this._lib.name + "...");
		}
	}
	,onErrorHandler: function(error) {
		console.error(error);
	}
	,addLibToServerHandler: function(response) {
		if(response.statusCode == 200) {
			response.on("end",$bind(this,this.onErrorHandler));
			this._config.libs.push(this._lib);
			(require('fs-extra')).writeJsonSync(nodejs_NodeJS.get_dirname() + "/../config.json",this._config);
			this.complete.dispatch();
			console.info("Lib Reeady");
		} else console.error("Error : " + response.statusCode);
	}
	,isValid: function(promptResult) {
		var result = true;
		if(promptResult.name == null || promptResult.name.length == 0) {
			console.warn("Error : Bad name");
			result = false;
		}
		if(promptResult.description == null || promptResult.description.length == 0) {
			console.warn("Error : Bad description");
			result = false;
		}
		if(promptResult.author == null || promptResult.author.length == 0) {
			console.warn("Error : Bad author");
			result = false;
		}
		if(promptResult.git == null || promptResult.git.length == 0 || promptResult.git.indexOf("http") < 0) {
			console.warn("Error : Bad git url");
			result = false;
		}
		if(result && this.exist(promptResult.name.toLowerCase(),promptResult.git)) {
			console.warn("Error : This lib already exists !");
			result = false;
		}
		return result;
	}
	,exist: function(name,url) {
		var result = false;
		var _g1 = 0;
		var _g = this._config.libs.length;
		while(_g1 < _g) {
			var i = _g1++;
			var lib = this._config.libs[i];
			if(lib.name == name || lib.npm.name == name || lib.git == url) {
				result = true;
				break;
			}
		}
		return result;
	}
	,__class__: com_tamina_npmlib_command_AddLibCommand
};
var com_tamina_npmlib_command_BuildLibCommand = function(lib) {
	this._publish = false;
	this._currentStep = 0;
	this._lib = lib;
	this._config = com_tamina_npmlib_config_Config.getInstance();
	this.initStepList();
	this.complete = new msignal_Signal1();
	this.error = new msignal_Signal1();
};
com_tamina_npmlib_command_BuildLibCommand.__name__ = true;
com_tamina_npmlib_command_BuildLibCommand.prototype = {
	run: function() {
		console.info("building : " + this._lib.name);
		this._currentStep = 0;
		this._buildStepList[this._currentStep]();
	}
	,initStepList: function() {
		this._buildStepList = [];
		this._buildStepList.push($bind(this,this.getLibSource));
		this._buildStepList.push($bind(this,this.getLibRevision));
		this._buildStepList.push($bind(this,this.packageLib));
		this._buildStepList.push($bind(this,this.getNpmVersion));
		this._buildStepList.push($bind(this,this.createJson));
		this._buildStepList.push($bind(this,this.publish));
		this._buildStepList.push($bind(this,this.end));
	}
	,publish: function() {
		console.info("publish");
		if(this._publish) (require('child_process')).exec("npm publish ",{ cwd : com_tamina_npmlib_config_Config.getPackagePath() + this._lib.name},$bind(this,this.publishHandler)); else this.executeNextStep();
	}
	,publishHandler: function(error,stdout,stderr) {
		if(error != null) {
			console.error("publish error : " + error);
			this.error.dispatch(this._lib);
		} else {
			console.info("PUBLISHED: " + stdout);
			this.executeNextStep();
		}
	}
	,getLibRevision: function() {
		console.info("retrieving git revision");
		(require('child_process')).exec("git rev-parse --short HEAD ",{ cwd : com_tamina_npmlib_config_Config.getLibsPath() + this._lib.name},$bind(this,this.getLibRevisionHandler));
	}
	,getLibRevisionHandler: function(error,stdout,stderr) {
		if(error != null) {
			console.error("getLibRevision error : " + error);
			this.error.dispatch(this._lib);
		} else {
			console.info("revision retrieved : " + stdout);
			this._lib.gitRevision = stdout;
			this.executeNextStep();
		}
	}
	,getNpmVersion: function() {
		console.info("Getting current NPM version");
		(require('npm')).commands.view([this._lib.npm.name],true,$bind(this,this.getNpmVersionHandler));
	}
	,getNpmVersionHandler: function(error,data) {
		if(error != null) {
			if(error.code == null || error.code == "E404") {
				console.info("New package on NPM");
				this._publish = true;
				this._lib.npm.config = { };
				this._lib.npm.config.build = this._lib.gitRevision;
				this.executeNextStep();
			} else console.error("Error while getting npm version : " + Std.string(error));
		} else {
			var fields = Reflect.fields(data);
			if(fields.length > 0) {
				var npmObj = Reflect.field(data,fields[0]);
				if(npmObj.version != null) {
					console.info("current npm version : " + npmObj.version);
					this._lib.npm.version = npmObj.version;
					if(npmObj.config == null || npmObj.config.build == null || npmObj.config.build != this._lib.gitRevision) {
						console.info("New version");
						this._publish = true;
						this._lib.npm.config = { };
						this._lib.npm.config.build = this._lib.gitRevision;
					} else console.info("no changes");
					this.executeNextStep();
				} else console.error("Error while getting npm version");
			} else console.error("Error while getting npm version");
		}
	}
	,createJson: function() {
		console.info("createJson");
		if(this._publish) {
			var versionNumbers = this._lib.npm.version.split(".");
			versionNumbers[2] = Std.parseInt(versionNumbers[2]) + 1;
			this._lib.npm.version = versionNumbers.join(".");
		}
		(require('fs-extra')).writeJsonSync(com_tamina_npmlib_config_Config.getPackagePath() + this._lib.name + "/package.json",this._lib.npm);
		this.executeNextStep();
	}
	,packageLib: function() {
		console.info("Packaging. " + this._lib.name);
		if(!(require('fs')).existsSync(com_tamina_npmlib_config_Config.getPackagePath())) (require('fs')).mkdirSync(com_tamina_npmlib_config_Config.getPackagePath(),"0777");
		if(!(require('fs')).existsSync(com_tamina_npmlib_config_Config.getPackagePath() + this._lib.name)) (require('fs')).mkdirSync(com_tamina_npmlib_config_Config.getPackagePath() + this._lib.name,"0777");
		try {
			(require('fs-extra')).copySync(com_tamina_npmlib_config_Config.getLibsPath() + this._lib.name,com_tamina_npmlib_config_Config.getPackagePath() + this._lib.name);
			if((require('fs')).existsSync(com_tamina_npmlib_config_Config.getPackagePath() + this._lib.name + "/package.json")) (require('fs-extra')).removeSync(com_tamina_npmlib_config_Config.getPackagePath() + this._lib.name + "/package.json");
			if((require('fs')).existsSync(com_tamina_npmlib_config_Config.getPackagePath() + this._lib.name + "/.git")) (require('fs-extra')).removeSync(com_tamina_npmlib_config_Config.getPackagePath() + this._lib.name + "/.git");
			console.info("package complete");
			this.executeNextStep();
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				console.error("packageLib e : " + Std.string(e));
			} else throw(e);
		}
	}
	,getLibSource: function() {
		console.info("retrieving source for : " + this._lib.name);
		if((require('fs')).existsSync(com_tamina_npmlib_config_Config.getLibsPath() + this._lib.name)) {
			console.info("updating...");
			(require('child_process')).exec("git pull " + this._lib.git,{ cwd : com_tamina_npmlib_config_Config.getLibsPath() + this._lib.name},$bind(this,this.getLibSourceHandler));
		} else {
			console.info("cloning...");
			(require('child_process')).exec("git clone " + this._lib.git + " " + com_tamina_npmlib_config_Config.getLibsPath() + this._lib.name,$bind(this,this.getLibSourceHandler));
		}
	}
	,getLibSourceHandler: function(error,stdout,stderr) {
		if(error != null) {
			console.error("getLibSource error : " + error);
			this.error.dispatch(this._lib);
		} else {
			console.info("source retrieved");
			this.executeNextStep();
		}
	}
	,end: function() {
		console.info("lib complete");
		this.complete.dispatch(this._lib);
	}
	,executeNextStep: function() {
		this._currentStep++;
		try {
			this._buildStepList[this._currentStep]();
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				console.error("Fatal : " + Std.string(e));
			} else throw(e);
		}
	}
	,__class__: com_tamina_npmlib_command_BuildLibCommand
};
var com_tamina_npmlib_command_HelpCommand = function() {
	this._config = com_tamina_npmlib_config_Config.getInstance();
};
com_tamina_npmlib_command_HelpCommand.__name__ = true;
com_tamina_npmlib_command_HelpCommand.prototype = {
	run: function() {
		console.info("Haxe NPM Libs Builder");
		console.info("Version : " + this._config.version);
		console.info("Usage :");
		console.info("-? : display this message");
		console.info("publish : build all libs to NPM");
		console.info("add : add a new lib to NPM");
		console.info("update : update libs list");
	}
	,__class__: com_tamina_npmlib_command_HelpCommand
};
var com_tamina_npmlib_command_UpdateLibsCommand = function() {
	this._responseBody = "";
	this._config = com_tamina_npmlib_config_Config.getInstance();
};
com_tamina_npmlib_command_UpdateLibsCommand.__name__ = true;
com_tamina_npmlib_command_UpdateLibsCommand.prototype = {
	run: function() {
		console.info("Updating libs...");
		(require('http')).get("http://" + this._config.serverName + "/lib/view",$bind(this,this.getConfigHandler));
	}
	,onErrorHandler: function(error) {
		console.error(error);
	}
	,onDataHandler: function(chunk) {
		this._responseBody += chunk;
	}
	,onEndHandler: function() {
		var libs = JSON.parse(this._responseBody);
		if(libs != null) {
			this._config.libs = libs;
			(require('fs-extra')).writeJsonSync(com_tamina_npmlib_config_Config.getConfigPath(),this._config);
			console.info("LIBS UP TO DATE ");
		} else console.error("Parsing error");
	}
	,getConfigHandler: function(response) {
		if(response.statusCode == 200) {
			response.on("data",$bind(this,this.onDataHandler));
			response.on("error",$bind(this,this.onErrorHandler));
			response.on("end",$bind(this,this.onEndHandler));
		} else console.error("Error : " + response.statusCode);
	}
	,__class__: com_tamina_npmlib_command_UpdateLibsCommand
};
var com_tamina_npmlib_config_IConfig = function() { };
com_tamina_npmlib_config_IConfig.__name__ = true;
com_tamina_npmlib_config_IConfig.prototype = {
	__class__: com_tamina_npmlib_config_IConfig
};
var com_tamina_npmlib_config_Config = function() {
};
com_tamina_npmlib_config_Config.__name__ = true;
com_tamina_npmlib_config_Config.__interfaces__ = [com_tamina_npmlib_config_IConfig];
com_tamina_npmlib_config_Config.getInstance = function() {
	if(com_tamina_npmlib_config_Config._instance == null) com_tamina_npmlib_config_Config._instance = (require('fs-extra')).readJsonSync(nodejs_NodeJS.get_dirname() + "/../config.json");
	return com_tamina_npmlib_config_Config._instance;
};
com_tamina_npmlib_config_Config.getPackagePath = function() {
	return nodejs_NodeJS.get_dirname() + "/../" + com_tamina_npmlib_config_Config.getInstance().packagesPath;
};
com_tamina_npmlib_config_Config.getConfigPath = function() {
	return nodejs_NodeJS.get_dirname() + "/../config.json";
};
com_tamina_npmlib_config_Config.getLibsPath = function() {
	return nodejs_NodeJS.get_dirname() + "/../" + com_tamina_npmlib_config_Config.getInstance().libsPath;
};
com_tamina_npmlib_config_Config.getLibByName = function(name) {
	var result = null;
	var _g1 = 0;
	var _g = com_tamina_npmlib_config_Config._instance.libs.length;
	while(_g1 < _g) {
		var i = _g1++;
		var lib = com_tamina_npmlib_config_Config._instance.libs[i];
		if(lib.name == name) {
			result = lib;
			break;
		}
	}
	return result;
};
com_tamina_npmlib_config_Config.prototype = {
	__class__: com_tamina_npmlib_config_Config
};
var com_tamina_npmlib_model_IHaxeLib = function() { };
com_tamina_npmlib_model_IHaxeLib.__name__ = true;
com_tamina_npmlib_model_IHaxeLib.prototype = {
	__class__: com_tamina_npmlib_model_IHaxeLib
};
var com_tamina_npmlib_model_INpmData = function() { };
com_tamina_npmlib_model_INpmData.__name__ = true;
com_tamina_npmlib_model_INpmData.prototype = {
	__class__: com_tamina_npmlib_model_INpmData
};
var com_tamina_npmlib_model_INpmConfig = function() { };
com_tamina_npmlib_model_INpmConfig.__name__ = true;
com_tamina_npmlib_model_INpmConfig.prototype = {
	__class__: com_tamina_npmlib_model_INpmConfig
};
var com_tamina_npmlib_model_INpmRepository = function() { };
com_tamina_npmlib_model_INpmRepository.__name__ = true;
com_tamina_npmlib_model_INpmRepository.prototype = {
	__class__: com_tamina_npmlib_model_INpmRepository
};
var com_tamina_npmlib_model_Lib = function(name,description,author,git) {
	this.name = name.toLowerCase();
	this.git = git;
	this.gitRevision = "";
	this.npm = new com_tamina_npmlib_model_NpmData(name,description,author,git);
};
com_tamina_npmlib_model_Lib.__name__ = true;
com_tamina_npmlib_model_Lib.__interfaces__ = [com_tamina_npmlib_model_IHaxeLib];
com_tamina_npmlib_model_Lib.prototype = {
	__class__: com_tamina_npmlib_model_Lib
};
var com_tamina_npmlib_model_NpmData = function(name,description,author,git) {
	this.name = name;
	this.description = description;
	this.keywords = ["javascript","library","haxe"];
	this.author = author;
	this.version = "0.0.1";
	this.license = "MIT";
	this.repository = new com_tamina_npmlib_model_NpmRepository(git);
};
com_tamina_npmlib_model_NpmData.__name__ = true;
com_tamina_npmlib_model_NpmData.__interfaces__ = [com_tamina_npmlib_model_INpmData];
com_tamina_npmlib_model_NpmData.prototype = {
	__class__: com_tamina_npmlib_model_NpmData
};
var com_tamina_npmlib_model_NpmRepository = function(git) {
	this.type = "git";
	this.url = git;
};
com_tamina_npmlib_model_NpmRepository.__name__ = true;
com_tamina_npmlib_model_NpmRepository.__interfaces__ = [com_tamina_npmlib_model_INpmRepository];
com_tamina_npmlib_model_NpmRepository.prototype = {
	__class__: com_tamina_npmlib_model_NpmRepository
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return (Function("return typeof " + name + " != \"undefined\" ? " + name + " : null"))();
};
var msignal_Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal_SlotList.NIL;
	this.priorityBased = false;
};
msignal_Signal.__name__ = true;
msignal_Signal.prototype = {
	add: function(listener) {
		return this.registerListener(listener);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,removeAll: function() {
		this.slots = msignal_SlotList.NIL;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		return false;
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,get_numListeners: function() {
		return this.slots.get_length();
	}
	,__class__: msignal_Signal
};
var msignal_Signal0 = function() {
	msignal_Signal.call(this);
};
msignal_Signal0.__name__ = true;
msignal_Signal0.__super__ = msignal_Signal;
msignal_Signal0.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot0(this,listener,once,priority);
	}
	,__class__: msignal_Signal0
});
var msignal_Signal1 = function(type) {
	msignal_Signal.call(this,[type]);
};
msignal_Signal1.__name__ = true;
msignal_Signal1.__super__ = msignal_Signal;
msignal_Signal1.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot1(this,listener,once,priority);
	}
	,__class__: msignal_Signal1
});
var msignal_Signal2 = function(type1,type2) {
	msignal_Signal.call(this,[type1,type2]);
};
msignal_Signal2.__name__ = true;
msignal_Signal2.__super__ = msignal_Signal;
msignal_Signal2.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot2(this,listener,once,priority);
	}
	,__class__: msignal_Signal2
});
var msignal_Slot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal_Slot.__name__ = true;
msignal_Slot.prototype = {
	remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		return this.listener = value;
	}
	,__class__: msignal_Slot
};
var msignal_Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot0.__name__ = true;
msignal_Slot0.__super__ = msignal_Slot;
msignal_Slot0.prototype = $extend(msignal_Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
	,__class__: msignal_Slot0
});
var msignal_Slot1 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot1.__name__ = true;
msignal_Slot1.__super__ = msignal_Slot;
msignal_Slot1.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
	,__class__: msignal_Slot1
});
var msignal_Slot2 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot2.__name__ = true;
msignal_Slot2.__super__ = msignal_Slot;
msignal_Slot2.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
	,__class__: msignal_Slot2
});
var msignal_SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) this.nonEmpty = false; else if(head == null) {
	} else {
		this.head = head;
		if(tail == null) this.tail = msignal_SlotList.NIL; else this.tail = tail;
		this.nonEmpty = true;
	}
};
msignal_SlotList.__name__ = true;
msignal_SlotList.prototype = {
	get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == msignal_SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,prepend: function(slot) {
		return new msignal_SlotList(slot,this);
	}
	,append: function(slot) {
		if(slot == null) return this;
		if(!this.nonEmpty) return new msignal_SlotList(slot);
		if(this.tail == msignal_SlotList.NIL) return new msignal_SlotList(slot).prepend(this.head);
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal_SlotList(slot);
		var priority = slot.priority;
		if(priority >= this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,contains: function(listener) {
		if(!this.nonEmpty) return false;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return true;
			p = p.tail;
		}
		return false;
	}
	,find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
	,__class__: msignal_SlotList
};
var nodejs_ChildProcessEventType = function() { };
nodejs_ChildProcessEventType.__name__ = true;
var nodejs_NodeJS = function() { };
nodejs_NodeJS.__name__ = true;
nodejs_NodeJS.get_dirname = function() {
	return __dirname;
};
nodejs_NodeJS.get_filename = function() {
	return __filename;
};
nodejs_NodeJS.require = function(p_lib) {
	return require(p_lib);
};
nodejs_NodeJS.get_process = function() {
	return process;
};
nodejs_NodeJS.setTimeout = function(cb,ms) {
	return setTimeout(cb,ms);
};
nodejs_NodeJS.clearTimeout = function(t) {
	clearTimeout(t);
	return;
};
nodejs_NodeJS.setInterval = function(cb,ms) {
	return setInterval(cb,ms);
};
nodejs_NodeJS.clearInterval = function(t) {
	clearInterval(t);
	return;
};
nodejs_NodeJS.assert = function(value,message) {
	require('assert')(value,message);
};
nodejs_NodeJS.get_global = function() {
	return global;
};
nodejs_NodeJS.resolve = function() {
	return require.resolve();
};
nodejs_NodeJS.get_cache = function() {
	return require.cache;
};
nodejs_NodeJS.get_extensions = function() {
	return require.extensions;
};
nodejs_NodeJS.get_module = function() {
	return module;
};
nodejs_NodeJS.get_exports = function() {
	return exports;
};
nodejs_NodeJS.get_domain = function() {
	return domain.create();
};
nodejs_NodeJS.get_repl = function() {
	return require('repl');
};
var nodejs_ProcessEventType = function() { };
nodejs_ProcessEventType.__name__ = true;
var nodejs_REPLEventType = function() { };
nodejs_REPLEventType.__name__ = true;
var nodejs_events_EventEmitterEventType = function() { };
nodejs_events_EventEmitterEventType.__name__ = true;
var nodejs_fs_FSWatcherEventType = function() { };
nodejs_fs_FSWatcherEventType.__name__ = true;
var nodejs_fs_FileLinkType = function() { };
nodejs_fs_FileLinkType.__name__ = true;
var nodejs_fs_FileIOFlag = function() { };
nodejs_fs_FileIOFlag.__name__ = true;
var nodejs_fs_ReadStreamEventType = function() { };
nodejs_fs_ReadStreamEventType.__name__ = true;
var nodejs_fs_WriteStreamEventType = function() { };
nodejs_fs_WriteStreamEventType.__name__ = true;
var nodejs_http_HTTPMethod = function() { };
nodejs_http_HTTPMethod.__name__ = true;
var nodejs_http_HTTPClientRequestEventType = function() { };
nodejs_http_HTTPClientRequestEventType.__name__ = true;
var nodejs_http_HTTPServerEventType = function() { };
nodejs_http_HTTPServerEventType.__name__ = true;
var nodejs_stream_ReadableEventType = function() { };
nodejs_stream_ReadableEventType.__name__ = true;
var nodejs_http_IncomingMessageEventType = function() { };
nodejs_http_IncomingMessageEventType.__name__ = true;
nodejs_http_IncomingMessageEventType.__super__ = nodejs_stream_ReadableEventType;
nodejs_http_IncomingMessageEventType.prototype = $extend(nodejs_stream_ReadableEventType.prototype,{
	__class__: nodejs_http_IncomingMessageEventType
});
var nodejs_http_ServerResponseEventType = function() { };
nodejs_http_ServerResponseEventType.__name__ = true;
var nodejs_net_TCPServerEventType = function() { };
nodejs_net_TCPServerEventType.__name__ = true;
var nodejs_net_TCPSocketEventType = function() { };
nodejs_net_TCPSocketEventType.__name__ = true;
var nodejs_stream_WritableEventType = function() { };
nodejs_stream_WritableEventType.__name__ = true;
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
msignal_SlotList.NIL = new msignal_SlotList(null,null);
js_Boot.__toStr = {}.toString;
nodejs_ChildProcessEventType.Disconnect = "disconnect";
nodejs_ChildProcessEventType.Error = "error";
nodejs_ChildProcessEventType.Close = "close";
nodejs_ChildProcessEventType.Message = "message";
nodejs_ChildProcessEventType.Exit = "exit";
nodejs_ProcessEventType.Exit = "exit";
nodejs_ProcessEventType.Exception = "uncaughtException";
nodejs_REPLEventType.Exit = "exit";
nodejs_events_EventEmitterEventType.NewListener = "newListener";
nodejs_events_EventEmitterEventType.RemoveListener = "removeListener";
nodejs_fs_FSWatcherEventType.Change = "change";
nodejs_fs_FSWatcherEventType.Error = "error";
nodejs_fs_FileLinkType.Dir = "dir";
nodejs_fs_FileLinkType.File = "file";
nodejs_fs_FileLinkType.Junction = "junction";
nodejs_fs_FileIOFlag.Read = "r";
nodejs_fs_FileIOFlag.ReadWrite = "r+";
nodejs_fs_FileIOFlag.ReadSync = "rs";
nodejs_fs_FileIOFlag.ReadWriteSync = "rs+";
nodejs_fs_FileIOFlag.WriteCreate = "w";
nodejs_fs_FileIOFlag.WriteCheck = "wx";
nodejs_fs_FileIOFlag.WriteReadCreate = "w+";
nodejs_fs_FileIOFlag.WriteReadCheck = "wx+";
nodejs_fs_FileIOFlag.AppendCreate = "a";
nodejs_fs_FileIOFlag.AppendCheck = "ax";
nodejs_fs_FileIOFlag.AppendReadCreate = "a+";
nodejs_fs_FileIOFlag.AppendReadCheck = "ax+";
nodejs_fs_ReadStreamEventType.Open = "open";
nodejs_fs_WriteStreamEventType.Open = "open";
nodejs_http_HTTPMethod.Get = "GET";
nodejs_http_HTTPMethod.Post = "POST";
nodejs_http_HTTPMethod.Options = "OPTIONS";
nodejs_http_HTTPMethod.Head = "HEAD";
nodejs_http_HTTPMethod.Put = "PUT";
nodejs_http_HTTPMethod.Delete = "DELETE";
nodejs_http_HTTPMethod.Trace = "TRACE";
nodejs_http_HTTPMethod.Connect = "CONNECT";
nodejs_http_HTTPClientRequestEventType.Response = "response";
nodejs_http_HTTPClientRequestEventType.Socket = "socket";
nodejs_http_HTTPClientRequestEventType.Connect = "connect";
nodejs_http_HTTPClientRequestEventType.Upgrade = "upgrade";
nodejs_http_HTTPClientRequestEventType.Continue = "continue";
nodejs_http_HTTPServerEventType.Listening = "listening";
nodejs_http_HTTPServerEventType.Connection = "connection";
nodejs_http_HTTPServerEventType.Close = "close";
nodejs_http_HTTPServerEventType.Error = "error";
nodejs_http_HTTPServerEventType.Request = "request";
nodejs_http_HTTPServerEventType.CheckContinue = "checkContinue";
nodejs_http_HTTPServerEventType.Connect = "connect";
nodejs_http_HTTPServerEventType.Upgrade = "upgrade";
nodejs_http_HTTPServerEventType.ClientError = "clientError";
nodejs_stream_ReadableEventType.Readable = "readable";
nodejs_stream_ReadableEventType.Data = "data";
nodejs_stream_ReadableEventType.End = "end";
nodejs_stream_ReadableEventType.Close = "close";
nodejs_stream_ReadableEventType.Error = "error";
nodejs_http_IncomingMessageEventType.Data = "data";
nodejs_http_IncomingMessageEventType.Close = "close";
nodejs_http_IncomingMessageEventType.End = "end";
nodejs_http_ServerResponseEventType.Close = "close";
nodejs_http_ServerResponseEventType.Finish = "finish";
nodejs_net_TCPServerEventType.Listening = "listening";
nodejs_net_TCPServerEventType.Connection = "connection";
nodejs_net_TCPServerEventType.Close = "close";
nodejs_net_TCPServerEventType.Error = "error";
nodejs_net_TCPSocketEventType.Connect = "connect";
nodejs_net_TCPSocketEventType.Data = "data";
nodejs_net_TCPSocketEventType.End = "end";
nodejs_net_TCPSocketEventType.TimeOut = "timeout";
nodejs_net_TCPSocketEventType.Drain = "drain";
nodejs_net_TCPSocketEventType.Error = "error";
nodejs_net_TCPSocketEventType.Close = "close";
nodejs_stream_WritableEventType.Drain = "drain";
nodejs_stream_WritableEventType.Finish = "finish";
nodejs_stream_WritableEventType.Pipe = "pipe";
nodejs_stream_WritableEventType.Unpipe = "unpipe";
nodejs_stream_WritableEventType.Error = "error";
HaxelibCli.main();
})(typeof console != "undefined" ? console : {log:function(){}});
