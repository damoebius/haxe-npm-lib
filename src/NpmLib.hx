package ;

import com.tamina.npmlib.routes.Routes;
import com.tamina.npmlib.routes.BuildRoute;
import com.tamina.npmlib.config.Config;
import nodejs.express.Express;
import nodejs.express.Application;
class NpmLib {

    private static var _server:NpmLib;

    private var _express:Application;

    public function new():Void {

        _express = Express.GetApplication();
        _express.listen(Config.APP_PORT);
        _express.use(Express.Static(Config.ROOT_PATH));

        var buildRoute = new BuildRoute();
        _express.get('/' + Routes.BUILD, buildRoute.succesHandler);
    }

    public static function main():Void{
         _server = new NpmLib();
    }
}
