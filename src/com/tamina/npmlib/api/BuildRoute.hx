package com.tamina.npmlib.routes;

import nodejs.Console;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;

class BuildRoute extends Route {

    public function new( ) {

        super(_sucessHandler);
    }

    private function _sucessHandler( request:ExpressRequest, response:ExpressResponse ):Void {
         Console.error('not yet implemented');
    }
}
