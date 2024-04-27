/*! SearchPanes 1.4.0
 * 2019-2020 SpryMedia Ltd - datatables.net/license
 */
(function () {
    'use strict';

    var $;
    var dataTable;
    function setJQuery(jq) {
        $ = jq;
        dataTable = jq.fn.dataTable;
    }
    var SearchPane = /** @class */ (function () {
        /**
         * Creates the panes, sets up the search function
         *
         * @param paneSettings The settings for the searchPanes
         * @param opts The options for the default features
         * @param idx the index of the column for this pane
         * @returns {object} the pane that has been created, including the table and the index of the pane
         */
        function SearchPane(paneSettings, opts, idx, layout, panesContainer, panes) {
            var _this = this;
            if (panes === void 0) { panes = null; }
            // Check that the required version of DataTables is included
            if (!dataTable || !dataTable.versionCheck || !dataTable.versionCheck('1.10.0')) {
                throw new Error('SearchPane requires DataTables 1.10 or newer');
            }
            // Check that Select is included
            // eslint-disable-next-line no-extra-parens
            if (!dataTable.select) {
                throw new Error('SearchPane requires Select');
            }
            var table = new dataTable.Api(paneSettings);
            this.classes = $.extend(true, {}, SearchPane.classes);
            // Get options from user
            this.c = $.extend(true, {}, SearchPane.defaults, opts);
            if (opts !== undefined && opts.hideCount !== undefined && opts.viewCount === undefined) {
                this.c.viewCount = !this.c.hideCount;
            }
            this.customPaneSettings = panes;
            this.s = {
                cascadeRegen: false,
                clearing: false,
                colOpts: [],
                deselect: false,
                displayed: false,
                dt: table,
                dtPane: undefined,
                filteringActive: false,
                firstSet: true,
                forceViewTotal: false,
                index: idx,
                indexes: [],
                lastCascade: false,
                lastSelect: false,
                listSet: false,
                name: undefined,
                redraw: false,
                rowData: {
                    arrayFilter: [],
                    arrayOriginal: [],
                    arrayTotals: [],
                    bins: {},
                    binsOriginal: {},
                    binsTotal: {},
                    filterMap: new Map(),
                    totalOptions: 0
                },
                scrollTop: 0,
                searchFunction: undefined,
                selectPresent: false,
                serverSelect: [],
                serverSelecting: false,
                showFiltered: false,
                tableLength: null,
                updating: false
            };
            var rowLength = table.columns().eq(0).toArray().length;
            this.colExists = this.s.index < rowLength;
            // Add extra elements to DOM object including clear and hide buttons
            this.c.layout = layout;
            var layVal = parseInt(layout.split('-')[1], 10);
            this.dom = {
                buttonGroup: $('<div/>').addClass(this.classes.buttonGroup),
                clear: $('<button type="button">&#215;</button>')
                    .addClass(this.classes.disabledButton)
                    .attr('disabled', 'true')
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.clearButton),
                collapseButton: $('<button type="button"><span class="dtsp-caret">&#x5e;</span></button>')
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.collapseButton),
                container: $('<div/>')
                    .addClass(this.classes.container)
                    .addClass(this.classes.layout +
                    (layVal < 10 ? layout : layout.split('-')[0] + '-9')),
                countButton: $('<button type="button"></button>')
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.countButton),
                dtP: $('<table><thead><tr><th>' +
                    (this.colExists
                        ? $(table.column(this.colExists ? this.s.index : 0).header()).text()
                        : this.customPaneSettings.header || 'Custom Pane') + '</th><th/></tr></thead></table>'),
                lower: $('<div/>').addClass(this.classes.subRow2).addClass(this.classes.narrowButton),
                nameButton: $('<button type="button"></button>')
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.nameButton),
                panesContainer: panesContainer,
                searchBox: $('<input/>').addClass(this.classes.paneInputButton).addClass(this.classes.search),
                searchButton: $('<button type = "button" class="' + this.classes.searchIcon + '"></button>')
                    .addClass(this.classes.paneButton),
                searchCont: $('<div/>').addClass(this.classes.searchCont),
                searchLabelCont: $('<div/>').addClass(this.classes.searchLabelCont),
                topRow: $('<div/>').addClass(this.classes.topRow),
                upper: $('<div/>').addClass(this.classes.subRow1).addClass(this.classes.narrowSearch)
            };
            this.s.displayed = false;
            table = this.s.dt;
            this.selections = [];
            this.s.colOpts = this.colExists ? this._getOptions() : this._getBonusOptions();
            var colOpts = this.s.colOpts;
            var clear = $('<button type="button">X</button>').addClass(this.classes.paneButton);
            clear.text(table.i18n('searchPanes.clearPane', this.c.i18n.clearPane));
            this.dom.container.addClass(colOpts.className);
            this.dom.container.addClass(this.customPaneSettings !== null && this.customPaneSettings.className !== undefined
                ? this.customPaneSettings.className
                : '');
            // Set the value of name incase ordering is desired
            if (this.s.colOpts.name !== undefined) {
                this.s.name = this.s.colOpts.name;
            }
            else if (this.customPaneSettings !== null && this.customPaneSettings.name !== undefined) {
                this.s.name = this.customPaneSettings.name;
            }
            else {
                this.s.name = this.colExists ?
                    $(table.column(this.s.index).header()).text() :
                    this.customPaneSettings.header || 'Custom Pane';
            }
            $(panesContainer).append(this.dom.container);
            var tableNode = table.table(0).node();
            // Custom search function for table
            this.s.searchFunction = function (settings, searchData, dataIndex, origData) {
                // If no data has been selected then show all
                if (_this.selections.length === 0) {
                    return true;
                }
                if (settings.nTable !== tableNode) {
                    return true;
                }
                var filter = null;
                if (_this.colExists) {
                    // Get the current filtered data
                    filter = searchData[_this.s.index];
                    if (colOpts.orthogonal.filter !== 'filter') {
                        // get the filter value from the map
                        filter = _this.s.rowData.filterMap.get(dataIndex);
                        if (filter instanceof $.fn.dataTable.Api) {
                            // eslint-disable-next-line no-extra-parens
                            filter = filter.toArray();
                        }
                    }
                }
                return _this._search(filter, dataIndex);
            };
            $.fn.dataTable.ext.search.push(this.s.searchFunction);
            // If the clear button for this pane is clicked clear the selections
            if (this.c.clear) {
                clear.on('click', function () {
                    var searches = _this.dom.container.find('.' + _this.classes.search.replace(/\s+/g, '.'));
                    searches.each(function () {
                        $(this).val('');
                        $(this).trigger('input');
                    });
                    _this.clearPane();
                });
            }
            // Sometimes the top row of the panes containing the search box and ordering buttons appears
            //  weird if the width of the panes is lower than expected, this fixes the design.
            // Equally this may occur when the table is resized.
            table.on('draw.dtsp', function () {
                _this.adjustTopRow();
            });
            table.on('buttons-action', function () {
                _this.adjustTopRow();
            });
            // When column-reorder is present and the columns are moved, it is necessary to
            //  reassign all of the panes indexes to the new index of the column.
            table.on('column-reorder.dtsp', function (e, settings, details) {
                _this.s.index = details.mapping[_this.s.index];
            });
            return this;
        }
        /**
         * Adds a row to the panes table
         *
         * @param display the value to be displayed to the user
         * @param filter the value to be filtered on when searchpanes is implemented
         * @param shown the number of rows in the table that are currently visible matching this criteria
         * @param total the total number of rows in the table that match this criteria
         * @param sort the value to be sorted in the pane table
         * @param type the value of which the type is to be derived from
         */
        SearchPane.prototype.addRow = function (display, filter, shown, total, sort, type, className) {
            var index;
            for (var _i = 0, _a = this.s.indexes; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.filter === filter) {
                    index = entry.index;
                }
            }
            if (index === undefined) {
                index = this.s.indexes.length;
                this.s.indexes.push({ filter: filter, index: index });
            }
            return this.s.dtPane.row.add({
                className: className,
                display: display !== '' ?
                    display :
                    this.emptyMessage(),
                filter: filter,
                index: index,
                shown: shown,
                sort: sort,
                total: total,
                type: type
            });
        };
        /**
         * Adjusts the layout of the top row when the screen is resized
         */
        SearchPane.prototype.adjustTopRow = function () {
            var subContainers = this.dom.container.find('.' + this.classes.subRowsContainer.replace(/\s+/g, '.'));
            var subRow1 = this.dom.container.find('.' + this.classes.subRow1.replace(/\s+/g, '.'));
            var subRow2 = this.dom.container.find('.' + this.classes.subRow2.replace(/\s+/g, '.'));
            var topRow = this.dom.container.find('.' + this.classes.topRow.replace(/\s+/g, '.'));
            // If the width is 0 then it is safe to assume that the pane has not yet been displayed.
            //  Even if it has, if the width is 0 it won't make a difference if it has the narrow class or not
            if (($(subContainers[0]).width() < 252 || $(topRow[0]).width() < 252) && $(subContainers[0]).width() !== 0) {
                $(subContainers[0]).addClass(this.classes.narrow);
                $(subRow1[0]).addClass(this.classes.narrowSub).removeClass(this.classes.narrowSearch);
                $(subRow2[0]).addClass(this.classes.narrowSub).removeClass(this.classes.narrowButton);
            }
            else {
                $(subContainers[0]).removeClass(this.classes.narrow);
                $(subRow1[0]).removeClass(this.classes.narrowSub).addClass(this.classes.narrowSearch);
                $(subRow2[0]).removeClass(this.classes.narrowSub).addClass(this.classes.narrowButton);
            }
        };
        /**
         * In the case of a rebuild there is potential for new data to have been included or removed
         * so all of the rowData must be reset as a precaution.
         */
        SearchPane.prototype.clearData = function () {
            this.s.rowData = {
                arrayFilter: [],
                arrayOriginal: [],
                arrayTotals: [],
                bins: {},
                binsOriginal: {},
                binsTotal: {},
                filterMap: new Map(),
                totalOptions: 0
            };
        };
        /**
         * Clear the selections in the pane
         */
        SearchPane.prototype.clearPane = function () {
            // Deselect all rows which are selected and update the table and filter count.
            this.s.dtPane.rows({ selected: true }).deselect();
            this.updateTable();
            return this;
        };
        /**
         * Collapses the pane so that only the header is displayed
         */
        SearchPane.prototype.collapse = function () {
            var _this = this;
            if (!this.s.displayed ||
                (!this.c.collapse && this.s.colOpts.collapse !== true ||
                    this.s.colOpts.collapse === false)) {
                return;
            }
            this.dom.collapseButton.addClass(this.classes.rotated);
            $(this.s.dtPane.table().container()).addClass(this.classes.hidden);
            this.dom.topRow.addClass(this.classes.bordered);
            this.dom.countButton.addClass(this.classes.disabledButton);
            this.dom.nameButton.addClass(this.classes.disabledButton);
            this.dom.searchButton.addClass(this.classes.disabledButton);
            this.dom.topRow.one('click', function () {
                _this.show();
            });
        };
        /**
         * Strips all of the SearchPanes elements from the document and turns all of the listeners for the buttons off
         */
        SearchPane.prototype.destroy = function () {
            if (this.s.dtPane !== undefined) {
                this.s.dtPane.off('.dtsp');
            }
            this.dom.nameButton.off('.dtsp');
            this.dom.collapseButton.off('.dtsp');
            this.dom.countButton.off('.dtsp');
            this.dom.clear.off('.dtsp');
            this.dom.searchButton.off('.dtsp');
            this.dom.container.remove();
            var searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.searchFunction);
            while (searchIdx !== -1) {
                $.fn.dataTable.ext.search.splice(searchIdx, 1);
                searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.searchFunction);
            }
            // If the datatables have been defined for the panes then also destroy these
            if (this.s.dtPane !== undefined) {
                this.s.dtPane.destroy();
            }
            this.s.listSet = false;
        };
        /**
         * Getting the legacy message is a little complex due a legacy parameter
         */
        SearchPane.prototype.emptyMessage = function () {
            var def = this.c.i18n.emptyMessage;
            // Legacy parameter support
            if (this.c.emptyMessage) {
                def = this.c.emptyMessage;
            }
            // Override per column
            if (this.s.colOpts.emptyMessage !== false && this.s.colOpts.emptyMessage !== null) {
                def = this.s.colOpts.emptyMessage;
            }
            return this.s.dt.i18n('searchPanes.emptyMessage', def);
        };
        /**
         * Updates the number of filters that have been applied in the title
         */
        SearchPane.prototype.getPaneCount = function () {
            return this.s.dtPane !== undefined ?
                this.s.dtPane.rows({ selected: true }).data().toArray().length :
                0;
        };
        /**
         * Rebuilds the panes from the start having deleted the old ones
         {for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},ct=function(){function t(t){this.init(t)}return t.prototype.init=function(t){this.root={x:0,y:0,w:t}},t.prototype.fit=function(t){var e,n,r,i=t.length,o=i>0?t[0].h:0;for(this.root.h=o,e=0;e<i;e++)r=t[e],(n=this.findNode(this.root,r.w,r.h))?r.fit=this.splitNode(n,r.w,r.h):r.fit=this.growDown(r.w,r.h)},t.prototype.findNode=function(t,e,n){return t.used?this.findNode(t.right,e,n)||this.findNode(t.down,e,n):e<=t.w&&n<=t.h?t:null},t.prototype.splitNode=function(t,e,n){return t.used=!0,t.down={x:t.x,y:t.y+n,w:t.w,h:t.h-n},t.right={x:t.x+e,y:t.y,w:t.w-e,h:n},t},t.prototype.growDown=function(t,e){var n;return this.root={used:!0,x:0,y:0,w:this.root.w,h:this.root.h+e,down:{x:0,y:this.root.h,w:this.root.w,h:e},right:this.root},(n=this.findNode(this.root,t,e))?this.splitNode(n,t,e):null},t}(),lt=ot()(function(t,e,n){var r=n.gutterPixels,o=n.layout;if(!e.length)return{containerHeight:0,itemsPositions:[]};switch(o){case i.HORIZONTAL:return function(t,e){return{containerHeight:Math.max.apply(Math,t.map(function(t){return t.height}))+2*e,itemsPositions:t.map(function(n,r){return{left:st(t.slice(0,r),e),top:0}})}}(e,r);case i.VERTICAL:return function(t,e){return{containerHeight:at(t,e)+e,itemsPositions:t.map(function(n,r){return{left:0,top:at(t.slice(0,r),e)}})}}(e,r);case i.SAME_HEIGHT:return function(t,e,n){var r=e.map(function(t,r){var i=t.width;return e.slice(0,r).reduce(function(t,e){return t+e.width+2*n},0)+i+n}),i=r.reduce(function(e,n,r){var i,o=Object.keys(e).length;return ut({},e,n>t*o&&((i={})[o]=r,i))},{0:0}),o=e.map(function(o,s){var a=o.height,u=Math.floor(r[s]/t);return{left:e.slice(i[u],s).reduce(function(t,e){return t+e.width+n},0),top:(a+n)*u}});return{containerHeight:Object.keys(i).length*(e[0].height+n)+n,itemsPositions:o}}(t,e,r);case i.SAME_WIDTH:return function(t,e,n){var r=Math.floor(t/(e[0].width+n)),i=e.map(function(t,i){var o=t.width,s=Math.floor(i/r);return{left:(i-r*s)*(o+n),top:e.slice(0,i).filter(function(t,e){return(i-e)%r==0}).reduce(function(t,e){return t+e.height+n},0)}}),o=e.reduce(function(t,e,i){var o=e.height,s=Math.floor(i/r);return t[i-r*s]+=o+n,t},Array.apply(null,Array(r)).map(Number.prototype.valueOf,0));return{containerHeight:Math.max.apply(Math,o)+n,itemsPositions:i}}(t,e,r);case i.PACKED:return function(t,e,n){var r=new ct(t),i=e.map(function(t){var e=t.width,r=t.height;return{w:e+n,h:r+n}});r.fit(i);var o=i.map(function(t){var e=t.fit;return{left:e.x,top:e.y}});return{containerHeight:r.root.h+n,itemsPositions:o}}(t,e,r);case i.SAME_SIZE:default:return function(t,e,n){var r=Math.floor(t/(e[0].width+n)),i=e.map(function(t,e){var i=t.width,o=t.height,s=Math.floor(e/r);return{left:(e-r*s)*(i+n),top:s*(o+n)}});return{containerHeight:Math.ceil(e.length/r)*(e[0].height+n)+n,itemsPositions:i}}(t,e,r)}});function ft(t){if(!t)throw new Error("Filterizr as a jQuery plugin, requires jQuery to work. If you would prefer to use the vanilla JS version, please use the correct bundle file.");t.fn.filterizr=function(){var e="."+t.trim(this.get(0).className).replace(/\s+/g,"."),n=arguments;if(!this._fltr&&0===n.length||1===n.length&&"object"==typeof n[0]){var r=n.length>0?n[0]:v;this._fltr=new yt(e,r)}else if(n.length>=1&&"string"==typeof n[0]){var i=n[0],o=Array.prototype.slice.call(n,1),s=this._fltr;switch(i){case"filter":return s.filter.apply(s,o),this;case"insertItem":return s.insertItem.apply(s,o),this;case"removeItem":return s.removeItem.apply(s,o),this;case"toggleFilter":return s.toggleFilter.apply(s,o),this;case"sort":return s.sort.apply(s,o),this;case"shuffle":return s.shuffle.apply(s,o),this;case"search":return s.search.apply(s,o),this;case"setOptions":return s.setOptions.apply(s,o),this;case"destroy":return s.destroy.apply(s,o),delete this._fltr,this;default:throw new Error("Filterizr: "+i+" is not part of the Filterizr API. Please refer to the docs for more information.")}}return this}}var ht=function(t,e,n,r){return new(n||(n=Promise))(function(i,o){function s(t){try{u(r.next(t))}catch(t){o(t)}}function a(t){try{u(r.throw(t))}catch(t){o(t)}}function u(t){t.done?i(t.value):new n(function(e){e(t.value)}).then(s,a)}u((r=r.apply(t,e||[])).next())})},pt=function(t,e){var n,r,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,r=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(i=(i=s.trys).length>0&&i[i.length-1])&&(6===o[0]||2===o[0])){s=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){s.label=o[1];break}if(6===o[0]&&s.label<i[1]){s.label=i[1],i=o;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(o);break}i[2]&&s.ops.pop(),s.trys.pop();continue}o=e.call(t,s)}catch(t){o=[6,t],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}},dt=n(1),yt=function(){function t(t,e){void 0===t&&(t=".filtr-container"),void 0===e&&(e={}),this.options=new b(e);var n=this.options,r=n.areControlsEnabled,i=n.controlsSelector,o=n.isSpinnerEnabled;this.windowEventReceiver=new y(window),this.filterContainer=new V(c(t),this.options),this.imagesHaveLoaded=!this.filterContainer.node.querySelectorAll("img").length,r&&(this.filterControls=new w(this,i)),o&&(this.spinner=new rt(this.filterContainer,this.options)),this.initialize()}return Object.defineProperty(t.prototype,"filterItems",{get:function(){return this.filterContainer.filterItems},enumerable:!0,configurable:!0}),t.prototype.filter=function(t){var e=this.filterContainer;e.trigger("filteringStart"),e.filterizrState=r.FILTERING,t=Array.isArray(t)?t.map(function(t){return t.toString()}):t.toString(),this.options.filter=t,this.render()},t.prototype.destroy=function(){var t=this.windowEventReceiver,e=this.filterControls;this.filterContainer.destroy(),t.destroy(),this.options.areControlsEnabled&&e&&e.destroy()},t.prototype.insertItem=function(t){return ht(this,void 0,void 0,function(){return pt(this,function(e){switch(e.label){case 0:return this.filterContainer.insertItem(t),[4,this.waitForImagesToLoad()];case 1:return e.sent(),this.render(),[2]}})})},t.prototype.removeItem=function(t){this.filterContainer.removeItem(t),this.render()},t.prototype.sort=function(t,e){void 0===t&&(t="index"),void 0===e&&(e="asc");var n=this.filterContainer,i=this.filterItems;n.trigger("sortingStart"),n.filterizrState=r.SORTING,i.sort(t,e),this.render()},t.prototype.search=function(t){void 0===t&&(t=this.options.get().searchTerm),this.options.searchTerm=t.toLowerCase(),this.render()},t.prototype.shuffle=function(){var t=this.filterContainer,e=this.filterItems;t.trigger("shufflingStart"),t.filterizrState=r.SHUFFLING,e.shuffle(),this.render()},t.prototype.setOptions=function(t){var e=this.filterContainer,n=this.filterItems,r="animationDuration"in t||"delay"in t||"delayMode"in t;(t.callbacks||r)&&e.unbindEvents(),this.options.set(t),(t.easing||r)&&n.styles.updateTransitionStyle(),(t.callbacks||r)&&e.bindEvents(),"searchTerm"in t&&this.search(t.searchTerm),("filter"in t||"multifilterLomultifilterLogicalOperator"in t)&&this.filter(this.options.filter),"gutterPixels"in t&&(this.filterContainer.styles.updatePaddings(),this.filterItems.styles.updateWidthWithTransitionsDisabled(),this.render())},t.prototype.toggleFilter=function(t){this.options.toggleFilter(t),this.filter(this.options.filter)},t.prototype.render=function(){var t=this.filterContainer,e=this.filterItems,n=this.options,r=e.getFiltered(n.filter);e.styles.resetDisplay(),e.getFilteredOut(n.filter).forEach(function(t){t.filterOut()});var i=lt(t.dimensions.width,r.map(function(t){return t.dimensions}),this.options.get()),o=i.containerHeight,s=i.itemsPositions;t.setHeight(o),r.forEach(function(t,e){t.filterIn(s[e])})},t.prototype.initialize=function(){return ht(this,void 0,void 0,function(){var t,e,n,r;return pt(this,function(i){switch(i.label){case 0:return e=(t=this).filterContainer,n=t.filterItems,r=t.spinner,this.bindEvents(),[4,this.waitForImagesToLoad()];case 1:return i.sent(),this.options.isSpinnerEnabled?[4,r.destroy()]:[3,3];case 2:i.sent(),i.label=3;case 3:return this.render(),[4,n.styles.enableTransitions()];case 4:return i.sent(),e.trigger("init"),[2]}})})},t.prototype.bindEvents=function(){var t=this,e=this.filterItems;this.windowEventReceiver.on("resize",a(function(){e.styles.updateWidthWithTransitionsDisabled(),t.render()},50,!1))},t.prototype.waitForImagesToLoad=function(){return ht(this,void 0,void 0,function(){var t,e,n,r=this;return pt(this,function(i){return e=(t=this).imagesHaveLoaded,n=t.filterContainer,e?[2,Promise.resolve()]:[2,new Promise(function(t){dt(n.node,function(){r.imagesHaveLoaded=!0,t()})})]})})},t.FilterContainer=V,t.FilterItem=N,t.defaultOptions=v,t.installAsJQueryPlugin=ft,t}();n.d(e,"a",function(){return yt})},function(t,e,n){var r,i;
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
!function(o,s){"use strict";r=[n(3)],void 0===(i=function(t){return function(t,e){var n=t.jQuery,r=t.console;function i(t,e){for(var n in e)t[n]=e[n];return t}var o=Array.prototype.slice;function s(t,e,a){if(!(this instanceof s))return new s(t,e,a);var u=t;"string"==typeof t&&(u=document.querySelectorAll(t)),u?(this.elements=function(t){if(Array.isArray(t))return t;if("object"==typeof t&&"number"==typeof t.length)return o.call(t);return[t]}(u),this.options=i({},this.options),"function"==typeof e?a=e:i(this.options,e),a&&this.on("always",a),this.getImages(),n&&(this.jqDeferred=new n.Deferred),setTimeout(this.check.bind(this))):r.error("Bad element for imagesLoaded "+(u||t))}s.prototype=Object.create(e.prototype),s.prototype.options={},s.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},s.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),!0===this.options.background&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&a[e]){for(var n=t.querySelectorAll("img"),r=0;r<n.length;r++){var i=n[r];this.addImage(i)}if("string"==typeof this.options.background){var o=t.querySelectorAll(this.options.background);for(r=0;r<o.length;r++){var s=o[r];this.addElementBackgroundImages(s)}}}};var a={1:!0,9:!0,11:!0};function u(t){this.img=t}function c(t,e){this.url=t,this.element=e,this.img=new Image}return s.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var n=/url\((['"])?(.*?)\1\)/gi,r=n.exec(e.backgroundImage);null!==r;){var i=r&&r[2];i&&this.addBackground(i,t),r=n.exec(e.backgroundImage)}},s.prototype.addImage=function(t){var e=new u(t);this.images.push(e)},s.prototype.addBackground=function(t,e){var n=new c(t,e);this.images.push(n)},s.prototype.check=function(){var t=this;function e(e,n,r){setTimeout(function(){t.progress(e,n,r)})}this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?this.images.forEach(function(t){t.once("progress",e),t.check()}):this.complete()},s.prototype.progress=function(t,e,n){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&r&&r.log("progress: "+n,t,e)},s.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},u.prototype=Object.create(e.prototype),u.prototype.check=function(){this.getIsImageComplete()?this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.proxyImage.src=this.img.src)},u.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},u.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},u.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},u.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},u.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},u.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},c.prototype=Object.create(u.prototype),c.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url,this.getIsImageComplete()&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},c.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},c.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},s.makeJQueryPlugin=function(e){(e=e||t.jQuery)&&((n=e).fn.imagesLoaded=function(t,e){return new s(this,t,e).jqDeferred.promise(n(this))})},s.makeJQueryPlugin(),s}(o,t)}.apply(e,r))||(t.exports=i)}("undefined"!=typeof window?window:this)},function(t,e){function n(t,e,n,r){var i,o=null==(i=r)||"number"==typeof i||"boolean"==typeof i?r:n(r),s=e.get(o);return void 0===s&&(s=t.call(this,r),e.set(o,s)),s}function r(t,e,n){var r=Array.prototype.slice.call(arguments,3),i=n(r),o=e.get(i);return void 0===o&&(o=t.apply(this,r),e.set(i,o)),o}function i(t,e,n,r,i){return n.bind(e,t,r,i)}function o(t,e){return i(t,this,1===t.length?n:r,e.cache.create(),e.serializer)}function s(){return JSON.stringify(arguments)}function a(){this.cache=Object.create(null)}a.prototype.has=function(t){return t in this.cache},a.prototype.get=function(t){return this.cache[t]},a.prototype.set=function(t,e){this.cache[t]=e};var u={create:function(){return new a}};t.exports=function(t,e){var n=e&&e.cache?e.cache:u,r=e&&e.serializer?e.serializer:s;return(e&&e.strategy?e.strategy:o)(t,{cache:n,serializer:r})},t.exports.strategies={variadic:function(t,e){return i(t,this,r,e.cache.create(),e.serializer)},monadic:function(t,e){return i(t,this,n,e.cache.create(),e.serializer)}}},function(t,e,n){var r,i;"undefined"!=typeof window&&window,void 0===(i="function"==typeof(r=function(){"use strict";function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var n=this._events=this._events||{},r=n[t]=n[t]||[];return-1==r.indexOf(e)&&r.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var n=this._onceEvents=this._onceEvents||{};return(n[t]=n[t]||{})[e]=!0,this}},e.off=function(t,e){var n=this._events&&this._events[t];if(n&&n.length){var r=n.indexOf(e);return-1!=r&&n.splice(r,1),this}},e.emitEvent=function(t,e){var n=this._events&&this._events[t];if(n&&n.length){n=n.slice(0),e=e||[];for(var r=this._onceEvents&&this._onceEvents[t],i=0;i<n.length;i++){var o=n[i];r&&r[o]&&(this.off(t,o),delete r[o]),o.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t})?r.call(e,n,e,t):r)||(t.exports=i)},function(t,e,n){"use strict";n.r(e);var r,i=n(0);
/**
 * Filterizr is a JavaScript library that sorts, shuffles and applies stunning filters over
 * responsive galleries using CSS3 transitions and custom CSS effects.
 *
 * @author Yiotis Kaltsikis
 * @see {@link http://yiotis.net/filterizr}
 * @license MIT
 */
