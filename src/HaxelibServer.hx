package ;
import php.Lib;
import com.tamina.server.controler.LibController;
import com.tamina.server.model.Route;
import com.tamina.server.web.Page;
import com.tamina.server.web.Action;
import php.Web;
class HaxelibServer {

    private static var _instance:HaxelibServer;

    private var _route:Route;

    public function new() {
        _route = new Route( Web.getParams() );
        if(_route.page != null && _route.action != null){

            if(_route.page == Page.LIB){
                var libCtrl = new LibController(_route);
                libCtrl.run();
            } else {
                Lib.print("unknow page");
                Web.setReturnCode(400);
            }
        } else {
            Lib.print('no action or page');
            Web.setReturnCode(400);
        }
    }

    public static function main():Void {
        _instance = new HaxelibServer();
    }
}
