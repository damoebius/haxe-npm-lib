/****
* ORIGINAL LIBRARY:
* Bean - copyright (c) Jacob Thornton 2011-2012
* https://github.com/fat/bean
* MIT license
* 
* Externs by Jason O'Neil 2013.  No further restrictions other than Jacob Thornton's MIT licence on the original source.
****/

#if (haxe_211 || haxe3)
	import js.html.Node;
	import js.html.EventListener;
#elseif xirsys_stdjs
	import UserAgentContext;
#else 
	typedef Node = js.Dom.HtmlDom;
	typedef EventListener = BnEvent->Void;
#end 

@:native("bean")
extern class Bean {
	@:overload(function(element:Node, eventType:String, handler:EventListener):Void{})
	@:overload(function(element:Node, eventType:String, selector:String, handler:EventListener):Void{})
	@:overload(function(element:Node, eventType:String, handler:EventListener, args:Array<Dynamic>):Void{})
	static function on(element:Node, eventType:String, selector:String, handler:EventListener, args:Array<Dynamic>):Void;
	
	@:overload(function(element:Node, eventType:String, handler:EventListener):Void{})
	@:overload(function(element:Node, eventType:String, selector:String, handler:EventListener):Void{})
	@:overload(function(element:Node, eventType:String, handler:EventListener, args:Array<Dynamic>):Void{})
	static function one(element:Node, eventType:String, selector:String, handler:EventListener, args:Array<Dynamic>):Void;
	
	@:overload(function(element:Node):Void{})
	@:overload(function(element:Node, eventType:String):Void{})
	@:overload(function(element:Node, handler:EventListener):Void{})
	static function off(element:Node, eventType:String, handler:EventListener):Void;

	@:overload(function(destElement:Node, srcElement:Node):Void{})
	static function clone(destElement:Node, srcElement:Node, eventType:String):Void;

	@:overload(function(element:Node, eventType:String):Void{})
	static function fire(element:Node, eventType:String, args:Array<Dynamic>):Void;

	@:overload(function(element:Node, eventType:String):Void{})
	static function setSelectorEngine(element:Node, eventType:String, args:Array<Dynamic>):Void;

	// Include the minified JS file.
	private static function __init__() : Void {

		#if (haxe_211 || haxe3)
			#if embed_js
				#if debug
					haxe.macro.Compiler.includeFile("bean.js");
				#else
					haxe.macro.Compiler.includeFile("bean.min.js");
				#end
			#end
		#else
			#if !noEmbedJS
				#if debug
					haxe.macro.Tools.includeFile("bean.js");
				#else
					haxe.macro.Tools.includeFile("bean.min.js");
				#end
			#end
		#end
	}
}