/*global console alert window*/
//functions to generate HTML markup

var RML = {
    //tag names are methods appended to the RML object
    //which will return markup

    //@param arg will contain the properties and content of the
    //desired tag, step through it and modify the tstr[] to match
    //@param t is the actual tag name, this allows for custom tags too
    tag: function(t,arg) {
        var props = [' id="$id"', ' class="$class"', ' style="$style"', '$content'],
        prop,tstr = '<' + t, _content = false;
        //arg can be an object or just a string/number:
        if (typeof (arg) === 'string' || typeof (arg) === 'number' ||
            typeof(arg) === 'undefined') {
            return ('<' + t + '>' + arg + '</' + t + '>');
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
                        case 'content':
                            props[3] = props[3].replace('$content', arg[prop]);
                            _content = true;
                            break;
                    }
                } //end hasownprop
            } //end for-in
            tstr +='>';
            if(_content) {tstr += props[3];}
            tstr += '</' + t + '>';
        } //end else if object
        return tstr;
    }, //end tag
    
    //convenience methods for specific tags
    p: function(arg) {
        return RML.tag('p', arg);
    }, //end p
    div: function(arg) {
        return RML.tag('div', arg);
    },
    span: function(arg) {
        return RML.tag('span', arg);
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
    table: function(arg) {
        return RML.tag('table', arg);
    },
    th: function(arg) {
        return RML.tag('th', arg);
    },
    tr: function(arg) {
        return RML.tag('tr', arg);
    },
    td: function(arg) {
        return RML.tag('td', arg);
    },
    thead: function(arg) {
        return RML.tag('thead', arg);
    },
    tbody: function(arg) {
        return RML.tag('tbody', arg);
    },
    ul: function(arg) {
        return RML.tag('ul', arg);
    },
    li: function(arg) {
        return RML.tag('li', arg);
    }
};