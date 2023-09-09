;(function ($, w) {
	'use strict';
	if (!w.jQuery) {
		throw 'IdeaTheme: jQuery not found';
	}
	w.IdeaTheme.navigationMenu = {

		activeClass: 'active',
		bodyActiveClass: 'navigation-active',
		onNavigation: false,

		init: function () {
			if ($('#navigation').length == 0) {
				return;
			}
			this.mobile.init();
			this.controlMedia();
			this.createOverlay();
			this.eventListener();
		},

		mobile: {
			activeClass: 'active',
			menuRendered: false,
			mobileMenuId: 'mobile-navigation',

			init: function () {
				this.eventListener();
			},

			buildMenu: function () {
				var self = this;
				if (self.menuRendered) {
					return;
                }
                $('.header-mobile-left').prepend(' \
                    <div class="toggle-bar" data-selector="toggle-bar"> \
                        <a href="javascript:void(0);"> \
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"> \
                                <path d="M10.584 26.001C10.4269 25.9946 10.2786 25.928 10.1697 25.8149C10.0608 25.7019 10 25.5512 10 25.3945C10 25.2378 10.0608 25.0871 10.1697 24.9741C10.2786 24.861 10.4269 24.7944 10.584 24.788H25.416C25.5731 24.7944 25.7214 24.861 25.8303 24.9741C25.9392 25.0871 26 25.2378 26 25.3945C26 25.5512 25.9392 25.7019 25.8303 25.8149C25.7214 25.928 25.5731 25.9946 25.416 26.001H10.584ZM10.584 18.601C10.4269 18.5946 10.2786 18.528 10.1697 18.4149C10.0608 18.3019 10 18.1512 10 17.9945C10 17.8378 10.0608 17.6871 10.1697 17.5741C10.2786 17.461 10.4269 17.3944 10.584 17.388H25.416C25.5731 17.3944 25.7214 17.461 25.8303 17.5741C25.9392 17.6871 26 17.8378 26 17.9945C26 18.1512 25.9392 18.3019 25.8303 18.4149C25.7214 18.528 25.5731 18.5946 25.416 18.601H10.584ZM10.584 11.213C10.4269 11.2066 10.2786 11.14 10.1697 11.0269C10.0608 10.9139 10 10.7632 10 10.6065C10 10.4498 10.0608 10.2991 10.1697 10.1861C10.2786 10.073 10.4269 10.0064 10.584 10H25.416C25.5731 10.0064 25.7214 10.073 25.8303 10.1861C25.9392 10.2991 26 10.4498 26 10.6065C26 10.7632 25.9392 10.9139 25.8303 11.0269C25.7214 11.14 25.5731 11.2066 25.416 11.213H10.584Z" fill="#110F21"/> \
                            </svg> \
                        </a> \
                    </div> \
                ');
				$('body').append('<div id="' + self.mobileMenuId + '"><div class="'+ self.mobileMenuId +'"></div></div>');
				if (typeof menuItems['row1'] !== "undefined") {
					$('.' + this.mobileMenuId).append(self.createMenuItemsHtml(menuItems['row1']));
				}
				if (navigationMenu !== null) {
					$('.' + this.mobileMenuId).append(self.createCategoriesHtml(navigationMenu.categories, null, 1))
				}
				if (typeof menuItems['row2'] !== "undefined") {
					$('.' + this.mobileMenuId).append(self.createMenuItemsHtml(menuItems['row2']));
				}
				this.menuRendered = true;
			},

			createMenuItemsHtml: function (menuItems) {
				var output = '<div class="mobile-navigation-menu-items"><ul>';
				$.each(menuItems, function (i, item) {
					output += '<li><a href="' + item.link + '" target="' + item.target + '"><div><span>' + item.label + '</span></div></a></li>';
				});
				output += '</ul></div>';
				return output;
			},

			createCategoriesHtml: function (categories, parentCategory, level) {
				var self = this;
				var output = '<div class="category-level-' + level + '">';
				if (level > 1) {
					output += '<div class="mobile-navigation-back"><a href="javascript:void(0);"><i class="fas fa-chevron-left"></i><span>{{ theme.settings.mobile_categories_goback }}</span></a></div>';
					output += '<div class="mobile-navigation-parent"><a href="' + parentCategory.url + '">' + parentCategory.name + '</a></div>';
				}
				output += '<ul>';
				$.each(categories, function (i, item) {
					var imageContent = '';

					if (navigationMenu.settings.useCategoryImage && level > 1) {
						imageContent = '<div><img src="' + item.imageUrl + '" alt="' + item.name + '"/></div>';
					}
					if (item.subCategories.length > 0) {
						output += '<li class="has-sub-category"><a href="javascript:void(0);"><div>' + imageContent + '<span>' + item.name + '</span></div><i class="fas fa-chevron-right"></i></a>' + self.createCategoriesHtml(item.subCategories, item, (level + 1)) + '</li>';
					} else {
						output += '<li><a href="' + item.url + '"><div>' + imageContent + '<span>' + item.name + '</span></div></a></li>';
					}
				});
				output += '</ul></div>';
				return output;
			},

			openSubCategories: function (element) {
				if (element.hasClass(this.activeClass)) {
					element.removeClass(this.activeClass);
				} else {
					var subCategoryHeight = element.find('> div').outerHeight();
					$('#' + this.mobileMenuId).scrollTop(0);
					$('.' + this.mobileMenuId).css('height',subCategoryHeight);
					element.addClass(this.activeClass);
				}
			},

			closeSubCategories: function (element) {
				element.parent('.has-sub-category').removeClass(this.activeClass);
				if(element.hasClass('category-level-2')) {
					$('.' + this.mobileMenuId).css('height','auto');
				}
				if(element.hasClass('category-level-3')) {
					var subCategoryHeight = element.parents('.category-level-2').outerHeight();
					$('.' + this.mobileMenuId).css('height',subCategoryHeight);
				}
			},

			toggleNavigation: function () {
				if ($('body').hasClass(IdeaTheme.navigationMenu.bodyActiveClass)) {
					$('body').removeClass(IdeaTheme.navigationMenu.bodyActiveClass);
				} else {
					$('body').addClass(IdeaTheme.navigationMenu.bodyActiveClass);
				}
			},

			eventListener: function () {
				var self = this;
				$(document).on('click', '[data-selector="toggle-bar"]', function (e) {
					e.stopPropagation();
					self.toggleNavigation();
				});

				$(document).on('click', '#' + self.mobileMenuId, function (e) {
					e.stopPropagation();
				});

				$(document).on('click', '#' + self.mobileMenuId + ' .has-sub-category a', function () {
					self.openSubCategories($(this).parent());
				});

				$(document).on('click', '.mobile-navigation-back', function () {
					self.closeSubCategories($(this).parent());
				});
			}

		},

		createOverlay: function () {
			$('body').append('<div class="navigation-menu-overlay" />');
		},
		
		overflowControl: function(element) {
			var browserWidth = $(window).width();
			var dropMenuSubCategoryLeftPosition = $(element).offset().left;
			var dropMenuSubCategoryOuterWidth = $(element).find("> div").outerWidth();
			if((browserWidth - dropMenuSubCategoryLeftPosition) < dropMenuSubCategoryOuterWidth) {
				$(element).find("> div").css({'right':'-0px','left':'auto'});
			}else{
				$(element).find("> div").css({'left':'-0px','right':'auto'});
			}
		},

		openDropMenu: function (element) {
			if(element.hasClass('has-sub-category')) {
				$('body').addClass(this.bodyActiveClass);
				//this.overflowControl(element);
			}
			element.addClass(this.activeClass).siblings().removeClass(this.activeClass);
		},

		closeDropMenu: function (element) {
			element.removeClass(this.activeClass);
			$('body').removeClass(this.bodyActiveClass);
		},

		controlMedia: function () {
			if (IdeaApp.helpers.matchMedia('(max-width: 1199px)')) {
				this.mobile.buildMenu();
			}
		},

		eventListener: function () {
			var self = this;
			$(document).on('click', function () {
				if ($('body').hasClass(self.bodyActiveClass)) {
					$('body').removeClass(self.bodyActiveClass);
				}
			});
			
			$(document).on('mouseenter', '[data-selector="first-level-navigation"]', function() {
				var element = $(this);
				if(self.onNavigation == false) {
					window.timeout = setTimeout(function() {
						self.openDropMenu(element);
					}, 200);
				} else {
					self.openDropMenu(element);
				}
			});
			
			$(document).on('mouseleave', '[data-selector="first-level-navigation"]', function() {
				clearTimeout(window.timeout);
				self.closeDropMenu($(this));
			});

			$(document).on('mouseenter', '#navigation', function() {
				self.onNavigation = true;
			});

			$(document).on('mouseleave', '#navigation', function() {
				self.onNavigation = false;
				clearTimeout(window.timeout);
			});

			
			$(window).on('resize', function () {
				self.controlMedia();
			});

		}
	}
})(jQuery, window);