/*globals jQuery */
/*!
 * jQuery imagesLoaded plugin v1.0.4
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */
(function ($) {
	"use strict";
	// $('#my-container').imagesLoaded(myFunction)
	// or
	// $('img').imagesLoaded(myFunction)
	// execute a callback when all images have loaded.
	// needed because .load() doesn't work on cached images
	// callback function gets image collection as argument
	//  `this` is the container
	$.fn.imagesLoaded = function (callback) {
		var $this = this,
			$images = $this.find('img').add($this.filter('img')),
			len = $images.length,
			blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
		function triggerCallback() {
			callback.call($this, $images);
		}
		function imgLoaded(event) {
			if (--len <= 0 && event.target.src !== blank) {
				setTimeout(triggerCallback);
				$images.unbind('load error', imgLoaded);
			}
		}
		if (!len) {
			triggerCallback();
		}
		$images.bind('load error', imgLoaded).each(function () {
			// cached images don't fire load sometimes, so we reset src.
			if (this.complete || this.complete === undefined) {
				var src = this.src;
				// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
				// data uri bypasses webkit log warning (thx doug jones)
				this.src = blank;
				this.src = src;
			}
		});
		return $this;
	};
}(jQuery));


/*
 * CJ Flashy Slideshow jQuery Plugin
 *
 * Copyright (c) 2011 Creative Juices Bo. Co.
 * Written by: Doug Jones (www.cjboco.com)
 * Licensed under the MIT.
 *
 * A jQuery Plugin That Gives Your Slide Shows Some Flash-Like Transitions
 *
 * Version History
 * --------------------------------------------------------------------------------
 * 2.1.1 - 12-20-2011
 *		Minor changes to to make sure you can use ustom options (from version 1.1.2).
 *		Added more directions (topleft, topright, bottomleft, bottomright)
 * 2.1 - 12-20-2011
 *		Added the ability to use links on your images.
 *			 (This version now uses and required jQuery 1.7+)
 *		Fixed the padding, margin, border offset problem.
 * 2.0 - 12-19-2011
 *		Re-write to new plug-in structure.
 *		updated imagesLoaded fn.
 * 1.1.3 - 05-22-2010
 *		Added preset support.
 * 1.1.2 - 05-12-2010
 *		Another stab at the images loader.
 * 1.1.1 - 04-23-2010
 *		Added ability to wait until images are loaded.
 * 1.1 - 10-16-2009
 *		Added directional support.
 * 1.0	10-15-2009
 *		Initial Release
 *
 */
