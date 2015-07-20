package ;
import com.tamina.server.web.Action;
import com.tamina.server.web.GetParamName;
import php.Web;
class HaxelibServer {

    private static var _instance:HaxelibServer;

    private var _params:Map<String,String>;

    public function new() {
        trace('server');
        _params = Web.getParams();

        if(_params[GetParamName.ACTION] != null){
            if(_params[GetParamName.ACTION] == Action.ADD_LIB){

            } else {
                trace("unknow action");
            }
        } else {
            trace('no action');
            Web.setReturnCode(500);
        }
    }

    public static function main():Void {
        _instance = new HaxelibServer();
    }
}
