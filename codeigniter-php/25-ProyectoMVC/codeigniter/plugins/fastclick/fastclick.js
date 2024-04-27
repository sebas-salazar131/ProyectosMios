;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to nule .select2-search__field:focus {\n  border: 1px solid #6d7a86;\n}\n\n.select2-container--default .select2-gray-dark .select2-results__option--highlighted,\n.select2-gray-dark .select2-container--default .select2-results__option--highlighted {\n  background-color: #343a40;\n  color: #fff;\n}\n\n.select2-container--default .select2-gray-dark .select2-results__option--highlighted[aria-selected], .select2-container--default .select2-gray-dark .select2-results__option--highlighted[aria-selected]:hover,\n.select2-gray-dark .select2-container--default .select2-results__option--highlighted[aria-selected],\n.select2-gray-dark .select2-container--default .select2-results__option--highlighted[aria-selected]:hover {\n  background-color: #2d3238;\n  color: #fff;\n}\n\n.select2-container--default .select2-gray-dark .select2-selection--multiple:focus,\n.select2-gray-dark .select2-container--default .select2-selection--multiple:focus {\n  border-color: #6d7a86;\n}\n\n.select2-container--default .select2-gray-dark .select2-selection--multiple .select2-selection__choice,\n.select2-gray-dark .select2-container--default .select2-selection--multiple .select2-selection__choice {\n  background-color: #343a40;\n  border-color: #292d32;\n  color: #fff;\n}\n\n.select2-container--default .select2-gray-dark .select2-selection--multiple .select2-selection__choice__remove,\n.select2-gray-dark .select2-container--default .select2-selection--multiple .select2-selection__choice__remove {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.select2-container--default .select2-gray-dark .select2-selection--multiple .select2-selection__choice__remove:hover,\n.select2-gray-dark .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {\n  color: #fff;\n}\n\n.select2-container--default .select2-gray-dark.select2-container--focus .select2-selection--multiple,\n.select2-gray-dark .select2-container--default.select2-container--focus .select2-selection--multiple {\n  border-color: #6d7a86;\n}\n\n.dark-mode .select2-selection {\n  background-color: #343a40;\n  border-color: #6c757d;\n}\n\n.dark-mode .select2-container--disabled .select2-selection--single {\n  background-color: #454d55;\n}\n\n.dark-mode .select2-selection--single {\n  background-color: #343a40;\n  border-color: #6c757d;\n}\n\n.dark-mode .select2-selection--single .select2-selection__rendered {\n  color: #fff;\n}\n\n.dark-mode .select2-dropdown .select2-search__field,\n.dark-mode .select2-search--inline .select2-search__field {\n  background-color: #343a40;\n  border-color: #6c757d;\n  color: white;\n}\n\n.dark-mode .select2-dropdown {\n  background-color: #343a40;\n  border-color: #6c757d;\n  color: white;\n}\n\n.dark-mode .select2-results__option[aria-selected=\"true\"] {\n  background-color: #3f474e !important;\n  color: #dee2e6;\n}\n\n.dark-mode .select2-container .select2-search--inline .select2-search__field {\n  background-color: transparent;\n  color: #fff;\n}\n\n.dark-mode .select2-container--bootstrap4 .select2-selection--multiple .select2-selection__choice {\n  color: #fff;\n}\n\n.dark-mode .select2-primary + .select2-container--default.select2-container--open .select2-selection--single {\n  border-color: #85a7ca;\n}\n\n.dark-mode .select2-primary + .select2-container--default.select2-container--focus .select2-selection--single {\n  border-color: #85a7ca;\n}\n\n.select2-container--default .dark-mode .select2-primary.select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-primary .select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-primary .select2-search--inline .select2-search__field:focus,\n.dark-mode .select2-primary .select2-container--default.select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-primary .select2-container--default .select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-primary .select2-container--default .select2-search--inline .select2-search__field:focus {\n  border: 1px solid #85a7ca;\n}\n\n.select2-container--default .dark-mode .select2-primary .select2-results__option--highlighted,\n.dark-mode .select2-primary .select2-container--default .select2-results__option--highlighted {\n  background-color: #3f6791;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-primary .select2-results__option--highlighted[aria-selected], .select2-container--default .dark-mode .select2-primary .select2-results__option--highlighted[aria-selected]:hover,\n.dark-mode .select2-primary .select2-container--default .select2-results__option--highlighted[aria-selected],\n.dark-mode .select2-primary .select2-container--default .select2-results__option--highlighted[aria-selected]:hover {\n  background-color: #3a5f86;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-primary .select2-selection--multiple:focus,\n.dark-mode .select2-primary .select2-container--default .select2-selection--multiple:focus {\n  border-color: #85a7ca;\n}\n\n.select2-container--default .dark-mode .select2-primary .select2-selection--multiple .select2-selection__choice,\n.dark-mode .select2-primary .select2-container--default .select2-selection--multiple .select2-selection__choice {\n  background-color: #3f6791;\n  border-color: #375a7f;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-primary .select2-selection--multiple .select2-selection__choice__remove,\n.dark-mode .select2-primary .select2-container--default .select2-selection--multiple .select2-selection__choice__remove {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.select2-container--default .dark-mode .select2-primary .select2-selection--multiple .select2-selection__choice__remove:hover,\n.dark-mode .select2-primary .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-primary.select2-container--focus .select2-selection--multiple,\n.dark-mode .select2-primary .select2-container--default.select2-container--focus .select2-selection--multiple {\n  border-color: #85a7ca;\n}\n\n.dark-mode .select2-secondary + .select2-container--default.select2-container--open .select2-selection--single {\n  border-color: #afb5ba;\n}\n\n.dark-mode .select2-secondary + .select2-container--default.select2-container--focus .select2-selection--single {\n  border-color: #afb5ba;\n}\n\n.select2-container--default .dark-mode .select2-secondary.select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-secondary .select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-secondary .select2-search--inline .select2-search__field:focus,\n.dark-mode .select2-secondary .select2-container--default.select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-secondary .select2-container--default .select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-secondary .select2-container--default .select2-search--inline .select2-search__field:focus {\n  border: 1px solid #afb5ba;\n}\n\n.select2-container--default .dark-mode .select2-secondary .select2-results__option--highlighted,\n.dark-mode .select2-secondary .select2-container--default .select2-results__option--highlighted {\n  background-color: #6c757d;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-secondary .select2-results__option--highlighted[aria-selected], .select2-container--default .dark-mode .select2-secondary .select2-results__option--highlighted[aria-selected]:hover,\n.dark-mode .select2-secondary .select2-container--default .select2-results__option--highlighted[aria-selected],\n.dark-mode .select2-secondary .select2-container--default .select2-results__option--highlighted[aria-selected]:hover {\n  background-color: #656d75;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-secondary .select2-selection--multiple:focus,\n.dark-mode .select2-secondary .select2-container--default .select2-selection--multiple:focus {\n  border-color: #afb5ba;\n}\n\n.select2-container--default .dark-mode .select2-secondary .select2-selection--multiple .select2-selection__choice,\n.dark-mode .select2-secondary .select2-container--default .select2-selection--multiple .select2-selection__choice {\n  background-color: #6c757d;\n  border-color: #60686f;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-secondary .select2-selection--multiple .select2-selection__choice__remove,\n.dark-mode .select2-secondary .select2-container--default .select2-selection--multiple .select2-selection__choice__remove {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.select2-container--default .dark-mode .select2-secondary .select2-selection--multiple .select2-selection__choice__remove:hover,\n.dark-mode .select2-secondary .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-secondary.select2-container--focus .select2-selection--multiple,\n.dark-mode .select2-secondary .select2-container--default.select2-container--focus .select2-selection--multiple {\n  border-color: #afb5ba;\n}\n\n.dark-mode .select2-success + .select2-container--default.select2-container--open .select2-selection--single {\n  border-color: #3dffcd;\n}\n\n.dark-mode .select2-success + .select2-container--default.select2-container--focus .select2-selection--single {\n  border-color: #3dffcd;\n}\n\n.select2-container--default .dark-mode .select2-success.select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-success .select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-success .select2-search--inline .select2-search__field:focus,\n.dark-mode .select2-success .select2-container--default.select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-success .select2-container--default .select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-success .select2-container--default .select2-search--inline .select2-search__field:focus {\n  border: 1px solid #3dffcd;\n}\n\n.select2-container--default .dark-mode .select2-success .select2-results__option--highlighted,\n.dark-mode .select2-success .select2-container--default .select2-results__option--highlighted {\n  background-color: #00bc8c;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-success .select2-results__option--highlighted[aria-selected], .select2-container--default .dark-mode .select2-success .select2-results__option--highlighted[aria-selected]:hover,\n.dark-mode .select2-success .select2-container--default .select2-results__option--highlighted[aria-selected],\n.dark-mode .select2-success .select2-container--default .select2-results__option--highlighted[aria-selected]:hover {\n  background-color: #00ad81;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-success .select2-selection--multiple:focus,\n.dark-mode .select2-success .select2-container--default .select2-selection--multiple:focus {\n  border-color: #3dffcd;\n}\n\n.select2-container--default .dark-mode .select2-success .select2-selection--multiple .select2-selection__choice,\n.dark-mode .select2-success .select2-container--default .select2-selection--multiple .select2-selection__choice {\n  background-color: #00bc8c;\n  border-color: #00a379;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-success .select2-selection--multiple .select2-selection__choice__remove,\n.dark-mode .select2-success .select2-container--default .select2-selection--multiple .select2-selection__choice__remove {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.select2-container--default .dark-mode .select2-success .select2-selection--multiple .select2-selection__choice__remove:hover,\n.dark-mode .select2-success .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-success.select2-container--focus .select2-selection--multiple,\n.dark-mode .select2-success .select2-container--default.select2-container--focus .select2-selection--multiple {\n  border-color: #3dffcd;\n}\n\n.dark-mode .select2-info + .select2-container--default.select2-container--open .select2-selection--single {\n  border-color: #a0cfee;\n}\n\n.dark-mode .select2-info + .select2-container--default.select2-container--focus .select2-selection--single {\n  border-color: #a0cfee;\n}\n\n.select2-container--default .dark-mode .select2-info.select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-info .select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-info .select2-search--inline .select2-search__field:focus,\n.dark-mode .select2-info .select2-container--default.select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-info .select2-container--default .select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-info .select2-container--default .select2-search--inline .select2-search__field:focus {\n  border: 1px solid #a0cfee;\n}\n\n.select2-container--default .dark-mode .select2-info .select2-results__option--highlighted,\n.dark-mode .select2-info .select2-container--default .select2-results__option--highlighted {\n  background-color: #3498db;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-info .select2-results__option--highlighted[aria-selected], .select2-container--default .dark-mode .select2-info .select2-results__option--highlighted[aria-selected]:hover,\n.dark-mode .select2-info .select2-container--default .select2-results__option--highlighted[aria-selected],\n.dark-mode .select2-info .select2-container--default .select2-results__option--highlighted[aria-selected]:hover {\n  background-color: #2791d9;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-info .select2-selection--multiple:focus,\n.dark-mode .select2-info .select2-container--default .select2-selection--multiple:focus {\n  border-color: #a0cfee;\n}\n\n.select2-container--default .dark-mode .select2-info .select2-selection--multiple .select2-selection__choice,\n.dark-mode .select2-info .select2-container--default .select2-selection--multiple .select2-selection__choice {\n  background-color: #3498db;\n  border-color: #258cd1;\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-info .select2-selection--multiple .select2-selection__choice__remove,\n.dark-mode .select2-info .select2-container--default .select2-selection--multiple .select2-selection__choice__remove {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.select2-container--default .dark-mode .select2-info .select2-selection--multiple .select2-selection__choice__remove:hover,\n.dark-mode .select2-info .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {\n  color: #fff;\n}\n\n.select2-container--default .dark-mode .select2-info.select2-container--focus .select2-selection--multiple,\n.dark-mode .select2-info .select2-container--default.select2-container--focus .select2-selection--multiple {\n  border-color: #a0cfee;\n}\n\n.dark-mode .select2-warning + .select2-container--default.select2-container--open .select2-selection--single {\n  border-color: #f9cf8b;\n}\n\n.dark-mode .select2-warning + .select2-container--default.select2-container--focus .select2-selection--single {\n  border-color: #f9cf8b;\n}\n\n.select2-container--default .dark-mode .select2-warning.select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-warning .select2-dropdown .select2-search__field:focus,\n.select2-container--default .dark-mode .select2-warning .select2-search--inline .select2-search__field:focus,\n.dark-mode .select2-warning .select2-container--default.select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-warning .select2-container--default .select2-dropdown .select2-search__field:focus,\n.dark-mode .select2-warning .select2-container--default .select2-search--inline .select2-search__field:focus {\n  border: 1px solid #f9cf8b;\n}\n\n.select2-container--default .dark-mode .select2-warning .select2-results__option--highlighted,\n.dark-mode .selec\n}\n\n.bg-gradient-cyan.btn:hover {\n  background: #17a2b8 linear-gradient(180deg, #3697a6, #138496) repeat-x !important;\n  border-color: #117a8b;\n  color: #ececec;\n}\n\n.bg-gradient-cyan.btn:not(:disabled):not(.disabled):active, .bg-gradient-cyan.btn:not(:disabled):not(.disabled).active, .bg-gradient-cyan.btn:active, .bg-gradient-cyan.btn.active {\n  background: #17a2b8 linear-gradient(180deg, #358e9c, #117a8b) repeat-x !important;\n  border-color: #10707f;\n  color: #fff;\n}\n\n.bg-gradient-cyan.btn:disabled, .bg-gradient-cyan.btn.disabled {\n  background-image: none !important;\n  border-color: #17a2b8;\n  color: #fff;\n}\n\n.bg-gradient-white {\n  background: #fff linear-gradient(180deg, white, #fff) repeat-x !important;\n  color: #1f2d3d;\n}\n\n.bg-gradient-white.btn:not(:disabled):not(.disabled):active, .bg-gradient-white.btn:not(:disabled):not(.disabled).active,\n.show > .bg-gradient-white.btn.dropdown-toggle {\n  background-image: none !important;\n}\n\n.bg-gradient-white.btn:hover {\n  background: #fff linear-gradient(180deg, #efefef, #ececec) repeat-x !important;\n  border-color: #e6e6e6;\n  color: #121a24;\n}\n\n.bg-gradient-white.btn:not(:disabled):not(.disabled):active, .bg-gradient-white.btn:not(:disabled):not(.disabled).active, .bg-gradient-white.btn:active, .bg-gradient-white.btn.active {\n  background: #fff linear-gradient(180deg, #e9e9e9, #e6e6e6) repeat-x !important;\n  border-color: #dfdfdf;\n  color: #1f2d3d;\n}\n\n.bg-gradient-white.btn:disabled, .bg-gradient-white.btn.disabled {\n  background-image: none !important;\n  border-color: #fff;\n  color: #1f2d3d;\n}\n\n.bg-gradient-gray {\n  background: #6c757d linear-gradient(180deg, #828a91, #6c757d) repeat-x !important;\n  color: #fff;\n}\n\n.bg-gradient-gray.btn:not(:disabled):not(.disabled):active, .bg-gradient-gray.btn:not(:disabled):not(.disabled).active,\n.show > .bg-gradient-gray.btn.dropdown-toggle {\n  background-image: none !important;\n}\n\n.bg-gradient-gray.btn:hover {\n  background: #6c757d linear-gradient(180deg, #73797f, #5a6268) repeat-x !important;\n  border-color: #545b62;\n  color: #ececec;\n}\n\n.bg-gradient-gray.btn:not(:disabled):not(.disabled):active, .bg-gradient-gray.btn:not(:disabled):not(.disabled).active, .bg-gradient-gray.btn:active, .bg-gradient-gray.btn.active {\n  background: #6c757d linear-gradient(180deg, #6e7479, #545b62) repeat-x !important;\n  border-color: #4e555b;\n  color: #fff;\n}\n\n.bg-gradient-gray.btn:disabled, .bg-gradient-gray.btn.disabled {\n  background-image: none !important;\n  border-color: #6c757d;\n  color: #fff;\n}\n\n.bg-gradient-gray-dark {\n  background: #343a40 linear-gradient(180deg, #52585d, #343a40) repeat-x !important;\n  color: #fff;\n}\n\n.bg-gradient-gray-dark.btn:not(:disabled):not(.disabled):active, .bg-gradient-gray-dark.btn:not(:disabled):not(.disabled).active,\n.show > .bg-gradient-gray-dark.btn.dropdown-toggle {\n  background-image: none !important;\n}\n\n.bg-gradient-gray-dark.btn:hover {\n  background: #343a40 linear-gradient(180deg, #44474b, #23272b) repeat-x !important;\n  border-color: #1d2124;\n  color: #ececec;\n}\n\n.bg-gradient-gray-dark.btn:not(:disabled):not(.disabled):active, .bg-gradient-gray-dark.btn:not(:disabled):not(.disabled).active, .bg-gradient-gray-dark.btn:active, .bg-gradient-gray-dark.btn.active {\n  background: #343a40 linear-gradient(180deg, #3f4245, #1d2124) repeat-x !important;\n  border-color: #171a1d;\n  color: #fff;\n}\n\n.bg-gradient-gray-dark.btn:disabled, .bg-gradient-gray-dark.btn.disabled {\n  background-image: none !important;\n  border-color: #343a40;\n  color: #fff;\n}\n\n[class^=\"bg-\"].disabled {\n  opacity: .65;\n}\n\na.text-muted:hover {\n  color: #007bff !important;\n}\n\n.link-muted {\n  color: #5d6974;\n}\n\n.link-muted:hover, .link-muted:focus {\n  color: #464f58;\n}\n\n.link-black {\n  color: #6c757d;\n}\n\n.link-black:hover, .link-black:focus {\n  color: #e6e8ea;\n}\n\n.accent-primary .btn-link,\n.accent-primary a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-primary .nav-tabs .nav-link {\n  color: #007bff;\n}\n\n.accent-primary .btn-link:hover,\n.accent-primary a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-primary .nav-tabs .nav-link:hover {\n  color: #0056b3;\n}\n\n.accent-primary .dropdown-item:active, .accent-primary .dropdown-item.active {\n  background-color: #007bff;\n  color: #fff;\n}\n\n.accent-primary .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #007bff;\n  border-color: #004a99;\n}\n\n.accent-primary .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-primary .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-primary .custom-select:focus,\n.accent-primary .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-primary .custom-file-input:focus ~ .custom-file-label {\n  border-color: #80bdff;\n}\n\n.accent-primary .page-item .page-link {\n  color: #007bff;\n}\n\n.accent-primary .page-item.active a,\n.accent-primary .page-item.active .page-link {\n  background-color: #007bff;\n  border-color: #007bff;\n  color: #fff;\n}\n\n.accent-primary .page-item.disabled a,\n.accent-primary .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-primary [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-primary [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-primary [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-primary [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-primary .page-item .page-link:hover, .dark-mode.accent-primary .page-item .page-link:focus {\n  color: #1a88ff;\n}\n\n.accent-secondary .btn-link,\n.accent-secondary a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-secondary .nav-tabs .nav-link {\n  color: #6c757d;\n}\n\n.accent-secondary .btn-link:hover,\n.accent-secondary a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-secondary .nav-tabs .nav-link:hover {\n  color: #494f54;\n}\n\n.accent-secondary .dropdown-item:active, .accent-secondary .dropdown-item.active {\n  background-color: #6c757d;\n  color: #fff;\n}\n\n.accent-secondary .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #6c757d;\n  border-color: #3d4246;\n}\n\n.accent-secondary .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-secondary .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-secondary .custom-select:focus,\n.accent-secondary .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-secondary .custom-file-input:focus ~ .custom-file-label {\n  border-color: #afb5ba;\n}\n\n.accent-secondary .page-item .page-link {\n  color: #6c757d;\n}\n\n.accent-secondary .page-item.active a,\n.accent-secondary .page-item.active .page-link {\n  background-color: #6c757d;\n  border-color: #6c757d;\n  color: #fff;\n}\n\n.accent-secondary .page-item.disabled a,\n.accent-secondary .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-secondary [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-secondary [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-secondary [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-secondary [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-secondary .page-item .page-link:hover, .dark-mode.accent-secondary .page-item .page-link:focus {\n  color: #78828a;\n}\n\n.accent-success .btn-link,\n.accent-success a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-success .nav-tabs .nav-link {\n  color: #28a745;\n}\n\n.accent-success .btn-link:hover,\n.accent-success a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-success .nav-tabs .nav-link:hover {\n  color: #19692c;\n}\n\n.accent-success .dropdown-item:active, .accent-success .dropdown-item.active {\n  background-color: #28a745;\n  color: #fff;\n}\n\n.accent-success .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #28a745;\n  border-color: #145523;\n}\n\n.accent-success .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-success .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-success .custom-select:focus,\n.accent-success .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-success .custom-file-input:focus ~ .custom-file-label {\n  border-color: #71dd8a;\n}\n\n.accent-success .page-item .page-link {\n  color: #28a745;\n}\n\n.accent-success .page-item.active a,\n.accent-success .page-item.active .page-link {\n  background-color: #28a745;\n  border-color: #28a745;\n  color: #fff;\n}\n\n.accent-success .page-item.disabled a,\n.accent-success .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-success [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-success [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-success [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-success [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-success .page-item .page-link:hover, .dark-mode.accent-success .page-item .page-link:focus {\n  color: #2dbc4e;\n}\n\n.accent-info .btn-link,\n.accent-info a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-info .nav-tabs .nav-link {\n  color: #17a2b8;\n}\n\n.accent-info .btn-link:hover,\n.accent-info a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-info .nav-tabs .nav-link:hover {\n  color: #0f6674;\n}\n\n.accent-info .dropdown-item:active, .accent-info .dropdown-item.active {\n  background-color: #17a2b8;\n  color: #fff;\n}\n\n.accent-info .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #17a2b8;\n  border-color: #0c525d;\n}\n\n.accent-info .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-info .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-info .custom-select:focus,\n.accent-info .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-info .custom-file-input:focus ~ .custom-file-label {\n  border-color: #63d9ec;\n}\n\n.accent-info .page-item .page-link {\n  color: #17a2b8;\n}\n\n.accent-info .page-item.active a,\n.accent-info .page-item.active .page-link {\n  background-color: #17a2b8;\n  border-color: #17a2b8;\n  color: #fff;\n}\n\n.accent-info .page-item.disabled a,\n.accent-info .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-info [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-info [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-info [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-info [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-info .page-item .page-link:hover, .dark-mode.accent-info .page-item .page-link:focus {\n  color: #1ab6cf;\n}\n\n.accent-warning .btn-link,\n.accent-warning a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-warning .nav-tabs .nav-link {\n  color: #ffc107;\n}\n\n.accent-warning .btn-link:hover,\n.accent-warning a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-warning .nav-tabs .nav-link:hover {\n  color: #ba8b00;\n}\n\n.accent-warning .dropdown-item:active, .accent-warning .dropdown-item.active {\n  background-color: #ffc107;\n  color: #1f2d3d;\n}\n\n.accent-warning .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #ffc107;\n  border-color: #a07800;\n}\n\n.accent-warning .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-warning .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-warning .custom-select:focus,\n.accent-warning .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-warning .custom-file-input:focus ~ .custom-file-label {\n  border-color: #ffe187;\n}\n\n.accent-warning .page-item .page-link {\n  color: #ffc107;\n}\n\n.accent-warning .page-item.active a,\n.accent-warning .page-item.active .page-link {\n  background-color: #ffc107;\n  border-color: #ffc107;\n  color: #fff;\n}\n\n.accent-warning .page-item.disabled a,\n.accent-warning .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-warning [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-warning [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-warning [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-warning [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-warning .page-item .page-link:hover, .dark-mode.accent-warning .page-item .page-link:focus {\n  color: #ffc721;\n}\n\n.accent-danger .btn-link,\n.accent-danger a:not(.dropdown-item):not(.btn-app):not(.nav-link):n