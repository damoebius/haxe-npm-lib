package ;

import com.tamina.npmlib.api.Routes;
import com.tamina.npmlib.api.BuildRoute;
import com.tamina.npmlib.config.Config;
import nodejs.express.Express;
import nodejs.express.Application;
class NpmLib {

    private static var _server:NpmLib;

    private var _express:Application;
    private var _config:Config;

    public function new( ):Void {

        _config = Config.getInstance();

        _express = Express.GetApplication();
        _express.listen(_config.appPort);
        _express.use(Express.Static(_config.rootPath));

        var buildRoute = new BuildRoute();
        _express.get('/' + Routes.BUILD, buildRoute.succesHandler);
    }

    public static function main( ):Void {
        _server = new NpmLib();
    }
}
