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