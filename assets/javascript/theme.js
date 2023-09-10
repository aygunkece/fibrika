;(function ($, w) {
	'use strict';
	if (!w.jQuery) {
		throw 'IdeaApp: jQuery not found';
	}
	w.IdeaTheme = {

		init: function () {
			IdeaTheme.navigationMenu.init();
			IdeaTheme.cart.init();
			this.eventListener();
			this.afterInit();
		},

		afterInit: function () {
			this.cart.updateCartContainer();
			this.initLazyLoad();
			if (this[IdeaApp.helpers.getRouteGroup()] !== undefined) {
				this[IdeaApp.helpers.getRouteGroup()].init();
			}
			this.login.init();
            this.dropBox.init();
            this.bannerTitle();
            if (IdeaApp.helpers.getRouteGroup() == 'product-list' || IdeaApp.helpers.getRouteGroup() == 'combine-list') {
                this.hasFilterOption();
            }
            this.initSlider(".home-products .products-content");
            this.initSlider(".popular-products .products-content");
            this.listTab('.standart-list-tab');
            this.blogSlider('.entry-blog-container .entry-blog-content');
		},

        hasFilterOption: function(){
            IdeaApp[IdeaApp.helpers.getRouteGroup()].filter.checkFilterMenu = function(){
                if (!IdeaApp.helpers.matchMedia('(max-width: 991px)')) {
                    $('.filter-options-title').parents('#filter-wrapper').removeClass('has-filter-option');
                    return;
                }
                if ($('.filter-menu .filter-menu-groups').length > 0 || $('.horizontal-filter-menu .filter-menu-groups').length > 0) {
                    $('.filter-options-title').parents('#filter-wrapper').addClass('has-filter-option');
                    var selectedItemCount = $('.filter-menu-selected-item').length;
                    if (selectedItemCount > 0) {
                        $('.filter-options-title span').text('(' + selectedItemCount + ')');
                    }
                }
            }
        },

        dropBox: {
            selector: '.dropbox',
            speed: 200,
            activeClass: 'active',
            targetClass: 'dropbox-content',
            activeBox: null,
    
            init: function () {
                this.mouseup();
                this.eventListener();
            },
    
            mouseenter: function (element) {
                var target = $('.' + element.attr('data-target'));
                this.slideDown(target);
                this.reset();
                this.addClasses(element);
                this.activeBox = element;
            },
    
            click: function (element) {
                var target = $('.' + element.attr('data-target'));
                if (element.hasClass(this.activeClass)) {
                    this.reset();
                } else {
                    this.slideDown(target);
                    this.reset();
                    this.mouseup();
                    this.addClasses(element);
                    this.activeBox = element;
                }
            },
    
            mouseup: function () {
                var self = this;
                $(document).bind('mouseup tap', function (e) {
                    if (!$('.' + self.targetClass).is(e.target) && $('.' + self.targetClass).has(e.target).length == 0 && !$(self.selector).is(e.target) && !$(self.selector).find('*').is(e.target)) {
                        self.reset();
                    }
                });
            },
    
            addClasses: function (element) {
                $(this.selector).removeClass(this.activeClass);
                $('body').addClass(element.attr('data-target') + '-active');
                element.addClass(this.activeClass);
            },
    
            slideDown: function (element) {
                element.stop(true, true).slideDown(100);
            },
    
            slideUp: function (element, cbafter) {
                element.stop(true).slideUp(100, cbafter);
            },
    
            reset: function () {
                if (this.activeBox) {
                    var target = this.activeBox.attr('data-target');
                    this.slideUp($('.' + target));
                    $('body').removeClass(target + '-active');
                    this.activeBox = null;
                }
                $(this.selector).removeClass(this.activeClass);
                $(document).unbind('mouseup');
            },
    
            eventListener: function () {
                var self = this;
                $(document).on('click tap', self.selector, function () {
                    self.click($(this));
                });
            }
        },
        
        initSlider: function (element) {
            if ($(element).length == 0) {
                return;
            }
            $(element).slick({
                autoplay: true,
                autoplaySpeed: 6000,
                arrows: true,
                dots: false,
                infinite: false,
                speed: 300,
                slidesToShow: 4,
                slidesToScroll: 4,
                prevArrow: `
                    <button type="button" class="slick-prev" aria-label="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_47_1181)">
                                <path d="M8.99998 12.0001L13.243 7.75708L14.657 9.17208L11.828 12.0001L14.657 14.8281L13.243 16.2431L8.99998 12.0001Z" fill="black"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_47_1181">
                                    <rect width="24" height="24" fill="white" transform="translate(24) rotate(90)"/>
                                </clipPath>
                            </defs>
                        </svg>                    
                    </button>
                `,
                nextArrow: `
                    <button type="button" class="slick-next" aria-label="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_47_1177)">
                                <path d="M15 11.9999L10.757 16.2429L9.34302 14.8279L12.172 11.9999L9.34302 9.17192L10.757 7.75692L15 11.9999Z" fill="black"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_47_1177">
                                    <rect width="24" height="24" fill="white" transform="translate(0 24) rotate(-90)"/>
                                </clipPath>
                            </defs>
                        </svg>                    
                    </button>
                `,
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 575,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            arrows: false,
                            dots: true
                        }
                    }
                ]
            });
            $(element).on('afterChange', function(event, slick, currentSlide){
                if((slick.$slides.length - slick.options.slidesToShow) <= currentSlide){
                    $(element).slick('slickPause');
                    setTimeout(function(){
                        $(element).slick('slickGoTo',0);
                        $(element).slick('slickPlay');
                    }, $(element).slick('slickGetOption', 'autoplaySpeed'));
                }
            });
        },

        blogSlider: function (element) {
            if ($(element).length == 0) {
                return;
            }
            var slickSettings = {
                autoplay: true,
                autoplaySpeed: 6000,
                arrows: true,
                dots: false,
                infinite: false,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                prevArrow: `
                    <button type="button" class="slick-prev" aria-label="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_47_1181)">
                                <path d="M8.99998 12.0001L13.243 7.75708L14.657 9.17208L11.828 12.0001L14.657 14.8281L13.243 16.2431L8.99998 12.0001Z" fill="black"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_47_1181">
                                    <rect width="24" height="24" fill="white" transform="translate(24) rotate(90)"/>
                                </clipPath>
                            </defs>
                        </svg>                    
                    </button>
                `,
                nextArrow: `
                    <button type="button" class="slick-next" aria-label="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_47_1177)">
                                <path d="M15 11.9999L10.757 16.2429L9.34302 14.8279L12.172 11.9999L9.34302 9.17192L10.757 7.75692L15 11.9999Z" fill="black"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_47_1177">
                                    <rect width="24" height="24" fill="white" transform="translate(0 24) rotate(-90)"/>
                                </clipPath>
                            </defs>
                        </svg>                    
                    </button>
                `,
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: "unslick"
                    }
                ]
            },
            slickSlider =  $(element).slick(slickSettings);
                 
            $(window).on('resize', function() {
                 if( $(window).width() > 420 &&  !slickSlider.hasClass('slick-initialized')) {
                    $(element).slick(slickSettings);
                }
            });
            slickSlider.on('afterChange', function(event, slick, currentSlide) {
                if((slick.$slides.length - slick.options.slidesToShow) <= currentSlide) {
                    $(element).slick('slickGoTo', 0);
                }
            });
        },


        listTab: function(element) {
            var self = this;
            IdeaApp.plugins.tab(element, function(){}, function(){}, function(){
                if (window.matchMedia("(max-width: 991px)").matches) {
                    $(this).parent().toggleClass('open');
                }
            });
        },
		
		bannerTitle: function() {
			$('[data-selector="banner-title"] .banner').each(function() {
				if($(this).find('.banner-title-img').length > 0) {
					return;
				}
				var elementImg = $(this).find('img');
				elementImg.wrap('<div class="banner-title-img"></div>');
				elementImg.parent().after('<div class="banner-title-text">'+ elementImg.attr('alt') +'</div>');
			});
		},

		scrollTop: function () {
			$("html, body").animate({scrollTop: 0}, 400);
		},

		scrollToggle: function (element) {
			if (element.scrollTop() > 200) {
				$("#scroll-top").stop().fadeIn();
			} else {
				$("#scroll-top").stop().fadeOut();
			}
        },
		
		login: {
			init: function () {
				this.eventListener();
				this.validateLoginForm();
			},

			validateLoginForm: function () {
				var form = '[data-selector="login-panel"]';
				$(form).validate({
					errorElement: "div",
					validClass: 'validate',
					errorClass: 'validate-error',
					rules: {
						email: {
							required: true,
							email: true,
							maxlength: 255
						},
						pass: {
							required: true,
							minlength: 2,
							maxlength: 255
						},
					},
					messages: {
						email: {
							required: "{{ theme.settings.login_form_please }} " + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="email"]', 'placeholder') + " {{ theme.settings.login_form_enter }}.",
							email: "" + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="email"]', 'placeholder') + " {{ theme.settings.login_form_format }}.",
							maxlength: "" + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="email"]', 'placeholder') + " {{ theme.settings.login_form_maxlenght_255 }}."
						},
						pass: {
							required: "{{ theme.settings.login_form_please }} " + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="pass"]', 'placeholder') + " {{ theme.settings.login_form_enter }}.",
							minlength: "" + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="pass"]', 'placeholder') + " {{ theme.settings.login_form_minlenght_2 }}.",
							maxlength: "" + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="pass"]', 'placeholder') + " {{ theme.settings.login_form_maxlenght_255 }}."
						}
					},
					errorPlacement: function (error, element) {
						element.parents('.user-menu-input').append(error);
					}
				});

				$.validator.addMethod('email', function (email) {
					return IdeaApp.helpers.checkEmail(email);
				});
			},

			eventListener: function () {
				$(document).on('click', '[data-selector="login-panel-button"]', function () {
					var memberLoginForm = $('[data-selector="login-panel"]');
					if (memberLoginForm.valid()) {
						$(this).addClass('btn-loading');
					}
				});
			}
		},

		cart: {
			init: function () {
				this.updateCartContainer();
                this.overrideListeners();
			},

			updateCartContainer: function () {
				this.cartContent();
                $('[data-selector="cart-item-count"]').html(IdeaCart.itemCount);
                $('[data-selector="cart-total-price"]').html(IdeaApp.helpers.formatMoney(IdeaCart.totalPrice) + ' ' + mainCurrency);
			},
			
			cartItemDelete: function(element) {
				IdeaCart.deleteItem(element, element.attr('data-id'));
			},

            cartContent: function () {
                var items = IdeaCart.items;
                if (items.length > 0) {
                    var output = '<div class="cart-content-title">{{ theme.settings.cart_popup_title }}</div>';
                    output += '<div class="cart-content-subtitle">{{ theme.settings.cart_popup_subtitle_1 }} <span>' + IdeaCart.itemCount + ' {{ theme.settings.cart_popup_subtitle_2 }}</span> {{ theme.settings.cart_popup_subtitle_3 }}.</div>';
                    output += '<div class="cart-list">';
                    for (var i = 0; i < items.length; i++) {
                        output += '<div class="cart-list-item">';
                        if (items[i].product.imageUrl == "") {
                            output += '<div class="cart-list-item-image"><a href="' + items[i].product.url + '"><img src="{{ themeAsset('images/nopic_image.png') }}" /></a></div>';
                        } else {
                            output += '<div class="cart-list-item-image"><a href="' + items[i].product.url + '"><img src="' + items[i].product.imageUrl + '" /></a></div>';
                        }
                        output += '<div class="cart-list-item-content">';
                        output += '<div>';
                        if(items[i].product.brandName !== null) {
                            output += '<a class="cart-list-item-brand" href="' + items[i].product.brandUrl + '">' + items[i].product.brandName + '</a>';
                        }
                        output += '<a class="cart-list-item-title" href="' + items[i].product.url + '">' + items[i].product.fullName + '</a>';
                        output += '</div><div>';
                        output += '<div class="cart-list-item-price">';
                        {% if theme.settings.cart_delete_check %}
                            output += '<a href="javascript:void(0);" class="cart-list-item-delete" data-product-id="' + items[i].product.id + '" data-id="' + items[i].id + '" data-toggle="modal" data-target="#modal-cart-delete-' + items[i].product.id + '" data-backdrop="false"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.3931 8.37755C12.5068 8.26387 12.6609 8.2 12.8217 8.2H15.2341C15.3949 8.2 15.5491 8.26387 15.6628 8.37755C15.7765 8.49124 15.8403 8.64543 15.8403 8.80621V9.41241H12.2155V8.80621C12.2155 8.64543 12.2794 8.49124 12.3931 8.37755ZM11.0155 9.41241V8.80621C11.0155 8.32717 11.2058 7.86775 11.5445 7.52903C11.8833 7.1903 12.3427 7 12.8217 7H15.2341C15.7132 7 16.1726 7.1903 16.5113 7.52903C16.85 7.86775 17.0403 8.32717 17.0403 8.80621V9.41241H18.2496H19.4559C19.7872 9.41241 20.0559 9.68104 20.0559 10.0124C20.0559 10.3438 19.7872 10.6124 19.4559 10.6124H18.8496V18.4559C18.8496 18.9349 18.6594 19.3943 18.3206 19.733C17.9819 20.0718 17.5225 20.2621 17.0434 20.2621H11.0124C10.5334 20.2621 10.074 20.0718 9.73523 19.733C9.3965 19.3943 9.20621 18.9349 9.20621 18.4559V10.6124H8.6C8.26863 10.6124 8 10.3438 8 10.0124C8 9.68104 8.26863 9.41241 8.6 9.41241H9.80621H11.0155ZM10.4062 10.6124V18.4559C10.4062 18.6166 10.4701 18.7708 10.5838 18.8845C10.6974 18.9982 10.8516 19.0621 11.0124 19.0621H17.0434C17.2042 19.0621 17.3584 18.9982 17.4721 18.8845C17.5858 18.7708 17.6496 18.6166 17.6496 18.4559V10.6124H10.4062ZM12.8217 12.4279C13.1531 12.4279 13.4217 12.6966 13.4217 13.0279V16.6465C13.4217 16.9779 13.1531 17.2465 12.8217 17.2465C12.4904 17.2465 12.2217 16.9779 12.2217 16.6465V13.0279C12.2217 12.6966 12.4904 12.4279 12.8217 12.4279ZM15.8341 13.0279C15.8341 12.6966 15.5655 12.4279 15.2341 12.4279C14.9028 12.4279 14.6341 12.6966 14.6341 13.0279V16.6465C14.6341 16.9779 14.9028 17.2465 15.2341 17.2465C15.5655 17.2465 15.8341 16.9779 15.8341 16.6465V13.0279Z" fill="#110F21"/></svg></a>';
                            output +='<div class="modal-cart-delete modal fade" id="modal-cart-delete-' + items[i].product.id + '" tabindex="-1" role="dialog" aria-labelledby="modal-cart-delete-label" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="modal-body"><svg width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M4.36232 41.1576C4.36394 40.578 4.51664 40.0089 4.80529 39.5065L23.1497 8.88192C23.1502 8.88113 23.1506 8.88034 23.1511 8.87956C23.4481 8.39079 23.8659 7.98666 24.3644 7.70606C24.8636 7.425 25.4268 7.27734 25.9997 7.27734C26.5726 7.27734 27.1358 7.425 27.635 7.70606C28.1334 7.98666 28.5512 8.39079 28.8483 8.87956C28.8487 8.88034 28.8492 8.88113 28.8497 8.88192L47.194 39.5064C47.4827 40.0089 47.6354 40.578 47.637 41.1576C47.6387 41.7396 47.4879 42.3119 47.1996 42.8176C46.9114 43.3232 46.4958 43.7446 45.9942 44.0398C45.494 44.3341 44.9257 44.4927 44.3455 44.5H7.65382C7.07362 44.4927 6.50533 44.3341 6.00518 44.0398C5.50355 43.7446 5.08794 43.3232 4.79971 42.8176C4.51149 42.3119 4.36069 41.7396 4.36232 41.1576Z" stroke="#F15E5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 19.5V28.1667" stroke="#F15E5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 36.8334H26.0217" stroke="#F15E5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>{{ theme.settings.cart_delete_title }}</span></div><div class="modal-footer"><button type="button" class="btn btn-block cart-button-continue" data-dismiss="modal">{{ theme.settings.cart_delete_negative }}</button><button type="button" class="btn btn-primary" data-dismiss="modal" data-product-id="' + items[i].product.id + '" data-id="' + items[i].id + '" data-selector="cart-item-delete">{{ theme.settings.cart_delete_positive }}</button></div></div></div></div>';
                        {% else %}
                            output += '<a href="javascript:void(0);" class="cart-list-item-delete" data-product-id="' + items[i].product.id + '" data-id="' + items[i].id + '" data-selector="cart-item-delete"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.3931 8.37755C12.5068 8.26387 12.6609 8.2 12.8217 8.2H15.2341C15.3949 8.2 15.5491 8.26387 15.6628 8.37755C15.7765 8.49124 15.8403 8.64543 15.8403 8.80621V9.41241H12.2155V8.80621C12.2155 8.64543 12.2794 8.49124 12.3931 8.37755ZM11.0155 9.41241V8.80621C11.0155 8.32717 11.2058 7.86775 11.5445 7.52903C11.8833 7.1903 12.3427 7 12.8217 7H15.2341C15.7132 7 16.1726 7.1903 16.5113 7.52903C16.85 7.86775 17.0403 8.32717 17.0403 8.80621V9.41241H18.2496H19.4559C19.7872 9.41241 20.0559 9.68104 20.0559 10.0124C20.0559 10.3438 19.7872 10.6124 19.4559 10.6124H18.8496V18.4559C18.8496 18.9349 18.6594 19.3943 18.3206 19.733C17.9819 20.0718 17.5225 20.2621 17.0434 20.2621H11.0124C10.5334 20.2621 10.074 20.0718 9.73523 19.733C9.3965 19.3943 9.20621 18.9349 9.20621 18.4559V10.6124H8.6C8.26863 10.6124 8 10.3438 8 10.0124C8 9.68104 8.26863 9.41241 8.6 9.41241H9.80621H11.0155ZM10.4062 10.6124V18.4559C10.4062 18.6166 10.4701 18.7708 10.5838 18.8845C10.6974 18.9982 10.8516 19.0621 11.0124 19.0621H17.0434C17.2042 19.0621 17.3584 18.9982 17.4721 18.8845C17.5858 18.7708 17.6496 18.6166 17.6496 18.4559V10.6124H10.4062ZM12.8217 12.4279C13.1531 12.4279 13.4217 12.6966 13.4217 13.0279V16.6465C13.4217 16.9779 13.1531 17.2465 12.8217 17.2465C12.4904 17.2465 12.2217 16.9779 12.2217 16.6465V13.0279C12.2217 12.6966 12.4904 12.4279 12.8217 12.4279ZM15.8341 13.0279C15.8341 12.6966 15.5655 12.4279 15.2341 12.4279C14.9028 12.4279 14.6341 12.6966 14.6341 13.0279V16.6465C14.6341 16.9779 14.9028 17.2465 15.2341 17.2465C15.5655 17.2465 15.8341 16.9779 15.8341 16.6465V13.0279Z" fill="#110F21"/></svg></a>';
                        {% endif %}
                        output += '<span class="cart-list-item-amount">' + items[i].quantity + ' ' + items[i].product.stockType + ' - </span>' + IdeaApp.helpers.formatMoney(items[i].price) + ' ' + mainCurrency + '</div>';
                        output += '</div>';
                        output += '</div></div>';
                    }
                    output += '</div>';
                    output += '<div class="cart-content-total-price"><span>{{ theme.settings.cart_popup_total_title }}</span><div>' + IdeaApp.helpers.formatMoney(IdeaCart.totalPrice) + ' ' + mainCurrency + '</div></div>';
                    output += '<div class="cart-content-button"><a href="'+IdeaApp.routing.generate('/sepet')+'" class="btn btn-primary btn-block">{{ theme.settings.cart_popup_buy_button }}</a></div>';
                    output += '<div class="cart-content-button mb-0"><a href="javascript:void(0);" class="btn btn-block cart-button-continue" data-selector="openbox-close">{{ theme.settings.cart_popup_continue_button }}</a></div>';
                } else {
                    var output = '<div class="cart-content-empty">';
                    output += '<div class="cart-content-title">{{ theme.settings.cart_popup_title }}</div>';
                    output += '<div class="cart-content-subtitle">{{ theme.settings.cart_popup_empty_title }}</div>';
                    output += `
                        <div class="cart-content-empty-icon">
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <path d="M26.9944 25.243L26.0803 15.708C26.0438 15.3041 25.8404 14.9276 25.5106 14.6537C25.1809 14.3799 24.7491 14.2289 24.3017 14.231H22.7627V13.315C22.7627 12.1706 22.2608 11.0731 21.3674 10.2638C20.474 9.45461 19.2623 9 17.9989 9C16.7355 9 15.5238 9.45461 14.6304 10.2638C13.737 11.0731 13.2351 12.1706 13.2351 13.315V14.231H11.695C11.2484 14.2299 10.8177 14.3813 10.4889 14.6551C10.16 14.9288 9.95721 15.3048 9.92083 15.708L9.0067 25.243C8.9853 25.4661 9.01528 25.6907 9.09473 25.9027C9.17418 26.1148 9.30138 26.3095 9.46827 26.4747C9.63515 26.6399 9.83809 26.7718 10.0642 26.8623C10.2904 26.9527 10.5348 26.9996 10.782 27H25.2147C25.4622 27 25.707 26.9534 25.9335 26.8632C26.16 26.7729 26.3634 26.641 26.5306 26.4758C26.6979 26.3106 26.8254 26.1157 26.905 25.9034C26.9847 25.6912 27.0147 25.4663 26.9933 25.243H26.9944ZM14.476 13.315C14.476 12.469 14.847 11.6576 15.5075 11.0593C16.168 10.4611 17.0638 10.125 17.9978 10.125C18.9318 10.125 19.8276 10.4611 20.4881 11.0593C21.1486 11.6576 21.5196 12.469 21.5196 13.315V14.231H14.476V13.315ZM25.6155 25.715C25.5663 25.7672 25.5047 25.8087 25.4353 25.8364C25.3659 25.8641 25.2905 25.8773 25.2147 25.875H10.782C10.7066 25.875 10.6321 25.8608 10.5632 25.8333C10.4943 25.8058 10.4324 25.7656 10.3815 25.7153C10.3307 25.665 10.2919 25.6056 10.2677 25.541C10.2435 25.4764 10.2344 25.408 10.241 25.34L11.1551 15.805C11.166 15.682 11.2278 15.5673 11.3281 15.4838C11.4284 15.4004 11.5599 15.3544 11.6961 15.355H13.2329V18.042C13.2329 18.1912 13.2983 18.3343 13.4148 18.4397C13.5312 18.5452 13.6892 18.6045 13.8539 18.6045C14.0186 18.6045 14.1765 18.5452 14.293 18.4397C14.4095 18.3343 14.4749 18.1912 14.4749 18.042V15.356H21.5185V18.042C21.5252 18.1871 21.5936 18.3242 21.7094 18.4247C21.8251 18.5252 21.9792 18.5813 22.1395 18.5813C22.2998 18.5813 22.4539 18.5252 22.5697 18.4247C22.6854 18.3242 22.7538 18.1871 22.7605 18.042V15.356H24.2995C24.4357 15.3554 24.5672 15.4014 24.6675 15.4848C24.7678 15.5683 24.8296 15.683 24.8405 15.806L25.7546 25.341C25.7636 25.4091 25.7556 25.4782 25.7311 25.5431C25.7067 25.608 25.6664 25.6671 25.6133 25.716L25.6155 25.715Z" fill="#110F21"/>
                            </svg>
                        </div>
                    `;
                    output += '<div class="cart-content-button mb-0"><a href="javascript:void(0);" class="btn btn-primary btn-block" data-selector="openbox-close">{{ theme.settings.cart_popup_start_shopping_button }}</a></div>';
                    output += '</div>';
                }
                $('[data-selector="cart-content"]').html(output);
            },
					
			showCartButtons: function (productId) {
				$('[data-selector="add-to-cart"][data-product-id="' + productId + '"]').each(function () {
					var context = $(this).attr('data-context');
					if (context == 'quick') {
						$(this).attr('href', 'javascript:void(0);').removeAttr('data-disabled');
					} else {
						IdeaApp.helpers.enableElement($(this));
						if (context == 'detail') {
							$(this).html('{{ theme.settings.addtocart_button }}').addClass('add-to-cart-button').removeClass('no-stock-button');
							$('.quick-order-button').parent().show();
						}
					}
				});
			},

			hideCartButtons: function (productId) {
				$('[data-selector="add-to-cart"][data-product-id="' + productId + '"]').each(function () {
					var context = $(this).attr('data-context');
					if (context == 'quick') {
						$(this).attr('href', IdeaApp.routing.generate('/sepet')).attr('data-disabled', 'true');
					} else {
						IdeaApp.helpers.disableElement($(this));
						if (context == 'detail') {
							$(this).html('{{ theme.settings.incart_button }}').removeClass('add-to-cart-button').addClass('no-stock-button');
							$('.quick-order-button').parent().hide();
						}
					}
				});
			},

			overrideListeners: function () {
				var self = this;
				IdeaCart.listeners.prePersist = function (element) {
					element.addClass('btn-loading');
				};

				IdeaCart.listeners.postPersist = function (element, response) {
					element.removeClass('btn-loading');
					if (!response.success) {
						return;
					}
					self.updateCartContainer();
					if (IdeaCart.validContextList.indexOf(element.attr('data-context')) !== -1) {
						if (response.item.product.stockAmount <= IdeaCart.helpers.getItemTotalQuantity(response.item.product.id)) {
							self.hideCartButtons(response.item.product.id);
						}
						{% if theme.settings.cart_fancybox %}
                            $.fancybox.open({
                                src: IdeaApp.routing.generate('/sepet-detayi'),
                                type: 'ajax'
                            });
                        {% else %}
                            $("body").append('<div class="shopping-information-cart"><div class="shopping-information-cart-inside"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="none"/><path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>{{ theme.settings.added_to_cart }}</div></div>');
                            setTimeout(function(){
                                $('.shopping-information-cart').fadeOut(200).remove();
                            },2000);
                        {% endif %}
					}
				};
				IdeaCart.listeners.postUpdate = function (element, response) {
					if (!response.success) {
						return;
					}
					if (response.item.product.stockAmount <= IdeaCart.helpers.getItemTotalQuantity(response.item.product.id)) {
						self.hideCartButtons(response.item.product.id);
					} else {
						self.showCartButtons(response.item.product.id);
					}
					self.updateCartContainer();
				};

				IdeaCart.listeners.preRemove = function (element) {
					element.addClass('btn-loading');
				};

				IdeaCart.listeners.postRemove = function (element, response) {
					element.removeClass('btn-loading');
					if (!response.success) {
						return;
					}
					self.showCartButtons(element.attr('data-product-id'));
					self.updateCartContainer();
				};
			}
        },

		initLazyLoad: function () {
			if (typeof lazyload != 'function') {
				return;
			}
			if ($('.tabbed-midblocks-container').length > 0) {
				$( document ).ajaxComplete(function( event, xhr, settings ) {
					if(settings.url == '/tabli-vitrin'){
						lazyload();
					}
				});
			} else {
				lazyload();
			}
		},
		
		footerMenu: function(element) {
			var parentElement = element.parent();
			var containerElement = element.parents('.footer-menu-container');
			if(parentElement.hasClass('active')) {
				containerElement.find('.footer-menu').removeClass('active');
				parentElement.removeClass('active');
			} else {
				containerElement.find('.footer-menu').removeClass('active');
				parentElement.addClass('active');
			}
		},

        
        ideaExport: {
            customSelectClass : 'custom-export-select',
        
            init: function() {
                this.getVariables();
                this.buildHtml();
                this.addLanguageCode();
                this.eventListener();
            },
        
            getVariables: function() {
                this.selectedLanguage = exportVariables.selected.language;
                this.selectedCountry = exportVariables.selected.country;
                this.selectedCurrency = exportVariables.selected.currency;
            },
        
            addLanguageCode: function() {
                $('body').addClass(this.selectedLanguage);
            },
        
            buildHtml: function() {
                var output = '<div id="custom-export">';
                output += '<a data-fancybox data-src="#custom-export-content" href="javascript:void(0);">';
                output += `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21C16.9556 21 21 16.9553 21 12C21 7.04437 16.9553 3 12 3C7.04441 3 3 7.04469 3 12C3 16.9556 7.04469 21 12 21ZM14.67 19.4833C15.18 18.8316 15.5708 18.0544 15.8644 17.2731H17.9374C17.059 18.2613 15.9387 19.0292 14.67 19.4833ZM18.7297 16.2188H16.2054C16.5166 15.0871 16.6991 13.8325 16.7379 12.5273H19.9274C19.8385 13.8769 19.4113 15.1354 18.7297 16.2188ZM18.7297 7.78125C19.4113 8.86459 19.8385 10.1231 19.9274 11.4727H16.7379C16.6991 10.1675 16.5166 8.91286 16.2054 7.78125H18.7297ZM17.9374 6.72656H15.8644C15.5709 5.94592 15.1801 5.16858 14.67 4.51675C15.9387 4.97079 17.059 5.73867 17.9374 6.72656ZM12.5273 4.1449C13.5622 4.49565 14.3046 5.7264 14.7292 6.72656H12.5273V4.1449ZM12.5273 7.78125H15.1088C15.4441 8.89141 15.6413 10.1509 15.6829 11.4727H12.5273V7.78125ZM12.5273 12.527H15.6829C15.6413 13.8491 15.4441 15.1086 15.1088 16.2188H12.5273V12.527ZM12.5273 17.2731H14.7292C14.3039 18.2753 13.5614 19.5047 12.5273 19.8551V17.2731ZM6.0626 17.2734H8.13562C8.42911 18.0541 8.81994 18.8314 9.33002 19.4833C8.06134 19.0292 6.94098 18.2613 6.0626 17.2734ZM11.4727 19.8551C10.4387 19.5047 9.69618 18.2754 9.27079 17.2734H11.4727V19.8551ZM11.4727 16.2188H8.89124C8.55592 15.1086 8.35866 13.8491 8.31714 12.5273H11.4727V16.2188ZM11.4727 11.4727H8.31714C8.35866 10.1509 8.55592 8.89141 8.89124 7.78125H11.4727V11.4727ZM11.4727 4.1449V6.72656H9.27079C9.69614 5.72468 10.4386 4.49537 11.4727 4.1449ZM9.32999 4.51675C8.82005 5.16837 8.42921 5.94557 8.13559 6.72656H6.0626C6.94098 5.73867 8.06134 4.97075 9.32999 4.51675ZM5.27029 7.7809H7.79464C7.48344 8.91286 7.30088 10.1675 7.26206 11.4727H4.07262C4.16149 10.1231 4.58871 8.86459 5.27029 7.7809ZM4.07262 12.5273H7.26206C7.30088 13.8325 7.48344 15.0871 7.79464 16.2188H5.27029C4.58871 15.1354 4.16149 13.8769 4.07262 12.5273Z" fill="black"/>
                    </svg>
                `;
                output += '<span>';
                output += '<span class="current-language">' + this.selectedLanguage + '</span><span> - </span><span class="current-currency">' + this.selectedCurrency + '</span>';
                output += '</span>';
                output += '</a>';
                output += '<div id="custom-export-content" class="custom-export-content">';
                output += '<div class="custom-export-title">{{ theme.settings.language_options }}</div>';
                output += '<div class="custom-export-select select-language">'+ this.buildLanguages() +'</div>';
                output += '<div class="custom-export-title">{{ theme.settings.currency_options }}</div>';
                output += '<div class="custom-export-select select-currency">'+ this.buildCurrencies() +'</div>';
                output += '</div>';
                output += '</div>';
                $('.header-wrapper').prepend(output);
            },
        
            getSelectedLanguage: function() {
                var languages = exportVariables.languages;
                for (var i in languages) {
                    if(this.selectedLanguage == languages[i].language_code) {
                        var output = '<span class="flag flag-'+ languages[i].country_code +'"></span><span>'+ languages[i].language_name +'</span>';
                        return output;
                    }
                }
            },
        
            buildLanguages: function() {
                var languageList = exportVariables.languages;
                var output = '<a href="javascript:void(0);" class="select-open">'+ this.getSelectedLanguage() +'</a>';
                output += '<div class="select-content">';
                for (var i = 0;i<languageList.length;i++) {
                    output += '<a href="javascript:void(0);" data-language-code="'+ languageList[i].language_code +'" data-language-name="'+ languageList[i].language_name +'"><span class="flag flag-'+ languageList[i].country_code +'"></span><span>'+ languageList[i].language_name +'</span></a>';
                }
                output += '</div>';
                return output;
            },
        
            buildCurrencies: function() {
                var currencyList = new Set(exportVariables.currencies);
                var output = '<a href="javascript:void(0);" class="select-open">'+ this.selectedCurrency +'</a>';
                output += '<div class="select-content">';
                currencyList.forEach(function(currency) {
                    output += '<a href="javascript:void(0);" data-currency="'+ currency +'"><span>'+ currency +'</span></a>';
                });
                output += '</div>';
                return output;
            },
        
            toggleSelect: function(element) {
                var parentElement = element.parents('.' + this.customSelectClass);
                if(parentElement.hasClass('active')) {
                    $('.' + this.customSelectClass + '.active').removeClass('active').find('.select-content').hide();
                } else {
                    $('.' + this.customSelectClass + '.active').removeClass('active').find('.select-content').hide();
                    parentElement.addClass('active').find('.select-content').show();
                }
            },
        
            changeSelect: function(element) {
                var parentElement = element.parents('.' + this.customSelectClass);
                parentElement.find('> a').remove();
                parentElement.prepend(element.clone());
                this.toggleSelect(element);
                if(parentElement.hasClass('select-language')) {
                    IdeaExportApp.changeLanguage(element.attr('data-language-code'));
                    IdeaExportApp.refreshForLanguage(element.attr('data-language-code'));
                } else if (parentElement.hasClass('select-currency')) {
                    IdeaExportApp.changeCurrency(element.attr('data-currency'));
                    IdeaExportApp.refreshPage();
                }
            },
        
            eventListener: function() {
                var self = this;
                $(document).on('click tap', '.' + this.customSelectClass + ' > a', function(event) {
                    self.toggleSelect($(this));
                    event.stopPropagation();
                });
                $(document).on('click tap', '.select-content > a', function() {
                    self.changeSelect($(this));
                });
                $(document).on('click tap', function() {
                    $('.' + self.customSelectClass + '.active').removeClass('active').find('.select-content').hide();
                });
            }
        },

		eventListener: function () {
			var self = this;
			$(document).on('click', '#scroll-top', function () {
				self.scrollTop();
			});
			$(window).scroll(function () {
				self.scrollToggle($(this));
			});
			$(document).on('click tap', '[data-selector="cart-item-delete"]', function() {
				self.cart.cartItemDelete($(this))
			});
			$(document).on('click tap', '[data-selector="openbox-close"]', function() {
				openBox.reset();
			});
			$(document).on('click tap', '.search > a', function() {
				setTimeout(function(){
                    $('.search-content input').focus();
                }, 100);
			});
			$(document).on('click tap', '[data-menu-type="accordion"] .footer-menu-title', function() {
				self.footerMenu($(this));
			});
		}
	}
})(jQuery, window);

$(function () {
    IdeaTheme.init();
});

function ideaExportTranslationBarDecorator() {
    IdeaTheme.ideaExport.init();
}

// -------form search------
$('#btn-search').on('click',function(){
    $('.form-search').css('right','0');
});
$('#close-search').on('click',function(){
    $('.form-search').css('right','-1920px');
});
// ------------end------------
// --------form cart----------
$('#btn-cart').on('click',function(){
    $('.form-cart').css('right','0');
    $('.overlay').css('opacity','1').css('visibility','visible');
});
$('#close-cart').on('click',function(){
    $('.form-cart').css('right','-470px');
    $('.overlay').css('opacity','0').css('visibility','hidden');
});
// -------------end----------
