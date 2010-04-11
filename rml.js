/*global console alert window*/
//functions to generate HTML markup

var RML = {
    //tag names are methods appended to the RML object
    //which will return markup

    //@param arg will contain the properties and content of the
    //desired tag, step through it and modify the tstr[] to match
    //@param t is the actual tag name, this allows for custom tags too
    //@param isClosed will be a bool only passed with self closing tags i.e.('br','',true)
    tag: function(t,arg, isClosed) {
        var props = [' id="$id"', ' class="$class"', ' style="$style"',' type="$type"',' name="$name"',
            ' value="$value"',' src="$src"', ' rows="$rows"', ' cols="$cols"',' href="$href"', '$content'], //INDEX!
        prop,tstr = '<' + t, _content = false;
        //arg can be an object or just a string/number:
        if (typeof (arg) === 'string' || typeof (arg) === 'number' ||
            typeof(arg) === 'undefined') {
            return (!isClosed) ? '<' + t + '>' + arg + '</' + t + '>' : 
                '<' + t + ' />';
        }
        else if (typeof (arg) === 'object') {
            for (prop in arg) {
                if (arg.hasOwnProperty(prop)) {
                    switch (prop) {
                        case 'id':
                            tstr += props[0].replace('$id', arg[prop]);
                            break;
                        case 'class':
                            tstr += props[1].replace('$class', arg[prop]);
                            break;
                        case 'style':
                            tstr += props[2].replace('$style', arg[prop]);
                            break;
                        case 'type':
                            tstr += props[3].replace('$type', arg[prop]);
                            break;
                        case 'name':
                            tstr += props[4].replace('$name', arg[prop]);
                            break;
                        case 'value':
                            tstr += props[5].replace('$value', arg[prop]);
                            break;
                        case 'src':
                            tstr += props[6].replace('$src', arg[prop]);
                            break;
                        case 'rows':
                            tstr += props[7].replace('$rows', arg[prop]);
                            break;
                        case 'cols':
                            tstr += props[8].replace('$cols', arg[prop]);
                            break;
                        case 'href':
                            tstr += props[9].replace('$href', arg[prop]);
                            break;    
                        case 'content':
                            props[10] = props[10].replace('$content', arg[prop]);
                            _content = true;
                            break;
                    }
                } //end hasownprop
            } //end for-in
            if(!isClosed) {
                tstr +='>';
                if(_content) {tstr += props[10];}
                tstr += '</' + t + '>';
            }
            if(isClosed) {
                if(_content) {tstr += props[10];}
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
        return RML.tag('br', arg, true)
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
        return RML.tag('hr', arg, true)
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