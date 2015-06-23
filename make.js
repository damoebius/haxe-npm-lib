/**
 * Created by damo on 06/10/14.
 */

var fs = require('fs');
var ncp = require('ncp').ncp;

var moduleName = process.argv[2];

console.log("Making haxe npm package for " + moduleName);

var buildDir = 'build';


clean();
build(moduleName);
//ncp('package.json',buildDir+'/package.json')
/*ncp('README.md',buildDir+'/README.md')
ncp('bin',buildDir+'/bin');
ncp('std',buildDir+'/std');
ncp('template',buildDir+'/template');
fs.mkdirSync(libDir);
ncp('lib/bean/src',libDir+'/bean');
ncp('lib/createjs',libDir+'/createjs');
ncp('lib/extjs/haxe',libDir+'/extjs');
ncp('lib/nodejs/lib/src',libDir+'/nodejs');
ncp('lib/phantomjs/src',libDir+'/phantomjs');
ncp('lib/phaser/src',libDir+'/phaser');
ncp('lib/pixijs/src',libDir+'/pixijs');
ncp('lib/threejs',libDir+'/threejs');*/

function build(name){
    var libDir = buildDir+'/'+name;
    ncp('libs/beanhx/src',libDir)
    fs.readFile('src/package.json', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace('#project.name#', name).replace('#project.description#', name).replace('#project.author#', name).replace('#project.version#', name);

        fs.writeFile(libDir+'/package.json', result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}


function clean(){
    if(fs.existsSync( buildDir)){
        rmDir(buildDir);
    }
    fs.mkdirSync(buildDir);
}


function rmDir(dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    fs.rmdirSync(dirPath);
};