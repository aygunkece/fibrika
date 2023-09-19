(function ($, w) {
    'use strict';
    if (!w.jQuery) {
        throw 'IdeaApp: jQuery not found'
    }
    w.IdeaTheme = {
        init: function () {
            IdeaTheme.navigationMenu.init();
            IdeaTheme.cart.init();
            this.eventListener();
            this.afterInit()
        }, afterInit: function () {
            this.cart.updateCartContainer();
            this.initLazyLoad();
            if (this[IdeaApp.helpers.getRouteGroup()] !== undefined) {
                this[IdeaApp.helpers.getRouteGroup()].init()
            }
            this.login.init();
            this.bannerTitle();
            this.initSlider(".home-products .products-content");
            this.initSlider3(".featured-products .products-content, .blog-container .blog-content");
            this.initSlider4(".banner-slider .banner-slider-content");
            this.brandsCarousel('.brands-list-content')
        }, initLazyLoad: function () {
            if (typeof lazyload != 'function') {
                return
            }
            if ($('.tabbed-midblocks-container').length > 0) {
                $(document).ajaxComplete(function (event, xhr, settings) {
                    if (settings.url == '/tabli-vitrin') {
                        lazyload()
                    }
                })
            } else {
                lazyload()
            }
        }, showcasePictureSliceOn: function (element) {
            var dataIndex = element.attr('data-index');
            var dataSrc = element.attr('data-src');
            var showcasePicture = element.parent().parent().find('img');
            showcasePicture.attr({src: dataSrc});
            var showcasePager = element.parent().next();
            showcasePager.find('span').removeClass('active');
            showcasePager.find('span[data-index="' + dataIndex + '"]').addClass('active')
        }, showcasePictureSliceOff: function (element) {
            var dataSrc = element.parent().find('a:first-child').attr('data-src');
            var showcasePicture = element.parent().parent().find('img');
            showcasePicture.attr({src: dataSrc})
        }, brandsCarousel: function (element) {
            brands.forEach(function (item, index) {
                var output = '<div class="brands-item col-auto" data-id="' + item.id + '">';
                output += '<a href="' + item.link + '">';
                output += '<div><img src="' + item.logo_path + '"></div>';
                output += '</a>';
                output += '</div>';
                $(element).append(output)
            });
            $(element).slick({
                autoplay: !0,
                autoplaySpeed: 2000,
                arrows: !0,
                dots: !1,
                infinite: !1,
                speed: 300,
                slidesToShow: 6,
                slidesToScroll: 6,
                prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"><i class="fas fa-angle-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next" aria-label="Next"><i class="fas fa-angle-right"></i></button>',
                responsive: [{breakpoint: 991, settings: {slidesToShow: 5, slidesToScroll: 5}}, {
                    breakpoint: 767,
                    settings: {slidesToShow: 4, slidesToScroll: 4}
                }, {breakpoint: 575, settings: {slidesToShow: 2, slidesToScroll: 2, dots: !0, arrows: !1}}]
            })
        }, initSlider: function (element) {
            if ($(element).length == 0) {
                return
            }
            $(element).slick({
                autoplay: !0,
                autoplaySpeed: 6000,
                arrows: !0,
                infinite: !1,
                speed: 300,
                slidesToShow: 5,
                slidesToScroll: 5,
                prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"><i class="fas fa-angle-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next" aria-label="Next"><i class="fas fa-angle-right"></i></button>',
                responsive: [{
                    breakpoint: 1200,
                    settings: {slidesToShow: 4, slidesToScroll: 4, dots: !0, arrows: !1}
                }, {
                    breakpoint: 767,
                    settings: {slidesToShow: 3, slidesToScroll: 3, dots: !0, arrows: !1}
                }, {breakpoint: 575, settings: {slidesToShow: 2, slidesToScroll: 2, dots: !0, arrows: !1}}]
            });
            $(element).on('afterChange', function (event, slick, currentSlide) {
                if ((slick.$slides.length - slick.options.slidesToShow) <= currentSlide) {
                    $(element).slick('slickGoTo', 0)
                }
            })
        }, initSlider3: function (element) {
            if ($(element).length == 0) {
                return
            }
            $(element).slick({
                autoplay: !0,
                autoplaySpeed: 6000,
                arrows: !0,
                infinite: !1,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"><i class="fas fa-angle-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next" aria-label="Next"><i class="fas fa-angle-right"></i></button>',
                responsive: [{
                    breakpoint: 1200,
                    settings: {slidesToShow: 3, slidesToScroll: 3, dots: !0, arrows: !1}
                }, {breakpoint: 768, settings: {slidesToShow: 2, slidesToScroll: 2}}]
            });
            $(element).on('afterChange', function (event, slick, currentSlide) {
                if ((slick.$slides.length - slick.options.slidesToShow) <= currentSlide) {
                    $(element).slick('slickGoTo', 0)
                }
            })
        }, initSlider4: function (element) {
            if ($(element).length == 0) {
                return
            }
            var slickSettings = {
                autoplay: !0,
                autoplaySpeed: 6000,
                arrows: !0,
                infinite: !1,
                speed: 300,
                slidesToShow: 4,
                slidesToScroll: 4,
                prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"><i class="fas fa-angle-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next" aria-label="Next"><i class="fas fa-angle-right"></i></button>',
                responsive: [{
                    breakpoint: 1025,
                    settings: {slidesToShow: 3, slidesToScroll: 3, dots: !0, arrows: !1}
                }, {breakpoint: 991, settings: "unslick"}]
            }, slickSlider = $(element).slick(slickSettings);
            $(window).on('resize', function () {
                if ($(window).width() > 420 && !slickSlider.hasClass('slick-initialized')) {
                    $(element).slick(slickSettings)
                }
            });
            slickSlider.on('afterChange', function (event, slick, currentSlide) {
                if ((slick.$slides.length - slick.options.slidesToShow) <= currentSlide) {
                    $(element).slick('slickGoTo', 0)
                }
            })
        }, bannerTitle: function () {
            $('[data-selector="banner-title"] .banner').each(function () {
                if ($(this).find('.banner-title-img').length > 0) {
                    return
                }
                var elementImg = $(this).find('img');
                elementImg.wrap('<div class="banner-title-img"></div>');
                elementImg.parent().after('<div class="banner-title-text">' + elementImg.attr('alt') + '</div>')
            })
        }, scrollTop: function () {
            $("html, body").animate({scrollTop: 0}, 400)
        }, scrollToggle: function (element) {
            if (element.scrollTop() > 200) {
                $("#scroll-top").stop().fadeIn()
            } else {
                $("#scroll-top").stop().fadeOut()
            }
        }, login: {
            init: function () {
                this.eventListener();
                this.validateLoginForm()
            }, validateLoginForm: function () {
                var form = '[data-selector="login-panel"]';
                $(form).validate({
                    errorElement: "div",
                    validClass: 'validate',
                    errorClass: 'validate-error',
                    rules: {
                        email: {required: !0, email: !0, maxlength: 255},
                        pass: {required: !0, minlength: 2, maxlength: 255},
                    },
                    messages: {
                        email: {
                            required: " " + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="email"]', 'placeholder') + " .",
                            email: "" + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="email"]', 'placeholder') + " .",
                            maxlength: "" + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="email"]', 'placeholder') + " ."
                        },
                        pass: {
                            required: " " + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="pass"]', 'placeholder') + " .",
                            minlength: "" + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="pass"]', 'placeholder') + " .",
                            maxlength: "" + IdeaApp.helpers.getFormValidateMessage(form + ' input[name="pass"]', 'placeholder') + " ."
                        }
                    },
                    errorPlacement: function (error, element) {
                        element.parents('.user-menu-input').append(error)
                    }
                });
                $.validator.addMethod('email', function (email) {
                    return IdeaApp.helpers.checkEmail(email)
                })
            }, eventListener: function () {
                $(document).on('click', '[data-selector="login-panel-button"]', function () {
                    var memberLoginForm = $('[data-selector="login-panel"]');
                    if (memberLoginForm.valid()) {
                        $(this).addClass('btn-loading')
                    }
                })
            }
        }, cart: {
            init: function () {
                this.updateCartContainer();
                this.overrideListeners()
            }, updateCartContainer: function () {
                $('[data-selector="cart-item-count"]').html(IdeaCart.itemCount);
                $('[data-selector="cart-total-price"]').html(IdeaApp.helpers.formatMoney(IdeaCart.totalPrice) + ' ' + mainCurrency)
            }, cartItemDelete: function (element) {
                IdeaCart.deleteItem(element, element.attr('data-id'))
            }, showCartButtons: function (productId) {
                $('[data-selector="add-to-cart"][data-product-id="' + productId + '"]').each(function () {
                    var context = $(this).attr('data-context');
                    if (context == 'quick') {
                        $(this).attr('href', 'javascript:void(0);').removeAttr('data-disabled')
                    } else {
                        IdeaApp.helpers.enableElement($(this));
                        if (context == 'detail') {
                            $(this).html('').addClass('add-to-cart-button').removeClass('no-stock-button');
                            $('.quick-order-button').parent().show()
                        }
                    }
                })
            }, hideCartButtons: function (productId) {
                $('[data-selector="add-to-cart"][data-product-id="' + productId + '"]').each(function () {
                    var context = $(this).attr('data-context');
                    if (context == 'quick') {
                        $(this).attr('href', '/sepet').attr('data-disabled', 'true')
                    } else {
                        IdeaApp.helpers.disableElement($(this));
                        if (context == 'detail') {
                            $(this).html('').removeClass('add-to-cart-button').addClass('no-stock-button');
                            $('.quick-order-button').parent().hide()
                        }
                    }
                })
            }, overrideListeners: function () {
                var self = this;
                IdeaCart.listeners.prePersist = function (element) {
                    element.addClass('btn-loading')
                };
                IdeaCart.listeners.postPersist = function (element, response) {
                    element.removeClass('btn-loading');
                    if (!response.success) {
                        return
                    }
                    self.updateCartContainer();
                    if (IdeaCart.validContextList.indexOf(element.attr('data-context')) !== -1) {
                        if (response.item.product.stockAmount <= IdeaCart.helpers.getItemTotalQuantity(response.item.product.id)) {
                            self.hideCartButtons(response.item.product.id)
                        }
                        $("body").append('<div class="shopping-information-cart"><div class="shopping-information-cart-inside"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="none"/><path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg></div></div>');
                        setTimeout(function () {
                            $('.shopping-information-cart').fadeOut(200).remove()
                        }, 2000)
                    }
                };
                IdeaCart.listeners.postUpdate = function (element, response) {
                    if (!response.success) {
                        return
                    }
                    if (response.item.product.stockAmount <= IdeaCart.helpers.getItemTotalQuantity(response.item.product.id)) {
                        self.hideCartButtons(response.item.product.id)
                    } else {
                        self.showCartButtons(response.item.product.id)
                    }
                    self.updateCartContainer()
                };
                IdeaCart.listeners.preRemove = function (element) {
                    element.addClass('btn-loading')
                };
                IdeaCart.listeners.postRemove = function (element, response) {
                    element.removeClass('btn-loading');
                    if (!response.success) {
                        return
                    }
                    self.showCartButtons(element.attr('data-product-id'));
                    self.updateCartContainer()
                }
            }
        }, footerMenu: function (element) {
            var parentElement = element.parent();
            var containerElement = element.parents('.footer-menu-container');
            if (parentElement.hasClass('active')) {
                containerElement.find('.footer-menu').removeClass('active');
                parentElement.removeClass('active')
            } else {
                containerElement.find('.footer-menu').removeClass('active');
                parentElement.addClass('active')
            }
        }, eventListener: function () {
            var self = this;
            $(document).on('click', '#scroll-top', function () {
                self.scrollTop()
            });
            $(window).scroll(function () {
                self.scrollToggle($(this))
            });
            $(document).on('click tap', '[data-selector="cart-item-delete"]', function () {
                self.cart.cartItemDelete($(this))
            });
            $(document).on('click tap', '[data-selector="openbox-close"]', function () {
                openBox.reset()
            });
            $(document).on('click tap', '[data-menu-type="accordion"] .footer-menu-title', function () {
                self.footerMenu($(this))
            });
            jQuery(document).on('mouseenter', '.showcase-image-columns a', function () {
                self.showcasePictureSliceOn($(this))
            });
            jQuery(document).on('mouseleave', '.showcase-image-columns a', function () {
                self.showcasePictureSliceOff($(this))
            })
        }
    }
})(jQuery, window);
$(function () {
    IdeaTheme.init()
})