/*!
 * Lightbox for Bootstrap by @ashleydw
 * https://github.com/ashleydw/lightbox
 *
 * License: https://github.com/ashleydw/lightbox/blob/master/LICENSE
 */
+function ($) {

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Lightbox = (function ($) {

	var NAME = 'ekkoLightbox';
	var JQUERY_NO_CONFLICT = $.fn[NAME];

	var Default = {
		title: '',
		footer: '',
		maxWidth: 9999,
		maxHeight: 9999,
		showArrows: true, //display the left / right arrows or not
		wrapping: true, //if true, gallery loops infinitely
		type: null, //force the lightbox into image / youtube mode. if null, or not image|youtube|vimeo; detect it
		alwaysShowClose: false, //always show the close button, even if there is no title
		loadingMessage: '<div class="ekko-lightbox-loader"><div><div></div><div></div></div></div>', // http://tobiasahlin.com/spinkit/
		leftArrow: '<span>&#10094;</span>',
		rightArrow: '<span>&#10095;</span>',
		strings: {
			close: 'Close',
			fail: 'Failed to load image:',
			type: 'Could not detect remote target type. Force the type using data-type'
		},
		doc: document, // if in an iframe can specify top.document
		onShow: function onShow() {},
		onShown: function onShown() {},
		onHide: function onHide() {},
		onHidden: function onHidden() {},
		onNavigate: function onNavigate() {},
		onContentLoaded: function onContentLoaded() {}
	};

	var Lightbox = (function () {
		_createClass(Lightbox, null, [{
			key: 'Default',

			/**
       Class properties:
   	 _$element: null -> the <a> element currently being displayed
    _$modal: The bootstrap modal generated
       _$modalDialog: The .modal-dialog
       _$modalContent: The .modal-content
       _$modalBody: The .modal-body
       _$modalHeader: The .modal-header
       _$modalFooter: The .modal-footer
    _$lightboxContainerOne: Container of the first lightbox element
    _$lightboxContainerTwo: Container of the second lightbox element
    _$lightboxBody: First element in the container
    _$modalArrows: The overlayed arrows container
   	 _$galleryItems: Other <a>'s available for this gallery
    _galleryName: Name of the current data('gallery') showing
    _galleryIndex: The current index of the _$galleryItems being shown
   	 _config: {} the options for the modal
    _modalId: unique id for the current lightbox
    _padding / _border: CSS properties for the modal container; these are used to calculate the available space for the content
   	 */

			get: function get() {
				return Default;
			}
		}]);

		function Lightbox($element, config) {
			var _this = this;

			_classCallCheck(this, Lightbox);

			this._config = $.extend({}, Default, config);
			this._$modalArrows = null;
			this._galleryIndex = 0;
			this._galleryName = null;
			this._padding = null;
			this._border = null;
			this._titleIsShown = false;
			this._footerIsShown = false;
			this._wantedWidth = 0;
			this._wantedHeight = 0;
			this._touchstartX = 0;
			this._touchendX = 0;

			this._modalId = 'ekkoLightbox-' + Math.floor(Math.random() * 1000 + 1);
			this._$element = $element instanceof jQuery ? $element : $($element);

			this._isBootstrap3 = $.fn.modal.Constructor.VERSION[0] == 3;

			var h4 = '<h4 class="modal-title">' + (this._config.title || "&nbsp;") + '</h4>';
			var btn = '<button type="button" class="close" data-dismiss="modal" aria-label="' + this._config.strings.close + '"><span aria-hidden="true">&times;</span></button>';

			var header = '<div class="modal-header' + (this._config.title || this._config.alwaysShowClose ? '' : ' hide') + '">' + (this._isBootstrap3 ? btn + h4 : h4 + btn) + '</div>';
			var footer = '<div class="modal-footer' + (this._config.footer ? '' : ' hide') + '">' + (this._config.footer || "&nbsp;") + '</div>';
			var body = '<div class="modal-body"><div class="ekko-lightbox-container"><div class="ekko-lightbox-item fade in show"></div><div class="ekko-lightbox-item fade"></div></div></div>';
			var dialog = '<div class="modal-dialog" role="document"><div class="modal-content">' + header + body + footer + '</div></div>';
			$(this._config.doc.body).append('<div id="' + this._modalId + '" class="ekko-lightbox modal fade" tabindex="-1" tabindex="-1" role="dialog" aria-hidden="true">' + dialog + '</div>');

			this._$modal = $('#' + this._modalId, this._config.doc);
			this._$modalDialog = this._$modal.find('.modal-dialog').first();
			this._$modalContent = this._$modal.find('.modal-content').first();
			this._$modalBody = this._$modal.find('.modal-body').first();
			this._$modalHeader = this._$modal.find('.modal-header').first();
			this._$modalFooter = this._$modal.find('.modal-footer').first();

			this._$lightboxContainer = this._$modalBody.find('.ekko-lightbox-container').first();
			this._$lightboxBodyOne = this._$lightboxContainer.find('> div:first-child').first();
			this._$lightboxBodyTwo = this._$lightboxContainer.find('> div:last-child').first();

			this._border = this._calculateBorders();
			this._padding = this._calculatePadding();

			this._galleryName = this._$element.data('gallery');
			if (this._galleryName) {
				this._$galleryItems = $(document.body).find('*[data-gallery="' + this._galleryName + '"]');
				this._galleryIndex = this._$galleryItems.index(this._$element);
				$(document).on('keydown.ekkoLightbox', this._navigationalBinder.bind(this));

				// add the directional arrows to the modal
				if (this._config.showArrows && this._$galleryItems.length > 1) {
					this._$lightboxContainer.append('<div class="ekko-lightbox-nav-overlay"><a href="#">' + this._config.leftArrow + '</a><a href="#">' + this._config.rightArrow + '</a></div>');
					this._$modalArrows = this._$lightboxContainer.find('div.ekko-lightbox-nav-overlay').first();
					this._$lightboxContainer.on('click', 'a:first-child', function (event) {
						event.preventDefault();
						return _this.navigateLeft();
					});
					this._$lightboxContainer.on('click', 'a:last-child', function (event) {
						event.preventDefault();
						return _this.navigateRight();
					});
					this.updateNavigation();
				}
			}

			this._$modal.on('show.bs.modal', this._config.onShow.bind(this)).on('shown.bs.modal', function () {
				_this._toggleLoading(true);
				_this._handle();
				return _this._config.onShown.call(_this);
			}).on('hide.bs.modal', this._config.onHide.bind(this)).on('hidden.bs.modal', function () {
				if (_this._galleryName) {
					$(document).off('keydown.ekkoLightbox');
					$(window).off('resize.ekkoLightbox');
				}
				_this._$modal.remove();
				return _this._config.onHidden.call(_this);
			}).modal(this._config);

			$(window).on('resize.ekkoLightbox', function () {
				_this._resize(_this._wantedWidth, _this._wantedHeight);
			});
			this._$lightboxContainer.on('touchstart', function () {
				_this._touchstartX = event.changedTouches[0].screenX;
			}).on('touchend', function () {
				_this._touchendX = event.changedTouches[0].screenX;
				_this._swipeGesure();
			});
		}

		_createClass(Lightbox, [{
			key: 'element',
			value: function element() {
				return this._$element;
			}
		}, {
			key: 'modal',
			value: function modal() {
				return this._$modal;
			}
		}, {
			key: 'navigateTo',
			value: function navigateTo(index) {

				if (index < 0 || index > this._$galleryItems.length - 1) return this;

				this._galleryIndex = index;

				this.updateNavigation();

				this._$element = $(this._$galleryItems.get(this._galleryIndex));
				this._handle();
			}
		}, {
			key: 'navigateLeft',
			value: function navigateLeft() {

				if (!this._$galleryItems) return;

				if (this._$galleryItems.length === 1) return;

				if (this._galleryIndex === 0) {
					if (this._config.wrapping) this._galleryIndex = this._$galleryItems.length - 1;else return;
				} else //circular
					this._galleryIndex--;

				this._config.onNavigate.call(this, 'left', this._galleryIndex);
				return this.navigateTo(this._galleryIndex);
			}
		}, {
			key: 'navigateRight',
			value: function navigateRight() {

				if (!this._$galleryItems) return;

				if (this._$galleryItems.length === 1) return;

				if (this._galleryIndex === this._$galleryItems.length - 1) {
					if (this._config.wrapping) this._galleryIndex = 0;else return;
				} else //circular
					this._galleryIndex++;

				this._config.onNavigate.call(this, 'right', this._galleryIndex);
				return this.navigateTo(this._galleryIndex);
			}
		}, {
			key: 'updateNavigation',
			value: function updateNavigation() {
				if (!this._config.wrapping) {
					var $nav = this._$lightboxContainer.find('div.ekko-lightbox-nav-overlay');
					if (this._galleryIndex === 0) $nav.find('a:first-child').addClass('disabled');else $nav.find('a:first-child').removeClass('disabled');

					if (this._galleryIndex === this._$galleryItems.length - 1) $nav.find('a:last-child').addClass('disabled');else $nav.find('a:last-child').removeClass('disabled');
				}
			}
		}, {
			key: 'close',
			value: function close() {
				return this._$modal.modal('hide');
			}

			// helper private methods
		}, {
			key: '_navigationalBinder',
			value: function _navigationalBinder(event) {
				event = event || window.event;
				if (event.keyCode === 39) return this.navigateRight();
				if (event.keyCode === 37) return this.navigateLeft();
			}

			// type detection private methods
		}, {
			key: '_detectRemoteType',
			value: function _detectRemoteType(src, type) {

				type = type || false;

				if (!type && this._isImage(src)) type = 'image';
				if (!type && this._getYoutubeId(src)) type = 'youtube';
				if (!type && this._getVimeoId(src)) type = 'vimeo';
				if (!type && this._getInstagramId(src)) type = 'instagram';

				if (!type || ['image', 'youtube', 'vimeo', 'instagram', 'video', 'url'].indexOf(type) < 0) type = 'url';

				return type;
			}
		}, {
			key: '_isImage',
			value: function _isImage(string) {
				return string && string.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
			}
		}, {
			key: '_containerToUse',
			value: function _containerToUse() {
				var _this2 = this;

				// if currently showing an image, fade it out and remove
				var $toUse = this._$lightboxBodyTwo;
				var $current = this._$lightboxBodyOne;

				if (this._$lightboxBodyTwo.hasClass('in')) {
					$toUse = this._$lightboxBodyOne;
					$current = this._$lightboxBodyTwo;
				}

				$current.removeClass('in show');
				setTimeout(function () {
					if (!_this2._$lightboxBodyTwo.hasClass('in')) _this2._$lightboxBodyTwo.empty();
					if (!_this2._$lightboxBodyOne.hasClass('in')) _this2._$lightboxBodyOne.empty();
				}, 500);

				$toUse.addClass('in show');
				return $toUse;
			}
		}, {
			key: '_handle',
			value: function _handle() {

				var $toUse = this._containerToUse();
				this._updateTitleAndFooter();

				var currentRemote = this._$element.attr('data-remote') || this._$element.attr('href');
				var currentType = this._detectRemoteType(currentRemote, this._$element.attr('data-type') || false);

				if (['image', 'youtube', 'vimeo', 'instagram', 'video', 'url'].indexOf(currentType) < 0) return this._error(this._config.strings.type);

				switch (currentType) {
					case 'image':
						this._preloadImage(currentRemote, $toUse);
						this._preloadImageByIndex(this._galleryIndex, 3);
						break;
					case 'youtube':
						this._showYoutubeVideo(currentRemote, $toUse);
						break;
					case 'vimeo':
						this._showVimeoVideo(this._getVimeoId(currentRemote), $toUse);
						break;
					case 'instagram':
						this._showInstagramVideo(this._getInstagramId(currentRemote), $toUse);
						break;
					case 'video':
						this._showHtml5Video(currentRemote, $toUse);
						break;
					default:
						// url
						this._loadRemoteContent(currentRemote, $toUse);
						break;
				}

				return this;
			}
		}, {
			key: '_getYoutubeId',
			value: function _getYoutubeId(string) {
				if (!string) return false;
				var matches = string.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
				return matches && matches[2].length === 11 ? matches[2] : false;
			}
		}, {
			key: '_getVimeoId',
			value: function _getVimeoId(string) {
				return string && string.indexOf('vimeo') > 0 ? string : false;
			}
		}, {
			key: '_getInstagramId',
			value: function _getInstagramId(string) {
				return string && string.indexOf('instagram') > 0 ? string : false;
			}

			// layout private methods
		}, {
			key: '_toggleLoading',
			value: function _toggleLoading(show) {
				show = show || false;
				if (show) {
					this._$modalDialog.css('display', 'none');
					this._$modal.removeClass('in show');
					$('.modal-backdrop').append(this._config.loadingMessage);
				} else {
					this._$modalDialog.css('display', 'block');
					this._$modal.addClass('in show');
					$('.modal-backdrop').find('.ekko-lightbox-loader').remove();
				}
				return this;
			}
		}, {
			key: '_calculateBorders',
			value: function _calculateBorders() {
				return {
					top: this._totalCssByAttribute('border-top-width'),
					right: this._totalCssByAttribute('border-right-width'),
					bottom: this._totalCssByAttribute('border-bottom-width'),
					left: this._totalCssByAttribute('border-left-width')
				};
			}
		}, {
			key: '_calculatePadding',
			value: function _calculatePadding() {
				return {
					top: this._totalCssByAttribute('padding-top'),
					right: this._totalCssByAttribute('padding-right'),
					bottom: this._totalCssByAttribute('padding-bottom'),
					left: this._totalCssByAttribute('padding-left')
				};
			}
		}, {
			key: '_totalCssByAttribute',
			value: function _totalCssByAttribute(attribute) {
				return parseInt(this._$modalDialog.css(attribute), 10) + parseInt(this._$modalContent.css(attribute), 10) + parseInt(this._$modalBody.css(attribute), 10);
			}
		}, {
			key: '_updateTitleAndFooter',
			value: function _updateTitleAndFooter() {
				var title = this._$element.data('title') || "";
				var caption = this._$element.data('footer') || "";

				this._titleIsShown = false;
				if (title || this._config.alwaysShowClose) {
					this._titleIsShown = true;
					this._$modalHeader.css('display', '').find('.modal-title').html(title || "&nbsp;");
				} else this._$modalHeader.css('display', 'none');

				this._footerIsShown = false;
				if (caption) {
					this._footerIsShown = true;
					this._$modalFooter.css('display', '').html(caption);
				} else this._$modalFooter.css('display', 'none');

				return this;
			}
		}, {
			key: '_showYoutubeVideo',
			value: function _showYoutubeVideo(remote, $containerForElement) {
				var id = this._getYoutubeId(remote);
				var query = remote.indexOf('&') > 0 ? remote.substr(remote.indexOf('&')) : '';
				var width = this._$element.data('width') || 560;
				var height = this._$element.data('height') || width / (560 / 315);
				return this._showVideoIframe('//www.youtube.com/embed/' + id + '?badge=0&autoplay=1&html5=1' + query, width, height, $containerForElement);
			}
		}, {
			key: '_showVimeoVideo',
			value: function _showVimeoVideo(id, $containerForElement) {
				var width = this._$element.data('width') || 500;
				var height = this._$element.data('height') || width / (560 / 315);
				return this._showVideoIframe(id + '?autoplay=1', width, height, $containerForElement);
			}
		}, {
			key: '_showInstagramVideo',
			value: function _showInstagramVideo(id, $containerForElement) {
				// instagram load their content into iframe's so this can be put straight into the element
				var width = this._$element.data('width') || 612;
				var height = width + 80;
				id = id.substr(-1) !== '/' ? id + '/' : id; // ensure id has trailing slash
				$containerForElement.html('<iframe width="' + width + '" height="' + height + 'dient-navy .bootstrap-datetimepicker-widget .table th {
  border: none;
}

.card.bg-navy .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-navy .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-navy .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-navy .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-navy .bootstrap-datetimepicker-widget table td.second:hover,
.card.bg-gradient-navy .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-gradient-navy .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-gradient-navy .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-gradient-navy .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-gradient-navy .bootstrap-datetimepicker-widget table td.second:hover {
  background-color: #000b16;
  color: #fff;
}

.card.bg-navy .bootstrap-datetimepicker-widget table td.today::before,
.card.bg-gradient-navy .bootstrap-datetimepicker-widget table td.today::before {
  border-bottom-color: #fff;
}

.card.bg-navy .bootstrap-datetimepicker-widget table td.active,
.card.bg-navy .bootstrap-datetimepicker-widget table td.active:hover,
.card.bg-gradient-navy .bootstrap-datetimepicker-widget table td.active,
.card.bg-gradient-navy .bootstrap-datetimepicker-widget table td.active:hover {
  background-color: #003872;
  color: #fff;
}

.card-olive:not(.card-outline) > .card-header {
  background-color: #3d9970;
}

.card-olive:not(.card-outline) > .card-header,
.card-olive:not(.card-outline) > .card-header a {
  color: #fff;
}

.card-olive:not(.card-outline) > .card-header a.active {
  color: #1f2d3d;
}

.card-olive.card-outline {
  border-top: 3px solid #3d9970;
}

.card-olive.card-outline-tabs > .card-header a:hover {
  border-top: 3px solid #dee2e6;
}

.card-olive.card-outline-tabs > .card-header a.active,
.card-olive.card-outline-tabs > .card-header a.active:hover {
  border-top: 3px solid #3d9970;
}

.bg-olive > .card-header .btn-tool,
.bg-gradient-olive > .card-header .btn-tool,
.card-olive:not(.card-outline) > .card-header .btn-tool {
  color: rgba(255, 255, 255, 0.8);
}

.bg-olive > .card-header .btn-tool:hover,
.bg-gradient-olive > .card-header .btn-tool:hover,
.card-olive:not(.card-outline) > .card-header .btn-tool:hover {
  color: #fff;
}

.card.bg-olive .bootstrap-datetimepicker-widget .table td,
.card.bg-olive .bootstrap-datetimepicker-widget .table th,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget .table td,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget .table th {
  border: none;
}

.card.bg-olive .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-olive .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-olive .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-olive .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-olive .bootstrap-datetimepicker-widget table td.second:hover,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget table td.second:hover {
  background-color: #317c5b;
  color: #fff;
}

.card.bg-olive .bootstrap-datetimepicker-widget table td.today::before,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget table td.today::before {
  border-bottom-color: #fff;
}

.card.bg-olive .bootstrap-datetimepicker-widget table td.active,
.card.bg-olive .bootstrap-datetimepicker-widget table td.active:hover,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget table td.active,
.card.bg-gradient-olive .bootstrap-datetimepicker-widget table td.active:hover {
  background-color: #50b98a;
  color: #fff;
}

.card-lime:not(.card-outline) > .card-header {
  background-color: #01ff70;
}

.card-lime:not(.card-outline) > .card-header,
.card-lime:not(.card-outline) > .card-header a {
  color: #1f2d3d;
}

.card-lime:not(.card-outline) > .card-header a.active {
  color: #1f2d3d;
}

.card-lime.card-outline {
  border-top: 3px solid #01ff70;
}

.card-lime.card-outline-tabs > .card-header a:hover {
  border-top: 3px solid #dee2e6;
}

.card-lime.card-outline-tabs > .card-header a.active,
.card-lime.card-outline-tabs > .card-header a.active:hover {
  border-top: 3px solid #01ff70;
}

.bg-lime > .card-header .btn-tool,
.bg-gradient-lime > .card-header .btn-tool,
.card-lime:not(.card-outline) > .card-header .btn-tool {
  color: rgba(31, 45, 61, 0.8);
}

.bg-lime > .card-header .btn-tool:hover,
.bg-gradient-lime > .card-header .btn-tool:hover,
.card-lime:not(.card-outline) > .card-header .btn-tool:hover {
  color: #1f2d3d;
}

.card.bg-lime .bootstrap-datetimepicker-widget .table td,
.card.bg-lime .bootstrap-datetimepicker-widget .table th,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget .table td,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget .table th {
  border: none;
}

.card.bg-lime .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-lime .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-lime .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-lime .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-lime .bootstrap-datetimepicker-widget table td.second:hover,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget table td.second:hover {
  background-color: #00d75e;
  color: #1f2d3d;
}

.card.bg-lime .bootstrap-datetimepicker-widget table td.today::before,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget table td.today::before {
  border-bottom-color: #1f2d3d;
}

.card.bg-lime .bootstrap-datetimepicker-widget table td.active,
.card.bg-lime .bootstrap-datetimepicker-widget table td.active:hover,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget table td.active,
.card.bg-gradient-lime .bootstrap-datetimepicker-widget table td.active:hover {
  background-color: #34ff8d;
  color: #1f2d3d;
}

.card-fuchsia:not(.card-outline) > .card-header {
  background-color: #f012be;
}

.card-fuchsia:not(.card-outline) > .card-header,
.card-fuchsia:not(.card-outline) > .card-header a {
  color: #fff;
}

.card-fuchsia:not(.card-outline) > .card-header a.active {
  color: #1f2d3d;
}

.card-fuchsia.card-outline {
  border-top: 3px solid #f012be;
}

.card-fuchsia.card-outline-tabs > .card-header a:hover {
  border-top: 3px solid #dee2e6;
}

.card-fuchsia.card-outline-tabs > .card-header a.active,
.card-fuchsia.card-outline-tabs > .card-header a.active:hover {
  border-top: 3px solid #f012be;
}

.bg-fuchsia > .card-header .btn-tool,
.bg-gradient-fuchsia > .card-header .btn-tool,
.card-fuchsia:not(.card-outline) > .card-header .btn-tool {
  color: rgba(255, 255, 255, 0.8);
}

.bg-fuchsia > .card-header .btn-tool:hover,
.bg-gradient-fuchsia > .card-header .btn-tool:hover,
.card-fuchsia:not(.card-outline) > .card-header .btn-tool:hover {
  color: #fff;
}

.card.bg-fuchsia .bootstrap-datetimepicker-widget .table td,
.card.bg-fuchsia .bootstrap-datetimepicker-widget .table th,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget .table td,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget .table th {
  border: none;
}

.card.bg-fuchsia .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-fuchsia .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-fuchsia .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-fuchsia .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-fuchsia .bootstrap-datetimepicker-widget table td.second:hover,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget table td.second:hover {
  background-color: #cc0da1;
  color: #fff;
}

.card.bg-fuchsia .bootstrap-datetimepicker-widget table td.today::before,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget table td.today::before {
  border-bottom-color: #fff;
}

.card.bg-fuchsia .bootstrap-datetimepicker-widget table td.active,
.card.bg-fuchsia .bootstrap-datetimepicker-widget table td.active:hover,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget table td.active,
.card.bg-gradient-fuchsia .bootstrap-datetimepicker-widget table td.active:hover {
  background-color: #f342cb;
  color: #fff;
}

.card-maroon:not(.card-outline) > .card-header {
  background-color: #d81b60;
}

.card-maroon:not(.card-outline) > .card-header,
.card-maroon:not(.card-outline) > .card-header a {
  color: #fff;
}

.card-maroon:not(.card-outline) > .card-header a.active {
  color: #1f2d3d;
}

.card-maroon.card-outline {
  border-top: 3px solid #d81b60;
}

.card-maroon.card-outline-tabs > .card-header a:hover {
  border-top: 3px solid #dee2e6;
}

.card-maroon.card-outline-tabs > .card-header a.active,
.card-maroon.card-outline-tabs > .card-header a.active:hover {
  border-top: 3px solid #d81b60;
}

.bg-maroon > .card-header .btn-tool,
.bg-gradient-maroon > .card-header .btn-tool,
.card-maroon:not(.card-outline) > .card-header .btn-tool {
  color: rgba(255, 255, 255, 0.8);
}

.bg-maroon > .card-header .btn-tool:hover,
.bg-gradient-maroon > .card-header .btn-tool:hover,
.card-maroon:not(.card-outline) > .card-header .btn-tool:hover {
  color: #fff;
}

.card.bg-maroon .bootstrap-datetimepicker-widget .table td,
.card.bg-maroon .bootstrap-datetimepicker-widget .table th,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget .table td,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget .table th {
  border: none;
}

.card.bg-maroon .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-maroon .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-maroon .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-maroon .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-maroon .bootstrap-datetimepicker-widget table td.second:hover,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget table td.second:hover {
  background-color: #b41650;
  color: #fff;
}

.card.bg-maroon .bootstrap-datetimepicker-widget table td.today::before,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget table td.today::before {
  border-bottom-color: #fff;
}

.card.bg-maroon .bootstrap-datetimepicker-widget table td.active,
.card.bg-maroon .bootstrap-datetimepicker-widget table td.active:hover,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget table td.active,
.card.bg-gradient-maroon .bootstrap-datetimepicker-widget table td.active:hover {
  background-color: #e73f7c;
  color: #fff;
}

.card-blue:not(.card-outline) > .card-header {
  background-color: #007bff;
}

.card-blue:not(.card-outline) > .card-header,
.card-blue:not(.card-outline) > .card-header a {
  color: #fff;
}

.card-blue:not(.card-outline) > .card-header a.active {
  color: #1f2d3d;
}

.card-blue.card-outline {
  border-top: 3px solid #007bff;
}

.card-blue.card-outline-tabs > .card-header a:hover {
  border-top: 3px solid #dee2e6;
}

.card-blue.card-outline-tabs > .card-header a.active,
.card-blue.card-outline-tabs > .card-header a.active:hover {
  border-top: 3px solid #007bff;
}

.bg-blue > .card-header .btn-tool,
.bg-gradient-blue > .card-header .btn-tool,
.card-blue:not(.card-outline) > .card-header .btn-tool {
  color: rgba(255, 255, 255, 0.8);
}

.bg-blue > .card-header .btn-tool:hover,
.bg-gradient-blue > .card-header .btn-tool:hover,
.card-blue:not(.card-outline) > .card-header .btn-tool:hover {
  color: #fff;
}

.card.bg-blue .bootstrap-datetimepicker-widget .table td,
.card.bg-blue .bootstrap-datetimepicker-widget .table th,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget .table td,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget .table th {
  border: none;
}

.card.bg-blue .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-blue .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-blue .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-blue .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-blue .bootstrap-datetimepicker-widget table td.second:hover,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget table td.second:hover {
  background-color: #0067d6;
  color: #fff;
}

.card.bg-blue .bootstrap-datetimepicker-widget table td.today::before,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget table td.today::before {
  border-bottom-color: #fff;
}

.card.bg-blue .bootstrap-datetimepicker-widget table td.active,
.card.bg-blue .bootstrap-datetimepicker-widget table td.active:hover,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget table td.active,
.card.bg-gradient-blue .bootstrap-datetimepicker-widget table td.active:hover {
  background-color: #3395ff;
  color: #fff;
}

.card-indigo:not(.card-outline) > .card-header {
  background-color: #6610f2;
}

.card-indigo:not(.card-outline) > .card-header,
.card-indigo:not(.card-outline) > .card-header a {
  color: #fff;
}

.card-indigo:not(.card-outline) > .card-header a.active {
  color: #1f2d3d;
}

.card-indigo.card-outline {
  border-top: 3px solid #6610f2;
}

.card-indigo.card-outline-tabs > .card-header a:hover {
  border-top: 3px solid #dee2e6;
}

.card-indigo.card-outline-tabs > .card-header a.active,
.card-indigo.card-outline-tabs > .card-header a.active:hover {
  border-top: 3px solid #6610f2;
}

.bg-indigo > .card-header .btn-tool,
.bg-gradient-indigo > .card-header .btn-tool,
.card-indigo:not(.card-outline) > .card-header .btn-tool {
  color: rgba(255, 255, 255, 0.8);
}

.bg-indigo > .card-header .btn-tool:hover,
.bg-gradient-indigo > .card-header .btn-tool:hover,
.card-indigo:not(.card-outline) > .card-header .btn-tool:hover {
  color: #fff;
}

.card.bg-indigo .bootstrap-datetimepicker-widget .table td,
.card.bg-indigo .bootstrap-datetimepicker-widget .table th,
.card.bg-gradient-indigo .bootstrap-datetimepicker-widget .table td,
.card.bg-gradient-indigo .bootstrap-datetimepicker-widget .table th {
  border: none;
}

.card.bg-indigo .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-indigo .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-indigo .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-indigo .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-indigo .bootstrap-datetimepicker-widget table td.second:hover,
.card.bg-gradient-indigo .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,
.card.bg-gradient-indigo .bootstrap-datetimepicker-widget table td.day:hover,
.card.bg-gradient-indigo .bootstrap-datetimepicker-widget table td.hour:hover,
.card.bg-gradient-indigo .bootstrap-datetimepicker-widget table td.minute:hover,
.card.bg-gradient-indigo .bootstrap-datetimepicker-widget table td.second:hover {
  background-color: #550bce;
  color: #fff;
}

.card.bg-indigo .bootstrap-datetimepicker-widget table td.today::before,
.card.bg-gradient-indigo .bootstrap-datetimepicker-.select2-search__field:focus,.select2-container--default .dark-mode .select2-fuchsia .select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-fuchsia .select2-search--inline .select2-search__field:focus,.select2-container--default .dark-mode .select2-fuchsia.select2-dropdown .select2-search__field:focus{border:1px solid #feeaf9}.dark-mode .select2-fuchsia .select2-container--default .select2-results__option--highlighted,.select2-container--default .dark-mode .select2-fuchsia .select2-results__option--highlighted{background-color:#f672d8;color:#1f2d3d}.dark-mode .select2-fuchsia .select2-container--default .select2-results__option--highlighted[aria-selected],.dark-mode .select2-fuchsia .select2-container--default .select2-results__option--highlighted[aria-selected]:hover,.select2-container--default .dark-mode .select2-fuchsia .select2-results__option--highlighted[aria-selected],.select2-container--default .dark-mode .select2-fuchsia .select2-results__option--highlighted[aria-selected]:hover{background-color:#f564d4;color:#1f2d3d}.dark-mode .select2-fuchsia .select2-container--default .select2-selection--multiple:focus,.select2-container--default .dark-mode .select2-fuchsia .select2-selection--multiple:focus{border-color:#feeaf9}.dark-mode .select2-fuchsia .select2-container--default .select2-selection--multiple .select2-selection__choice,.select2-container--default .dark-mode .select2-fuchsia .select2-selection--multiple .select2-selection__choice{background-color:#f672d8;border-color:#f55ad2;color:#1f2d3d}.dark-mode .select2-fuchsia .select2-container--default .select2-selection--multiple .select2-selection__choice__remove,.select2-container--default .dark-mode .select2-fuchsia .select2-selection--multiple .select2-selection__choice__remove{color:rgba(31,45,61,.7)}.dark-mode .select2-fuchsia .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-container--default .dark-mode .select2-fuchsia .select2-selection--multiple .select2-selection__choice__remove:hover{color:#1f2d3d}.dark-mode .select2-fuchsia .select2-container--default.select2-container--focus .select2-selection--multiple,.select2-container--default .dark-mode .select2-fuchsia.select2-container--focus .select2-selection--multiple{border-color:#feeaf9}.dark-mode .select2-maroon+.select2-container--default.select2-container--open .select2-selection--single{border-color:#fbdee8}.dark-mode .select2-maroon+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#fbdee8}.dark-mode .select2-maroon .select2-container--default .select2-dropdown .select2-search__field:focus,.dark-mode .select2-maroon .select2-container--default .select2-search--inline .select2-search__field:focus,.dark-mode .select2-maroon .select2-container--default.select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-maroon .select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-maroon .select2-search--inline .select2-search__field:focus,.select2-container--default .dark-mode .select2-maroon.select2-dropdown .select2-search__field:focus{border:1px solid #fbdee8}.dark-mode .select2-maroon .select2-container--default .select2-results__option--highlighted,.select2-container--default .dark-mode .select2-maroon .select2-results__option--highlighted{background-color:#ed6c9b;color:#1f2d3d}.dark-mode .select2-maroon .select2-container--default .select2-results__option--highlighted[aria-selected],.dark-mode .select2-maroon .select2-container--default .select2-results__option--highlighted[aria-selected]:hover,.select2-container--default .dark-mode .select2-maroon .select2-results__option--highlighted[aria-selected],.select2-container--default .dark-mode .select2-maroon .select2-results__option--highlighted[aria-selected]:hover{background-color:#eb5f92;color:#fff}.dark-mode .select2-maroon .select2-container--default .select2-selection--multiple:focus,.select2-container--default .dark-mode .select2-maroon .select2-selection--multiple:focus{border-color:#fbdee8}.dark-mode .select2-maroon .select2-container--default .select2-selection--multiple .select2-selection__choice,.select2-container--default .dark-mode .select2-maroon .select2-selection--multiple .select2-selection__choice{background-color:#ed6c9b;border-color:#ea568c;color:#1f2d3d}.dark-mode .select2-maroon .select2-container--default .select2-selection--multiple .select2-selection__choice__remove,.select2-container--default .dark-mode .select2-maroon .select2-selection--multiple .select2-selection__choice__remove{color:rgba(31,45,61,.7)}.dark-mode .select2-maroon .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-container--default .dark-mode .select2-maroon .select2-selection--multiple .select2-selection__choice__remove:hover{color:#1f2d3d}.dark-mode .select2-maroon .select2-container--default.select2-container--focus .select2-selection--multiple,.select2-container--default .dark-mode .select2-maroon.select2-container--focus .select2-selection--multiple{border-color:#fbdee8}.dark-mode .select2-blue+.select2-container--default.select2-container--open .select2-selection--single{border-color:#85a7ca}.dark-mode .select2-blue+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#85a7ca}.dark-mode .select2-blue .select2-container--default .select2-dropdown .select2-search__field:focus,.dark-mode .select2-blue .select2-container--default .select2-search--inline .select2-search__field:focus,.dark-mode .select2-blue .select2-container--default.select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-blue .select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-blue .select2-search--inline .select2-search__field:focus,.select2-container--default .dark-mode .select2-blue.select2-dropdown .select2-search__field:focus{border:1px solid #85a7ca}.dark-mode .select2-blue .select2-container--default .select2-results__option--highlighted,.select2-container--default .dark-mode .select2-blue .select2-results__option--highlighted{background-color:#3f6791;color:#fff}.dark-mode .select2-blue .select2-container--default .select2-results__option--highlighted[aria-selected],.dark-mode .select2-blue .select2-container--default .select2-results__option--highlighted[aria-selected]:hover,.select2-container--default .dark-mode .select2-blue .select2-results__option--highlighted[aria-selected],.select2-container--default .dark-mode .select2-blue .select2-results__option--highlighted[aria-selected]:hover{background-color:#3a5f86;color:#fff}.dark-mode .select2-blue .select2-container--default .select2-selection--multiple:focus,.select2-container--default .dark-mode .select2-blue .select2-selection--multiple:focus{border-color:#85a7ca}.dark-mode .select2-blue .select2-container--default .select2-selection--multiple .select2-selection__choice,.select2-container--default .dark-mode .select2-blue .select2-selection--multiple .select2-selection__choice{background-color:#3f6791;border-color:#375a7f;color:#fff}.dark-mode .select2-blue .select2-container--default .select2-selection--multiple .select2-selection__choice__remove,.select2-container--default .dark-mode .select2-blue .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.dark-mode .select2-blue .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-container--default .dark-mode .select2-blue .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.dark-mode .select2-blue .select2-container--default.select2-container--focus .select2-selection--multiple,.select2-container--default .dark-mode .select2-blue.select2-container--focus .select2-selection--multiple{border-color:#85a7ca}.dark-mode .select2-indigo+.select2-container--default.select2-container--open .select2-selection--single{border-color:#b389f9}.dark-mode .select2-indigo+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#b389f9}.dark-mode .select2-indigo .select2-container--default .select2-dropdown .select2-search__field:focus,.dark-mode .select2-indigo .select2-container--default .select2-search--inline .select2-search__field:focus,.dark-mode .select2-indigo .select2-container--default.select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-indigo .select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-indigo .select2-search--inline .select2-search__field:focus,.select2-container--default .dark-mode .select2-indigo.select2-dropdown .select2-search__field:focus{border:1px solid #b389f9}.dark-mode .select2-indigo .select2-container--default .select2-results__option--highlighted,.select2-container--default .dark-mode .select2-indigo .select2-results__option--highlighted{background-color:#6610f2;color:#fff}.dark-mode .select2-indigo .select2-container--default .select2-results__option--highlighted[aria-selected],.dark-mode .select2-indigo .select2-container--default .select2-results__option--highlighted[aria-selected]:hover,.select2-container--default .dark-mode .select2-indigo .select2-results__option--highlighted[aria-selected],.select2-container--default .dark-mode .select2-indigo .select2-results__option--highlighted[aria-selected]:hover{background-color:#5f0de6;color:#fff}.dark-mode .select2-indigo .select2-container--default .select2-selection--multiple:focus,.select2-container--default .dark-mode .select2-indigo .select2-selection--multiple:focus{border-color:#b389f9}.dark-mode .select2-indigo .select2-container--default .select2-selection--multiple .select2-selection__choice,.select2-container--default .dark-mode .select2-indigo .select2-selection--multiple .select2-selection__choice{background-color:#6610f2;border-color:#5b0cdd;color:#fff}.dark-mode .select2-indigo .select2-container--default .select2-selection--multiple .select2-selection__choice__remove,.select2-container--default .dark-mode .select2-indigo .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.dark-mode .select2-indigo .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-container--default .dark-mode .select2-indigo .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.dark-mode .select2-indigo .select2-container--default.select2-container--focus .select2-selection--multiple,.select2-container--default .dark-mode .select2-indigo.select2-container--focus .select2-selection--multiple{border-color:#b389f9}.dark-mode .select2-purple+.select2-container--default.select2-container--open .select2-selection--single{border-color:#b8a2e0}.dark-mode .select2-purple+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#b8a2e0}.dark-mode .select2-purple .select2-container--default .select2-dropdown .select2-search__field:focus,.dark-mode .select2-purple .select2-container--default .select2-search--inline .select2-search__field:focus,.dark-mode .select2-purple .select2-container--default.select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-purple .select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-purple .select2-search--inline .select2-search__field:focus,.select2-container--default .dark-mode .select2-purple.select2-dropdown .select2-search__field:focus{border:1px solid #b8a2e0}.dark-mode .select2-purple .select2-container--default .select2-results__option--highlighted,.select2-container--default .dark-mode .select2-purple .select2-results__option--highlighted{background-color:#6f42c1;color:#fff}.dark-mode .select2-purple .select2-container--default .select2-results__option--highlighted[aria-selected],.dark-mode .select2-purple .select2-container--default .select2-results__option--highlighted[aria-selected]:hover,.select2-container--default .dark-mode .select2-purple .select2-results__option--highlighted[aria-selected],.select2-container--default .dark-mode .select2-purple .select2-results__option--highlighted[aria-selected]:hover{background-color:#683cb8;color:#fff}.dark-mode .select2-purple .select2-container--default .select2-selection--multiple:focus,.select2-container--default .dark-mode .select2-purple .select2-selection--multiple:focus{border-color:#b8a2e0}.dark-mode .select2-purple .select2-container--default .select2-selection--multiple .select2-selection__choice,.select2-container--default .dark-mode .select2-purple .select2-selection--multiple .select2-selection__choice{background-color:#6f42c1;border-color:#643ab0;color:#fff}.dark-mode .select2-purple .select2-container--default .select2-selection--multiple .select2-selection__choice__remove,.select2-container--default .dark-mode .select2-purple .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.dark-mode .select2-purple .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-container--default .dark-mode .select2-purple .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.dark-mode .select2-purple .select2-container--default.select2-container--focus .select2-selection--multiple,.select2-container--default .dark-mode .select2-purple.select2-container--focus .select2-selection--multiple{border-color:#b8a2e0}.dark-mode .select2-pink+.select2-container--default.select2-container--open .select2-selection--single{border-color:#f6b0d0}.dark-mode .select2-pink+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#f6b0d0}.dark-mode .select2-pink .select2-container--default .select2-dropdown .select2-search__field:focus,.dark-mode .select2-pink .select2-container--default .select2-search--inline .select2-search__field:focus,.dark-mode .select2-pink .select2-container--default.select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-pink .select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-pink .select2-search--inline .select2-search__field:focus,.select2-container--default .dark-mode .select2-pink.select2-dropdown .select2-search__field:focus{border:1px solid #f6b0d0}.dark-mode .select2-pink .select2-container--default .select2-results__option--highlighted,.select2-container--default .dark-mode .select2-pink .select2-results__option--highlighted{background-color:#e83e8c;color:#fff}.dark-mode .select2-pink .select2-container--default .select2-results__option--highlighted[aria-selected],.dark-mode .select2-pink .select2-container--default .select2-results__option--highlighted[aria-selected]:hover,.select2-container--default .dark-mode .select2-pink .select2-results__option--highlighted[aria-selected],.select2-container--default .dark-mode .select2-pink .select2-results__option--highlighted[aria-selected]:hover{background-color:#e63084;color:#fff}.dark-mode .select2-pink .select2-container--default .select2-selection--multiple:focus,.select2-container--default .dark-mode .select2-pink .select2-selection--multiple:focus{border-color:#f6b0d0}.dark-mode .select2-pink .select2-container--default .select2-selection--multiple .select2-selection__choice,.select2-container--default .dark-mode .select2-pink .select2-selection--multiple .select2-selection__choice{background-color:#e83e8c;border-color:#e5277e;color:#fff}.dark-mode .select2-pink .select2-container--default .select2-selection--multiple .select2-selection__choice__remove,.select2-container--default .dark-mode .select2-pink .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.dark-mode .select2-pink .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-container--default .dark-mode .select2-pink .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.dark-mode .select2-pink .select2-container--default.select2-container--focus .select2-selection--multiple,.select2-containe<?php
    $dataHeader['titulo']= "Crear usuarios";
    $this->load->view('layouts/header', $dataHeader);
?>

<?php
    $dataSidebar['session']= "session";
    $this->load->view('layouts/sidebar');
?>

<div class="content-wrapper">
        <div class="col-12 m-0 p-3">
            <h1 class="text-primary text-center">FORMULARIO PARA CREAR USUARIO</h1>
            <?php echo form_open(); ?>
       
            <div class="container">
              <?php echo form_open(); ?>

              <div class="form-group">
              <?php 
                      echo form_label('Documento', 'documento');
                      $datas = [
                          'name'      => 'cedula',
                          'value'     => '',
                          'class' => 'form-control input-lg',
                      ];
                      echo form_input($datas);
                  ?>
              </div>

              <div class="form-group">
                  <?php 
                      echo form_label('Nombre', 'nombre');
                      $datas = [
                          'name'      => 'nombres',
                          'value'     => '',
                          'class' => 'form-control input-lg',
                      ];
                      echo form_input($datas);
                  ?>
              </div>

              

              <div class="form-group">
                  <?php 
                      echo form_label('Correo', 'correo');
                      $data1 = [
                          'name'  => 'email',
                          'type'  => 'email',
                          
                          'class' => 'form-control input-lg',
                      ];

                      echo form_input($data1);
                  ?>
              </div>
              <div class="form-group">
                      <?php 
                          echo form_label('Contrasenia:', 'contrasenia');
                      ?>
                      <br>
                      <?php
                      $data1 = [
                          'name'  => 'password',
                          'type'  => 'password',
                          'class' => 'form-control input-lg',
                        
                      ];
                      echo form_input($data1);
                    ?>

              </div>

            <div class="form-group mt-3">
                <?php 
                ?>

                    <div class="mr-2">
                <?php
                    echo form_label('Estado', 'tipo');
                    ?>
                    </div> 
                    <?php
                    $data = [
                        'Activo'  => 'Activo',
                        'Inactivo'  => 'Inactivo', 
                    ];
                    echo form_dropdown('shirts', $data, 'large', 'class="form-control"');
                ?>
            </div>

            <div class="form-group mt-3">
                <?php 
                ?>
                    <div class="mr-2">
                <?php
                    echo form_label('Tipo', 'tipo');
                    ?>
                    </div> 
                    <?php
                    $data = [
                        'ADMIN'  => 'ADMIN',
                        'CAJERO'  => 'CAJERO',  
                    ];
                    echo form_dropdown('shirts2', $data, 'large', 'class="form-control"');
                ?>
            </div>

              <?php echo form_submit('mysubmit', 'Enviar', "class='btn btn-primary'");?>

              <?php echo form_close(); ?>
            </div>
        </div>
</div>
<?php
    $this->load->view('layouts/footer');
?>                                                                                                                                                                                                                                                                                                  }\n\n        ~ .input-group-append .input-group-text {\n          border-color: $danger;\n        }\n      }\n    }\n\n    .input-group-text {\n      background-color: transparent;\n      border-bottom-right-radius: $border-radius;\n      border-left: 0;\n      border-top-right-radius: $border-radius;\n      color: #777;\n      transition: $input-transition;\n    }\n  }\n}\n\n.login-box-msg,\n.register-box-msg {\n  margin: 0;\n  padding: 0 20px 20px;\n  text-align: center;\n}\n\n.social-auth-links {\n  margin: 10px 0;\n}\n\n@include dark-mode () {\n  .login-card-body,\n  .register-card-body {\n    background-color: $dark;\n    border-color: $gray-600;\n    color: $white;\n  }\n  .login-logo,\n  .register-logo {\n    a {\n      color: $white;\n    }\n  }\n}\n","//\n// Pages: 400 and 500 error pages\n//\n\n.error-page {\n  margin: 20px auto 0;\n  width: 600px;\n\n  @include media-breakpoint-down(sm) {\n    width: 100%;\n  }\n\n  //For the error number e.g: 404\n  > .headline {\n    float: left;\n    font-size: 100px;\n    font-weight: 300;\n\n    @include media-breakpoint-down(sm) {\n      float: none;\n      text-align: center;\n    }\n  }\n\n  //For the message\n  > .error-content {\n    display: block;\n    margin-left: 190px;\n\n    @include media-breakpoint-down(sm) {\n      margin-left: 0;\n    }\n\n    > h3 {\n      font-size: 25px;\n      font-weight: 300;\n\n      @include media-breakpoint-down(sm) {\n        text-align: center;\n      }\n    }\n  }\n}\n","//\n// Pages: Invoice\n//\n\n.invoice {\n  background-color: $white;\n  border: 1px solid $card-border-color;\n  position: relative;\n}\n\n.invoice-title {\n  margin-top: 0;\n}\n\n@include dark-mode () {\n  .invoice {\n    background-color: $dark;\n  }\n}\n","//\n// Pages: Profile\n//\n\n.profile-user-img {\n  border: 3px solid $gray-500;\n  margin: 0 auto;\n  padding: 3px;\n  width: 100px;\n}\n\n.profile-username {\n  font-size: 21px;\n  margin-top: 5px;\n}\n\n.post {\n  border-bottom: 1px solid $gray-500;\n  color: #666;\n  margin-bottom: 15px;\n  padding-bottom: 15px;\n\n  &:last-of-type {\n    border-bottom: 0;\n    margin-bottom: 0;\n    padding-bottom: 0;\n  }\n\n  .user-block {\n    margin-bottom: 15px;\n    width: 100%;\n  }\n\n  .row {\n    width: 100%;\n  }\n}\n\n@include dark-mode () {\n  .post {\n    color: $white;\n    border-color: $gray-600;\n  }\n}\n","//\n// Pages: E-commerce\n//\n\n// product image\n.product-image {\n  @include img-fluid ();\n  width: 100%;\n}\n\n// product image thumbnails list\n.product-image-thumbs {\n  align-items: stretch;\n  display: flex;\n  margin-top: 2rem;\n}\n\n// product image thumbnail\n.product-image-thumb {\n  @include box-shadow($thumbnail-box-shadow);\n  @include border-radius($thumbnail-border-radius);\n\n  background-color: $thumbnail-bg;\n  border: $thumbnail-border-width solid $thumbnail-border-color;\n  display: flex;\n  margin-right: 1rem;\n  max-width: 6.5rem + ($thumbnail-padding * 2);\n  padding: $thumbnail-padding * 2;\n\n  img {\n    @include img-fluid ();\n    align-self: center;\n  }\n\n  &:hover {\n    opacity: .5;\n  }\n}\n\n// product share\n.product-share {\n  a {\n    margin-right: .5rem;\n  }\n}\n","//\n// Pages: Projects\n//\n\n.projects {\n  td {\n    vertical-align: middle;\n  }\n\n  .list-inline {\n    margin-bottom: 0;\n  }\n\n  // table avatar\n  img.table-avatar,\n  .table-avatar img {\n    border-radius: 50%;\n    display: inline;\n    width: 2.5rem;\n  }\n\n  // project state\n  .project-state {\n    text-align: center;\n  }\n}\n","body.iframe-mode {\n  .main-sidebar {\n    display: none;\n  }\n  .content-wrapper {\n    margin-left: 0 !important;\n    margin-top: 0 !important;\n    padding-bottom: 0 !important;\n  }\n  .main-header,\n  .main-footer {\n    display: none;\n  }\n}\n\nbody.iframe-mode-fullscreen {\n  overflow: hidden;\n\n  &.layout-navbar-fixed .wrapper .content-wrapper {\n    margin-top: 0 !important;\n  }\n}\n\n.content-wrapper {\n  height: 100%;\n\n  &.iframe-mode {\n    .btn-iframe-close {\n      color: $danger;\n      position: absolute;\n      line-height: 1;\n      right: .125rem;\n      top: .125rem;\n      z-index: 10;\n      visibility: hidden;\n\n      &:hover,\n      &:focus {\n        animation-name: fadeIn;\n        animation-duration: $transition-speed;\n        animation-fill-mode: both;\n        visibility: visible;\n      }\n\n      @include on-touch-device() {\n        visibility: visible;\n      }\n    }\n    .navbar-nav {\n      overflow-y: auto;\n      width: 100%;\n\n      .nav-link {\n        white-space: nowrap;\n      }\n      .nav-item {\n        position: relative;\n\n        &:hover,\n        &:focus {\n          .btn-iframe-close {\n            animation-name: fadeIn;\n            animation-duration: $transition-speed;\n            animation-fill-mode: both;\n            visibility: visible;\n\n            @include on-touch-device() {\n              visibility: visible;\n            }\n          }\n        }\n      }\n    }\n    .tab-content {\n      position: relative;\n    }\n    .tab-pane + .tab-empty {\n      display: none;\n    }\n    .tab-empty {\n      width: 100%;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    }\n    .tab-loading {\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      display: none;\n      background-color: $main-bg;\n\n      > div {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: 100%;\n        height: 100%;\n      }\n    }\n\n    iframe {\n      border: 0;\n      width: 100%;\n      height: 100%;\n      margin-bottom: -8px;\n\n      .content-wrapper {\n        padding-bottom: 0 !important;\n      }\n    }\n\n    body.iframe-mode-fullscreen & {\n      position: absolute;\n      left: 0;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      margin-left: 0 !important;\n      height: 100%;\n      min-height: 100%;\n      z-index: $zindex-main-sidebar + 10;\n    }\n  }\n}\n\n.permanent-btn-iframe-close {\n  .btn-iframe-close {\n    animation: none !important;\n    visibility: visible !important;\n    opacity: 1;\n  }\n}\n\n@include dark-mode () {\n  .content-wrapper.iframe-mode {\n    .tab-loading {\n      background-color: $dark;\n    }\n  }\n}\n","//\n// Mixins: Touch Support\n//\n\n@mixin on-touch-device {\n  @media (hover: none) and (pointer: coarse) {\n    @content;\n  }\n}\n\n//\n",".content-wrapper.kanban {\n  height: 1px;\n\n  .content {\n    height: 100%;\n    overflow-x: auto;\n    overflow-y: hidden;\n\n    .container,\n    .container-fluid {\n      width: max-content;\n      display: flex;\n      align-items: stretch;\n    }\n  }\n  .content-header + .content {\n    height: calc(100% - ((2 * 15px) + (1.8rem * #{$headings-line-height})));\n  }\n\n  .card {\n    .card-body {\n      padding: .5rem;\n    }\n\n    &.card-row {\n      width: 340px;\n      display: inline-block;\n      margin: 0 .5rem;\n\n      &:first-child {\n        margin-left: 0;\n      }\n\n      .card-body {\n        height: calc(100% - (12px + (1.8rem * #{$headings-line-height}) + .5rem));\n        overflow-y: auto;\n      }\n\n      .card {\n        &:last-child {\n          margin-bottom: 0;\n          border-bottom-width: 1px;\n        }\n        .card-header {\n          padding: .5rem .75rem;\n        }\n        .card-body {\n          padding: .75rem;\n        }\n      }\n    }\n  }\n  .btn-tool {\n    &.btn-link {\n      text-decoration: underline;\n      padding-left: 0;\n      padding-right: 0;\n    }\n  }\n}\n","//\n// Plugin: Full Calendar\n//\n\n// Buttons\n.fc-button {\n  background: $gray-100;\n  background-image: none;\n  border-bottom-color: #ddd;\n  border-color: #ddd;\n  color: $gray-700;\n\n  &:hover,\n  &:active,\n  &.hover {\n    background-color: #e9e9e9;\n  }\n}\n\n// Calendar title\n.fc-header-title h2 {\n  color: #666;\n  font-size: 15px;\n  line-height: 1.6em;\n  margin-left: 10px;\n}\n\n.fc-header-right {\n  padding-right: 10px;\n}\n\n.fc-header-left {\n  padding-left: 10px;\n}\n\n// Calendar table header cells\n.fc-widget-header {\n  background: #fafafa;\n}\n\n.fc-grid {\n  border: 0;\n  width: 100%;\n}\n\n.fc-widget-header:first-of-type,\n.fc-widget-content:first-of-type {\n  border-left: 0;\n  border-right: 0;\n}\n\n.fc-widget-header:last-of-type,\n.fc-widget-content:last-of-type {\n  border-right: 0;\n}\n\n.fc-toolbar,\n.fc-toolbar.fc-header-toolbar {\n  margin: 0;\n  padding: 1rem;\n}\n\n@include media-breakpoint-down(xs) {\n  .fc-toolbar {\n    flex-direction: column;\n\n    .fc-left {\n      order: 1;\n      margin-bottom: .5rem;\n    }\n\n    .fc-center {\n      order: 0;\n      margin-bottom: .375rem;\n    }\n\n    .fc-right {\n      order: 2;\n    }\n  }\n}\n\n.fc-day-number {\n  font-size: 20px;\n  font-weight: 300;\n  padding-right: 10px;\n}\n\n.fc-color-picker {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n\n  > li {\n    float: left;\n    font-size: 30px;\n    line-height: 30px;\n    margin-right: 5px;\n\n    .fa,\n    .fas,\n    .far,\n    .fab,\n    .fal,\n    .fad,\n    .svg-inline--fa,\n    .ion {\n      transition: transform linear .3s;\n\n      &:hover {\n        @include rotate(30deg);\n      }\n    }\n  }\n}\n\n#add-new-event {\n  transition: all linear .3s;\n}\n\n.external-event {\n  @include box-shadow($card-shadow);\n\n  border-radius: $border-radius;\n  cursor: move;\n  font-weight: 700;\n  margin-bottom: 4px;\n  padding: 5px 10px;\n\n  &:hover {\n    @include box-shadow(inset 0 0 90px rgba(0, 0, 0, 0.2));\n  }\n}\n","//\n// Plugin: Select2\n//\n\n//Signle select\n// .select2-container--default,\n// .select2-selection {\n//   &.select2-container--focus,\n//   &:focus,\n//   &:active {\n//     outline: none;\n//   }\n// }\n\n.select2-container--default {\n  .select2-selection--single {\n    border: $input-border-width solid $input-border-color;\n    //border-radius: $input-radius;\n    padding: ($input-padding-y * 1.25) $input-padding-x;\n    height: $input-height;\n  }\n\n  &.select2-container--open {\n    .select2-selection--single {\n      border-color: lighten($primary, 25%);\n    }\n  }\n\n  & .select2-dropdown {\n    border: $input-border-width solid $input-border-color;\n    //border-radius: $input-radius;\n  }\n\n  & .select2-results__option {\n    padding: 6px 12px;\n    user-select: none;\n  }\n\n  & .select2-selection--single .select2-selection__rendered {\n    padding-left: 0;\n    //padding-right: 0;\n    height: auto;\n    margin-top: -3px;\n  }\n\n  &[dir=\"rtl\"] .select2-selection--single .select2-selection__rendered {\n    padding-right: 6px;\n    padding-left: 20px;\n  }\n\n  & .select2-selection--single .select2-selection__arrow {\n    height: 31px;\n    right: 6px;\n  }\n\n  & .select2-selection--single .select2-selection__arrow b {\n    margin-top: 0;\n  }\n\n  .select2-dropdown,\n  .select2-search--inline {\n    .select2-search__field {\n      border: $input-border-width solid $input-border-color;\n\n      &:focus {\n        outline: none;\n        border: $input-border-width solid $input-focus-border-color;\n      }\n    }\n  }\n\n  .select2-dropdown {\n    &.select2-dropdown--below {\n      border-top: 0;\n    }\n\n    &.select2-dropdown--above {\n      border-bottom: 0;\n    }\n  }\n\n  .select2-results__option {\n    &[aria-disabled='true'] {\n      color: $gray-600;\n    }\n\n    &[aria-selected='true'] {\n      $color: $gray-300;\n\n      background-color: $color;\n\n      &,\n      &:hover {\n        color: color-yiq($color);\n      }\n    }\n  }\n\n  .select2-results__option--highlighted {\n    $color: $primary;\n    background-color: $color;\n    color: color-yiq($color);\n\n    &[aria-selected] {\n      $color: darken($color, 3%);\n\n      &,\n      &:hover {\n        background-color: $color;\n        color: color-yiq($color);\n      }\n    }\n  }\n\n  //Multiple select\n  & {\n    .select2-selection--multiple {\n      border: $input-border-width solid $input-border-color;\n      min-height: $input-height;\n\n      &:focus {\n        border-color: $input-focus-border-color;\n      }\n\n      .select2-selection__rendered {\n        padding: 0 $input-padding-x * 0.5 $input-padding-y;\n        margin-bottom: -$input-padding-x * 0.5;\n\n        li:fi