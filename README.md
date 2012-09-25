Bean.hx: Bean.js externs for Haxe
=================================

Providing light-weight, cross browser event management for the DOM.

Original project: https://github.com/fat/bean/ thanks to Jacob Thornton.

This extern provides a light-weight implementation of cross browser events in Haxe.  It is super light weight (4.1kb gzipped) and works reliably cross platform.  The externs should support mostly the same usage as the original, but with a capital 'B':

```
Bean.on(js.Lib.document.body, "click", function (e) {
	trace ("The body was clicked!");
});

Bean.one(myBtnNode, "click", function (e) {
	trace ("This click will only fire once");
});

Bean.off(myBtnNode);

Bean.trigger(myBtnNode, "click");
```

etc.  For more usage options (including delegates etc) see the original README.  If anyone feels like updating this README to flesh out the examples please do!
