/*global console alert window*/
var RML = (function() {
    //vars...
    var SLICE = Array.prototype.slice,
    TOSTRING = Object.prototype.toString,
    ARRAY = '[object Array]',
    FUNCTION = '[object Function]',
    OBJECT = '[object Object]',
    //function is passed the string array
    //pre-join, a string arg, and the tag type (0,1,2)
    factory = function(tstr, arg, tt, dl) {
        //the original tag is in the tstr
        var t = tstr[1];
        //handle arg = array
        if(TOSTRING.call(arg) === ARRAY) {
            arg = arg.join(dl);
        }
        switch(tt) {
            case 1:
            case true: //remain backwards compatible with older RML code
                //self closing tag
                tstr.push(' ', arg, '/>');
                break;
            case 2:
                //single tag form
                tstr.push(' ', arg, '>');
                break;
            default:
                //undefined tt = default type with closing tag
                tstr.push('>', arg, '</', t, '>');
        }
        return tstr.join('');
    },
    //assemble the string arg from an object and return
    handleObj = function(tstr, arg, tt, that, dl) {
        var content = false, t = tstr[1], prop;
        //override bool for content if present
        if (that.has(arg, 'content')) {content = true;}
        //assemble the properties section of the tag
        //TODO avoid the for...in?
        for (prop in arg) {
            if(that.has(arg, prop) && !that.filter[prop]) {
                tstr.push(that.rsub(prop, arg[prop]));
            }
        }
        //deal with possible content based on tag type
        switch(tt) {
            case 1:
            case true: //backwards compatible
                //self closing, no content
                tstr.push('/>');
                break;
            case 2:
                //open tag form, no content
                tstr.push('>');
                break;
            default:
                //default tag type with closing tag, may have content
                tstr.push('>');
                if(content) {
                    switch(TOSTRING.call(arg.content)) {
                    case FUNCTION:
                        tstr.push(arg.content());
                        break;
                    case ARRAY:
                        tstr.push(arg.content.join(dl));
                        break;  
                    default:
                        tstr.push(arg.content);
                    }
                }
                tstr.push('</', t, '>');
        }
        return tstr.join('');
    };
    return {
		// Store a compiled template function in the cached object
		cache: function(k, str) {
			this.cached[k] = this.compile(str);
		},
		// the stored functions should be called with data objects
		// RML.cached.foo({bar: 'Bar'})
		cached: {},
		// Used with RML.tag() calls to return a function which expects
		// to be called with a data object via the curried template().
		compile: function(str) {
			return this.template(str);
		},
        //items which should NOT appear in the
        //attributes of a tag. Items set to true
        //will be excluded
        filter: {
            'content': true
        },
		//convenience method for hasOwnProperty
        //@param obj is the object in question
        //@param key is the key to look for
        has: function(obj, key) {
            return obj && obj.hasOwnProperty && obj.hasOwnProperty(key);
        },
        //absract out the string replacement bit.
        rsub: function(k,v) {
            // AFAIK there is no atribute with an underscore, 
            // we'll use this to replace '_class' with 'class'
            k = k.replace(/_/, '');
            //can accomodate html5 attributes like the video tag 'controls'
            var str = v ? ' %1="%2"' : ' %1';
            return v ? str.replace('%1', k).replace('%2', v) :
                str.replace('%1', k);
        },
        //method to abstract over the typical operation
        //of joining or (worse) concatonating sibling elements
        siblings: function() {
            //could have any number of arguments
            var args = SLICE.call(arguments, 0);
            return args.join('');
        },
		// Pass in a string to have variable replacement done
		// with the template() algorithm
		// strSub('${foo} ${bar}', {foo: "Hello", bar: "world!"})
		// strSub('${0} ${1}', ["Hello", "world!"])
		strSub: function(str, data) {
			return this.template(str, data);
		},
        //tag names are methods appended to the RML object
        //which will return a markup string
        //@param arg will contain the attributes and content of the
        //desired tag, step through it and modify the tstr to match
        //@param t is the actual tag name, this allows for custom tags too
        //@param tt is an int representing tag type:
        //falsy values (0 for ex.) will create a tag with a closing tag, <a></a>
        //1 (or true) for a self closing tag, <br /> **these are not checked for content
        //2 for the open tag form <foo> **also not checked for content
        //dl is an optional arg which can provide a delimiter for content arrays
        tag: function(t, arg, tt, dl) {
            arg = arg || '';
            dl = dl || ''; //default no spaces between array items
            var tstr = ['<', t];
            //handle the arg type, a string or an object, then 
            //hand off to appropriate function
            return TOSTRING.call(arg) !== OBJECT ? factory(tstr, arg, tt, dl) :
                handleObj(tstr, arg, tt, this, dl);
        },
		//shortcut methods to append to RML
        tags: {
            'a': 0,'b': 0,'br': 1,
            'canvas': 0,'code': 0,'div': 0,
            'dl': 0, 'dd': 0, 'dt': 0,
            'em': 0,'form': 0,'h1': 0,
            'h2': 0,'h3': 0,'h4': 0,
            'hr': 1,'i': 0,'img': 0,
            'input': 1,'li': 0,'link': 1,
            'ol': 0,'p': 0,'pre': 0,
            'script': 0,'select': 0, 'strong': 0,
            'span': 0,'table': 0,'tbody': 0,
            'td': 0,'textarea': 0,'th': 0,
            'thead': 0,'tr': 0,'ul': 0
        },
        template: function(tpl, data) {
            // str passed in as an array? I do...
            var str = TOSTRING.call(tpl) === ARRAY ? tpl.join('') : tpl,
			fn = function(obj) {
				return str.replace(/\$\{(.+?)\}/g, 
					function(match, key) {
						return obj[key];
					}
				);
			};
			// curry the method, provides the ability to
			// return a function which waits for a data source
			return data ? fn(data) : fn;
        }
    };
}());
//dynamically append convenience methods using tags object
(function() {
    var has = RML.has,
    tags = RML.tags,
    prop;
    for(prop in tags) {
        if (has(tags, prop)) {
            RML[prop] = (function(t) {
                return function(arg) {
                    return this.tag(t, arg, this.tags[t]);
                };
            }(prop));
        }
    }
}());