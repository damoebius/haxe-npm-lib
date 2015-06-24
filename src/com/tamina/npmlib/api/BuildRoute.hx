package com.tamina.npmlib.api;

import nodejs.Console;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;

class BuildRoute extends Route {

    public function new( ) {

        super(_sucessHandler);
    }

    private function _sucessHandler( request:ExpressRequest, response:ExpressResponse ):Void {
        Console.error('not yet implemented');
        response.send('not yet implemented');
    }
}
