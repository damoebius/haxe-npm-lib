package;

import massive.munit.util.Timer;
import massive.munit.Assert;
import massive.munit.async.AsyncFactory;
import js.JQuery;
import js.Dom.HtmlDom;
import Bean;

/**
* Auto generated ExampleTest for MassiveUnit. 
* This is an example test class can be used as a template for writing normal and async tests 
* Refer to munit command line tool for more information (haxelib run munit)
*/
class BeanTest 
{
	private var timer:Timer;
	
	public function new() 
	{
		
	}

	var container:JQuery;
	var btn:JQuery;
	var btnNode:HtmlDom;
	var input:JQuery;
	var inputNode:HtmlDom;
	static var longTimeOut = 5 * 60 * 1000; // 5 minutes
	static var btnPosition = "left";
	static var eventCount = 0;

	
	@BeforeClass
	public function beforeClass():Void
	{
		// Set up a container in the main body, it will hide the results
		var body = new JQuery(js.Lib.document.body);
		container = new JQuery("<div />").css({
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			background: 'orange'
		}).attr('id', 'bean-test');
		body.append(container);
	}
	
	@AfterClass
	public function afterClass():Void
	{
		// Remove the container, so we can see the results again
		container.remove();
	}
	
	@Before
	public function setup():Void
	{
		// Reset the button
		btn = new JQuery("<button>Some Button</button>").css({
			position: 'absolute',
			top: '45%',
			'text-align': 'center'
		});
		btnNode = btn.get(0);

		// Get button to toggle between being on the right and on the left so mouseevents don't accidentally fire
		btn.css(btnPosition, '10%');
		btnPosition = (btnPosition == "left") ? "right" : "left";

		// Reset the event count
		eventCount = 0;
	}
	
	@After
	public function tearDown():Void
	{
		container.empty();
	}
	
	@AsyncTest
	public function testClick(factory:AsyncFactory):Void
	{
		var handler:Dynamic = factory.createHandler(this, function() { Assert.isTrue(true); }, longTimeOut);
		btn.text("Please click me").appendTo(container);
		Bean.on(btnNode, "click", handler);
	}
	
	@AsyncTest
	public function testMouseOver(factory:AsyncFactory):Void
	{
		var handler:Dynamic = factory.createHandler(this, function() { Assert.isTrue(true); }, longTimeOut);

		btn.text("Please mouseover me").appendTo(container);
		Bean.on(btnNode, "mouseover", handler);
	}
	
	@AsyncTest
	public function testMouseOut(factory:AsyncFactory):Void
	{
		var handler:Dynamic = factory.createHandler(this, function() { Assert.isTrue(true); }, longTimeOut);

		btn.text("Please mouseout me").appendTo(container);
		Bean.on(btnNode, "mouseout", handler);
	}
	
	@AsyncTest
	public function testOn(factory:AsyncFactory):Void
	{
		var handler:Dynamic = factory.createHandler(this, function() { 
			Assert.isTrue(true); 
		}, longTimeOut);

		
		btn.text("Please click me three times").appendTo(container);
		
		Bean.on(btnNode, "click", function (e) {
			eventCount++;
			if (eventCount == 3)
			{
				handler();
			}
			else 
			{
				btn.text("Please click me " + (3 - eventCount) + " more times.");
			}
		});
	}
	
	@AsyncTest
	public function testOne(factory:AsyncFactory):Void
	{
		var handler:Dynamic = factory.createHandler(this, function() { 
			Assert.isTrue(true); 
		}, longTimeOut);

		
		btn.text("Please click me three times").appendTo(container);
		
		Bean.one(btnNode, "click", function (e) {

			// Check this was only ever called once
			eventCount++;
			Assert.areEqual(1, eventCount);

			// Get them to click again, but the next click needs to fire a different callback, not this one
			btn.text("And again");
			Bean.on(btnNode, "click", function (e) {
				eventCount++;
				if (eventCount == 3)
				{
					handler();
				}
			});
		});
	}
	
	@AsyncTest
	public function testOff(factory:AsyncFactory):Void
	{
		var handler:Dynamic = factory.createHandler(this, function() { 
			Assert.isTrue(true); 
		}, longTimeOut);

		
		btn.text("Please click me three times").appendTo(container);
		
		Bean.on(btnNode, "click", function (e) {

			Bean.off(btnNode);

			// Check this was only ever called once
			eventCount++;
			Assert.areEqual(1, eventCount);

			// Get them to click again, but the next click needs to fire a different callback, not this one
			btn.text("And again");
			Bean.on(btnNode, "click", function (e) {
				eventCount++;
				if (eventCount == 3)
				{
					handler();
				}
			});
		});
	}
	
	@AsyncTest
	public function testTrigger(factory:AsyncFactory):Void
	{
		var handler:Dynamic = factory.createHandler(this, function() { 
			Assert.isTrue(true); 
		}, longTimeOut);

		js.Lib.debug();

		btn.text('jQuery will listen, bean will trigger').appendTo(container);
		btn.click(function () {
			handler();
		});

		Bean.fire(btnNode, 'click');


	}
}