/**
 * Filterizr is a JavaScript library that sorts, shuffles and applies stunning filters over
 * responsive galleries using CSS3 transitions and custom CSS effects.
 *
 * @author Yiotis Kaltsikis
 * @see {@link http://yiotis.net/filterizr}
 * @license MIT
 */
r=window.jQuery,i.a.installAsJQueryPlugin(rpace-barber-shop-primary .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-primary .pace .pace-progress::after {\n  color: rgba(0, 123, 255, 0.2);\n}\n\n.pace-bounce-primary .pace .pace-activity {\n  background: #007bff;\n}\n\n.pace-center-atom-primary .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-primary .pace-progress::before {\n  background: #007bff;\n  color: #fff;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-primary .pace-activity {\n  border-color: #007bff;\n}\n\n.pace-center-atom-primary .pace-activity::after, .pace-center-atom-primary .pace-activity::before {\n  border-color: #007bff;\n}\n\n.pace-center-circle-primary .pace .pace-progress {\n  background: rgba(0, 123, 255, 0.8);\n  color: #fff;\n}\n\n.pace-center-radar-primary .pace .pace-activity {\n  border-color: #007bff transparent transparent;\n}\n\n.pace-center-radar-primary .pace .pace-activity::before {\n  border-color: #007bff transparent transparent;\n}\n\n.pace-center-simple-primary .pace {\n  background: #fff;\n  border-color: #007bff;\n}\n\n.pace-center-simple-primary .pace .pace-progress {\n  background: #007bff;\n}\n\n.pace-material-primary .pace {\n  color: #007bff;\n}\n\n.pace-corner-indicator-primary .pace .pace-activity {\n  background: #007bff;\n}\n\n.pace-corner-indicator-primary .pace .pace-activity::after,\n.pace-corner-indicator-primary .pace .pace-activity::before {\n  border: 5px solid #fff;\n}\n\n.pace-corner-indicator-primary .pace .pace-activity::before {\n  border-right-color: rgba(0, 123, 255, 0.2);\n  border-left-color: rgba(0, 123, 255, 0.2);\n}\n\n.pace-corner-indicator-primary .pace .pace-activity::after {\n  border-top-color: rgba(0, 123, 255, 0.2);\n  border-bottom-color: rgba(0, 123, 255, 0.2);\n}\n\n.pace-fill-left-primary .pace .pace-progress {\n  background-color: rgba(0, 123, 255, 0.2);\n}\n\n.pace-flash-primary .pace .pace-progress {\n  background: #007bff;\n}\n\n.pace-flash-primary .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #007bff, 0 0 5px #007bff;\n}\n\n.pace-flash-primary .pace .pace-activity {\n  border-top-color: #007bff;\n  border-left-color: #007bff;\n}\n\n.pace-loading-bar-primary .pace .pace-progress {\n  background: #007bff;\n  color: #007bff;\n  box-shadow: 120px 0 #fff, 240px 0 #fff;\n}\n\n.pace-loading-bar-primary .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #007bff, inset 0 0 0 7px #fff;\n}\n\n.pace-mac-osx-primary .pace .pace-progress {\n  background-color: #007bff;\n  box-shadow: inset -1px 0 #007bff, inset 0 -1px #007bff, inset 0 2px rgba(255, 255, 255, 0.5), inset 0 6px rgba(255, 255, 255, 0.3);\n}\n\n.pace-mac-osx-primary .pace .pace-activity {\n  background-image: radial-gradient(rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-primary .pace-progress {\n  color: #007bff;\n}\n\n.pace-secondary .pace .pace-progress {\n  background: #6c757d;\n}\n\n.pace-barber-shop-secondary .pace {\n  background: #fff;\n}\n\n.pace-barber-shop-secondary .pace .pace-progress {\n  background: #6c757d;\n}\n\n.pace-barber-shop-secondary .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-secondary .pace .pace-progress::after {\n  color: rgba(108, 117, 125, 0.2);\n}\n\n.pace-bounce-secondary .pace .pace-activity {\n  background: #6c757d;\n}\n\n.pace-center-atom-secondary .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-secondary .pace-progress::before {\n  background: #6c757d;\n  color: #fff;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-secondary .pace-activity {\n  border-color: #6c757d;\n}\n\n.pace-center-atom-secondary .pace-activity::after, .pace-center-atom-secondary .pace-activity::before {\n  border-color: #6c757d;\n}\n\n.pace-center-circle-secondary .pace .pace-progress {\n  background: rgba(108, 117, 125, 0.8);\n  color: #fff;\n}\n\n.pace-center-radar-secondary .pace .pace-activity {\n  border-color: #6c757d transparent transparent;\n}\n\n.pace-center-radar-secondary .pace .pace-activity::before {\n  border-color: #6c757d transparent transparent;\n}\n\n.pace-center-simple-secondary .pace {\n  background: #fff;\n  border-color: #6c757d;\n}\n\n.pace-center-simple-secondary .pace .pace-progress {\n  background: #6c757d;\n}\n\n.pace-material-secondary .pace {\n  color: #6c757d;\n}\n\n.pace-corner-indicator-secondary .pace .pace-activity {\n  background: #6c757d;\n}\n\n.pace-corner-indicator-secondary .pace .pace-activity::after,\n.pace-corner-indicator-secondary .pace .pace-activity::before {\n  border: 5px solid #fff;\n}\n\n.pace-corner-indicator-secondary .pace .pace-activity::before {\n  border-right-color: rgba(108, 117, 125, 0.2);\n  border-left-color: rgba(108, 117, 125, 0.2);\n}\n\n.pace-corner-indicator-secondary .pace .pace-activity::after {\n  border-top-color: rgba(108, 117, 125, 0.2);\n  border-bottom-color: rgba(108, 117, 125, 0.2);\n}\n\n.pace-fill-left-secondary .pace .pace-progress {\n  background-color: rgba(108, 117, 125, 0.2);\n}\n\n.pace-flash-secondary .pace .pace-progress {\n  background: #6c757d;\n}\n\n.pace-flash-secondary .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #6c757d, 0 0 5px #6c757d;\n}\n\n.pace-flash-secondary .pace .pace-activity {\n  border-top-color: #6c757d;\n  border-left-color: #6c757d;\n}\n\n.pace-loading-bar-secondary .pace .pace-progress {\n  background: #6c757d;\n  color: #6c757d;\n  box-shadow: 120px 0 #fff, 240px 0 #fff;\n}\n\n.pace-loading-bar-secondary .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #6c757d, inset 0 0 0 7px #fff;\n}\n\n.pace-mac-osx-secondary .pace .pace-progress {\n  background-color: #6c757d;\n  box-shadow: inset -1px 0 #6c757d, inset 0 -1px #6c757d, inset 0 2px rgba(255, 255, 255, 0.5), inset 0 6px rgba(255, 255, 255, 0.3);\n}\n\n.pace-mac-osx-secondary .pace .pace-activity {\n  background-image: radial-gradient(rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-secondary .pace-progress {\n  color: #6c757d;\n}\n\n.pace-success .pace .pace-progress {\n  background: #28a745;\n}\n\n.pace-barber-shop-success .pace {\n  background: #fff;\n}\n\n.pace-barber-shop-success .pace .pace-progress {\n  background: #28a745;\n}\n\n.pace-barber-shop-success .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-success .pace .pace-progress::after {\n  color: rgba(40, 167, 69, 0.2);\n}\n\n.pace-bounce-success .pace .pace-activity {\n  background: #28a745;\n}\n\n.pace-center-atom-success .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-success .pace-progress::before {\n  background: #28a745;\n  color: #fff;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-success .pace-activity {\n  border-color: #28a745;\n}\n\n.pace-center-atom-success .pace-activity::after, .pace-center-atom-success .pace-activity::before {\n  border-color: #28a745;\n}\n\n.pace-center-circle-success .pace .pace-progress {\n  background: rgba(40, 167, 69, 0.8);\n  color: #fff;\n}\n\n.pace-center-radar-success .pace .pace-activity {\n  border-color: #28a745 transparent transparent;\n}\n\n.pace-center-radar-success .pace .pace-activity::before {\n  border-color: #28a745 transparent transparent;\n}\n\n.pace-center-simple-success .pace {\n  background: #fff;\n  border-color: #28a745;\n}\n\n.pace-center-simple-success .pace .pace-progress {\n  background: #28a745;\n}\n\n.pace-material-success .pace {\n  color: #28a745;\n}\n\n.pace-corner-indicator-success .pace .pace-activity {\n  background: #28a745;\n}\n\n.pace-corner-indicator-success .pace .pace-activity::after,\n.pace-corner-indicator-success .pace .pace-activity::before {\n  border: 5px solid #fff;\n}\n\n.pace-corner-indicator-success .pace .pace-activity::before {\n  border-right-color: rgba(40, 167, 69, 0.2);\n  border-left-color: rgba(40, 167, 69, 0.2);\n}\n\n.pace-corner-indicator-success .pace .pace-activity::after {\n  border-top-color: rgba(40, 167, 69, 0.2);\n  border-bottom-color: rgba(40, 167, 69, 0.2);\n}\n\n.pace-fill-left-success .pace .pace-progress {\n  background-color: rgba(40, 167, 69, 0.2);\n}\n\n.pace-flash-success .pace .pace-progress {\n  background: #28a745;\n}\n\n.pace-flash-success .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #28a745, 0 0 5px #28a745;\n}\n\n.pace-flash-success .pace .pace-activity {\n  border-top-color: #28a745;\n  border-left-color: #28a745;\n}\n\n.pace-loading-bar-success .pace .pace-progress {\n  background: #28a745;\n  color: #28a745;\n  box-shadow: 120px 0 #fff, 240px 0 #fff;\n}\n\n.pace-loading-bar-success .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #28a745, inset 0 0 0 7px #fff;\n}\n\n.pace-mac-osx-success .pace .pace-progress {\n  background-color: #28a745;\n  box-shadow: inset -1px 0 #28a745, inset 0 -1px #28a745, inset 0 2px rgba(255, 255, 255, 0.5), inset 0 6px rgba(255, 255, 255, 0.3);\n}\n\n.pace-mac-osx-success .pace .pace-activity {\n  background-image: radial-gradient(rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-success .pace-progress {\n  color: #28a745;\n}\n\n.pace-info .pace .pace-progress {\n  background: #17a2b8;\n}\n\n.pace-barber-shop-info .pace {\n  background: #fff;\n}\n\n.pace-barber-shop-info .pace .pace-progress {\n  background: #17a2b8;\n}\n\n.pace-barber-shop-info .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-info .pace .pace-progress::after {\n  color: rgba(23, 162, 184, 0.2);\n}\n\n.pace-bounce-info .pace .pace-activity {\n  background: #17a2b8;\n}\n\n.pace-center-atom-info .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-info .pace-progress::before {\n  background: #17a2b8;\n  color: #fff;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-info .pace-activity {\n  border-color: #17a2b8;\n}\n\n.pace-center-atom-info .pace-activity::after, .pace-center-atom-info .pace-activity::before {\n  border-color: #17a2b8;\n}\n\n.pace-center-circle-info .pace .pace-progress {\n  background: rgba(23, 162, 184, 0.8);\n  color: #fff;\n}\n\n.pace-center-radar-info .pace .pace-activity {\n  border-color: #17a2b8 transparent transparent;\n}\n\n.pace-center-radar-info .pace .pace-activity::before {\n  border-color: #17a2b8 transparent transparent;\n}\n\n.pace-center-simple-info .pace {\n  background: #fff;\n  border-color: #17a2b8;\n}\n\n.pace-center-simple-info .pace .pace-progress {\n  background: #17a2b8;\n}\n\n.pace-material-info .pace {\n  color: #17a2b8;\n}\n\n.pace-corner-indicator-info .pace .pace-activity {\n  background: #17a2b8;\n}\n\n.pace-corner-indicator-info .pace .pace-activity::after,\n.pace-corner-indicator-info .pace .pace-activity::before {\n  border: 5px solid #fff;\n}\n\n.pace-corner-indicator-info .pace .pace-activity::before {\n  border-right-color: rgba(23, 162, 184, 0.2);\n  border-left-color: rgba(23, 162, 184, 0.2);\n}\n\n.pace-corner-indicator-info .pace .pace-activity::after {\n  border-top-color: rgba(23, 162, 184, 0.2);\n  border-bottom-color: rgba(23, 162, 184, 0.2);\n}\n\n.pace-fill-left-info .pace .pace-progress {\n  background-color: rgba(23, 162, 184, 0.2);\n}\n\n.pace-flash-info .pace .pace-progress {\n  background: #17a2b8;\n}\n\n.pace-flash-info .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #17a2b8, 0 0 5px #17a2b8;\n}\n\n.pace-flash-info .pace .pace-activity {\n  border-top-color: #17a2b8;\n  border-left-color: #17a2b8;\n}\n\n.pace-loading-bar-info .pace .pace-progress {\n  background: #17a2b8;\n  color: #17a2b8;\n  box-shadow: 120px 0 #fff, 240px 0 #fff;\n}\n\n.pace-loading-bar-info .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #17a2b8, inset 0 0 0 7px #fff;\n}\n\n.pace-mac-osx-info .pace .pace-progress {\n  background-color: #17a2b8;\n  box-shadow: inset -1px 0 #17a2b8, inset 0 -1px #17a2b8, inset 0 2px rgba(255, 255, 255, 0.5), inset 0 6px rgba(255, 255, 255, 0.3);\n}\n\n.pace-mac-osx-info .pace .pace-activity {\n  background-image: radial-gradient(rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-info .pace-progress {\n  color: #17a2b8;\n}\n\n.pace-warning .pace .pace-progress {\n  background: #ffc107;\n}\n\n.pace-barber-shop-warning .pace {\n  background: #1f2d3d;\n}\n\n.pace-barber-shop-warning .pace .pace-progress {\n  background: #ffc107;\n}\n\n.pace-barber-shop-warning .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(31, 45, 61, 0.2) 25%, transparent 25%, transparent 50%, rgba(31, 45, 61, 0.2) 50%, rgba(31, 45, 61, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-warning .pace .pace-progress::after {\n  color: rgba(255, 193, 7, 0.2);\n}\n\n.pace-bounce-warning .pace .pace-activity {\n  background: #ffc107;\n}\n\n.pace-center-atom-warning .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-warning .pace-progress::before {\n  background: #ffc107;\n  color: #1f2d3d;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-warning .pace-activity {\n  border-color: #ffc107;\n}\n\n.pace-center-atom-warning .pace-activity::after, .pace-center-atom-warning .pace-activity::before {\n  border-color: #ffc107;\n}\n\n.pace-center-circle-warning .pace .pace-progress {\n  background: rgba(255, 193, 7, 0.8);\n  color: #1f2d3d;\n}\n\n.pace-center-radar-warning .pace .pace-activity {\n  border-color: #ffc107 transparent transparent;\n}\n\n.pace-center-radar-warning .pace .pace-activity::before {\n  border-color: #ffc107 transparent transparent;\n}\n\n.pace-center-simple-warning .pace {\n  background: #1f2d3d;\n  border-color: #ffc107;\n}\n\n.pace-center-simple-warning .pace .pace-progress {\n  background: #ffc107;\n}\n\n.pace-material-warning .pace {\n  color: #ffc107;\n}\n\n.pace-corner-indicator-warning .pace .pace-activity {\n  background: #ffc107;\n}\n\n.pace-corner-indicator-warning .pace .pace-activity::after,\n.pace-corner-indicator-warning .pace .pace-activity::before {\n  border: 5px solid #1f2d3d;\n}\n\n.pace-corner-indicator-warning .pace .pace-activity::before {\n  border-right-color: rgba(255, 193, 7, 0.2);\n  border-left-color: rgba(255, 193, 7, 0.2);\n}\n\n.pace-corner-indicator-warning .pace .pace-activity::after {\n  border-top-color: rgba(255, 193, 7, 0.2);\n  border-bottom-color: rgba(255, 193, 7, 0.2);\n}\n\n.pace-fill-left-warning .pace .pace-progress {\n  background-color: rgba(255, 193, 7, 0.2);\n}\n\n.pace-flash-warning .pace .pace-progress {\n  background: #ffc107;\n}\n\n.pace-flash-warning .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #ffc107, 0 0 5px #ffc107;\n}\n\n.pace-flash-warning .pace .pace-activity {\n  border-top-color: #ffc107;\n  border-left-color: #ffc107;\n}\n\n.pace-loading-bar-warning .pace .pace-progress {\n  background: #ffc107;\n  color: #ffc107;\n  box-shadow: 120px 0 #1f2d3d, 240px 0 #1f2d3d;\n}\n\n.pace-loading-bar-warning .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #ffc107, inset 0 0 0 7px #1f2d3d;\n}\n\n.pace-mac-osx-warning .pace .pace-progress {\n  background-color: #ffc107;\n  box-shadow: inset -1px 0 #ffc107, inset 0 -1px #ffc107, inset 0 2px rgba(31, 45, 61, 0.5), inset 0 6px rgba(31, 45, 61, 0.3);\n}\n\n.pace-mac-osx-warning .pace .pace-activity {\n  background-image: radial-gradient(rgba(31, 45, 61, 0.65) 0%, rgba(31, 45, 61, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-warning .pace-progress {\n  color: #ffc107;\n}\n\n.pace-danger .pace .pace-progress {\n  background: #dc3545;\n}\n\n.pace-barber-shop-danger .pa-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.dark-mode .accent-light .nav-tabs .nav-link {\n  color: #f8f9fa;\n}\n\n.dark-mode .accent-light .btn-link:hover,\n.dark-mode .accent-light a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.dark-mode .accent-light .nav-tabs .nav-link:hover {\n  color: #cbd3da;\n}\n\n.dark-mode .accent-light .dropdown-item:active, .dark-mode .accent-light .dropdown-item.active {\n  background-color: #f8f9fa;\n  color: #1f2d3d;\n}\n\n.dark-mode .accent-light .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #f8f9fa;\n  border-color: #bdc6d0;\n}\n\n.dark-mode .accent-light .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.dark-mode .accent-light .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.dark-mode .accent-light .custom-select:focus,\n.dark-mode .accent-light .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.dark-mode .accent-light .custom-file-input:focus ~ .custom-file-label {\n  border-color: white;\n}\n\n.dark-mode .accent-light .page-item .page-link {\n  color: #f8f9fa;\n}\n\n.dark-mode .accent-light .page-item.active a,\n.dark-mode .accent-light .page-item.active .page-link {\n  background-color: #f8f9fa;\n  border-color: #f8f9fa;\n  color: #fff;\n}\n\n.dark-mode .accent-light .page-item.disabled a,\n.dark-mode .accent-light .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.dark-mode .accent-light [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.dark-mode .accent-light [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.dark-mode .accent-light [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.dark-mode .accent-light [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode .dark-mode.accent-light .page-item .page-link:hover, .dark-mode .dark-mode.accent-light .page-item .page-link:focus {\n  color: white;\n}\n\n.dark-mode .accent-dark .btn-link,\n.dark-mode .accent-dark a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.dark-mode .accent-dark .nav-tabs .nav-link {\n  color: #343a40;\n}\n\n.dark-mode .accent-dark .btn-link:hover,\n.dark-mode .accent-dark a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.dark-mode .accent-dark .nav-tabs .nav-link:hover {\n  color: #121416;\n}\n\n.dark-mode .accent-dark .dropdown-item:active, .dark-mode .accent-dark .dropdown-item.active {\n  background-color: #343a40;\n  color: #fff;\n}\n\n.dark-mode .accent-dark .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #343a40;\n  border-color: #060708;\n}\n\n.dark-mode .accent-dark .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.dark-mode .accent-dark .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.dark-mode .accent-dark .custom-select:focus,\n.dark-mode .accent-dark .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.dark-mode .accent-dark .custom-file-input:focus ~ .custom-file-label {\n  border-color: #6d7a86;\n}\n\n.dark-mode .accent-dark .page-item .page-link {\n  color: #343a40;\n}\n\n.dark-mode .accent-dark .page-item.active a,\n.dark-mode .accent-dark .page-item.active .page-link {\n  background-color: #343a40;\n  border-color: #343a40;\n  color: #fff;\n}\n\n.dark-mode .accent-dark .page-item.disabled a,\n.dark-mode .accent-dark .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.dark-mode .accent-dark [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.dark-mode .accent-dark [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.dark-mode .accent-dark [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.dark-mode .accent-dark [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode .dark-mode.accent-dark .page-item .page-link:hover, .dark-mode .dark-mode.accent-dark .page-item .page-link:focus {\n  color: #3f474e;\n}\n\n.dark-mode [class*=\"accent-\"] a.btn-primary {\n  color: #fff;\n}\n\n.dark-mode [class*=\"accent-\"] a.btn-secondary {\n  color: #fff;\n}\n\n.dark-mode [class*=\"accent-\"] a.btn-success {\n  color: #fff;\n}\n\n.dark-mode [class*=\"accent-\"] a.btn-info {\n  color: #fff;\n}\n\n.dark-mode [class*=\"accent-\"] a.btn-warning {\n  color: #1f2d3d;\n}\n\n.dark-mode [class*=\"accent-\"] a.btn-danger {\n  color: #fff;\n}\n\n.dark-mode [class*=\"accent-\"] a.btn-light {\n  color: #1f2d3d;\n}\n\n.dark-mode [class*=\"accent-\"] a.btn-dark {\n  color: #fff;\n}\n\n.dark-mode .accent-lightblue .btn-link,\n.dark-mode .accent-lightblue a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.dark-mode .accent-lightblue .nav-tabs .nav-link {\n  color: #86bad8;\n}\n\n.dark-mode .accent-lightblue .btn-link:hover,\n.dark-mode .accent-lightblue a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.dark-mode .accent-lightblue .nav-tabs .nav-link:hover {\n  color: #4c99c6;\n}\n\n.dark-mode .accent-lightblue .dropdown-item:active, .dark-mode .accent-lightblue .dropdown-item.active {\n  background-color: #86bad8;\n  color: #1f2d3d;\n}\n\n.dark-mode .accent-lightblue .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #86bad8;\n  border-color: #3c8dbc;\n}\n\n.dark-mode .accent-lightblue .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.dark-mode .accent-lightblue .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.dark-mode .accent-lightblue .custom-select:focus,\n.dark-mode .accent-lightblue .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.dark-mode .accent-lightblue .custom-file-input:focus ~ .custom-file-label {\n  border-color: #e6f1f7;\n}\n\n.dark-mode .accent-lightblue .page-item .page-link {\n  color: #86bad8;\n}\n\n.dark-mode .accent-lightblue .page-item.active a,\n.dark-mode .accent-lightblue .page-item.active .page-link {\n  background-color: #86bad8;\n  border-color: #86bad8;\n  color: #fff;\n}\n\n.dark-mode .accent-lightblue .page-item.disabled a,\n.dark-mode .accent-lightblue .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.dark-mode .accent-lightblue [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.dark-mode .accent-lightblue [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.dark-mode .accent-lightblue [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.dark-mode .accent-lightblue [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode .dark-mode.accent-lightblue .page-item .page-link:hover, .dark-mode .dark-mode.accent-lightblue .page-item .page-link:focus {\n  color: #99c5de;\n}\n\n.dark-mode .accent-navy .btn-link,\n.dark-mode .accent-navy a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.dark-mode .accent-navy .nav-tabs .nav-link {\n  color: #002c59;\n}\n\n.dark-mode .accent-navy .btn-link:hover,\n.dark-mode .accent-navy a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.dark-mode .accent-navy .nav-tabs .nav-link:hover {\n  color: #00060c;\n}\n\n.dark-mode .accent-navy .dropdown-item:active, .dark-mode .accent-navy .dropdown-item.active {\n  background-color: #002c59;\n  color: #fff;\n}\n\n.dark-mode .accent-navy .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #002c59;\n  border-color: black;\n}\n\n.dark-mode .accent-navy .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.dark-mode .accent-navy .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.dark-mode .accent-navy .custom-select:focus,\n.dark-mode .accent-navy .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.dark-mode .accent-navy .custom-file-input:focus ~ .custom-file-label {\n  border-color: #006ad8;\n}\n\n.dark-mode .accent-navy .page-item .page-link {\n  color: #002c59;\n}\n\n.dark-mode .accent-navy .page-item.active a,\n.dark-mode .accent-navy .page-item.active .page-link {\n  background-color: #002c59;\n  border-color: #002c59;\n  color: #fff;\n}\n\n.dark-mode .accent-navy .page-item.disabled a,\n.dark-mode .accent-navy .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.dark-mode .accent-navy [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.dark-mode .accent-navy [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.dark-mode .accent-navy [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.dark-mode .accent-navy [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode .dark-mode.accent-navy .page-item .page-link:hover, .dark-mode .dark-mode.accent-navy .page-item .page-link:focus {\n  color: #003872;\n}\n\n.dark-mode .accent-olive .btn-link,\n.dark-mode .accent-olive a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.dark-mode .accent-olive .nav-tabs .nav-link {\n  color: #74c8a3;\n}\n\n.dark-mode .accent-olive .btn-link:hover,\n.dark-mode .accent-olive a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.dark-mode .accent-olive .nav-tabs .nav-link:hover {\n  color: #44ab7d;\n}\n\n.dark-mode .accent-olive .dropdown-item:active, .dark-mode .accent-olive .dropdown-item.active {\n  background-color: #74c8a3;\n  color: #1f2d3d;\n}\n\n.dark-mode .accent-olive .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #74c8a3;\n  border-color: #3d9970;\n}\n\n.dark-mode .accent-olive .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.dark-mode .accent-olive .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.dark-mode .accent-olive .custom-select:focus,\n.dark-mode .accent-olive .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.dark-mode .accent-olive .custom-file-input:focus ~ .custom-file-label {\n  border-color: #cfecdf;\n}\n\n.dark-mode .accent-olive .page-item .page-link {\n  color: #74c8a3;\n}\n\n.dark-mode .accent-olive .page-item.active a,\n.dark-mode .accent-olive .page-item.active .page-link {\n  background-color: #74c8a3;\n  border-color: #74c8a3;\n  color: #fff;\n}\n\n.dark-mode .accent-olive .page-item.disabled a,\n.dark-mode .accent-olive .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.dark-mode .accent-olive [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.dark-mode .accent-olive [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.dark-mode .accent-olive [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.dark-mode .accent-olive [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode .dark-mode.accent-olive .page-item .page-link:hover, .dark-mode .dark-mode.accent-olive .page-item .page-link:focus {\n  color: #87cfaf;\n}\n\n.dark-mode .accent-lime .btn-link,\n.dark-mode .accent-lime a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.dark-mode .accent-lime .nav-tabs .nav-link {\n  color: #67ffa9;\n}\n\n.dark-mode .accent-lime .btn-link:hover,\n.dark-mode .accent-lime a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.dark-mode .accent-lime .nav-tabs .nav-link:hover {\n  color: #1bff7e;\n}\n\n.dark-mode .accent-lime .dropdown-item:active, .dark-mode .accent-lime .dropdown-item.active {\n  background-color: #67ffa9;\n  color: #1f2d3d;\n}\n\n.dark-mode .accent-lime .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #67ffa9;\n  border-color: #01ff70;\n}\n\n.dark-mode .accent-lime .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.dark-mode .accent-lime .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.dark-mode .accent-lime .custom-select:focus,\n.dark-mode .accent-lime .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.dark-mode .accent-lime .custom-file-input:focus ~ .custom-file-label {\n  border-color: #e7fff1;\n}\n\n.dark-mode .accent-lime .page-item .page-link {\n  color: #67ffa9;\n}\n\n.dark-mode .accent-lime .page-item.active a,\n.dark-mode .accent-lime .page-item.active .page-link {\n  background-color: #67ffa9;\n  border-color: #67ffa9;\n  color: #fff;\n}\n\n.dark-mode .accent-lime .page-item.disabled a,\n.dark-mode .accent-lime .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.dark-mode .accent-lime [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.dark-mode .accent-lime [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.dark-mode .accent-lime [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #34