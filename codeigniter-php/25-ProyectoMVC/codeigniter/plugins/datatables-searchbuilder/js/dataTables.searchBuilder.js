/*! SearchBuilder 1.3.1
 * ©SpryMedia Ltd - datatables.net/license/mit
 */
(function () {
    'use strict';

    var $$2;
    var dataTable$2;
    // eslint-disable-next-line no-extra-parens
    var moment = window.moment;
    // eslint-disable-next-line no-extra-parens
    var luxon = window.luxon;
    /**
     * Sets the value of jQuery for use in the file
     *
     * @param jq the instance of jQuery to be set
     */
    function setJQuery$2(jq) {
        $$2 = jq;
        dataTable$2 = jq.fn.dataTable;
    }
    /**
     * The Criteria class is used within SearchBuilder to represent a search criteria
     */
    var Criteria = /** @class */ (function () {
        function Criteria(table, opts, topGroup, index, depth) {
            var _this = this;
            if (index === void 0) { index = 0; }
            if (depth === void 0) { depth = 1; }
            // Check that the required version of DataTables is included
            if (!dataTable$2 || !dataTable$2.versionCheck || !dataTable$2.versionCheck('1.10.0')) {
                throw new Error('SearchPane requires DataTables 1.10 or newer');
            }
            this.classes = $$2.extend(true, {}, Criteria.classes);
            // Get options from user and any extra conditions/column types defined by plug-ins
            this.c = $$2.extend(true, {}, Criteria.defaults, $$2.fn.dataTable.ext.searchBuilder, opts);
            var i18n = this.c.i18n;
            this.s = {
                condition: undefined,
                conditions: {},
                data: undefined,
                dataIdx: -1,
                dataPoints: [],
                dateFormat: false,
                depth: depth,
                dt: table,
                filled: false,
                index: index,
                origData: undefined,
                topGroup: topGroup,
                type: '',
                value: []
            };
            this.dom = {
                buttons: $$2('<div/>')
                    .addClass(this.classes.buttonContainer),
                condition: $$2('<select disabled/>')
                    .addClass(this.classes.condition)
                    .addClass(this.classes.dropDown)
                    .addClass(this.classes.italic)
                    .attr('autocomplete', 'hacking'),
                conditionTitle: $$2('<option value="" disabled selected hidden/>')
                    .html(this.s.dt.i18n('searchBuilder.condition', i18n.condition)),
                container: $$2('<div/>')
                    .addClass(this.classes.container),
                data: $$2('<select/>')
                    .addClass(this.classes.data)
                    .addClass(this.classes.dropDown)
                    .addClass(this.classes.italic),
                dataTitle: $$2('<option value="" disabled selected hidden/>')
                    .html(this.s.dt.i18n('searchBuilder.data', i18n.data)),
                defaultValue: $$2('<select disabled/>')
                    .addClass(this.classes.value)
                    .addClass(this.classes.dropDown)
                    .addClass(this.classes.select)
                    .addClass(this.classes.italic),
                "delete": $$2('<button/>')
                    .html(this.s.dt.i18n('searchBuilder.delete', i18n["delete"]))
                    .addClass(this.classes["delete"])
                    .addClass(this.classes.button)
                    .attr('title', this.s.dt.i18n('searchBuilder.deleteTitle', i18n.deleteTitle))
                    .attr('type', 'button'),
                // eslint-disable-next-line no-useless-escape
                left: $$2('<button/>')
                    .html(this.s.dt.i18n('searchBuilder.left', i18n.left))
                    .addClass(this.classes.left)
                    .addClass(this.classes.button)
                    .attr('title', this.s.dt.i18n('searchBuilder.leftTitle', i18n.leftTitle))
                    .attr('type', 'button'),
                // eslint-disable-next-line no-useless-escape
                right: $$2('<button/>')
                    .html(this.s.dt.i18n('searchBuilder.right', i18n.right))
                    .addClass(this.classes.right)
                    .addClass(this.classes.button)
                    .attr('title', this.s.dt.i18n('searchBuilder.rightTitle', i18n.rightTitle))
                    .attr('type', 'button'),
                value: [
                    $$2('<select disabled/>')
                        .addClass(this.classes.value)
                        .addClass(this.classes.dropDown)
                        .addClass(this.classes.italic)
                        .addClass(this.classes.select)
                ],
                valueTitle: $$2('<option value="--valueTitle--" disabled selected hidden/>')
                    .html(this.s.dt.i18n('searchBuilder.value', i18n.value))
            };
            // If the greyscale option is selected then add the class to add the grey colour to SearchBuilder
            if (this.c.greyscale) {
                this.dom.data.addClass(this.classes.greyscale);
                this.dom.condition.addClass(this.classes.greyscale);
                this.dom.defaultValue.addClass(this.classes.greyscale);
                for (var _i = 0, _a = this.dom.value; _i < _a.length; _i++) {
                    var val = _a[_i];
                    val.addClass(this.classes.greyscale);
                }
            }
            // For responsive design, adjust the criterias properties on the following events
            this.s.dt.on('draw.dtsb', function () {
                _this._adjustCriteria();
            });
            this.s.dt.on('buttons-action.dtsb', function () {
                _this._adjustCriteria();
            });
            $$2(window).on('resize.dtsb', dataTable$2.util.throttle(function () {
                _this._adjustCriteria();
            }));
            this._buildCriteria();
            return this;
        }
        /**
         * Escape html characters within a string
         *
         * @param txt the string to be escaped
         * @returns the escaped string
         */
        Criteria._escapeHTML = function (txt) {
            return txt
                .toString()
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"');
        };
        /**
         * Adds the left button to the criteria
         */
        Criteria.prototype.updateArrows = function (hasSiblings, redraw) {
            if (hasSiblings === void 0) { hasSiblings = false; }
            if (redraw === void 0) { redraw = true; }
            // Empty the container and append all of the elements in the correct order
            this.dom.container.children().detach();
            this.dom.container
                .append(this.dom.data)
                .append(this.dom.condition)
                .append(this.dom.value[0]);
            this.setListeners();
            // Trigger the inserted events for the value elements as they are inserted
            if (this.dom.value[0] !== undefined) {
                this.dom.value[0].trigger('dtsb-inserted');
            }
            for (var i = 1; i < this.dom.value.length; i++) {
                this.dom.container.append(this.dom.value[i]);
                this.dom.value[i].trigger('dtsb-inserted');
            }
            // If this is a top level criteria then don't let it move left
            if (this.s.depth > 1) {
                this.dom.buttons.append(this.dom.left);
            }
            // If the depthLimit of the query has been hit then don't add the right button
            if ((this.c.depthLimit === false || this.s.depth < this.c.depthLimit) && hasSiblings) {
                this.dom.buttons.append(this.dom.right);
            }
            else {
                this.dom.right.remove();
            }
            this.dom.buttons.append(this.dom["delete"]);
            this.dom.container.append(this.dom.buttons);
            if (redraw) {
                // A different combination of arrows and selectors may lead to a need for responsive to be triggered
                this._adjustCriteria();
            }
        };
        /**
         * Destroys the criteria, removing listeners and container from the dom
         */
        Criteria.prototype.destroy = function () {
            // Turn off listeners
            this.dom.data.off('.dtsb');
            this.dom.condition.off('.dtsb');
            this.dom["delete"].off('.dtsb');
            for (var _i = 0, _a = this.dom.value; _i < _a.length; _i++) {
                var val = _a[_i];
                val.off('.dtsb');
            }
            // Remove container from the dom
            this.dom.container.remove();
        };
        /**
         * Passes in the data for the row and compares it against this single criteria
         *
         * @param rowData The data for the row to be compared
         * @returns boolean Whether the criteria has passed
         */
        Criteria.prototype.search = function (rowData, rowIdx) {
            var condition = this.s.conditions[this.s.condition];
            if (this.s.condition !== undefined && condition !== undefined) {
                var filter = rowData[this.s.dataIdx];
                // This check is in place for if a custom decimal character is in place
                if (this.s.type.includes('num') &&
                    (this.s.dt.settings()[0].oLanguage.sDecimal !== '' ||
                        this.s.dt.settings()[0].oLanguage.sThousands !== '')) {
                    var splitRD = [rowData[this.s.dataIdx]];
                    if (this.s.dt.settings()[0].oLanguage.sDecimal !== '') {
                        splitRD = rowData[this.s.dataIdx].split(this.s.dt.settings()[0].oLanguage.sDecimal);
                    }
                    if (this.s.dt.settings()[0].oLanguage.sThousands !== '') {
                        for (var i = 0; i < splitRD.length; i++) {
                            splitRD[i] = splitRD[i].replace(this.s.dt.settings()[0].oLanguage.sThousands, ',');
                        }
                    }
                    filter = splitRD.join('.');
                }
                // If orthogonal data is in place we need to get it's values for searching
                if (this.c.orthogonal.search !== 'filter') {
                    var settings = this.s.dt.settings()[0];
                    filter = settings.oApi._fnGetCellData(settings, rowIdx, this.s.dataIdx, typeof this.c.orthogonal === 'string' ?
                        this.c.orthogonal :
                        this.c.orthogonal.search);
                }
                if (this.s.type === 'array') {
                    // Make sure we are working with an array
                    if (!Array.isArray(filter)) {
                        filter = [filter];
                    }
                    filter.sort();
                    for (var _i = 0, filter_1 = filter; _i < filter_1.length; _i++) {
                        var filt = filter_1[_i];
                        if (filt && typeof filt === 'string') {
                            filt = filt.replace(/[\r\n\u2028]/g, ' ');
                        }
                    }
                }
                else if (filter !== null && typeof filter === 'string') {
                    filter = filter.replace(/[\r\n\u2028]/g, ' ');
                }
                if (this.s.type.includes('html') && typeof filter === 'string') {
                    filter = filter.replace(/(<([^>]+)>)/ig, '');
                }
                // Not ideal, but jqueries .val() returns an empty string even
                // when the value set is null, so we shall assume the two are equal
                if (filter === null) {
                    filter = '';
                }
                return condition.search(filter, this.s.value, this);
            }
        };
        /**
         * Gets the details required to rebuild the criteria
         */
        Criteria.prototype.getDetails = function (deFormatDates) {
            if (deFormatDates === void 0) { deFormatDates = false; }
            // This check is in place for if a custom decimal character is in place
            if (this.s.type !== null &&
                this.s.type.includes('num') &&
                (this.s.dt.settings()[0].oLanguage.sDecimal !== '' || this.s.dt.settings()[0].oLanguage.sThousands !== '')) {
                for (var i = 0; i < this.s.value.length; i++) {
                    var splitRD = [this.s.value[i].toString()];
                    if (this.s.dt.settings()[0].oLanguage.sDecimal !== '') {
                        splitRD = this.s.value[i].split(this.s.dt.settings()[0].oLanguage.sDecimal);
                    }
                    if (this.s.dt.settings()[0].oLanguage.sThousands !== '') {
                        for (var j = 0; j < splitRD.length; j++) {
                            splitRD[j] = splitRD[j].replace(this.s.dt.settings()[0].oLanguage.sThousands, ',');
                        }
                    }
                    this.s.value[i] = splitRD.join('.');
                }
            }
            else if (this.s.type !== null && deFormatDates) {
                if (this.s.type.includes('date') ||
                    this.s.type.includes('time')) {
                    for (var i = 0; i < this.s.value.length; i++) {
                        if (this.s.value[i].match(/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/g) === null) {
                            this.s.value[i] = '';
                        }
                    }
                }
                else if (this.s.type.includes('moment')) {
                    for (var i = 0; i < this.s.value.length; i++) {
                        this.s.value[i] = moment(this.s.value[i], this.s.dateFormat).toISOString();
                    }
                }
                else if (this.s.type.includes('luxon')) {
                    for (var i = 0; i < this.s.value.length; i++) {
                        this.s.value[i] = luxon.DateTime.fromFormat(this.s.value[i], this.s.dateFormat).toISO();
                    }
                }
            }
            if (this.s.type.includes('num') && this.s.dt.page.info().serverSide) {
                for (var i = 0; i < this.s.value.length; i++) {
                    this.s.value[i] = this.s.value[i].replace(/[^0-9.]/g, '');
                }
            }
            return {
                condition: this.s.condition,
                data: this.s.data,
                origData: this.s.origData,
                type: this.s.type,
                value: this.s.value.map(function (a) { return a.toString(); })
            };
        };
        /**
         * Getter for the node for the container of the criteria
         *
         * @returns JQuery<HTMLElement> the node for the container
         */
        Criteria.prototype.getNode = function () {
            return this.dom.container;
        };
        /**
         * Populates the criteria data, condition and value(s) as far as has been selected
         */
        Criteria.prototype.populate = function () {
            this._populateData();
            // If the column index has been found attempt to select a condition
            if (this.s.dataIdx !== -1) {
                this._populateCondition();
                // If the condittion has been found attempt to select the values
                if (this.s.condition !== undefined) {
                    this._populateValue();
                }
            }
        };
        /**
         * Rebuilds the criteria based upon the details passed in
         *
         * @param loadedCriteria the details required to rebuild the criteria
         */
        Criteria.prototype.rebuild = function (loadedCriteria) {
            // Check to see if the previously selected data exists, if so select it
            var foundData = false;
            var dataIdx;
            this._populateData();
            // If a data selection has previously been made attempt to find and select it
            if (loadedCriteria.data !== undefined) {
                var italic_1 = this.classes.italic;
                var data_1 = this.dom.data;
                this.dom.data.children('option').each(function () {
          4:function(e,t,n){"use strict";var r=n(7854),i=n(260),o=n(7293),a=r.Int8Array,u=i.aTypedArray,s=i.exportTypedArrayMethod,l=[].toLocaleString,c=[].slice,f=!!a&&o((function(){l.call(new a(1))}));s("toLocaleString",(function(){return l.apply(f?c.call(u(this)):u(this),arguments)}),o((function(){return[1,2].toLocaleString()!=new a([1,2]).toLocaleString()}))||!o((function(){a.prototype.toLocaleString.call([1,2])})))},5016:function(e,t,n){"use strict";var r=n(260).exportTypedArrayMethod,i=n(7293),o=n(7854).Uint8Array,a=o&&o.prototype||{},u=[].toString,s=[].join;i((function(){u.call({})}))&&(u=function(){return s.call(this)});var l=a.toString!=u;r("toString",u,l)},2472:function(e,t,n){n(9843)("Uint8",(function(e){return function(t,n,r){return e(this,t,n,r)}}))},4747:function(e,t,n){var r=n(7854),i=n(8324),o=n(8533),a=n(8880);for(var u in i){var s=r[u],l=s&&s.prototype;if(l&&l.forEach!==o)try{a(l,"forEach",o)}catch(e){l.forEach=o}}},3948:function(e,t,n){var r=n(7854),i=n(8324),o=n(6992),a=n(8880),u=n(5112),s=u("iterator"),l=u("toStringTag"),c=o.values;for(var f in i){var p=r[f],h=p&&p.prototype;if(h){if(h[s]!==c)try{a(h,s,c)}catch(e){h[s]=c}if(h[l]||a(h,l,f),i[f])for(var d in o)if(h[d]!==o[d])try{a(h,d,o[d])}catch(e){h[d]=o[d]}}}},1637:function(e,t,n){"use strict";n(6992);var r=n(2109),i=n(5005),o=n(590),a=n(1320),u=n(2248),s=n(8003),l=n(4994),c=n(9909),f=n(5787),p=n(6656),h=n(9974),d=n(648),v=n(9670),y=n(111),g=n(30),m=n(9114),b=n(8554),x=n(1246),w=n(5112),E=i("fetch"),k=i("Headers"),A=w("iterator"),S="URLSearchParams",F="URLSearchParamsIterator",T=c.set,C=c.getterFor(S),L=c.getterFor(F),R=/\+/g,I=Array(4),U=function(e){return I[e-1]||(I[e-1]=RegExp("((?:%[\\da-f]{2}){"+e+"})","gi"))},O=function(e){try{return decodeURIComponent(e)}catch(t){return e}},_=function(e){var t=e.replace(R," "),n=4;try{return decodeURIComponent(t)}catch(e){for(;n;)t=t.replace(U(n--),O);return t}},M=/[!'()~]|%20/g,z={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},P=function(e){return z[e]},j=function(e){return encodeURIComponent(e).replace(M,P)},D=function(e,t){if(t)for(var n,r,i=t.split("&"),o=0;o<i.length;)(n=i[o++]).length&&(r=n.split("="),e.push({key:_(r.shift()),value:_(r.join("="))}))},N=function(e){this.entries.length=0,D(this.entries,e)},B=function(e,t){if(e<t)throw TypeError("Not enough arguments")},q=l((function(e,t){T(this,{type:F,iterator:b(C(e).entries),kind:t})}),"Iterator",(function(){var e=L(this),t=e.kind,n=e.iterator.next(),r=n.value;return n.done||(n.value="keys"===t?r.key:"values"===t?r.value:[r.key,r.value]),n})),W=function(){f(this,W,S);var e,t,n,r,i,o,a,u,s,l=arguments.length>0?arguments[0]:void 0,c=this,h=[];if(T(c,{type:S,entries:h,updateURL:function(){},updateSearchParams:N}),void 0!==l)if(y(l))if("function"==typeof(e=x(l)))for(n=(t=e.call(l)).next;!(r=n.call(t)).done;){if((a=(o=(i=b(v(r.value))).next).call(i)).done||(u=o.call(i)).done||!o.call(i).done)throw TypeError("Expected sequence with length 2");h.push({key:a.value+"",value:u.value+""})}else for(s in l)p(l,s)&&h.push({key:s,value:l[s]+""});else D(h,"string"==typeof l?"?"===l.charAt(0)?l.slice(1):l:l+"")},H=W.prototype;u(H,{append:function(e,t){B(arguments.length,2);var n=C(this);n.entries.push({key:e+"",value:t+""}),n.updateURL()},delete:function(e){B(arguments.length,1);for(var t=C(this),n=t.entries,r=e+"",i=0;i<n.length;)n[i].key===r?n.splice(i,1):i++;t.updateURL()},get:function(e){B(arguments.length,1);for(var t=C(this).entries,n=e+"",r=0;r<t.length;r++)if(t[r].key===n)return t[r].value;return null},getAll:function(e){B(arguments.length,1);for(var t=C(this).entries,n=e+"",r=[],i=0;i<t.length;i++)t[i].key===n&&r.push(t[i].value);return r},has:function(e){B(arguments.length,1);for(var t=C(this).entries,n=e+"",r=0;r<t.length;)if(t[r++].key===n)return!0;return!1},set:function(e,t){B(arguments.length,1);for(var n,r=C(this),i=r.entries,o=!1,a=e+"",u=t+"",s=0;s<i.length;s++)(n=i[s]).key===a&&(o?i.splice(s--,1):(o=!0,n.value=u));o||i.push({key:a,value:u}),r.updateURL()},sort:function(){var e,t,n,r=C(this),i=r.entries,o=i.slice();for(i.length=0,n=0;n<o.length;n++){for(e=o[n],t=0;t<n;t++)if(i[t].key>e.key){i.splice(t,0,e);break}t===n&&i.push(e)}r.updateURL()},forEach:function(e){for(var t,n=C(this).entries,r=h(e,arguments.length>1?arguments[1]:void 0,3),i=0;i<n.length;)r((t=n[i++]).value,t.key,this)},keys:function(){return new q(this,"keys")},values:function(){return new q(this,"values")},entries:function(){return new q(this,"entries")}},{enumerable:!0}),a(H,A,H.entries),a(H,"toString",(function(){for(var e,t=C(this).entries,n=[],r=0;r<t.length;)e=t[r++],n.push(j(e.key)+"="+j(e.value));return n.join("&")}),{enumerable:!0}),s(W,S),r({global:!0,forced:!o},{URLSearchParams:W}),o||"function"!=typeof E||"function"!=typeof k||r({global:!0,enumerable:!0,forced:!0},{fetch:function(e){var t,n,r,i=[e];return arguments.length>1&&(y(t=arguments[1])&&(n=t.body,d(n)===S&&((r=t.headers?new k(t.headers):new k).has("content-type")||r.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"),t=g(t,{body:m(0,String(n)),headers:m(0,r)}))),i.push(t)),E.apply(this,i)}}),e.exports={URLSearchParams:W,getState:C}},285:function(e,t,n){"use strict";n(8783);var r,i=n(2109),o=n(9781),a=n(590),u=n(7854),s=n(6048),l=n(1320),c=n(5787),f=n(6656),p=n(1574),h=n(8457),d=n(8710).codeAt,v=n(3197),y=n(8003),g=n(1637),m=n(9909),b=u.URL,x=g.URLSearchParams,w=g.getState,E=m.set,k=m.getterFor("URL"),A=Math.floor,S=Math.pow,F="Invalid scheme",T="Invalid host",C="Invalid port",L=/[A-Za-z]/,R=/[\d+-.A-Za-z]/,I=/\d/,U=/^(0x|0X)/,O=/^[0-7]+$/,_=/^\d+$/,M=/^[\dA-Fa-f]+$/,z=/[\u0000\t\u000A\u000D #%/:?@[\\]]/,P=/[\u0000\t\u000A\u000D #/:?@[\\]]/,j=/^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,D=/[\t\u000A\u000D]/g,N=function(e,t){var n,r,i;if("["==t.charAt(0)){if("]"!=t.charAt(t.length-1))return T;if(!(n=q(t.slice(1,-1))))return T;e.host=n}else if(X(e)){if(t=v(t),z.test(t))return T;if(null===(n=B(t)))return T;e.host=n}else{if(P.test(t))return T;for(n="",r=h(t),i=0;i<r.length;i++)n+=$(r[i],H);e.host=n}},B=function(e){var t,n,r,i,o,a,u,s=e.split(".");if(s.length&&""==s[s.length-1]&&s.pop(),(t=s.length)>4)return e;for(n=[],r=0;r<t;r++){if(""==(i=s[r]))return e;if(o=10,i.length>1&&"0"==i.charAt(0)&&(o=U.test(i)?16:8,i=i.slice(8==o?1:2)),""===i)a=0;else{if(!(10==o?_:8==o?O:M).test(i))return e;a=parseInt(i,o)}n.push(a)}for(r=0;r<t;r++)if(a=n[r],r==t-1){if(a>=S(256,5-t))return null}else if(a>255)return null;for(u=n.pop(),r=0;r<n.length;r++)u+=n[r]*S(256,3-r);return u},q=function(e){var t,n,r,i,o,a,u,s=[0,0,0,0,0,0,0,0],l=0,c=null,f=0,p=function(){return e.charAt(f)};if(":"==p()){if(":"!=e.charAt(1))return;f+=2,c=++l}for(;p();){if(8==l)return;if(":"!=p()){for(t=n=0;n<4&&M.test(p());)t=16*t+parseInt(p(),16),f++,n++;if("."==p()){if(0==n)return;if(f-=n,l>6)return;for(r=0;p();){if(i=null,r>0){if(!("."==p()&&r<4))return;f++}if(!I.test(p()))return;for(;I.test(p());){if(o=parseInt(p(),10),null===i)i=o;else{if(0==i)return;i=10*i+o}if(i>255)return;f++}s[l]=256*s[l]+i,2!=++r&&4!=r||l++}if(4!=r)return;break}if(":"==p()){if(f++,!p())return}else if(p())return;s[l++]=t}else{if(null!==c)return;f++,c=++l}}if(null!==c)for(a=l-c,l=7;0!=l&&a>0;)u=s[l],s[l--]=s[c+a-1],s[c+--a]=u;else if(8!=l)return;return s},W=function(e){var t,n,r,i;if("number"==typeof e){for(t=[],n=0;n<4;n++)t.unshift(e%256),e=A(e/256);return t.join(".")}if("object"==typeof e){for(t="",r=function(e){for(var t=null,n=1,r=null,i=0,o=0;o<8;o++)0!==e[o]?(i>n&&(t=r,n=i),r=null,i=0):(null===r&&(r=o),++i);return i>n&&(t=r,n=i),t}(e),n=0;n<8;n++)i&&0===e[n]||(i&&(i=!1),r===n?(t+=n?":":"::",i=!0):(t+=e[n].toString(16),n<7&&(t+=":")));return"["+t+"]"}return e},H={},Y=p({},H,{" ":1,'"':1,"<":1,">":1,"`":1}),G=p({},Y,{"#":1,"?":1,"{":1,"}":1}),Q=p({},G,{"/":1,":":1,";":1,"=":1,"@":1,"[":1,"\\":1,"]":1,"^":1,"|":1}),$=function(e,t){var n=d(e,0);return n>32&&n<127&&!f(t,e)?e:encodeURIComponent(e)},V={ftp:21,file:null,http:80,https:443,ws:80,wss:443},X=function(e){return f(V,e.scheme)},K=function(e){return""!=e.username||""!=e.password},Z=function(e){return!e.host||e.cannotBeABaseURL||"file"==e.scheme},J=function(e,t){var n;return 2==e.length&&L.test(e.charAt(0))&&(":"==(n=e.charAt(1))||!t&&"|"==n)},ee=function(e){var t;return e.length>1&&J(e.slice(0,2))&&(2==e.length||"/"===(t=e.charAt(2))||"\\"===t||"?"===t||"#"===t)},te=function(e){var t=e.path,n=t.length;!n||"file"==e.scheme&&1==n&&J(t[0],!0)||t.pop()},ne=function(e){return"."===e||"%2e"===e.toLowerCase()},re={},ie={},oe={},ae={},ue={},se={},le={},ce={},fe={},pe={},he={},de={},ve={},ye={},ge={},me={},be={},xe={},we={},Ee={},ke={},Ae=function(e,t,n,i){var o,a,u,s,l,c=n||re,p=0,d="",v=!1,y=!1,g=!1;for(n||(e.scheme="",e.username="",e.password="",e.host=null,e.port=null,e.path=[],e.query=null,e.fragment=null,e.cannotBeABaseURL=!1,t=t.replace(j,"")),t=t.replace(D,""),o=h(t);p<=o.length;){switch(a=o[p],c){case re:if(!a||!L.test(a)){if(n)return F;c=oe;continue}d+=a.toLowerCase(),c=ie;break;case ie:if(a&&(R.test(a)||"+"==a||"-"==a||"."==a))d+=a.toLowerCase();else{if(":"!=a){if(n)return F;d="",c=oe,p=0;continue}if(n&&(X(e)!=f(V,d)||"file"==d&&(K(e)||null!==e.port)||"file"==e.scheme&&!e.host))return;if(e.scheme=d,n)return void(X(e)&&V[e.scheme]==e.port&&(e.port=null));d="","file"==e.scheme?c=ye:X(e)&&i&&i.scheme==e.scheme?c=ae:X(e)?c=ce:"/"==o[p+1]?(c=ue,p++):(e.cannotBeABaseURL=!0,e.path.push(""),c=we)}break;case oe:if(!i||i.cannotBeABaseURL&&"#"!=a)return F;if(i.cannotBeABaseURL&&"#"==a){e.scheme=i.scheme,e.path=i.path.slice(),e.query=i.query,e.fragment="",e.cannotBeABaseURL=!0,c=ke;break}c="file"==i.scheme?ye:se;continue;case ae:if("/"!=a||"/"!=o[p+1]){c=se;continue}c=fe,p++;break;case ue:if("/"==a){c=pe;break}c=xe;continue;case se:if(e.scheme=i.scheme,a==r)e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.query=i.query;else if("/"==a||"\\"==a&&X(e))c=le;else if("?"==a)e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.query="",c=Ee;else{if("#"!=a){e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.path.pop(),c=xe;continue}e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.query=i.query,e.fragment="",c=ke}break;case le:if(!X(e)||"/"!=a&&"\\"!=a){if("/"!=a){e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,c=xe;continue}c=pe}else c=fe;break;case ce:if(c=fe,"/"!=a||"/"!=d.charAt(p+1))continue;p++;break;case fe:if("/"!=a&&"\\"!=a){c=pe;continue}break;case pe:if("@"==a){v&&(d="%40"+d),v=!0,u=h(d);for(var m=0;m<u.length;m++){var b=u[m];if(":"!=b||g){var x=$(b,Q);g?e.password+=x:e.username+=x}else g=!0}d=""}else if(a==r||"/"==a||"?"==a||"#"==a||"\\"==a&&X(e)){if(v&&""==d)return"Invalid authority";p-=h(d).length+1,d="",c=he}else d+=a;break;case he:case de:if(n&&"file"==e.scheme){c=me;continue}if(":"!=a||y){if(a==r||"/"==a||"?"==a||"#"==a||"\\"==a&&X(e)){if(X(e)&&""==d)return T;if(n&&""==d&&(K(e)||null!==e.port))return;if(s=N(e,d))return s;if(d="",c=be,n)return;continue}"["==a?y=!0:"]"==a&&(y=!1),d+=a}else{if(""==d)return T;if(s=N(e,d))return s;if(d="",c=ve,n==de)return}break;case ve:if(!I.test(a)){if(a==r||"/"==a||"?"==a||"#"==a||"\\"==a&&X(e)||n){if(""!=d){var w=parseInt(d,10);if(w>65535)return C;e.port=X(e)&&w===V[e.scheme]?null:w,d=""}if(n)return;c=be;continue}return C}d+=a;break;case ye:if(e.scheme="file","/"==a||"\\"==a)c=ge;else{if(!i||"file"!=i.scheme){c=xe;continue}if(a==r)e.host=i.host,e.path=i.path.slice(),e.query=i.query;else if("?"==a)e.host=i.host,e.path=i.path.slice(),e.query="",c=Ee;else{if("#"!=a){ee(o.slice(p).join(""))||(e.host=i.host,e.path=i.path.slice(),te(e)),c=xe;continue}e.host=i.host,e.path=i.path.slice(),e.query=i.query,e.fragment="",c=ke}}break;case ge:if("/"==a||"\\"==a){c=me;break}i&&"file"==i.scheme&&!ee(o.slice(p).join(""))&&(J(i.path[0],!0)?e.path.push(i.path[0]):e.host=i.host),c=xe;continue;case me:if(a==r||"/"==a||"\\"==a||"?"==a||"#"==a){if(!n&&J(d))c=xe;else if(""==d){if(e.host="",n)return;c=be}else{if(s=N(e,d))return s;if("localhost"==e.host&&(e.host=""),n)return;d="",c=be}continue}d+=a;break;case be:if(X(e)){if(c=xe,"/"!=a&&"\\"!=a)continue}else if(n||"?"!=a)if(n||"#"!=a){if(a!=r&&(c=xe,"/"!=a))continue}else e.fragment="",c=ke;else e.query="",c=Ee;break;case xe:if(a==r||"/"==a||"\\"==a&&X(e)||!n&&("?"==a||"#"==a)){if(".."===(l=(l=d).toLowerCase())||"%2e."===l||".%2e"===l||"%2e%2e"===l?(te(e),"/"==a||"\\"==a&&X(e)||e.path.push("")):ne(d)?"/"==a||"\\"==a&&X(e)||e.path.push(""):("file"==e.scheme&&!e.path.length&&J(d)&&(e.host&&(e.host=""),d=d.charAt(0)+":"),e.path.push(d)),d="","file"==e.scheme&&(a==r||"?"==a||"#"==a))for(;e.path.length>1&&""===e.path[0];)e.path.shift();"?"==a?(e.query="",c=Ee):"#"==a&&(e.fragment="",c=ke)}else d+=$(a,G);break;case we:"?"==a?(e.query="",c=Ee):"#"==a?(e.fragment="",c=ke):a!=r&&(e.path[0]+=$(a,H));break;case Ee:n||"#"!=a?a!=r&&("'"==a&&X(e)?e.query+="%27":e.query+="#"==a?"%23":$(a,H)):(e.fragment="",c=ke);break;case ke:a!=r&&(e.fragment+=$(a,Y))}p++}},Se=function(e){var t,n,r=c(this,Se,"URL"),i=arguments.length>1?arguments[1]:void 0,a=String(e),u=E(r,{type:"URL"});if(void 0!==i)if(i instanceof Se)t=k(i);else if(n=Ae(t={},String(i)))throw TypeError(n);if(n=Ae(u,a,null,t))throw TypeError(n);var s=u.searchParams=new x,l=w(s);l.updateSearchParams(u.query),l.updateURL=function(){u.query=String(s)||null},o||(r.href=Te.call(r),r.origin=Ce.call(r),r.protocol=Le.call(r),r.username=Re.call(r),r.password=Ie.call(r),r.host=Ue.call(r),r.hostname=Oe.call(r),r.port=_e.call(r),r.pathname=Me.call(r),r.search=ze.call(r),r.searchParams=Pe.call(r),r.hash=je.call(r))},Fe=Se.prototype,Te=function(){var e=k(this),t=e.scheme,n=e.username,r=e.password,i=e.host,o=e.port,a=e.path,u=e.query,s=e.fragment,l=t+":";return null!==i?(l+="//",K(e)&&(l+=n+(r?":"+r:"")+"@"),l+=W(i),null!==o&&(l+=":"+o)):"file"==t&&(l+="//"),l+=e.cannotBeABaseURL?a[0]:a.length?"/"+a.join("/"):"",null!==u&&(l+="?"+u),null!==s&&(l+="#"+s),l},Ce=function(){var e=k(this),t=e.scheme,n=e.port;if("blob"==t)try{return new URL(t.path[0]).origin}catch(e){return"null"}return"file"!=t&&X(e)?t+"://"+W(e.host)+(null!==n?":"+n:""):"null"},Le=function(){return k(this).scheme+":"},Re=function(){return k(this).username},Ie=function(){return k(this).password},Ue=function(){var e=k(this),t=e.host,n=e.port;return null===t?"":null===n?W(t):W(t)+":"+n},Oe=function(){var e=k(this).host;return null===e?"":W(e)},_e=function(){var e=k(this).port;return null===e?"":String(e)},Me=function(){var e=k(this),t=e.path;return e.cannotBeABaseURL?t[0]:t.length?"/"+t.join("/"):""},ze=function(){var e=k(this).query;return e?"?"+e:""},Pe=function(){return k(this).searchParams},je=function(){var e=k(this).fragment;return e?"#"+e:""},De=function(e,t){return{get:e,set:t,configurable:!0,enumerable:!0}};if(o&&s(Fe,{href:De(Te,(function(e){var t=k(this),n=String(e),r=Ae(t,n);if(r)throw TypeError(r);w(t.searchParams).updateSearchParams(t.query)})),origin:De(Ce),protocol:De(Le,(function(e){var t=k(this);Ae(t,String(e)+":",re)})),username:De(Re,(function(e){var t=k(this),n=h(String(e));if(!Z(t)){t.username="";for(var r=0;r<n.length;r++)t.username+=$(n[r],Q)}})),password:De(Ie,(function(e){var t=k(this),n=h(String(e));if(!Z(t)){t.password="";for(var r=0;r<n.length;r++)t.password+=$(n[r],Q)}})),host:De(Ue,(function(e){var t=k(this);t.cannotBeABaseURL||Ae(t,String(e),he)})),hostname:De(Oe,(function(e){var t=k(this);t.cannotBeABaseURL||Ae(t,String(e),de)})),port:De(_e,(function(e){var t=k(this);Z(t)||(""==(e=String(e))?t.port=null:Ae(t,e,ve))})),pathname:De(Me,(function(e){var t=k(this);t.cannotBeABaseURL||(t.path=[],Ae(t,e+"",be))})),search:De(ze,(function(e){var t=k(this);""==(e=String(e))?t.query=null:("?"==e.charAt(0)&&(e=e.slice(1)),t.query="",Ae(t,e,Ee)),w(t.searchParams).updateSearchParams(t.query)})),searchParams:De(Pe),hash:De(je,(function(e){var t=k(this);""!=(e=String(e))?("#"==e.charAt(0)&&(e=e.slice(1)),t.fragment="",Ae(t,e,ke)):t.fragment=null}))}),l(Fe,"toJSON",(function(){return Te.call(this)}),{enumerable:!0}),l(Fe,"toString",(function(){return Te.call(this)}),{enumerable:!0}),b){var Ne=b.createObjectURL,Be=b.revokeObjectURL;Ne&&l(Se,"createObjectURL",(function(e){return Ne.apply(b,arguments)})),Be&&l(Se,"revokeObjectURL",(function(e){return Be.apply(b,arguments)}))}y(Se,"URL"),i({global:!0,forced:!a,sham:!o},{U-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(63, 103, 145, 0.25);
}

.dark-mode .custom-range.custom-range-primary:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(63, 103, 145, 0.25);
}

.dark-mode .custom-range.custom-range-primary:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(63, 103, 145, 0.25);
}

.dark-mode .custom-range.custom-range-primary::-webkit-slider-thumb {
  background-color: #3f6791;
}

.dark-mode .custom-range.custom-range-primary::-webkit-slider-thumb:active {
  background-color: #a9c1da;
}

.dark-mode .custom-range.custom-range-primary::-moz-range-thumb {
  background-color: #3f6791;
}

.dark-mode .custom-range.custom-range-primary::-moz-range-thumb:active {
  background-color: #a9c1da;
}

.dark-mode .custom-range.custom-range-primary::-ms-thumb {
  background-color: #3f6791;
}

.dark-mode .custom-range.custom-range-primary::-ms-thumb:active {
  background-color: #a9c1da;
}

.dark-mode .custom-range.custom-range-secondary:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-secondary:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(108, 117, 125, 0.25);
}

.dark-mode .custom-range.custom-range-secondary:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(108, 117, 125, 0.25);
}

.dark-mode .custom-range.custom-range-secondary:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(108, 117, 125, 0.25);
}

.dark-mode .custom-range.custom-range-secondary::-webkit-slider-thumb {
  background-color: #6c757d;
}

.dark-mode .custom-range.custom-range-secondary::-webkit-slider-thumb:active {
  background-color: #caced1;
}

.dark-mode .custom-range.custom-range-secondary::-moz-range-thumb {
  background-color: #6c757d;
}

.dark-mode .custom-range.custom-range-secondary::-moz-range-thumb:active {
  background-color: #caced1;
}

.dark-mode .custom-range.custom-range-secondary::-ms-thumb {
  background-color: #6c757d;
}

.dark-mode .custom-range.custom-range-secondary::-ms-thumb:active {
  background-color: #caced1;
}

.dark-mode .custom-range.custom-range-success:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-success:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(0, 188, 140, 0.25);
}

.dark-mode .custom-range.custom-range-success:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(0, 188, 140, 0.25);
}

.dark-mode .custom-range.custom-range-success:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(0, 188, 140, 0.25);
}

.dark-mode .custom-range.custom-range-success::-webkit-slider-thumb {
  background-color: #00bc8c;
}

.dark-mode .custom-range.custom-range-success::-webkit-slider-thumb:active {
  background-color: #70ffda;
}

.dark-mode .custom-range.custom-range-success::-moz-range-thumb {
  background-color: #00bc8c;
}

.dark-mode .custom-range.custom-range-success::-moz-range-thumb:active {
  background-color: #70ffda;
}

.dark-mode .custom-range.custom-range-success::-ms-thumb {
  background-color: #00bc8c;
}

.dark-mode .custom-range.custom-range-success::-ms-thumb:active {
  background-color: #70ffda;
}

.dark-mode .custom-range.custom-range-info:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-info:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(52, 152, 219, 0.25);
}

.dark-mode .custom-range.custom-range-info:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(52, 152, 219, 0.25);
}

.dark-mode .custom-range.custom-range-info:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(52, 152, 219, 0.25);
}

.dark-mode .custom-range.custom-range-info::-webkit-slider-thumb {
  background-color: #3498db;
}

.dark-mode .custom-range.custom-range-info::-webkit-slider-thumb:active {
  background-color: #cce5f6;
}

.dark-mode .custom-range.custom-range-info::-moz-range-thumb {
  background-color: #3498db;
}

.dark-mode .custom-range.custom-range-info::-moz-range-thumb:active {
  background-color: #cce5f6;
}

.dark-mode .custom-range.custom-range-info::-ms-thumb {
  background-color: #3498db;
}

.dark-mode .custom-range.custom-range-info::-ms-thumb:active {
  background-color: #cce5f6;
}

.dark-mode .custom-range.custom-range-warning:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-warning:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(243, 156, 18, 0.25);
}

.dark-mode .custom-range.custom-range-warning:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(243, 156, 18, 0.25);
}

.dark-mode .custom-range.custom-range-warning:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(243, 156, 18, 0.25);
}

.dark-mode .custom-range.custom-range-warning::-webkit-slider-thumb {
  background-color: #f39c12;
}

.dark-mode .custom-range.custom-range-warning::-webkit-slider-thumb:active {
  background-color: #fce3bc;
}

.dark-mode .custom-range.custom-range-warning::-moz-range-thumb {
  background-color: #f39c12;
}

.dark-mode .custom-range.custom-range-warning::-moz-range-thumb:active {
  background-color: #fce3bc;
}

.dark-mode .custom-range.custom-range-warning::-ms-thumb {
  background-color: #f39c12;
}

.dark-mode .custom-range.custom-range-warning::-ms-thumb:active {
  background-color: #fce3bc;
}

.dark-mode .custom-range.custom-range-danger:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-danger:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(231, 76, 60, 0.25);
}

.dark-mode .custom-range.custom-range-danger:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(231, 76, 60, 0.25);
}

.dark-mode .custom-range.custom-range-danger:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(231, 76, 60, 0.25);
}

.dark-mode .custom-range.custom-range-danger::-webkit-slider-thumb {
  background-color: #e74c3c;
}

.dark-mode .custom-range.custom-range-danger::-webkit-slider-thumb:active {
  background-color: #fbdedb;
}

.dark-mode .custom-range.custom-range-danger::-moz-range-thumb {
  background-color: #e74c3c;
}

.dark-mode .custom-range.custom-range-danger::-moz-range-thumb:active {
  background-color: #fbdedb;
}

.dark-mode .custom-range.custom-range-danger::-ms-thumb {
  background-color: #e74c3c;
}

.dark-mode .custom-range.custom-range-danger::-ms-thumb:active {
  background-color: #fbdedb;
}

.dark-mode .custom-range.custom-range-light:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-light:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(248, 249, 250, 0.25);
}

.dark-mode .custom-range.custom-range-light:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(248, 249, 250, 0.25);
}

.dark-mode .custom-range.custom-range-light:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(248, 249, 250, 0.25);
}

.dark-mode .custom-range.custom-range-light::-webkit-slider-thumb {
  background-color: #f8f9fa;
}

.dark-mode .custom-range.custom-range-light::-webkit-slider-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-light::-moz-range-thumb {
  background-color: #f8f9fa;
}

.dark-mode .custom-range.custom-range-light::-moz-range-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-light::-ms-thumb {
  background-color: #f8f9fa;
}

.dark-mode .custom-range.custom-range-light::-ms-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-dark:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-dark:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(52, 58, 64, 0.25);
}

.dark-mode .custom-range.custom-range-dark:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(52, 58, 64, 0.25);
}

.dark-mode .custom-range.custom-range-dark:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(52, 58, 64, 0.25);
}

.dark-mode .custom-range.custom-range-dark::-webkit-slider-thumb {
  background-color: #343a40;
}

.dark-mode .custom-range.custom-range-dark::-webkit-slider-thumb:active {
  background-color: #88939e;
}

.dark-mode .custom-range.custom-range-dark::-moz-range-thumb {
  background-color: #343a40;
}

.dark-mode .custom-range.custom-range-dark::-moz-range-thumb:active {
  background-color: #88939e;
}

.dark-mode .custom-range.custom-range-dark::-ms-thumb {
  background-color: #343a40;
}

.dark-mode .custom-range.custom-range-dark::-ms-thumb:active {
  background-color: #88939e;
}

.dark-mode .custom-range.custom-range-lightblue:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-lightblue:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(134, 186, 216, 0.25);
}

.dark-mode .custom-range.custom-range-lightblue:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(134, 186, 216, 0.25);
}

.dark-mode .custom-range.custom-range-lightblue:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(134, 186, 216, 0.25);
}

.dark-mode .custom-range.custom-range-lightblue::-webkit-slider-thumb {
  background-color: #86bad8;
}

.dark-mode .custom-range.custom-range-lightblue::-webkit-slider-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-lightblue::-moz-range-thumb {
  background-color: #86bad8;
}

.dark-mode .custom-range.custom-range-lightblue::-moz-range-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-lightblue::-ms-thumb {
  background-color: #86bad8;
}

.dark-mode .custom-range.custom-range-lightblue::-ms-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-navy:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-navy:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(0, 44, 89, 0.25);
}

.dark-mode .custom-range.custom-range-navy:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(0, 44, 89, 0.25);
}

.dark-mode .custom-range.custom-range-navy:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(0, 44, 89, 0.25);
}

.dark-mode .custom-range.custom-range-navy::-webkit-slider-thumb {
  background-color: #002c59;
}

.dark-mode .custom-range.custom-range-navy::-webkit-slider-thumb:active {
  background-color: #0c84ff;
}

.dark-mode .custom-range.custom-range-navy::-moz-range-thumb {
  background-color: #002c59;
}

.dark-mode .custom-range.custom-range-navy::-moz-range-thumb:active {
  background-color: #0c84ff;
}

.dark-mode .custom-range.custom-range-navy::-ms-thumb {
  background-color: #002c59;
}

.dark-mode .custom-range.custom-range-navy::-ms-thumb:active {
  background-color: #0c84ff;
}

.dark-mode .custom-range.custom-range-olive:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-olive:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(116, 200, 163, 0.25);
}

.dark-mode .custom-range.custom-range-olive:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(116, 200, 163, 0.25);
}

.dark-mode .custom-range.custom-range-olive:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(116, 200, 163, 0.25);
}

.dark-mode .custom-range.custom-range-olive::-webkit-slider-thumb {
  background-color: #74c8a3;
}

.dark-mode .custom-range.custom-range-olive::-webkit-slider-thumb:active {
  background-color: #f4fbf8;
}

.dark-mode .custom-range.custom-range-olive::-moz-range-thumb {
  background-color: #74c8a3;
}

.dark-mode .custom-range.custom-range-olive::-moz-range-thumb:active {
  background-color: #f4fbf8;
}

.dark-mode .custom-range.custom-range-olive::-ms-thumb {
  background-color: #74c8a3;
}

.dark-mode .custom-range.custom-range-olive::-ms-thumb:active {
  background-color: #f4fbf8;
}

.dark-mode .custom-range.custom-range-lime:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-lime:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(103, 255, 169, 0.25);
}

.dark-mode .custom-range.custom-range-lime:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(103, 255, 169, 0.25);
}

.dark-mode .custom-range.custom-range-lime:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(103, 255, 169, 0.25);
}

.dark-mode .custom-range.custom-range-lime::-webkit-slider-thumb {
  background-color: #67ffa9;
}

.dark-mode .custom-range.custom-range-lime::-webkit-slider-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-lime::-moz-range-thumb {
  background-color: #67ffa9;
}

.dark-mode .custom-range.custom-range-lime::-moz-range-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-lime::-ms-thumb {
  background-color: #67ffa9;
}

.dark-mode .custom-range.custom-range-lime::-ms-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-fuchsia:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-fuchsia:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(246, 114, 216, 0.25);
}

.dark-mode .custom-range.custom-range-fuchsia:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(246, 114, 216, 0.25);
}

.dark-mode .custom-range.custom-range-fuchsia:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(246, 114, 216, 0.25);
}

.dark-mode .custom-range.custom-range-fuchsia::-webkit-slider-thumb {
  background-color: #f672d8;
}

.dark-mode .custom-range.custom-range-fuchsia::-webkit-slider-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-fuchsia::-moz-range-thumb {
  background-color: #f672d8;
}

.dark-mode .custom-range.custom-range-fuchsia::-moz-range-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-fuchsia::-ms-thumb {
  background-color: #f672d8;
}

.dark-mode .custom-range.custom-range-fuchsia::-ms-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-maroon:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-maroon:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(237, 108, 155, 0.25);
}

.dark-mode .custom-range.custom-range-maroon:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(237, 108, 155, 0.25);
}

.dark-mode .custom-range.custom-range-maroon:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(237, 108, 155, 0.25);
}

.dark-mode .custom-range.custom-range-maroon::-webkit-slider-thumb {
  background-color: #ed6c9b;
}

.dark-mode .custom-range.custom-range-maroon::-webkit-slider-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-maroon::-moz-range-thumb {
  background-color: #ed6c9b;
}

.dark-mode .custom-range.custom-range-maroon::-moz-range-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-maroon::-ms-thumb {
  background-color: #ed6c9b;
}

.dark-mode .custom-range.custom-range-maroon::-ms-thumb:active {
  background-color: white;
}

.dark-mode .custom-range.custom-range-blue:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-blue:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(63, 103, 145, 0.25);
}

.dark-mode .custom-range.custom-range-blue:focus::-moz-range-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(63, 103, 145, 0.25);
}

.dark-mode .custom-range.custom-range-blue:focus::-ms-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(63, 103, 145, 0.25);
}

.dark-mode .custom-range.custom-range-blue::-webkit-slider-thumb {
  background-color: #3f6791;
}

.dark-mode .custom-range.custom-range-blue::-webkit-slider-thumb:active {
  background-color: #a9c1da;
}

.dark-mode .custom-range.custom-range-blue::-moz-range-thumb {
  background-color: #3f6791;
}

.dark-mode .custom-range.custom-range-blue::-moz-range-thumb:active {
  background-color: #a9c1da;
}

.dark-mode .custom-range.custom-range-blue::-ms-thumb {
  background-color: #3f6791;
}

.dark-mode .custom-range.custom-range-blue::-ms-thumb:active {
  background-color: #a9c1da;
}

.dark-mode .custom-range.custom-range-indigo:focus {
  outline: none;
}

.dark-mode .custom-range.custom-range-indigo:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(102, 16, 242, 0.25);
}

.dark-mode .custom-range.custom-range-indigo:fper.kanban .content .container-lg,.content-wrapper.kanban .content .container-md,.content-wrapper.kanban .content .container-sm,.content-wrapper.kanban .content .container-xl{width:-webkit-max-content;width:-moz-max-content;width:max-content;display:-ms-flexbox;display:flex;-ms-flex-align:stretch;align-items:stretch}.content-wrapper.kanban .content-header+.content{height:calc(100% - ((2 * 15px) + (1.8rem * 1.2)))}.content-wrapper.kanban .card .card-body{padding:.5rem}.content-wrapper.kanban .card.card-row{width:340px;display:inline-block;margin:0 .5rem}.content-wrapper.kanban .card.card-row:first-child{margin-left:0}.content-wrapper.kanban .card.card-row .card-body{height:calc(100% - (12px + (1.8rem * 1.2) + .5rem));overflow-y:auto}.content-wrapper.kanban .card.card-row .card:last-child{margin-bottom:0;border-bottom-width:1px}.content-wrapper.kanban .card.card-row .card .card-header{padding:.5rem .75rem}.content-wrapper.kanban .card.card-row .card .card-body{padding:.75rem}.content-wrapper.kanban .btn-tool.btn-link{text-decoration:underline;padding-left:0;padding-right:0}.fc-button{background:#f8f9fa;background-image:none;border-bottom-color:#ddd;border-color:#ddd;color:#495057}.fc-button.hover,.fc-button:active,.fc-button:hover{background-color:#e9e9e9}.fc-header-title h2{color:#666;font-size:15px;line-height:1.6em;margin-left:10px}.fc-header-right{padding-right:10px}.fc-header-left{padding-left:10px}.fc-widget-header{background:#fafafa}.fc-grid{border:0;width:100%}.fc-widget-content:first-of-type,.fc-widget-header:first-of-type{border-left:0;border-right:0}.fc-widget-content:last-of-type,.fc-widget-header:last-of-type{border-right:0}.fc-toolbar,.fc-toolbar.fc-header-toolbar{margin:0;padding:1rem}@media (max-width:575.98px){.fc-toolbar{-ms-flex-direction:column;flex-direction:column}.fc-toolbar .fc-left{-ms-flex-order:1;order:1;margin-bottom:.5rem}.fc-toolbar .fc-center{-ms-flex-order:0;order:0;margin-bottom:.375rem}.fc-toolbar .fc-right{-ms-flex-order:2;order:2}}.fc-day-number{font-size:20px;font-weight:300;padding-right:10px}.fc-color-picker{list-style:none;margin:0;padding:0}.fc-color-picker>li{float:left;font-size:30px;line-height:30px;margin-right:5px}.fc-color-picker>li .fa,.fc-color-picker>li .fab,.fc-color-picker>li .fad,.fc-color-picker>li .fal,.fc-color-picker>li .far,.fc-color-picker>li .fas,.fc-color-picker>li .ion,.fc-color-picker>li .svg-inline--fa{transition:-webkit-transform linear .3s;transition:transform linear .3s;transition:transform linear .3s,-webkit-transform linear .3s}.fc-color-picker>li .fa:hover,.fc-color-picker>li .fab:hover,.fc-color-picker>li .fad:hover,.fc-color-picker>li .fal:hover,.fc-color-picker>li .far:hover,.fc-color-picker>li .fas:hover,.fc-color-picker>li .ion:hover,.fc-color-picker>li .svg-inline--fa:hover{-webkit-transform:rotate(30deg);transform:rotate(30deg)}#add-new-event{transition:all linear .3s}.external-event{box-shadow:0 0 1px rgba(0,0,0,.125),0 1px 3px rgba(0,0,0,.2);border-radius:.25rem;cursor:move;font-weight:700;margin-bottom:4px;padding:5px 10px}.external-event:hover{box-shadow:inset 0 0 90px rgba(0,0,0,.2)}.select2-container--default .select2-selection--single{border:1px solid #ced4da;padding:.46875rem .75rem;height:calc(2.25rem + 2px)}.select2-container--default.select2-container--open .select2-selection--single{border-color:#80bdff}.select2-container--default .select2-dropdown{border:1px solid #ced4da}.select2-container--default .select2-results__option{padding:6px 12px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.select2-container--default .select2-selection--single .select2-selection__rendered{padding-left:0;height:auto;margin-top:-3px}.select2-container--default[dir=rtl] .select2-selection--single .select2-selection__rendered{padding-right:6px;padding-left:20px}.select2-container--default .select2-selection--single .select2-selection__arrow{height:31px;right:6px}.select2-container--default .select2-selection--single .select2-selection__arrow b{margin-top:0}.select2-container--default .select2-dropdown .select2-search__field,.select2-container--default .select2-search--inline .select2-search__field{border:1px solid #ced4da}.select2-container--default .select2-dropdown .select2-search__field:focus,.select2-container--default .select2-search--inline .select2-search__field:focus{outline:0;border:1px solid #80bdff}.select2-container--default .select2-dropdown.select2-dropdown--below{border-top:0}.select2-container--default .select2-dropdown.select2-dropdown--above{border-bottom:0}.select2-container--default .select2-results__option[aria-disabled=true]{color:#6c757d}.select2-container--default .select2-results__option[aria-selected=true]{background-color:#dee2e6}.select2-container--default .select2-results__option[aria-selected=true],.select2-container--default .select2-results__option[aria-selected=true]:hover{color:#1f2d3d}.select2-container--default .select2-results__option--highlighted{background-color:#007bff;color:#fff}.select2-container--default .select2-results__option--highlighted[aria-selected],.select2-container--default .select2-results__option--highlighted[aria-selected]:hover{background-color:#0074f0;color:#fff}.select2-container--default .select2-selection--multiple{border:1px solid #ced4da;min-height:calc(2.25rem + 2px)}.select2-container--default .select2-selection--multiple:focus{border-color:#80bdff}.select2-container--default .select2-selection--multiple .select2-selection__rendered{padding:0 .375rem .375rem;margin-bottom:-.375rem}.select2-container--default .select2-selection--multiple .select2-selection__rendered li:first-child.select2-search.select2-search--inline{width:100%;margin-left:.375rem}.select2-container--default .select2-selection--multiple .select2-selection__rendered li:first-child.select2-search.select2-search--inline .select2-search__field{width:100%!important}.select2-container--default .select2-selection--multiple .select2-selection__rendered .select2-search.select2-search--inline .select2-search__field{border:0;margin-top:6px}.select2-container--default .select2-selection--multiple .select2-selection__choice{background-color:#007bff;border-color:#006fe6;color:#fff;padding:0 10px;margin-top:.31rem}.select2-container--default .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7);float:right;margin-left:5px;margin-right:-2px}.select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.select2-container--default .select2-selection--multiple.text-sm .select2-search.select2-search--inline .select2-search__field,.text-sm .select2-container--default .select2-selection--multiple .select2-search.select2-search--inline .select2-search__field{margin-top:8px}.select2-container--default .select2-selection--multiple.text-sm .select2-selection__choice,.text-sm .select2-container--default .select2-selection--multiple .select2-selection__choice{margin-top:.4rem}.select2-container--default.select2-container--focus .select2-selection--multiple,.select2-container--default.select2-container--focus .select2-selection--single{border-color:#80bdff}.select2-container--default.select2-container--focus .select2-search__field{border:0}.select2-container--default .select2-selection--single .select2-selection__rendered li{padding-right:10px}.input-group-prepend~.select2-container--default .select2-selection{border-bottom-left-radius:0;border-top-left-radius:0}.input-group>.select2-container--default:not(:last-child) .select2-selection{border-bottom-right-radius:0;border-top-right-radius:0}.select2-container--bootstrap4.select2-container--focus .select2-selection{box-shadow:none}select.form-control-sm~.select2-container--default{font-size:75%}.text-sm .select2-container--default .select2-selection--single,select.form-control-sm~.select2-container--default .select2-selection--single{height:calc(1.8125rem + 2px)}.text-sm .select2-container--default .select2-selection--single .select2-selection__rendered,select.form-control-sm~.select2-container--default .select2-selection--single .select2-selection__rendered{margin-top:-.4rem}.text-sm .select2-container--default .select2-selection--single .select2-selection__arrow,select.form-control-sm~.select2-container--default .select2-selection--single .select2-selection__arrow{top:-.12rem}.text-sm .select2-container--default .select2-selection--multiple,select.form-control-sm~.select2-container--default .select2-selection--multiple{min-height:calc(1.8125rem + 2px)}.text-sm .select2-container--default .select2-selection--multiple .select2-selection__rendered,select.form-control-sm~.select2-container--default .select2-selection--multiple .select2-selection__rendered{padding:0 .25rem .25rem;margin-top:-.1rem}.text-sm .select2-container--default .select2-selection--multiple .select2-selection__rendered li:first-child.select2-search.select2-search--inline,select.form-control-sm~.select2-container--default .select2-selection--multiple .select2-selection__rendered li:first-child.select2-search.select2-search--inline{margin-left:.25rem}.text-sm .select2-container--default .select2-selection--multiple .select2-selection__rendered .select2-search.select2-search--inline .select2-search__field,select.form-control-sm~.select2-container--default .select2-selection--multiple .select2-selection__rendered .select2-search.select2-search--inline .select2-search__field{margin-top:6px}.maximized-card .select2-dropdown{z-index:9999}.select2-primary+.select2-container--default.select2-container--open .select2-selection--single{border-color:#80bdff}.select2-primary+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#80bdff}.select2-container--default .select2-primary .select2-dropdown .select2-search__field:focus,.select2-container--default .select2-primary .select2-search--inline .select2-search__field:focus,.select2-container--default .select2-primary.select2-dropdown .select2-search__field:focus,.select2-primary .select2-container--default .select2-dropdown .select2-search__field:focus,.select2-primary .select2-container--default .select2-search--inline .select2-search__field:focus,.select2-primary .select2-container--default.select2-dropdown .select2-search__field:focus{border:1px solid #80bdff}.select2-container--default .select2-primary .select2-results__option--highlighted,.select2-primary .select2-container--default .select2-results__option--highlighted{background-color:#007bff;color:#fff}.select2-container--default .select2-primary .select2-results__option--highlighted[aria-selected],.select2-container--default .select2-primary .select2-results__option--highlighted[aria-selected]:hover,.select2-primary .select2-container--default .select2-results__option--highlighted[aria-selected],.select2-primary .select2-container--default .select2-results__option--highlighted[aria-selected]:hover{background-color:#0074f0;color:#fff}.select2-container--default .select2-primary .select2-selection--multiple:focus,.select2-primary .select2-container--default .select2-selection--multiple:focus{border-color:#80bdff}.select2-container--default .select2-primary .select2-selection--multiple .select2-selection__choice,.select2-primary .select2-container--default .select2-selection--multiple .select2-selection__choice{background-color:#007bff;border-color:#006fe6;color:#fff}.select2-container--default .select2-primary .select2-selection--multiple .select2-selection__choice__remove,.select2-primary .select2-container--default .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.select2-container--default .select2-primary .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-primary .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.select2-container--default .select2-primary.select2-container--focus .select2-selection--multiple,.select2-primary .select2-container--default.select2-container--focus .select2-selection--multiple{border-color:#80bdff}.select2-secondary+.select2-container--default.select2-container--open .select2-selection--single{border-color:#afb5ba}.select2-secondary+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#afb5ba}.select2-container--default .select2-secondary .select2-dropdown .select2-search__field:focus,.select2-container--default .select2-secondary .select2-search--inline .select2-search__field:focus,.select2-container--default .select2-secondary.select2-dropdown .select2-search__field:focus,.select2-secondary .select2-container--default .select2-dropdown .select2-search__field:focus,.select2-secondary .select2-container--default .select2-search--inline .select2-search__field:focus,.select2-secondary .select2-container--default.select2-dropdown .select2-search__field:focus{border:1px solid #afb5ba}.select2-container--default .select2-secondary .select2-results__option--highlighted,.select2-secondary .select2-container--default .select2-results__option--highlighted{background-color:#6c757d;color:#fff}.select2-container--default .select2-secondary .select2-results__option--highlighted[aria-selected],.select2-container--default .select2-secondary .select2-results__option--highlighted[aria-selected]:hover,.select2-secondary .select2-container--default .select2-results__option--highlighted[aria-selected],.select2-secondary .select2-container--default .select2-results__option--highlighted[aria-selected]:hover{background-color:#656d75;color:#fff}.select2-container--default .select2-secondary .select2-selection--multiple:focus,.select2-secondary .select2-container--default .select2-selection--multiple:focus{border-color:#afb5ba}.select2-container--default .select2-secondary .select2-selection--multiple .select2-selection__choice,.select2-secondary .select2-container--default .select2-selection--multiple .select2-selection__choice{background-color:#6c757d;border-color:#60686f;color:#fff}.select2-container--default .select2-secondary .select2-selection--multiple .select2-selection__choice__remove,.select2-secondary .select2-container--default .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.select2-container--default .select2-secondary .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-secondary .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.select2-container--default .select2-secondary.select2-container--focus .select2-selection--multiple,.select2-secondary .select2-container--default.select2-container--focus .select2-selection--multiple{border-color:#afb5ba}.select2-success+.select2-container--default.select2-container--open .select2-selection--single{border-color:#71dd8a}.select2-success+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#71dd8a}.select2-container--default .select2-success .select2-dropdown .select2-search__field:focus,.select2-container--default .select2-success .select2-search--inline .select2-search__field:focus,.select2-container--default .select2-success.select2-dropdown .select2-search__field:focus,.select2-success .select2-container--default .select2-dropdown .select2-search__field:focus,.select2-success .select2-container--default .select2-search--inline .select2-search__field:focus,.select2-success .select2-container--default.select2-dropdown .select2-search__field:focus{border:1px solid #71dd8a}.select2-container--default .select2-success .select2-results__option--highlighted,.select2-success .select2-container--default .select2-results__option--highlighted{background-color:#28a745;color:#fff}.select2-container--default .select2-success .select2-results__option--highlighted[aria-selected],.select2-container--default .select2-success .select2-results__option--highlighted[aria-selected]:hover,.select2-success .select2-container--default .select2-results__option--highlighted[aria-selected],.select2-success .select2-container--default .select2-results__option--highlighted[aria-selected]:hover{background-color:#259b40;color:#fff}.select2-container--default .select2-success .select2-selection--multiple:focus,.select2-success .select2-container--default .select2-selene-height: .8;\n    margin-top: -.1rem;\n    max-height: 33px;\n    width: auto;\n  }\n\n  .brand-image-xl {\n    line-height: .8;\n    max-height: 40px;\n    width: auto;\n\n    &.single {\n      margin-top: -.3rem;\n    }\n  }\n\n  &.text-sm,\n  .text-sm & {\n    .brand-image {\n      height: 29px;\n      margin-bottom: -.25rem;\n      margin-left: .95rem;\n      margin-top: -.25rem;\n    }\n\n    .brand-image-xs {\n      margin-top: -.2rem;\n      max-height: 29px;\n    }\n\n    .brand-image-xl {\n      margin-top: -.225rem;\n      max-height: 38px;\n    }\n  }\n}\n","//\n// Component: Main Sidebar\n//\n\n.main-sidebar {\n  height: 100vh;\n  overflow-y: hidden;\n  z-index: $zindex-main-sidebar;\n\n  // Remove Firefox Focusring\n  a {\n    &:-moz-focusring {\n      border: 0;\n      outline: none;\n    }\n  }\n}\n\n.sidebar {\n  height: calc(100% - (#{$main-header-height-inner} + #{$main-header-bottom-border-width}));\n  overflow-x: hidden;\n  overflow-y: initial;\n  padding-bottom: $sidebar-padding-y;\n  padding-left: $sidebar-padding-x;\n  padding-right: $sidebar-padding-x;\n  padding-top: $sidebar-padding-y;\n  @include scrollbar-color-gray();\n  @include scrollbar-width-none();\n\n  &:hover {\n    @include scrollbar-width-thin();\n  }\n\n  .brand-link.border-bottom-0 ~ & {\n    height: calc(100% - #{$main-header-height-inner});\n  }\n}\n\n// Sidebar user panel\n.user-panel {\n  position: relative;\n\n  [class*=\"sidebar-dark\"] & {\n    border-bottom: 1px solid lighten($dark, 12%);\n  }\n\n  [class*=\"sidebar-light\"] & {\n    border-bottom: 1px solid $gray-300;\n  }\n\n  &,\n  .info {\n    overflow: hidden;\n    white-space: nowrap;\n  }\n\n  .image {\n    display: inline-block;\n    padding-left: $nav-link-padding-x - .2;\n  }\n\n  img {\n    height: auto;\n    width: $sidebar-user-image-width;\n  }\n\n  .info {\n    display: inline-block;\n    padding: 5px 5px 5px 10px;\n  }\n\n  .status,\n  .dropdown-menu {\n    font-size: $font-size-sm;\n  }\n}\n\n// Sidebar navigation menu\n.nav-sidebar {\n  // All levels\n  .nav-item {\n    > .nav-link {\n      margin-bottom: .2rem;\n\n      .right {\n        @include transition(transform $transition-fn $transition-speed);\n      }\n    }\n  }\n\n  .nav-link > .right,\n  .nav-link > p > .right {\n    position: absolute;\n    right: 1rem;\n    top: .7rem;\n\n    i,\n    span {\n      margin-left: .5rem;\n    }\n\n    &:nth-child(2) {\n      right: 2.2rem;\n    }\n  }\n\n  .menu-open {\n    > .nav-treeview {\n      display: block;\n    }\n  }\n\n  .menu-open,\n  .menu-is-opening {\n    > .nav-link {\n      svg.right,\n      i.right {\n        @include rotate(-90deg);\n      }\n    }\n  }\n\n  // First Level\n  > .nav-item {\n    margin-bottom: 0;\n\n    .nav-icon {\n      margin-left: .05rem;\n      font-size: 1.2rem;\n      margin-right: .2rem;\n      text-align: center;\n      width: $sidebar-nav-icon-width;\n\n      &.fa,\n      &.fas,\n      &.far,\n      &.fab,\n      &.fal,\n      &.fad,\n      &.svg-inline--fa,\n      &.ion {\n        font-size: 1.1rem;\n      }\n    }\n\n    .float-right {\n      margin-top: 3px;\n    }\n  }\n\n  // Tree view menu\n  .nav-treeview {\n    display: none;\n    list-style: none;\n    padding: 0;\n\n    > .nav-item {\n      > .nav-link {\n        > .nav-icon {\n          width: $sidebar-nav-icon-width;\n        }\n      }\n    }\n  }\n\n  &.nav-child-indent {\n    .nav-treeview {\n      transition: padding $transition-speed $transition-fn;\n      padding-left: 1rem;\n\n      .text-sm & {\n        padding-left: .5rem;\n      }\n    }\n\n    &.nav-legacy {\n      .nav-treeview {\n        .nav-treeview {\n          padding-left: 2rem;\n          margin-left: -1rem;\n\n          .text-sm & {\n            padding-left: 1rem;\n            margin-left: -.5rem;\n          }\n        }\n      }\n    }\n  }\n\n  .nav-header {\n    font-size: .9rem;\n    padding: $nav-link-padding-y ($nav-link-padding-y * 1.5);\n  }\n\n  .nav-link p {\n    display: inline;\n    margin: 0;\n    white-space: normal;\n  }\n}\n\n.sidebar-is-opening .sidebar .nav-sidebar {\n  .nav-link p {\n    animation-name: fadeIn;\n    animation-duration: $transition-speed;\n    animation-fill-mode: both;\n  }\n}\n\n#sidebar-overlay {\n  @include media-breakpoint-down(md) {\n    .sidebar-open & {\n      display: block;\n    }\n  }\n\n  background-color: rgba($black, .1);\n  bottom: 0;\n  display: none;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: $zindex-main-sidebar - 1;\n}\n\n[class*=\"sidebar-light-\"] {\n  // Sidebar background color\n  background-color: $sidebar-light-bg;\n\n  // User Panel (resides in the sidebar)\n  .user-panel {\n    a:hover {\n      color: $sidebar-light-hover-color;\n    }\n\n    .status {\n      background-color: $sidebar-light-hover-bg;\n      color: $sidebar-light-color;\n\n      &:hover,\n      &:focus,\n      &:active {\n        background-color: darken($sidebar-light-hover-bg, 3%);\n        color: $sidebar-light-hover-color;\n      }\n    }\n\n    .dropdown-menu {\n      @include box-shadow(0 2px 4px rgba(0, 0, 0, .4));\n      border-color: darken($sidebar-light-hover-bg, 5%);\n    }\n\n    .dropdown-item {\n      color: $body-color;\n    }\n  }\n\n  // Sidebar Menu. First level links\n  .nav-sidebar > .nav-item {\n    // links\n    > .nav-link {\n      // border-left: 3px solid transparent;\n      &:active,\n      &:focus {\n        color: $sidebar-light-color;\n      }\n    }\n\n    // Hover and active states\n    &.menu-open > .nav-link,\n    &:hover > .nav-link {\n      background-color: $sidebar-light-hover-bg;\n      color: $sidebar-light-hover-color;\n    }\n\n    > .nav-link.active {\n      color: $sidebar-light-active-color;\n\n      @if $enable-shadows {\n        box-shadow: map-get($elevations, 1);\n      }\n    }\n\n    // First Level Submenu\n    > .nav-treeview {\n      background-color: $sidebar-light-submenu-bg;\n    }\n  }\n\n  // Section Heading\n  .nav-header {\n    background-color: inherit;\n    color: darken($sidebar-light-color, 5%);\n  }\n\n  // All links within the sidebar menu\n  .sidebar {\n    a {\n      color: $sidebar-light-color;\n\n      &:hover {\n        text-decoration: none;\n      }\n    }\n  }\n\n  // All submenus\n  .nav-treeview {\n    > .nav-item {\n      > .nav-link {\n        color: $sidebar-light-submenu-color;\n\n        &:hover,\n        &:focus {\n          background-color: $sidebar-light-submenu-hover-bg;\n          color: $sidebar-light-submenu-hover-color;\n        }\n      }\n\n      > .nav-link.active {\n        &,\n        &:hover {\n          background-color: $sidebar-light-submenu-active-bg;\n          color: $sidebar-light-submenu-active-color;\n        }\n      }\n\n      > .nav-link:hover {\n        background-color: $sidebar-light-submenu-hover-bg;\n      }\n    }\n  }\n\n  // Flat style\n  .nav-flat {\n    .nav-item {\n      .nav-treeview {\n        .nav-treeview {\n          border-color: $sidebar-light-submenu-active-bg;\n        }\n\n        > .nav-item {\n          > .nav-link {\n            &,\n            &.active {\n              border-color: $sidebar-light-submenu-active-bg;\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n[class*=\"sidebar-dark-\"] {\n  // Sidebar background color\n  background-color: $sidebar-dark-bg;\n\n  // User Panel (resides in the sidebar)\n  .user-panel {\n    a:hover {\n      color: $sidebar-dark-hover-color;\n    }\n\n    .status {\n      background-color: $sidebar-dark-hover-bg;\n      color: $sidebar-dark-color;\n\n      &:hover,\n      &:focus,\n      &:active {\n        background-color: darken($sidebar-dark-hover-bg, 3%);\n        color: $sidebar-dark-hover-color;\n      }\n    }\n\n    .dropdown-menu {\n      @include box-shadow(0 2px 4px rgba(0, 0, 0, .4));\n      border-color: darken($sidebar-dark-hover-bg, 5%);\n    }\n\n    .dropdown-item {\n      color: $body-color;\n    }\n  }\n\n  // Sidebar Menu. First level links\n  .nav-sidebar > .nav-item {\n    // links\n    > .nav-link {\n      // border-left: 3px solid transparent;\n      &:active {\n        color: $sidebar-dark-color;\n      }\n    }\n\n    // Hover and active states\n    &.menu-open > .nav-link,\n    &:hover > .nav-link,\n    > .nav-link:focus {\n      background-color: $sidebar-dark-hover-bg;\n      color: $sidebar-dark-hover-color;\n    }\n\n    > .nav-link.active {\n      color: $sidebar-dark-hover-color;\n\n      @if $enable-shadows {\n        box-shadow: map-get($elevations, 1);\n      }\n    }\n\n    // First Level Submenu\n    > .nav-treeview {\n      background-color: $sidebar-dark-submenu-bg;\n    }\n  }\n\n  // Section Heading\n  .nav-header {\n    background-color: inherit; //darken($sidebar-dark-bg, 3%);\n    color: lighten($sidebar-dark-color, 5%);\n  }\n\n  // All links within the sidebar menu\n  .sidebar {\n    a {\n      color: $sidebar-dark-color;\n\n      &:hover,\n      &:focus {\n        text-decoration: none;\n      }\n    }\n  }\n\n  // All submenus\n  .nav-treeview {\n    > .nav-item {\n      > .nav-link {\n        color: $sidebar-dark-submenu-color;\n\n        &:hover,\n        &:focus {\n          background-color: $sidebar-dark-submenu-hover-bg;\n          color: $sidebar-dark-submenu-hover-color;\n        }\n      }\n\n      > .nav-link.active {\n        &,\n        &:hover,\n        &:focus {\n          background-color: $sidebar-dark-submenu-active-bg;\n          color: $sidebar-dark-submenu-active-color;\n        }\n      }\n    }\n  }\n\n  // Flat Style\n  .nav-flat {\n    .nav-item {\n      .nav-treeview {\n        .nav-treeview {\n          border-color: $sidebar-dark-submenu-active-bg;\n        }\n\n        > .nav-item {\n          > .nav-link {\n            &,\n            &.active {\n              border-color: $sidebar-dark-submenu-active-bg;\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n// Sidebar variants\n@each $name, $color in $theme-colors {\n  .sidebar-dark-#{$name},\n  .sidebar-light-#{$name} {\n    @include sidebar-color($color);\n  }\n}\n\n@each $name, $color in $colors {\n  .sidebar-dark-#{$name},\n  .sidebar-light-#{$name} {\n    @include sidebar-color($color);\n  }\n}\n\n.sidebar-mini .main-sidebar:not(.sidebar-no-expand),\n.sidebar-mini-md .main-sidebar:not(.sidebar-no-expand),\n.sidebar-mini-xs .main-sidebar:not(.sidebar-no-expand),\n.sidebar-mini .main-sidebar:not(.sidebar-no-expand):hover,\n.sidebar-mini-md .main-sidebar:not(.sidebar-no-expand):hover,\n.sidebar-mini-xs .main-sidebar:not(.sidebar-no-expand):hover,\n.sidebar-mini .main-sidebar.sidebar-focused,\n.sidebar-mini-md .main-sidebar.sidebar-focused,\n.sidebar-mini-xs .main-sidebar.sidebar-focused {\n  .nav-compact.nav-sidebar.nav-child-indent:not(.nav-flat) .nav-treeview {\n    padding-left: 1rem;\n    margin-left: -.5rem;\n  }\n}\n\n// Nav Flat\n.nav-flat {\n  margin: (-$sidebar-padding-x * .5) (-$sidebar-padding-x) 0;\n\n  .nav-item {\n    > .nav-link {\n      border-radius: 0;\n      margin-bottom: 0;\n\n      > .nav-icon {\n        margin-left: .55rem;\n      }\n    }\n  }\n\n  &:not(.nav-child-indent) {\n    .nav-treeview {\n      .nav-item {\n        > .nav-link {\n          > .nav-icon {\n            margin-left: .4rem;\n          }\n        }\n      }\n    }\n  }\n\n  &.nav-child-indent {\n    .nav-treeview {\n      padding-left: 0;\n\n      .nav-icon {\n        margin-left: .85rem;\n      }\n\n      .nav-treeview {\n        border-left: .2rem solid;\n\n        .nav-icon {\n          margin-left: 1.15rem;\n        }\n\n        .nav-treeview {\n          .nav-icon {\n            margin-left: 1.45rem;\n          }\n\n          .nav-treeview {\n            .nav-icon {\n              margin-left: 1.75rem;\n            }\n\n            .nav-treeview {\n              .nav-icon {\n                margin-left: 2.05rem;\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n\n  .sidebar-collapse &.nav-child-indent .sidebar {\n    .nav-treeview {\n      .nav-icon {\n        margin-left: .55rem;\n      }\n\n      .nav-link {\n        padding-left: calc(#{$nav-link-padding-x} - .2rem);\n      }\n\n      .nav-treeview {\n        .nav-icon {\n          margin-left: .35rem;\n        }\n\n        .nav-treeview {\n          .nav-icon {\n            margin-left: .15rem;\n          }\n\n          .nav-treeview {\n            .nav-icon {\n              margin-left: -.15rem;\n            }\n\n            .nav-treeview {\n              .nav-icon {\n                margin-left: -.35rem;\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n\n  .sidebar-mini .main-sidebar:not(.sidebar-no-expand):hover &,\n  .sidebar-mini-md .main-sidebar:not(.sidebar-no-expand):hover &,\n  .sidebar-mini-xs .main-sidebar:not(.sidebar-no-expand):hover &,\n  .sidebar-mini .main-sidebar.sidebar-focused &,\n  .sidebar-mini-md .main-sidebar.sidebar-focused &,\n  .sidebar-mini-xs .main-sidebar.sidebar-focused & {\n    &.nav-compact.nav-sidebar .nav-treeview {\n      .nav-icon {\n        margin-left: .4rem;\n      }\n    }\n\n    &.nav-sidebar.nav-child-indent .nav-treeview {\n      .nav-icon {\n        margin-left: .85rem;\n      }\n\n      .nav-treeview {\n        .nav-icon {\n          margin-left: 1.15rem;\n        }\n\n        .nav-treeview {\n          .nav-icon {\n            margin-left: 1.45rem;\n          }\n\n          .nav-treeview {\n            .nav-icon {\n              margin-left: 1.75rem;\n            }\n\n            .nav-treeview {\n              .nav-icon {\n                margin-left: 2.05rem;\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n\n  .nav-icon {\n    @include transition(margin-left $transition-fn $transition-speed);\n  }\n\n  .nav-treeview {\n    .nav-icon {\n      margin-left: -.2rem;\n    }\n  }\n\n  &.nav-sidebar > .nav-item {\n    .nav-treeview,\n    > .nav-treeview {\n      background-color: rgba($white, .05);\n\n      .nav-item {\n        > .nav-link {\n          border-left: .2rem solid;\n        }\n      }\n    }\n  }\n}\n\n.nav-legacy {\n  margin: (-$sidebar-padding-x * .5) (-$sidebar-padding-x) 0;\n\n  &.nav-sidebar .nav-item {\n    > .nav-link {\n      border-radius: 0;\n      margin-bottom: 0;\n\n      > .nav-icon {\n        margin-left: .55rem;\n\n        .text-sm & {\n          margin-left: .75rem;\n        }\n      }\n    }\n  }\n\n  &.nav-sidebar > .nav-item {\n    > .nav-link {\n      &.active {\n        background-color: inherit;\n        border-left: 3px solid transparent;\n        box-shadow: none;\n\n        > .nav-icon {\n          margin-left: calc(.55rem - 3px);\n\n          .text-sm & {\n            margin-left: calc(.75rem - 3px);\n          }\n        }\n      }\n    }\n  }\n\n  .text-sm &.nav-sidebar.nav-flat .nav-treeview {\n    .nav-item {\n      > .nav-link {\n        > .nav-icon {\n          margin-left: calc(.75rem - 3px);\n        }\n      }\n    }\n  }\n\n  .sidebar-mini &,\n  .sidebar-mini-md &,\n  .sidebar-mini-xs & {\n    > .nav-item .nav-link {\n      .nav-icon {\n        @include transition(margin-left $transition-fn $transition-speed);\n        margin-left: .6rem;\n      }\n    }\n  }\n\n  .sidebar-mini.sidebar-collapse,\n  .sidebar-mini-md.sidebar-collapse,\n  .sidebar-mini-xs.sidebar-collapse {\n    .main-sidebar.sidebar-focused &.nav-child-indent,\n    .main-sidebar:hover &.nav-child-indent {\n      .nav-treeview {\n        padding-left: 1rem;\n\n        .nav-treeview {\n          padding-left: 2rem;\n          margin-left: -1rem;\n        }\n      }\n    }\n  }\n\n  .sidebar-mini.sidebar-collapse.text-sm,\n  .sidebar-mini-md.sidebar-collapse.text-sm,\n  .sidebar-mini-xs.sidebar-collapse.text-sm {\n    .main-sidebar.sidebar-focused &.nav-child-indent,\n    .main-sidebar:hover &.nav-child-indent {\n      .nav-treeview {\n        padding-left: .5rem;\n\n        .nav-treeview {\n          padding-left: 1rem;\n          margin-left: -.5rem;\n        }\n      }\n    }\n  }\n\n  .sidebar-mini.sidebar-collapse &,\n  .sidebar-mini-md.sidebar-collapse &,\n  .sidebar-mini-xs.sidebar-collapse & {\n    .sidebar {\n      > .nav-item > .nav-link {\n        .nav-icon {\n          margin-left: .55rem;\n        }\n        &.active {\n          > .nav-icon {\n            margin-left: .36rem;\n          }\n        }\n      }\n      &.nav-child-indent {\n        .nav-treev