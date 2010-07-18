# The Righteous Markup Lever

*v1.4.0* 
## What's New?

### The Siblings Method

To abstract out the common pattern of joining string arrays or using `+=`, you can now call `RML.siblings()` with any number of arguments:

<pre>RML.ul({
    id: 'list',
    content: RML.siblings(
		RML.li('these'),
		RML.li('are'),
		RML.li('sibling'),
		RML.li('elements')
});
</pre>

### Use of _class

A workaround for the fact that 'class' is a reserved keyword, when you are placing a class attribute on an element with RML use '_class: "name"'. The underscore will get stripped off and 'class' written in its place, this way you won't get parsing errors or warnings from JSLint (if you use it) See below:

<pre>RML.div({
	id: 'foo',
	_class: 'bar',
	content: function() {
		return 'if your content attribute is a function RML will call it for you';
	}
});
</pre>

### Node.js Module

I made a Node compatible version of RML, it's in the 'rml' folder above. The folder contains the single file 'index.js' so you can just reference the directory with your Node require statement. I created a '.node_libraries' folder in my home directory, and I simlink files to it as node will look there to resolve 'requires' statements. For example: 
<pre>$ln -s ~/path-to-rml-folder ~/.node_libraries/rml	
</pre> Then in your Node file or REPL session: 

<pre>var RML = require('rml');	
</pre> All other use is identical to client-side version. I have been using RML with 

[express][1] so I don't have to write HTML into the response: 
<pre>get('/update', function(req, res){
	res.send(
		RML.div({
			id: 'foo',
			_class: 'padded',
			content: RML.p('some content')
		})
	);
});
</pre>

### The Tags Object

This version says goodbye to the hard-coded convenience methods and now dynamically creates them based on the key-value pairs in the 'tags' object. 
<pre>tags: {
    'a': false,
    'br': true
}
</pre> At run-time these are convered into convenience methods for each property defined. For example the 

`br: true` above is appended to the RML object as: 
<pre>br: function(arg) {
	this.tag('br', arg, true);
}
</pre>

## Misc Examples

Say you had a 'markup' object which held all of your HTML generating methods:

<pre>markup: {
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
</pre>

#### Custom, XML, or HTML5 tags

Tags not defined by you (or me) in the tags object can be generated in your scripts by simply calling RML.tag() directly: 
<pre>RML.tag('myTag', 'stuff', false)</pre> The 'isClosed' bool sent as true will generate a self closing tag: 

<pre>RML.tag('custom', {foo:'bar'}, true)</pre> 

Any attributes without values can be placed in a tag by simply leaving the value a blank string: 

<pre>RML.tag('custom', {keyOnly:''}, false)</pre>

enjoy.
