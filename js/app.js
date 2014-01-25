(function($) {
	
	$(document).ready(function() {

		var mobile_breakpoint = 480,

			// Determines if we're on mobile
			isMobile = $(window).width() <= mobile_breakpoint,

			// First level primary nav links
			$first_level_links = $('#primary > ul > li');

		init();

		// Initialise page
		function init() {
			// Initialise slideshow plugin
			cbpBGSlideshow.init();

			// Set the UI colours based on the first slide item
			updateColours( $('#cbp-bislideshow li:eq(0)') );

			// Add span to show dots for loading elements
			$('.loading').append('<span>').hide();
		}

		// Expand / collapse content
		$('.expand').unbind('click').on('click', function() {
			var $this = $(this);

			$this.siblings('ul, .project').slideToggle();
			$this.toggleClass('expanded');
		});

		// Updates the UI text and background colours
		function updateColours( slide ) {
			var options = $(slide).data(),
				text = ( options && options.text ) ? options.text : 'inherit',
				background = ( options && options.background ) ? options.background : 'inherit';

			$('body').css({ 'background-color': background });
			$('#primary, #primary a, #secondary a, .description-toggle').css({ 'color': text });
		}

		// Act upon the slider changing slide
		$(document).on('slide-init slide-change', function( e, slide ) {
			updateColours(slide);
		});

		// Primary menu
		// Resets the sub navigation state when collapsing
		$('#primary > ul > li').children('a').on('click', function() {
			var $this = $(this);

			if( !$this.hasClass('expanded') ) {
				$this.siblings('ul').find('li, .project').removeAttr('style');
				$this.siblings('ul').find('.expanded').removeClass('expanded');
				$first_level_links.not('.persist').show();
			}
		});

		// Toggles related content display
		$('.expand', '#primary').on('click', function() {
			var $this = $(this);

			if( $this.hasClass('isolate') ) {
				// If 'isolate' flag is set, hide sibling list items
				$this.parent('li').siblings('li').slideToggle();

				// If 'isolate' flag is set, hide first level primary navigation links
				// that are not flagged as 'persist'
				var expand = $this.closest('ul').siblings('.expand');
				if( expand.length && expand.hasClass('expanded') ) {
					$first_level_links.not('.persist').hide();
				} else {
					$first_level_links.not('.persist').show();
				}
			}

			$('.project').siblings('a').show();
		});

		// Back to projects link
		$('.back', '#primary').on('click', function() {
			var $this = $(this);

			// $this.closest('.project').hide();
			$this.closest('.project').animate({
				width: 'hide'
			}, 1000, function() {
				$this.closest('ul').find('.project').siblings('.expand').removeClass('expanded').show();
				$this.closest('ul').children('li').fadeIn();
				$first_level_links.not('.persist').fadeIn();
			});
		});

		function setPortfolioBindings() {
			// Wrap text in spans so we can colour the background
			$('.description').find('p').wrapInner('<span class="highlight" />');

			// Toggle project's info display
			$('.description-toggle').unbind('click').on('click', function() {
				var $self = $(this);

				$(this).siblings('.description').slideToggle(function() {
					var text = $(this).is(':visible') ? 'Hide Info' : 'Show Info';
					$self.text(text);
				});
			});
		}

		setPortfolioBindings();

		// Updates the contents toggle state based on whether the toggler
		// controller has the expanded class
		function updateToggleState( $toggle, $content ) {
			if( $toggle.hasClass('expanded') ) {
				$content.show();
				$toggle.text( $toggle.text().replace(/Show/g, 'Hide') );
			} else {
				$content.hide();
				$toggle.text( $toggle.text().replace(/Hide/g, 'Show') );
			}
		}

		// Show project
		$('.project').siblings('a').on('click', function() {
			var $this = $(this),
				timeout = null;

			function loadProject( project ) {
				var url = project + '.html #main';

				$('#primary').slideUp(function() {
					var arr = ['', '.', '..', '...'],
						current = 0;

					$('.loading').hide().slideDown(500);
					
					function dots() {
						if( timeout !== false ) {
							timeout = setTimeout(function() {
								$('span', '.loading').text(arr[current]);
								current++;

								if( current >= arr.length ) {
									current = 0;
								}

								dots();
							}, 500);
						} else {
							$('.loading').slideUp(function() {
								clearTimeout(timeout);
								current = 0;

								$('#primary').slideDown(500);
								$('.content', '#main').slideDown(500);

								// Hide description section by default for mobile
								$('.description-toggle').toggleClass('expanded', !isMobile);
								updateToggleState( $('.description-toggle'), $('.description') );

								// $('body').css({ 'z-index': 1, 'position': 'relative' });
							});
						}
					}

					dots();

					$('#main').load(url, function() {
						$('body').css({ 'color': '#252525' });

						$('.content', '#main').hide();
						$('.description').hide();

						setTimeout(function() { ////////////////////////////////////////////// REMOVE THIS - WE'RE JUST DEMONSTRATING A POINT
							$('body').css({ 'color': '#fff' });

							setPortfolioBindings();

							if( timeout ) {
								timeout = false;
							}

							// Reload slideshow plugin
							cbpBGSlideshow.init();
						}, 1500); ////////////////////////////////////////////////////////////////////////////////////////////////////////////
					});
				});
			}

			if( $this.hasClass('expanded') ) {
				var project = $(this).siblings('.project').data('project');
				loadProject(project);
				$this.hide();
			} else {
				$this.show();
				$first_level_links.not('.persist').show(); //////////////////////////////////////////////////////////////// MAY NOT BE NEEDED
			}
		});

		// Show manifesto overlay
		$('#manifesto').on('click', function() {
			$.ajax({
				url: '/partials/manifesto.html'
			}).done(function( data ) {
				if( !$('#main').find('.page-manifesto').length ) {
					$('#main').append( data );
				}

				// Close overlay
				$('.overlay-close').on('click', function() {
					$(this).closest('.overlay').remove();
				});
			});
		});

	});

	// Swipe
	jQuery(window).on('swipeleft', function( event ) {
		$('.cbp-biprev').trigger('click');
	});

	jQuery(window).on('swiperight', function( event ) {
		$('.cbp-binext').trigger('click');
	});

	// Key Bindings
	$(document).on('keydown', function( event ) {
		switch( event.keyCode ) {
			// Left
			case 37:
				if( !$('.overlay').length ) {
					$('.cbp-biprev').trigger('click');
				}
				break;

			// Right
			case 39:
				if( !$('.overlay').length ) {
					$('.cbp-binext').trigger('click');
				}
				break;

			// Escape
			case 27:
				$('.overlay').remove();
				break;
		}
	});

})( jQuery );