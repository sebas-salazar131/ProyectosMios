// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Stylus mode created by Dmitry Kiselyov http://git.io/AaRB

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("stylus", function(config) {
    var indentUnit = config.indentUnit,
        indentUnitString = '',
        tagKeywords = keySet(tagKeywords_),
        tagVariablesRegexp = /^(a|b|i|s|col|em)$/i,
        propertyKeywords = keySet(propertyKeywords_),
        nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_),
        valueKeywords = keySet(valueKeywords_),
        colorKeywords = keySet(colorKeywords_),
        documentTypes = keySet(documentTypes_),
        documentTypesRegexp = wordRegexp(documentTypes_),
        mediaFeatures = keySet(mediaFeatures_),
        mediaTypes = keySet(mediaTypes_),
        fontProperties = keySet(fontProperties_),
        operatorsRegexp = /^\s*([.]{2,3}|&&|\|\||\*\*|[?!=:]?=|[-+*\/%<>]=?|\?:|\~)/,
        wordOperatorKeywordsRegexp = wordRegexp(wordOperatorKeywords_),
        blockKeywords = keySet(blockKeywords_),
        vendorPrefixesRegexp = new RegExp(/^\-(moz|ms|o|webkit)-/i),
        commonAtoms = keySet(commonAtoms_),
        firstWordMatch = "",
        states = {},
        ch,
        style,
        type,
        override;

    while (indentUnitString.length < indentUnit) indentUnitString += ' ';

    /**
     * Tokenizers
     */
    function tokenBase(stream, state) {
      firstWordMatch = stream.string.match(/(^[\w-]+\s*=\s*$)|(^\s*[\w-]+\s*=\s*[\w-])|(^\s*(\.|#|@|\$|\&|\[|\d|\+|::?|\{|\>|~|\/)?\s*[\w-]*([a-z0-9-]|\*|\/\*)(\(|,)?)/);
      state.context.line.firstWord = firstWordMatch ? firstWordMatch[0].replace(/^\s*/, "") : "";
      state.context.line.indent = stream.indentation();
      ch = stream.peek();

      // Line comment
      if (stream.match("//")) {
        stream.skipToEnd();
        return ["comment", "comment"];
      }
      // Block comment
      if (stream.match("/*")) {
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
      // String
      if (ch == "\"" || ch == "'") {
        stream.next();
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      }
      // Def
      if (ch == "@") {
        stream.next();
        stream.eatWhile(/[\w\\-]/);
        return ["def", stream.current()];
      }
      // ID selector or Hex color
      if (ch == "#") {
        stream.next();
        // Hex color
        if (stream.match(/^[0-9a-f]{3}([0-9a-f]([0-9a-f]{2}){0,2})?\b(?!-)/i)) {
          return ["atom", "atom"];
        }
        // ID selector
        if (stream.match(/^[a-z][\w-]*/i)) {
          return ["builtin", "hash"];
        }
      }
      // Vendor prefixes
      if (stream.match(vendorPrefixesRegexp)) {
        return ["meta", "vendor-prefixes"];
      }
      // Numbers
      if (stream.match(/^-?[0-9]?\.?[0-9]/)) {
        stream.eatWhile(/[a-z%]/i);
        return ["number", "unit"];
      }
      // !important|optional
      if (ch == "!") {
        stream.next();
        return [stream.match(/^(important|optional)/i) ? "keyword": "operator", "important"];
      }
      // Class
      if (ch == "." && stream.match(/^\.[a-z][\w-]*/i)) {
        return ["qualifier", "qualifier"];
      }
      // url url-prefix domain regexp
      if (stream.match(documentTypesRegexp)) {
        if (stream.peek() == "(") state.tokenize = tokenParenthesized;
        return ["property", "word"];
      }
      // Mixins / Functions
      if (stream.match(/^[a-z][\w-]*\(/i)) {
        stream.backUp(1);
        return ["keyword", "mixin"];
      }
      // Block mixins
      if (stream.match(/^(\+|-)[a-z][\w-]*\(/i)) {
        stream.backUp(1);
        return ["keyword", "block-mixin"];
      }
      // Parent Reference BEM naming
      if (stream.string.match(/^\s*&/) && stream.match(/^[-_]+[a-z][\w-]*/)) {
        return ["qualifier", "qualifier"];
      }
      // / Root Reference & Parent Reference
      if (stream.match(/^(\/|&)(-|_|:|\.|#|[a-z])/)) {
        stream.backUp(1);
        return ["variable-3", "reference"];
      }
      if (stream.match(/^&{1}\s*$/)) {
        return ["variable-3", "reference"];
      }
      // Word operator
      if (stream.match(wordOperatorKeywordsRegexp)) {
        return ["operator", "operator"];
      }
      // Word
      if (stream.match(/^\$?[-_]*[a-z0-9]+[\w-]*/i)) {
        // Variable
        if (stream.match(/^(\.|\[)[\w-\'\"\]]+/i, false)) {
          if (!wordIsTag(stream.current())) {
            stream.match('.');
            return ["variable-2", "variable-name"];
          }
        }
        return ["variable-2", "word"];
      }
      // Operators
      if (stream.match(operatorsRegexp)) {
        return ["operator", stream.current()];
      }
      // Delimiters
      if (/[:;,{}\[\]\(\)]/.test(ch)) {
        stream.next();
        return [null, ch];
      }
      // Non-detected items
      stream.next();
      return [null, null];
    }

    /**
     * Token comment
     */
    function tokenCComment(stream, state) {
      var maybeEnd = false, ch;
      while ((ch = stream.next()) != null) {
        if (maybeEnd && ch == "/") {
          state.tokenize = null;
          break;
        }
        maybeEnd = (ch == "*");
      }
      return ["comment", "comment"];
    }

    /**
     * Token string
     */
    function tokenString(quote) {
      return function(stream, state) {
        var escaped = false, ch;
        while ((ch = stream.next()) != null) {
          if (ch == quote && !escaped) {
            if (quote == ")") stream.backUp(1);
            break;
          }
          escaped = !escaped && ch == "\\";
        }
        if (ch == quote || !escaped && quote != ")") state.tokenize = null;
        return ["string", "string"];
      };
    }

    /**
     * Token parenthesized
     */
    function tokenParenthesized(stream, state) {
      stream.next(); // Must be "("
      if (!stream.match(/\s*[\"\')]/, false))
        state.tokenize = tokenString(")");
      else
        state.tokenize = null;
      return [null, "("];
    }

    /**
     * Context management
     */
    function Context(type, indent, prev, line) {
      this.type = type;
      this.indent = indent;
      this.prev = prev;
      this.line = line || {firstWord: "", indent: 0};
    }

    function pushContext(state, stream, type, indent) {
      indent = indent >= 0 ? indent : indentUnit;
      state.context = new Context(type, stream.indentation() + indent, state.context);
      return type;
    }

    function popContext(state, currentIndent) {
      var contextIndent = state.context.indent - indentUnit;
      currentIndent = currentIndent || false;
      state.context = state.context.prev;
      if (currentIndent) state.context.indent = contextIndent;
      return state.context.type;
    }

    function pass(type, stream, state) {
      return states[state.context.type](type, stream, state);
    }

    function popAndPass(type, stream, state, n) {
      for (var i = n || 1; i > 0; i--)
        state.context = state.context.prev;
      return pass(type, stream, state);
    }


    /**
     * Parser
     */
    function wordIsTag(word) {
      return word.toLowerCase() in tagKeywords;
    }

    function wordIsProperty(word) {
      word = word.toLowerCase();
      return word in propertyKeywords || word in fontProperties;
    }

    function wordIsBlock(word) {
      return word.toLowerCase() in blockKeywords;
    }

    function wordIsVendorPrefix(word) {
      return word.toLowerCase().match(vendorPrefixesRegexp);
    }

    function wordAsValue(word) {
      var wordLC = word.toLowerCase();
      var override = "variable-2";
      if (wordIsTag(word)) override = "tag";
      else if (wordIsBlock(word)) override = "block-keyword";
      else if (wordIsProperty(word)) override = "property";
      else if (wordLC in valueKeywords || wordLC in commonAtoms) override = "atom";
      else if (wordLC == "return" || wordLC in colorKeywords) override = "keyword";

      // Font family
      else if (word.match(/^[A-Z]/)) override = "string";
      return override;
    }

    function typeIsBlock(type, stream) {
      return ((endOfLine(stream) && (type == "{" || type == "]" || type == "hash" || type == "qualifier")) || type == "block-mixin");
    }

    function typeIsInterpolation(type, stream) {
      return type == "{" && stream.match(/^\s*\$?[\w-]+/i, false);
    }

    function typeIsPseudo(type, stream) {
      return type == ":" && stream.match(/^[a-z-]+/, false);
    }

    function startOfLine(stream) {
      return stream.sol() || stream.string.match(new RegExp("^\\s*" + escapeRegExp(stream.current())));
    }

    function endOfLine(stream) {
      return stream.eol() || stream.match(/^\s*$/, false);
    }

    function firstWordOfLine(line) {
      var re = /^\s*[-_]*[a-z0-9]+[\w-]*/i;
      var result = typeof line == "string" ? line.match(re) : line.string.match(re);
      return result ? result[0].replace(/^\s*/, "") : "";
    }


    /**
     * Block
     */
    states.block = function(type, stream, state) {
      if ((type == "comment" && startOfLine(stream)) ||
          (type == "," && endOfLine(stream)) ||
          type == "mixin") {
        return pushContext(state, stream, "block", 0);
      }
      if (typeIsInterpolation(type, stream)) {
        return pushContext(state, stream, "interpolation");
      }
      if (endOfLine(stream) && type == "]") {
        if (!/^\s*(\.|#|:|\[|\*|&)/.test(stream.string) && !wordIsTag(firstWordOfLine(stream))) {
          return pushContext(state, stream, "block", 0);
        }
      }
      if (typeIsBlock(type, stream)) {
        return pushContext(state, stream, "block");
      }
      if (type == "}" && endOfLine(stream)) {
        return pushContext(state, stream, "block", 0);
      }
      if (type == "variable-name") {
        if (stream.string.match(/^\s?\$[\w-\.\[\]\'\"]+$/) || wordIsBlock(firstWordOfLine(stream))) {
          return pushContext(state, stream, "variableName");
        }
        else {
          return pushContext(state, stream, "variableName", 0);
        }
      }
      if (type == "=") {
        if (!endOfLine(stream) && !wordIsBlock(firstWordOfLine(stream))) {
          return pushContext(state, stream, "block", 0);
        }
        return pushContext(state, stream, "block");
      }
      if (type == "*") {
        if (endOfLine(stream) || stream.match(/\s*(,|\.|#|\[|:|{)/,false)) {
          override = "tag";
          return pushContext(state, stream, "block");
        }
      }
      if (typeIsPseudo(type, stream)) {
        return pushContext(state, stream, "pseudo");
      }
      if (/@(font-face|media|supports|(-moz-)?document)/.test(type)) {
        return pushContext(state, stream, endOfLine(stream) ? "block" : "atBlock");
      }
      if (/@(-(moz|ms|o|webkit)-)?keyframes$/.test(type)) {
        return pushContext(state, stream, "keyframes");
      }
      if (/@extends?/.test(type)) {
        return pushContext(state, stream, "extend", 0);
      }
      if (type && type.charAt(0) == "@") {

        // Property Lookup
        if (stream.indentation() > 0 && wordIsProperty(stream.current().slice(1))) {
          override = "variable-2";
          return "block";
        }
        if (/(@import|@require|@charset)/.test(type)) {
          return pushContext(state, stream, "block", 0);
        }
        return pushContext(state, stream, "block");
      }
      if (type == "reference" && endOfLine(stream)) {
        return pushContext(state, stream, "block");
      }
      if (type == "(") {
        return pushContext(state, stream, "parens");
      }

      if (type == "vendor-prefixes") {
        return pushContext(state, stream, "vendorPrefixes");
      }
      if (type == "word") {
        var word = stream.current();
        override = wordAsValue(word);

        if (override == "property") {
          if (startOfLine(stream)) {
            return pushContext(state, stream, "block", 0);
          } else {
            override = "atom";
            return "block";
          }
        }

        if (override == "tag") {

          // tag is a css value
          if (/embed|menu|pre|progress|sub|table/.test(word)) {
            if (wordIsProperty(firstWordOfLine(stream))) {
              override = "atom";
              return "block";
            }
          }

          // tag is an attribute
          if (stream.string.match(new RegExp("\\[\\s*" + word + "|" + word +"\\s*\\]"))) {
            override = "atom";
            return "block";
          }

          // tag is a variable
          if (tagVariablesRegexp.test(word)) {
            if ((startOfLine(stream) && stream.string.match(/=/)) ||
                (!startOfLine(stream) &&
                 !stream.string.match(/^(\s*\.|#|\&|\[|\/|>|\*)/) &&
                 !wordIsTag(firstWordOfLine(stream)))) {
              override = "variable-2";
              if (wordIsBlock(firstWordOfLine(stream)))  return "block";
              return pushContext(state, stream, "block", 0);
            }
          }

          if (endOfLine(stream)) return pushContext(state, stream, "block");
        }
        if (override == "block-keyword") {
          override = "keyword";

          // Postfix conditionals
          if (stream.current(/(if|unless)/) && !startOfLine(stream)) {
            return "block";
          }
          return pushContext(state, stream, "block");
        }
        if (word == "return") return pushContext(state, stream, "block", 0);

        // Placeholder selector
        if (override == "variable-2" && stream.string.match(/^\s?\$[\w-\.\[\]\'\"]+$/)) {
          return pushContext(state, stream, "block");
        }
      }
      return state.context.type;
    };


    /**
     * Parens
     */
    states.parens = function(type, stream, state) {
      if (type == "(") return pushContext(state, stream, "parens");
      if (type == ")") {
        if (state.context.prev.type == "parens") {
          return popContext(state);
        }
        if ((stream.string.match(/^[a-z][\w-]*\(/i) && endOfLine(stream)) ||
            wordIsBlock(firstWordOfLine(stream)) ||
            /(\.|#|:|\[|\*|&|>|~|\+|\/)/.test(firstWordOfLine(stream)) ||
            (!stream.string.match(/^-?[a-z][\w-\.\[\]\'\"]*\s*=/) &&
             wordIsTag(firstWordOfLine(stream)))) {
          return pushContext(state, stream, "block");
        }
        if (stream.string.match(/^[\$-]?[a-z][\w-\.\[\]\'\"]*\s*=/) ||
            stream.string.match(/^\s*(\(|\)|[0-9])/) ||
            stream.string.match(/^\s+[a-z][\w-]*\(/i) ||
            stream.string.match(/^\s+[\$-]?[a-z]/i)) {
          return pushContext(state, stream, "block", 0);
        }
        if (endOfLine(stream)) return pushContext(state, stream, "block");
        else return pushContext(state, stream, "block", 0);
      }
      if (type && type.charAt(0) == "@" && wordIsProperty(stream.current().slice(1))) {
        override = "variable-2";
      }
      if (type == "word") {
        var word = stream.current();
        override = wordAsValue(word);
        if (override == "tag" && tagVariablesRegexp.test(word)) {
          override = "variable-2";
        }
        if (override == "property" || word == "to") override = "atom";
      }
      if (type == "variable-name") {
        return pushContext(state, stream, "variableName");
      }
      if (typeIsPseudo(type, stream)) {
        return pushContext(state, stream, "pseudo");
      }
      return state.context.type;
    };


    /**
     * Vendor prefixes
     */
    states.vendorPrefixes = function(type, stream, state) {
      if (type == "word") {
        override = "property";
        return pushContext(state, stream, "block", 0);
      }
      return popContext(state);
    };


    /**
     * Pseudo
     */
    states.pseudo = function(type, stream, state) {
      if (!wordIsProperty(firstWordOfLine(stream
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	var _includes = function (search, start) {
		if (start === undefined) {
			start = 0;
		}
	
		return this.indexOf(search, start) !== -1;	
	};
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	if (! Array.prototype.includes) {
		Array.prototype.includes = _includes;
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	if (! String.prototype.includes) {
		String.prototype.includes = _includes;
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		},
	
		/**
		 * Create a function that will write to a nested object or array
		 * @param {*} source JSON notation string
		 * @returns Write function
		 */
		set: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				/* Unlike get, only the underscore (global) option is used for for
				 * setting data since we don't know the type here. This is why an object
				 * option is not documented for `mData` (which is read/write), but it is
				 * for `mRender` which is read only.
				 */
				return DataTable.util.set( source._ );
			}
			else if ( source === null ) {
				// Nothing to do when the data source is null
				return function () {};
			}
			else if ( typeof source === 'function' ) {
				return function (data, val, meta) {
					source( data, 'set', val, meta );
				};
			}
			else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
					  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
			{
				// Like the get, we need to get data from a nested object
				var setData = function (data, val, src) {
					var a = _fnSplitObjNotation( src ), b;
					var aLast = a[a.length-1];
					var arrayNotation, funcNotation, o, innerSrc;
		
					for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ ) {
						// Protect against prototype pollution
						if (a[i] === '__proto__' || a[i] === 'constructor') {
							throw new Error('Cannot set prototype values');
						}
		
						// Check if we are dealing with an array notation request
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
		
						if ( arrayNotation ) {
							a[i] = a[i].replace(__reArray, '');
							data[ a[i] ] = [];
		
							// Get the remainder of the nested object to set so we can recurse
							b = a.slice();
							b.splice( 0, i+1 );
							innerSrc = b.join('.');
		
							// Traverse each entry in the array setting the properties requested
							if ( Array.isArray( val ) ) {
								for ( var j=0, jLen=val.length ; j<jLen ; j++ ) {
									o = {};
									setData( o, val[j], innerSrc );
									data[ a[i] ].push( o );
								}
							}
							else {
								// We've been asked to save data to an array, but it
								// isn't array data to be saved. Best that can be done
								// is to just save the value.
								data[ a[i] ] = val;
							}
		
							// The inner call to setData has already traversed through the remainder
							// of the source and has set the data, thus we can exit here
							return;
						}
						else if ( funcNotation ) {
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]( val );
						}
		
						// If the nested object doesn't currently exist - since we are
						// trying to set the value - create it
						if ( data[ a[i] ] === null || data[ a[i] ] === undefined ) {
							data[ a[i] ] = {};
						}
						data = data[ a[i] ];
					}
		
					// Last item in the input - i.e, the actual set
					if ( aLast.match(__reFn ) ) {
						// Function call
						data = data[ aLast.replace(__reFn, '') ]( val );
					}
					else {
						// If array notation is used, we just want to strip it and use the property name
						// and assign the value. If it isn't used, then we get the result we want anyway
						data[ aLast.replace(__reArray, '') ] = val;
					}
				};
		
				return function (data, val) { // meta is also passed in, but not used
					return setData( data, val, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data, val) { // meta is also passed in, but not used
					data[source] = val;
				};
			}
		},
	
		/**
		 * Create a function that will read nested objects from arrays, based on JSON notation
		 * @param {*} source JSON notation string
		 * @returns Value read
		 */
		get: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				// Build an object of get functions, and wrap them in a single call
				var o = {};
				$.each( source, function (key, val) {
					if ( val ) {
						o[key] = DataTable.util.get( val );
					}
				} );
		
				return function (data, type, row, meta) {
					var t = o[type] || o._;
					return t !== undefined ?
						t(data, type, row, meta) :
						data;
				};
			}
			else if ( source === null ) {
				// Give an empty string for rendering / sorting etc
				return function (data) { // type, row and meta also passed, but not used
					return data;
				};
			}
			else if ( typeof source === 'function' ) {
				return function (data, type, row, meta) {
					return source( data, type, row, meta );
				};
			}
			else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
					  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
			{
				/* If there is a . in the source string then the data source is in a
				 * nested object so we loop over the data for each level to get the next
				 * level down. On each loop we test for undefined, and if found immediately
				 * return. This allows entire objects to be missing and sDefaultContent to
				 * be used if defined, rather than throwing an error
				 */
				var fetchData = function (data, type, src) {
					var arrayNotation, funcNotation, out, innerSrc;
		
					if ( src !== "" ) {
						var a = _fnSplitObjNotation( src );
		
						for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {
							// Check if we are dealing with special notation
							arrayNotation = a[i].match(__reArray);
							funcNotation = a[i].match(__reFn);
		
							if ( arrayNotation ) {
								// Array notation
								a[i] = a[i].replace(__reArray, '');
		
								// Condition allows simply [] to be passed in
								if ( a[i] !== "" ) {
									data = data[ a[i] ];
								}
								out = [];
		
								// Get the remainder of the nested object to get
								a.splice( 0, i+1 );
								innerSrc = a.join('.');
		
								// Traverse each entry in the array getting the properties requested
								if ( Array.isArray( data ) ) {
									for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
										out.push( fetchData( data[j], type, innerSrc ) );
									}
								}
		
								// If a string is given in between the array notation indicators, that
								// is used to join the strings together, otherwise an array is returned
								var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
								data = (join==="") ? out : out.join(join);
		
								// The inner call to fetchData has already traversed through the remainder
								// of the source requested, so we exit from the loop
								break;
							}
							else if ( funcNotation ) {
								// Function call
								a[i] = a[i].replace(__reFn, '');
								data = data[ a[i] ]();
								continue;
							}
		
							if ( data === null || data[ a[i] ] === undefined ) {
								return undefined;
							}
	
							data = data[ a[i] ];
						}
					}
		
					return data;
				};
		
				return function (data, type) { // row and meta also passed, but not used
					return fetchData( data, type, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data, type) { // row and meta also passed, but not used
					return data[source];
				};
			}
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX 