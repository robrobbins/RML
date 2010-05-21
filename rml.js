/*global console alert window*/
var RML = (function() {
    //private stuff here
    return {
        //list of tagnames, autoclose bool
        tags: {
            'a': false,
            'br': true,
            'div': false,
            'h1': false,
            'h2': false,
            'h3': false,
            'h4': false,
            'hr': true,
            'img': false,
            'input': true,
            'li': false,
            'link': true,
            'p': false,
            'script': false,
            'span': false,
            'table': false,
            'tbody': false,
            'td': false,
            'textarea': false,
            'th': false,
            'thead': false,
            'tr': false,
            'ul': false
        },
        //items which should NOT appear in the
        //attributes of a tag. Items set to true
        //will be excluded
        filter: {
            'content': true
        },
        //absract out the string replacement bit...
        rsub: function(k,v) {
            var str = ' %1="%2"';
            return str.replace('%1', k).replace('%2', v);
        },
        //convenience method for hasOwnProperty
        //@param obj is the object in question
        //@param key is the key to look for
        has: function(obj, key) {
            return obj && obj.hasOwnProperty && obj.hasOwnProperty(key);
        },
        //tag names are methods appended to the RML object
        //which will return markup
        //@param arg will contain the attributes and content of the
        //desired tag, step through it and modify the tstr to match
        //@param t is the actual tag name, this allows for custom tags too
        //@param isClosed will be a bool only passed with self closing tags i.e.('br','',true)
        tag: function(t, arg, isClosed) {
            var tstr = ['<', t],
            content = false,
            prop;
            //arg can be an object or just a string/number:
            if (typeof(arg) === 'string' || typeof (arg) === 'number' ||
                typeof(arg) === 'undefined') {
                    if (!isClosed) {
                        tstr.push('>', arg, '</', t, '>');
                        return tstr.join('');
                    }
                    tstr.push('/>');
                    return tstr.join('');
            }
            else if (typeof(arg) === 'function') {
                tstr.push('>', arg(), '</', t, '>');
                return tstr.join('');
            }
            else if (typeof(arg) === 'object') { //could typecheck further...
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