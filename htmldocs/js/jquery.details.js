/*!Denis Sokolov, http://akral.github.io/details-tag/, denis@sokolov.cc. GPL, MIT */
(function($){
	var support = 'open' in document.createElement('details'), init;

	// API
	$.fn.details = function(command) {
		if (command === 'open')
		{
			if (support)
				this.prop('open', true);
			else
				this.trigger('open');
		}

		if (command === 'close')
		{
			if (support)
				this.prop('open', false);
			else
				this.trigger('close');
		}

		if (command === 'init')
			init($(this));

		if (!command) {
			if (!support)
				return this.hasClass('open');

			var open = false;
			this.each(function(){
				if (this.open) {
					open = true;
					return false;
				}
			});
			return open;
		}
	};

	init = function(elements) {
		elements = elements.not('.details-inited').addClass('details-inited');

		/* Animated tags */
		elements.filter('.animated').each(function(){
			var me = $(this);
			var summary = me.children('summary').remove();
			var wrapper = $('<div>').addClass('details-wrapper').append(me.children());
			me.append(wrapper).prepend(summary);
		});

		if (support)
			return;

		elements
			// Add missing summary tags
			.each(function(){
				var me = $(this);
				if (!me.children('summary').length)
					me.prepend('<summary>Details</summary>');
			})

			.children('summary')
				.filter(':not(tabindex)').attr('tabindex', 0).end()
			.end()

			// Wrap plain text nodes in spans for CSS visibility
			.contents(':not(summary)').filter(function(){
					return (this.nodeType === 3) && (/[^\t\n\r ]/.test(this.data));
				})
				.wrap('<span>')
			.end().end()

			// Initial positions
			.filter(':not([open])')
				.prop('open', false)
			.end()
			.filter('[open]')
				.addClass('open')
				.prop('open', true)
			.end();

		elements.filter(':not(.open)').children().not('summary').hide();
	};

	$(function(){
		$('body')
		.on('open.details', 'details.animated', function(){
			var details = $(this);
			var wrapper = details.children('.details-wrapper');
			wrapper.hide();
			setTimeout(function(){ // Simple .height() redraw is not enough for Chrome
				wrapper.slideDown(details.data('animation-speed'));
			}, 0);
		})
		.on('close.details', 'details.animated', function(){
			var details = $(this);
			var wrapper = details.children('.details-wrapper');
			setTimeout(function(){
				details.prop('open', true).addClass('open');
				wrapper.slideUp(details.data('animation-speed'), function(){
					details.prop('open', false).removeClass('open');
				});
			}, 0);
		});

		if (support)
		{
			// Add our triggers on native implementation
			$('body').on('click', 'summary', function(){
				var details = $(this).parent();
				setTimeout(function(){
					if (details.prop('open'))
						details.trigger('close');
					else
						details.trigger('open');
				}, 0);
			});
			return;
		}

		// Everything below is a polyfill

		$('html').addClass('no-details');

		$('head').prepend('<style>'+
			// Style
			'details{display:block}'+
			'summary{cursor:pointer}'+
			'details>summary::before{content:"►"}'+
			'details.open>summary::before{content:"▼"}'+
			'</style>'
		);

		$('body')

		.on('open.details', 'details', function(e){
			$(this).addClass('open').trigger('change.details');
			e.preventDefault();
			e.stopPropagation();
		})

		.on('close.details', 'details', function(e){
			$(this).removeClass('open').trigger('change.details');
			e.preventDefault();
			e.stopPropagation();
		})

		.on('toggle.details', 'details', function(e){
			var me = $(this);
			if (me.hasClass('open'))
				me.trigger('close');
			else
				me.trigger('open');
			e.stopPropagation();
		})

		.on('click', 'summary', function(){
			$(this).parent().trigger('toggle');
		})

		.on('keyup', 'summary', function(e){
			// 32 - space
			// 13 - Enter. Opera triggers .click()
			if (e.keyCode === 32 || e.keyCode === 13)
				$(this).parent().trigger('toggle');
		});

		$('body')
			.on('open.details', 'details', function(){
				$(this).children().not('summary').show();
			})
			.on('close.details', 'details', function(){
				$(this).children().not('summary').hide();
			});

		init($('details'));
	});
})(jQuery);
