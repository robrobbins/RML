# The Righteous Markup Lever

*v1.6.0* 
## A Quick and Dirty Tour

### Micro-Templating Added

On a recent project I hacked in  an implementation of [John Resig's Micro Templates](http://ejohn.org/blog/javascript-micro-templating/)
to RML for the places where a more tradional template was a better tool. This version has the [Rick Strahl](http://www.west-wind.com/Weblog/default.aspx) and
team [Underscore.js](http://github.com/documentcloud/underscore/) tweaks, along with the ability to pass in an array as the first argument.

#### RML.template

	var tpl = RML.template([
		'<div id="<?= id ?>">',
			'<ul class="<?= class ?>">',
				'<? for (var i=0; i<items.length; i++) { ?>',
					'<li><?= items[i] ?></li>',
				'<? } ?>',
			'</ul>',
		'</div>'
	]);
	
'Compiles' the template into a callable function. Now you can pass it a data object:

	tpl({id: 'foo', class: 'bar', items: ['spam', 'eggs']});
	
	=> <div id="foo"><ul class="bar"><li>spam</li><li>eggs</li></ul></div>
	
Of course you could just do a 'one-shot' template by passing the data object along as the second argument to `RML.template`:

	RML.template('<span id="<?= id ?>">Hello Span!</span>', {id: 'myID'});
	
	=> <span id="myID">Hello Span!</span>

I'm using `<? ?>` as the delimiters but you can change that in the `templatePrefs` object 
(just be sure to update the `re` to match).
 
### Render A Tag, Any Tag...

Most common HTML tags have convenience methods which can be called like so:

	RML.a();
	
	=> <a></a>
	
If a tag doesn't require any attributes you can pass in its content simply as
a string argument:

	RML.span('Hello World!');
	
	=> <span>Hello World!</span>
	
Tags will require attributes though, so pass a 'config' object to a method with  
properties and values which reflect the attributes you want rendered:

	RML.div({
		id: 'foo',
		_class: 'bar'
	});
	
	=> <div id='foo' class='bar'></div>
	
We use _class in the config object to circumvent any issues with the reserved 
keyword 'class'.

#### The Content Property

If a config object has a `content` property its value is placed between the 
opening and closing tags. In the case of a string (or a number) the value is 
written as is:

	RML.div({
		id: 'foo',
		_class: 'bar',
		content: 'Important stuff'
	});
	
	=> <div id='foo' class='bar'>Important stuff</div>
	
If the value of the content property is a function, that function will be called.

	RML.div({
	    id: 'foo',
	    _class: 'bar',
	    content: function() {
	        var data = {
	        	stuff: 'Important stuff'
			};
			return data.stuff;
	    }
	});
	
	=> <div id='foo' class='bar'>Important stuff</div>

This feature, obviously, can have much more powerful uses than the above example, 
and has proven to be very effective for elements whose contents need to be
fetched and parsed asynchronously.

##### Arrays as Content

You can have an array as content for a tag. Here, with no attributes:

	RML.div(['I', 'am', 'an', 'array']);
	
	=> <div>Iamanarray</div>
	
This has one obvious problem, the array is joined and return with no spaces
between items. This is a design decision as I have no way to know what any 
given array may contain, or how it needs to be rendered. The solution is to 
provide an override argument passed to the tag method itself. You lose the 
convenience method, but you gain the ability to join an array with any delimiter
you wish:

	RML.tag('div', ['I', 'am', 'an', 'array'], 0, ' ');
	
	=> <div>I am an array</div>
	
Dashes:, 

	RML.tag('div', ['I', 'am', 'an', 'array'], 0, '-');
	
	=> <div>I-am-an-array</div>

And here, in the `content` attribute of a config object. The same
procedure as above would apply for rendering it how you wanted. With commas for 
example:

	RML.tag('div', {
		id: 'green',
		_class: 'eggs',
		content: ['I', 'am', 'an', 'array', 'too']
	}, 0, ',');
	
	=> <div id='green' class='eggs'>I,am,an,array,too</div>

### The Siblings Method

To abstract out the common pattern of joining string arrays or using `+=`, you can now call `RML.siblings()` with any number of arguments:

	RML.ul({
    	id: 'list',
    	content: RML.siblings(
			RML.li('some'),
			RML.li('sibling'),
			RML.li('elements')
		);
	});
	
	=> <ul id="list"><li>some</li><li>sibling</li><li>elements</li></ul>

### The Tags Object

RML dynamically creates convenience methods for tags based on the key-value 
pairs in the 'tags' object. 
 
	tags: {
		'a': 0,
		'br': 1
	}

At run-time these are converted into functions for each property defined. 
For example the `br: 1` above is appended automatically to the RML object as: 

	br: function(arg) {
		this.tag('br', arg, 1);
	}
	
That `int` value determines the type of tag rendered. Default with a closing tag, 
`<foo></foo>`, self-closing, `<foo />`, or open, `<foo>`. More on that in a moment.
	
### The tag() Method

This is the centerpiece of the RML library, and only about 6 lines of code. 
Looking at the source, you'll notice the tag() method takes 4 arguments:

	tag: function(t, arg, tt, dl) {
        //code...
    }

1. `t` is the tag name itself. 'div', 'span', 'canvas' etc...
2. `arg` is the deciding factor on which function tag() passes control flow to. 
Strings, numbers, arrays and objects are all useful types for `arg`
3. `tt` is the type of tag: closed, self-closing, or open
4. `dl` is an optional argument which will be used as a seperator when an array is passed
as the `content` of a tag. See the `Arrays as Content` section above

#### Custom, XML, or HTML5 tags

Tags not defined by you (or me) in the tags object can be generated in your scripts by simply calling RML.tag() directly: 
	
	RML.tag('myTag', 'stuff');
	
	=> <myTag>stuff</myTag>
	
The 'tag type' argument is the third argument passed. Omitting it, or passing a falsy 
value (such as 0 like the `tags` object does) results in the default type, a tag complete 
with a closing tag, such as the `myTag` example above. Pass in a 1 (or true) for a 
self-closing tag:

	RML.tag('custom', {foo:'bar'}, 1);

	=> <custom foo="bar"/>

Any attributes without values can be placed in a tag by assigning it a falsy value: 

	RML.tag('custom', {keyOnly:0});
	
	=> <custom keyOnly></custom>
	
Remember, you can add your own convenience methods to the tag object, this will 
prevent you from having to pass the tag name as an argument.

##### The Open Tag

Just in case you need an unclosed tag, you can pass a 2 as the 'tag type' argument. 
So a doctype tag could be generated by:

	RML.tag('!DOCTYPE', 'html PUBLIC "-//W3C...""http..."', 2);
	
	=> <!DOCTYPE html PUBLIC "-//W3C...""http...">

## Big Example

Say you had a 'markup' object which held all of your HTML generating methods:

	markup: {
		header: function() {
    		var $header = RML.div({
        		id:'header',
        		content: RML.siblings( 
					RML.h1('An H1'),
					RML.hr(),
					RML.div({
          				_class:'message-form',
          				content: RML.textarea({
          					name:'txt-message',
          					id:'txt-message',
          					rows:'4',
          					cols:'60'
        			}),
					RML.input({
          				type:'button',
          				id:'btn-send-message',
          				name:'btn-send-message',
          				value:'Send Message'
        			}),
 					RML.input({
          				type:'button',
          				id:'btn-clear-message',
          				name:'btn-clear-message',
          				value:'Clear Message'
        			}),
					RML.input({
          				type:'button',
          				id:'btn-logout',
          				name:'btn-logout',
          				value:'Log Out'
        			})
      			})
    		});
    		return $header;
		},
		footer: function() {...}
	};
	
### Node.js Module

I made a Node compatible version of RML, it's in the 'rml' folder above. 
The folder contains the single file 'index.js' so you can just reference the 
directory with your Node require statement. I created a '.node_libraries' 
folder in my home directory, and I simlink files to it as node will look there 
to resolve 'requires' statements. For example:

	$ln -s ~/path-to-rml-folder ~/.node_libraries/rml
	
Then in your Node file or REPL session:

	var RML = require('rml'); 
	
All other use is identical to client-side version. I have been using RML with
[express](http://www.expressjs.com) so I don't have to write HTML into the response:

	get('/update', function(req, res){
	    res.send(
	        RML.div({
	            id: 'foo',
	            _class: 'padded',
	            content: RML.p('some content')
	        })
	    );
	});
	
enjoy.
