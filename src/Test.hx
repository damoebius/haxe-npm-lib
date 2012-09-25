/****
* ORIGINAL LIBRARY:
* Bean - copyright (c) Jacob Thornton 2011-2012
* https://github.com/fat/bean
* MIT license
* 
* Externs by Jason O'Neil 2012.  No further restrictions other than Jacob Thornton's MIT licence on the original source.
****/

class Test 
{
	static function main()
	{
		js.Lib.window.onload = function (e) {
			Bean.on(js.Lib.document.body, 'click', function(e) {
				trace('hi');
			});
		}
	}
}