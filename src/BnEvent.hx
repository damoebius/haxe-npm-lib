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
	import js.html.DOMWindow;
#elseif xirsys_stdjs
	import UserAgentContext;
#else 
	typedef Node = js.Dom.HtmlDom;
	typedef DOMWindow = js.Dom.Window;
#end

extern class BnEvent {
	
	public var type (default,never) : String;
	public var target (default,never) : Node;
	public var currentTarget (default,never) : Node;
	public var relatedTarget (default,never) : Node;
	public var eventPhase (default,never) : Int;
	public var bubbles (default,never) : Bool;
	public var cancelable (default,never) : Bool;
	public var timeStamp (default,never) : Int;
	public var shiftKey (default,never) : Bool;
	public var ctrlKey (default,never) : Bool;
	public var altKey (default,never) : Bool;
	public var metaKey (default,never) : Bool;
	public var view (default,never) : DOMWindow;
	public var which (default,never) : Int;
	public var detail (default,never) : Int;
	public var isTrusted (default,never) : Bool;
	public var relatedNode (default,never) : Node;
	public var attrName (default,never) : String;
	public var attrChange (default,never) : Int;
	public function getModifierState(keyIdentifierArg:String) : Bool;
	public function stopPropagation() : Void;
	public function preventDefault() : Void;
	public function stop() : Void;

	// xirsys_stdjs has these properties, which are probably in the W3 standard.  Not in bean though?
	/*
	public var namespaceURI (default,never) : DOMString;
	public var defaultPrevented (default,never) : Bool;
	public static inline var CAPTURING_PHASE:UnsignedShort = 1;
	public static inline var AT_TARGET:UnsignedShort = 2;
	public static inline var BUBBLING_PHASE:UnsignedShort = 3;
	public function initEvent(eventTypeArg:DOMString, canBubbleArg:Bool, cancelableArg:Bool) : Void;
	public function stopImmediatePropagation() : Void;
	public function initEventNS(namespaceURIArg:DOMString, eventTypeArg:DOMString, canBubbleArg:Bool, cancelableArg:Bool) : Void;
	*/

	// Bean still has these event properties that we're not catching - they weren't present in FF, not sure what they are
	/* srcElement propertyName */
}
extern class BnMouseEvent extends BnEvent 
{
	// Bean has these properties which we're ignoring for now...
	public var clientX (default,never) : Int;
	public var clientY (default,never) : Int;
	public var pageX (default,never) : Int;
	public var pageY (default,never) : Int;
	public var screenX (default,never) : Int;
	public var screenY (default,never) : Int;
	public var button (default,never) : Int;
	public var buttons (default,never) : Int;
	/* dataTransfer fromElement offsetX offsetY     toElement */
}
extern class BnMouseWheelEvent extends BnEvent 
{
	public var wheelDeltaX (default,never) : Int;
	public var wheelDeltaY (default,never) : Int;
	public var wheelDeltaZ (default,never) : Int;
	public var wheelDelta (default,never) : Int;
	// Bean has these properties which we're ignoring for now...
	/* axis (axis is FF specific) */
}
extern class BnKeyEvent extends BnEvent 
{
	public var keyIdentifier (default,never) : String;
	public var keyLocation (default,never) : Int;
	// Bean has these properties which we're ignoring for now...
	/* char charCode key keyCode location */
}
extern class BnTextEvent extends BnEvent 
{
	public var data (default,never) : String;
}
extern class BnTouchEvent extends BnEvent 
{
	// Bean has these properties which we're ignoring for now...
	/* touches targetTouches changedTouches scale rotation */
}
extern class BnMessageEvent extends BnEvent 
{
	// Bean has these properties which we're ignoring for now...
	/* data origin source */
}
extern class BnStateEvent extends BnEvent 
{
	// Bean has these properties which we're ignoring for now...
	/* state */
}