package com.tamina.npmlib.routes;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;
class Route {

    public var succesHandler:ExpressRequest->ExpressResponse->Void;

    public function new( successHandler:ExpressRequest->ExpressResponse->Void ) {
        this.succesHandler = successHandler;
    }

}
