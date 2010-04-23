/*global console alert window*/
//functions to generate HTML markup

var RML = {
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
        var has = RML.has,
        filter = RML.filter,
        rsub = RML.rsub,
        tstr = '<' + t,
        content = false,
        prop;

        //arg can be an object or just a string/number:
        if (typeof (arg) === 'string' || typeof (arg) === 'number' ||
            typeof(arg) === 'undefined') {
            return (!isClosed) ? '<' + t + '>' + arg + '</' + t + '>' :
                '<' + t + ' />';
        }
 
        else if (typeof (arg) === 'object') { //could typecheck further...
            //override bool for content if present
            if (RML.has(arg, 'content')) {content = true;}
            //assemble the properties section of the tag
            for (prop in arg) {
                if(has(arg, prop) && !filter[prop]) {
                    tstr += rsub(prop, arg[prop]);
                }
            }

            if(!isClosed) {
                tstr +='>';
                if(content) {tstr += arg.content;}
                tstr += '</' + t + '>';
            }
            if(isClosed) {
                if(content) {tstr += arg.content;}
                tstr += ' />';
            }
        } //end else if object
        return tstr;
    }, //end tag
    
    //convenience methods for specific tags
    a: function(arg) {
        return RML.tag('a', arg);
    },
    br: function(arg) {
        return RML.tag('br', arg, true);
    },
    div: function(arg) {
        return RML.tag('div', arg);
    },
    h1: function(arg) {
        return RML.tag('h1', arg);
    },
    h2: function(arg) {
        return RML.tag('h2', arg);
    },
    h3: function(arg) {
        return RML.tag('h3', arg);
    },
    h4: function(arg) {
        return RML.tag('h4', arg);
    },
    hr: function(arg) {
        return RML.tag('hr', arg, true);
    },
    img: function(arg) {
        return RML.tag('img', arg);
    },
    input: function(arg) {
        return RML.tag('input', arg, true);
    },
    li: function(arg) {
        return RML.tag('li', arg);
    },
    link: function(arg) {
        return RML.tag('link', arg);
    },
    p: function(arg) {
        return RML.tag('p', arg);
    },
    script: function(arg) {
        return RML.tag('script', arg);
    },
    span: function(arg) {
        return RML.tag('span', arg);
    },
    table: function(arg) {
        return RML.tag('table', arg);
    },
    tbody: function(arg) {
        return RML.tag('tbody', arg);
    },
    td: function(arg) {
        return RML.tag('td', arg);
    },
    textarea: function(arg) {
        return RML.tag('textarea', arg);
    },
    th: function(arg) {
        return RML.tag('th', arg);
    },
    thead: function(arg) {
        return RML.tag('thead', arg);
    },
    tr: function(arg) {
        return RML.tag('tr', arg);
    },
    ul: function(arg) {
        return RML.tag('ul', arg);
    }
};