(function ($) {
	"use strict";

	$.cjFlashySlideShow = function ($obj, settings) {

		var options = {
				// user editable options
				preset: null,
				xBlocks: 12,
				yBlocks: 3,
				minBlockSize: 3,
				delay: 3000,
				direction: 'left',
				style: 'normal',
				translucent: false,
				sloppy: false
			},

			_randomRange = function (a, b, f) {
				var v = a + (Math.random() * (b - a));
				return typeof f == 'undefined' ? Math.round(v) : v.toFixed(f);
			},

			_getNextSlide = function (n) {
				var sys = $obj.data('system');
				if (parseInt(n, 10) + 1 < sys.imgs.length) {
					return sys.imgs[n + 1];
				} else {
					return sys.imgs[0];
				}
			};



		/*
			core functions
		***************************************/

		// reset our transitional blocks
		function resetBlocks() {
			var sys = $obj.data('system'),
				next_slide = _getNextSlide(sys.current_img),
				slide_src;

			// loop through and find each transition block
			$obj.find('#cjFlashyTransitionTop .cjFlashyTransitionBlock').each(function () {

				var $this = $(this),
					data = $this.data('info');

				// randomize the direction (if set)
				if (options.direction === 'random') {
					options.current_direction = sys.directions[parseInt(_randomRange(0, sys.directions.length - 1), 10)];

					// calculate positions
					if (options.current_direction === 'top') {

						data.start_top = options.minBlockSize * -1;
						data.start_left = parseInt((sys.block_w * data.x) + (sys.block_w / 2) - (options.minBlockSize / 2), 10);

					} else if (options.current_direction === 'topleft') {

						data.start_top = options.minBlockSize * -1;
						data.start_left = options.minBlockSize * -1;

					} else if (options.current_direction === 'topright') {

						data.start_top = options.minBlockSize * -1;
						data.start_left = sys.w + options.minBlockSize;

					} else if (options.current_direction === 'left') {

						data.start_top = parseInt((sys.block_h * data.y) + (sys.block_h / 2) - (options.minBlockSize / 2), 10);
						data.start_left = options.minBlockSize * -1;

					} else if (options.current_direction === 'bottom') {

						data.start_top = sys.h + options.minBlockSize;
						data.start_left = parseInt((sys.block_w * data.x) + (sys.block_w / 2) - (options.minBlockSize / 2), 10);

					} else if (options.current_direction === 'bottomleft') {

						data.start_top = sys.h + options.minBlockSize;
						data.start_left = options.minBlockSize * -1;

					} else if (options.current_direction === 'bottomright') {

						data.start_top = sys.h + options.minBlockSize;
						data.start_left = sys.w + options.minBlockSize;

					} else if (options.current_direction === 'right') {

						data.start_top = parseInt((sys.block_h * data.y) + (sys.block_h / 2) - (options.minBlockSize / 2), 10);
						data.start_left = sys.w + options.minBlockSize;

					} else {

						data.start_top = parseInt((sys.block_h * data.y) + (sys.block_h / 2) - (options.minBlockSize / 2), 10);
						data.start_left = parseInt((sys.block_w * data.x) + (sys.block_w / 2) - (options.minBlockSize / 2), 10);

					}

				}

				// determine the image source
				if (next_slide.nodeName === 'A') {
					slide_src = $(next_slide).find('img').get(0).src;
				} else {
					slide_src = next_slide.src;
				}

				$this.css({
					top: data.start_top + 'px',
					left: data.start_left + 'px',
					width: options.minBlockSize + 'px',
					height: options.minBlockSize + 'px',
					'background-image': 'url(' + slide_src + ')',
					opacity: data.opacity
				});

				$this.data('info', data);
			});
		}

		// handle image swaps and delay once transitional blocks are done.
		function handleBlocksDone(clb) {
			var sys = $obj.data('system'),
				next_slide, slide_src;
			sys.current_blocks++;
			if (sys.current_blocks === sys.total_blocks) {

				// get the next slide object
				next_slide = _getNextSlide(sys.current_img);

				// check for a link and determine the image source
				if (next_slide.nodeName === 'A') {
					$obj.off('click').on('click', function() {
						document.location.href = $(next_slide).attr('href');
						return false;
					}).css('cursor', 'pointer').attr('title', $(next_slide).attr('href'));
					slide_src = $(next_slide).find('img').get(0).src;
				} else {
					slide_src = next_slide.src;
				}

				// set slide src
				$obj.find('#cjFlashyTransitionBottom').css({
					'background-image': 'url(' + slide_src + ')',
					'background-attachment': 'scroll'
				});

				sys.current_blocks = 0;
				sys.current_img++;
				if (sys.current_img > sys.imgs.length - 1) {
					sys.current_img = 0;
				}
				resetBlocks();
				if (sys.timer && sys.timer !== null) {
					clearTimeout(sys.timer);
				}
				if ($.isFunction(clb)) {
					sys.timer = setTimeout(function () {
						clb.call();
					}, options.delay);
				}
			}
		}

		// animate our transitional blocks
		function animateBlocks() {
			var sys = $obj.data('system');
			$obj.find('#cjFlashyTransitionTop .cjFlashyTransitionBlock').each(function () {
				var $block = $(this),
					data = $block.data('info');
				$block.animate({
					top: parseInt(((sys.block_h * data.y) + (sys.block_h / 2) - (options.minBlockSize / 2)) + (options.sloppy ? _randomRange(0, options.minBlockSize) - (options.minBlockSize / 2) : 0), 10) + 'px',
					left: parseInt(((sys.block_w * data.x) + (sys.block_w / 2) - (options.minBlockSize / 2)) + (options.sloppy ? _randomRange(0, options.minBlockSize) - (options.minBlockSize / 2) : 0), 10) + 'px'
				}, (options.sloppy ? _randomRange(350, 1250) : 650), 'linear', function () {
					$block.animate({
						top: data.end_top + 'px',
						left: data.end_left + 'px',
						width: (sys.block_w * 2) + 'px',
						height: (sys.block_h * 2) + 'px',
						opacity: 1
					}, (options.sloppy ? _randomRange(250, 850) : 650), function () {
						handleBlocksDone(function () {
							animateBlocks();
						});
					});
				});
			});
		}

		// corrects the block's image offset to the page
		function correctOffset() {
			$obj.find('#cjFlashyTransitionTop .cjFlashyTransitionBlock').each(function () {
				var off = $obj.offset(),
					padMargBorFixW = parseInt(($obj.outerWidth() - $obj.width()) / 2, 10),
					padMargBorFixH = parseInt(($obj.outerHeight() - $obj.height()) / 2, 10);
				$(this).css({
					'background-position': (off.left + padMargBorFixW - $(window).scrollLeft()) + 'px ' + (off.top + padMargBorFixH - $(window).scrollTop()) + 'px'
				});
			});
		}

		// create our transitional blocks
		function createBlocks() {
			var sys = $obj.data('system'),
				$elem, $block,
				next_slide = _getNextSlide(sys.current_img),
				slide_src, data, x, y;
			for (y = 0; y < options.yBlocks; y++) {
				for (x = 0; x < options.xBlocks; x++) {

					$elem = $obj.find('#cjFlashyTransitionTop');
					$block = $('<div id="cjFlashyTransitionBlock_' + y + '_' + x + '" class="cjFlashyTransitionBlock">');
					$elem.append($block);

					data = {
						x: x,
						y: y,
						end_top: parseInt(((sys.block_h * y) - (sys.block_h / 2)), 10),
						end_left: parseInt(((sys.block_w * x) - (sys.block_w / 2)), 10)
					};

					// determine direction
					if (options.direction === 'random') {
						options.current_direction = sys.directions[_randomRange(0, sys.directions.length - 1)];
					}

					// calculate initial position
					if (options.current_direction === 'top') {

						data.start_top = options.minBlockSize * -1;
						data.start_left = parseInt((sys.block_w * x) + (sys.block_w / 2) - (options.minBlockSize / 2), 10);

					} else if (options.current_direction === 'topleft') {

						data.start_top = options.minBlockSize * -1;
						data.start_left = options.minBlockSize * -1;

					} else if (options.current_direction === 'topright') {

						data.start_top = options.minBlockSize * -1;
						data.start_left = sys.w + options.minBlockSize;

					} else if (options.current_direction === 'left') {

						data.start_top = parseInt((sys.block_h * y) + (sys.block_h / 2) - (options.minBlockSize / 2), 10);
						data.start_left = options.minBlockSize * -1;

					} else if (options.current_direction === 'bottom') {

						data.start_top = sys.h + options.minBlockSize;
						data.start_left = parseInt((sys.block_w * x) + (sys.block_w / 2) - (options.minBlockSize / 2), 10);

					} else if (options.current_direction === 'bottomleft') {

						data.start_top = sys.h + options.minBlockSize;
						data.start_left = options.minBlockSize * -1;

					} else if (options.current_direction === 'bottomright') {

						data.start_top = sys.h + options.minBlockSize;
						data.start_left = sys.w + options.minBlockSize;

					} else if (options.current_direction === 'right') {

						data.start_top = parseInt((sys.block_h * y) + (sys.block_h / 2) - (options.minBlockSize / 2), 10);
						data.start_left = sys.w + options.minBlockSize;

					} else {

						data.start_top = parseInt((sys.block_h * y) + (sys.block_h / 2) - (options.minBlockSize / 2), 10);
						data.start_left = parseInt((sys.block_w * x) + (sys.block_w / 2) - (options.minBlockSize / 2), 10);

					}

					// set opacity
					data.opacity = options.translucent ? _randomRange(0.1, 0.5, 2) : 1;

					// determine the image source
					if (next_slide.nodeName === 'A') {
						slide_src = $(next_slide).find('img').get(0).src;
					} else {
						slide_src = next_slide.src;
					}

					$block.css({
						position: 'absolute',
						top: data.start_top + 'px',
						left: data.start_left + 'px',
						display: 'block',
						width: options.minBlockSize + 'px',
						height: options.minBlockSize + 'px',
						margin: '0px',
						padding: '0px',
						'background-image': 'url(' + slide_src + ')',
						'background-repeat': 'no-repeat',
						'background-position': $obj.offset().left + 'px ' + $obj.offset().top + 'px',
						'background-attachment': 'fixed',
						opacity: data.opacity
					});

					/* set up additional stylings based on style */
					if (options.style === 'rounded') {
						$block.css({
							'-moz-border-radius': (sys.h > sys.w ? sys.h : sys.w) + 'px',
							'-webkit-border-radius': (sys.h > sys.w ? sys.h : sys.w) + 'px',
							'-o-border-radius': (sys.h > sys.w ? sys.h : sys.w) + 'px',
							'-ms-border-radius': (sys.h > sys.w ? sys.h : sys.w) + 'px',
							'border-radius': (sys.h > sys.w ? sys.h : sys.w) + 'px'
						});
					}

					$block.data('info', data);
				}
			}

			// corrects the images offsets if the user scrolls the page
			$(window).scroll(function () {
				correctOffset();
			});

			// corrects the images offsets if the user resizes the page
			$(window).resize(function () {
				correctOffset();
			});

			// initial correction
			correctOffset();

			// start the animation
			sys.timer = setTimeout(function () {
				animateBlocks();
			}, options.delay);
		}

		/*
			initialize our plug-in
		***************************************/

		function init() {

			var sys = $obj.data('system'),
				slide_src;

			// determine if we have a preset. If so, set some options (overides user options).
			if (options.preset) {
				switch (options.preset) {
				case 'cubism':
					options.xBlocks = Math.round(sys.w / 100);
					options.yBlocks = Math.round(sys.h / 100);
					options.minBlockSize = Math.round(sys.w / 100) * 25;
					options.direction = 'random';
					options.translucent = true;
					options.sloppy = true;
					options.delay = 3000;
					break;
				case 'rain':
					options.xBlocks = Math.round(sys.w / 75);
					options.yBlocks = Math.round(sys.h / 75);
					options.minBlockSize = 2;
					options.style = 'rounded';
					options.direction = 'top';
					options.translucent = false;
					options.sloppy = true;
					options.delay = 1250;
					break;
				case 'blinds':
					options.xBlocks = 1;
					options.yBlocks = Math.round(sys.h / 15);
					options.minBlockSize = 0;
					options.style = 'normal';
					options.direction = 'top';
					options.translucent = false;
					options.sloppy = false;
					options.delay = 3000;
					break;
				case 'blinds2':
					options.xBlocks = Math.round(sys.w / 15);
					options.yBlocks = 1;
					options.minBlockSize = 0;
					options.style = 'normal';
					options.direction = 'top';
					options.translucent = false;
					options.sloppy = false;
					options.delay = 3000;
					break;
				case 'transport':
					options.xBlocks = 1;
					options.yBlocks = Math.round(sys.h / 10);
					options.minBlockSize = 0;
					options.style = 'normal';
					options.direction = 'top';
					options.translucent = true;
					options.sloppy = true;
					options.delay = 1250;
					break;
				case 'transport2':
					options.xBlocks = Math.round(sys.w / 10);
					options.yBlocks = 1;
					options.minBlockSize = 0;
					options.style = 'normal';
					options.direction = 'top';
					options.translucent = true;
					options.sloppy = true;
					options.delay = 1250;
					break;
				case 'bricks':
					options.xBlocks = Math.round(sys.w / 100);
					options.yBlocks = Math.round(sys.h / 100);
					options.minBlockSize = 3;
					options.style = 'normal';
					options.direction = 'left';
					options.translucent = false;
					options.sloppy = false;
					options.delay = 3000;
					break;
				default:
					options.xBlocks = Math.round(sys.w / 100);
					options.yBlocks = Math.round(sys.h / 100);
					options.minBlockSize = 3;
					options.style = 'normal';
					options.direction = 'top';
					options.translucent = false;
					options.sloppy = false;
					options.delay = 3000;
					break;
				}
			}

			// make sure our main element has positioning set
			$obj.css({
				'position': $obj.css('position') || 'relative'
			});

			// verify the user options
			options.yBlocks = typeof options.yBlocks !== 'number' ? 3 : (options.yBlocks < 0 ? 1 : options.yBlocks);
			options.xBlocks = typeof options.xBlocks !== 'number' ? 3 : (options.xBlocks < 0 ? 1 : options.xBlocks);
			options.minBlockSize = typeof options.minBlockSize !== 'number' ? 5 : options.minBlockSize < 0 ? 0 : options.minBlockSize;
			if (sys.w > sys.h && options.minBlockSize > sys.w) {
				options.minBlockSize = sys.w;
			} else if (options.minBlockSize > sys.h) {
				options.minBlockSize = sys.h;
			}
			options.delay = typeof options.delay !== 'number' ? 3000 : options.delay < 0 ? 0 : options.delay;
			if (options.style !== 'rounded') {
				options.style = 'normal';
			}
			options.translucent = typeof options.translucent !== 'boolean' ? false : options.translucent;
			options.sloppy = typeof options.sloppy !== 'boolean' ? false : options.sloppy;
			if (options.direction !== 'top' && options.direction !== 'left' && options.direction !== 'bottom' && options.direction !== 'right' && options.direction !== 'random' && options.direction !== 'none') {
				options.direction = 'left';
			} else if (options.direction === 'random') {
				options.current_direction = sys.directions[_randomRange(0, sys.directions.length - 1)];
			} else {
				options.current_direction = options.direction;
			}

			// setup some initial variables
			sys.block_w = parseInt(Math.ceil(sys.w / options.xBlocks), 10);
			sys.block_h = parseInt(Math.ceil(sys.h / options.yBlocks), 10);
			sys.offset_x = parseInt((sys.w - (sys.block_w * options.xBlocks)) / 2, 10);
			sys.offset_y = parseInt((sys.h - (sys.block_h * options.yBlocks)) / 2, 10);
			sys.total_blocks = options.xBlocks * options.yBlocks;
			sys.current_img = 0;
			sys.current_blocks = 0;

			// check for a link
			if (sys.imgs[sys.current_img].nodeName === 'A') {
				$obj.off('click').on('click', function() {
					document.location.href = $(sys.imgs[sys.current_img]).attr('href');
					return false;
				}).css('cursor', 'pointer').attr('title', $(sys.imgs[sys.current_img]).attr('href'));
				slide_src = $(sys.imgs[sys.current_img]).find('img').get(0).src;
			} else {
				slide_src = sys.imgs[sys.current_img].src;
			}

			$obj.append('<div id="cjFlashyTransitionBottom">');
			$obj.find('#cjFlashyTransitionBottom').css({
				position: 'absolute',
				top: '0px',
				left: '0px',
				display: 'block',
				width: sys.w + 'px',
				height: sys.h + 'px',
				margin: '0px',
				padding: '0px',
				'background-image': 'url("' + slide_src + '")',
				'background-repeat': 'no-repeat',
				'background-position': '50% 50%',
				'background-attachment': 'scroll',
				'z-index': 1,
				overflow: 'hidden'
			});

			$obj.append('<div id="cjFlashyTransitionTop">');
			$obj.find('#cjFlashyTransitionTop').css({
				position: 'absolute',
				top: sys.offset_y + 'px',
				left: sys.offset_x + 'px',
				display: 'block',
				width: sys.block_w * options.xBlocks + 'px',
				height: sys.block_h * options.yBlocks + 'px',
				margin: '0px',
				padding: '0px',
				'z-index': 2,
				overflow: 'hidden'
			});

			createBlocks();
		}

		if (settings && typeof settings === 'object') {

			// extend our options and store locally
			options = $.extend(options, settings);
			$obj.data('system', {
				// system parameters
				version: '2.1.1',
				imgs: [],
				w: parseInt($obj.width(), 10),
				h: parseInt($obj.height(), 10),
				block_w: 0,
				block_h: 0,
				sec_y: 0,
				sec_x: 0,
				current_img: 0,
				current_blocks: 0,
				current_direction: 'left',
				directions: ['top', 'topleft', 'topright', 'left', 'bottom', 'bottomleft', 'bottomright', 'right'],
				total_blocks: 0,
				loaded: 0
			});

			// grab images and check for links
			$obj.find('img').each(function(a, b) {
				var $this = $(b);
				if ($this.parent('a').length > 0) {
					$obj.data('system').imgs.push($this.parent('a').get(0));
				} else {
					$obj.data('system').imgs.push($this.get(0));
				}
			});

			if (!options.destElem) {
				options.destElem = $obj;
			}
			if ($obj.hasClass('cj_image_scale_fill')) {
				options.method = 'fill';
			} else if ($obj.hasClass('cj_image_scale_fit')) {
				options.method = 'fit';
			}

			if ($obj.data('system').imgs.length === 0) {
				throw ('CJ Flashy Slideshow could not initialize (Could not find any images).');
			} else {
				init();
			}

		} else if (settings && typeof settings === 'string') {

			// unknown call to our plugin
			$.error('Method ' + settings + ' does not exist on (cjFlashySlideShow)');
		}

	};

	$.fn.extend({

		cjFlashySlideShow: function (settings) {

			// call to the plug-in
			return this.each(function () {

				$.cjFlashySlideShow($(this), settings || {});

			});

		}
	});

}(jQuery));