/*global console alert window exports*/

//commonJS version of the RML markup generating library
exports.name = 'Righteous Markup Lever';
exports.summary = 'Returns HTML markup via methods appended to rml';
exports.requires = [];

var RML = (function() {
    //vars...
    var SLICE = Array.prototype.slice;
    return {
        //list of tagnames, autoclose bool
        tags: {
            'a': false,'b': false,'br': true,
            'canvas': false,'code': false,'div': false,
            'dl': false, 'dd': false, 'dt': false,
            'em': false,'form': false,'h1': false,
            'h2': false,'h3': false,'h4': false,
            'hr': true,'i': false,'img': false,
            'input': true,'li': false,'link': true,
            'ol': false,'p': false,'pre': false,
            'script': false,'select': false, 'strong': false,
            'span': false,'table': false,'tbody': false,
            'td': false,'textarea': false,'th': false,
            'thead': false,'tr': false,'ul': false
        },
        //items which should NOT appear in the
        //attributes of a tag. Items set to true
        //will be excluded
        filter: {
            'content': true
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
        //convenience method for hasOwnProperty
        //@param obj is the object in question
        //@param key is the key to look for
        has: function(obj, key) {
            return obj && obj.hasOwnProperty && obj.hasOwnProperty(key);
        },
        //method to abstract over the typical operation
        //of joining or (worse) concatonating sibling elements
        siblings: function() {
            //could have any number of arguments
            var args = SLICE.call(arguments, 0);
            return args.join('');
        },
        //tag names are methods appended to the RML object
        //which will return markup
        //@param arg will contain the attributes and content of the
        //desired tag, step through it and modify the tstr to match
        //@param t is the actual tag name, this allows for custom tags too
        //@param isClosed will be a bool only passed with self closing tags 
        //i.e.('br','',true)
        tag: function(t, arg, isClosed) {
            var tstr = ['<', t],
            content = false,
            prop;
            //arg can be an object or just a string/number:
            if (typeof arg === 'string' || typeof arg === 'number' ||
                typeof arg === 'undefined') {
                    if (!isClosed) {
                        tstr.push('>', arg, '</', t, '>');
                        return tstr.join('');
                    }
                    tstr.push('/>');
                    return tstr.join('');
            }
            else if (typeof arg === 'function') {
                tstr.push('>', arg(), '</', t, '>');
                return tstr.join('');
            }
            else if (typeof arg === 'object') { //could typecheck further...
                //override bool for content if present
                if (this.has(arg, 'content')) {content = true;}
                //assemble the properties section of the tag
                for (prop in arg) {
                    if(this.has(arg, prop) && !this.filter[prop]) {
                        tstr.push(this.rsub(prop, arg[prop]));
                    }
                }
                if(!isClosed) {
                    tstr.push('>');
                    if(content) {
                        //content could be a function which returns a string
                        if (typeof(content) === 'function') {
                            tstr.push(arg.content());
                        }
                        else {
                            tstr.push(arg.content);
                        }
                    }
                    tstr.push('</', t, '>');
                }
                if(isClosed) {
                    //will never need content
                    tstr.push('/>');
                }
            } //end else if object
            return tstr.join('');
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
//transfer RML to exports
for (prop in RML) {
    exports[prop] = RML[prop];
}