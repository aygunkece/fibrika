;(function ($, w) {
	'use strict';
	if (!w.jQuery) {
		throw 'IdeaApp: jQuery not found';
	}
	w.IdeaTheme.product = {

		init: function () {
			this.eventListener();
			this.thumbImagesCarousel();
			this.zoom.init();
			this.afterInit();
		},

		afterInit: function () {
			IdeaTheme.initSlider('.similar-products .products-content');
			IdeaTheme.initSlider('.offered-products .products-content');
			IdeaTheme.initSlider('.combined-products .products-content');
			IdeaTheme.initLazyLoad();
            this.responsiveTabs();
			this.commentRate();
        },

        responsiveTabs: function(){
            IdeaApp.product.productTab('.product-detail-tab', function () {}, function () {});
            $('.product-detail-tab-row [data-tab-index]').on('click', function(event) {
                if($(this).parent().attr('class').indexOf('active') > -1) {
                    $(this).next().slideUp();
                    $(this).parent().removeClass('active');
                } else {
                    $(this).next().slideDown().parent().siblings().find('[data-tab-content]').slideUp();
                    $('.product-detail-tab-row').removeClass('active');
                    $(this).parent().addClass('active');
                }
                $('html, body').animate({
                    scrollTop: $(this).parent().parent().offset().top - 15
                }, 500);
            });
            {% if theme.settings.product_detail_mobile_first_tab %}
                $('.product-detail-tab-content .product-detail-tab-row.active .active[data-tab-content]').show();
            {% endif %}
            var productId = $('.product-detail-tab').attr('data-product-id');
            $.ajax({
                url: '/taksit-secenekleri',
                data: "productId=" + productId,
                success: function (response) {
                    $('[data-selector="product-payment-options"]').html(response);
                }
            });
        },

		thumbImagesCarousel: function () {
			$('#product-thumb-image').slick({
				vertical: false,
				verticalSwiping: false,
				autoplay: false,
				arrows: false,
				infinite: false,
				speed: 300,
				slidesToShow: 6,
				slidesToScroll: 6,
				prevArrow: `
                    <button type="button" class="slick-prev" aria-label="Previous">
                        <svg width="6.333" height="11.503" viewBox="0 0 6.333 11.503">
                            <path id="icon-arrow-left" d="M60.278,5.341,55.105.17a.581.581,0,0,0-.822.821l4.762,4.761-4.762,4.761a.581.581,0,0,0,.822.821l5.173-5.171A.586.586,0,0,0,60.278,5.341Z" transform="translate(60.446 11.503) rotate(180)" fill="#323232"/>
                        </svg>
                    </button>
                `,
                nextArrow: `
                    <button type="button" class="slick-next" aria-label="Next">
                        <svg width="6.333" height="11.503" viewBox="0 0 6.333 11.503">
                            <path id="icon-arrow-right" d="M60.278,5.341,55.105.17a.581.581,0,0,0-.822.821l4.762,4.761-4.762,4.761a.581.581,0,0,0,.822.821l5.173-5.171A.586.586,0,0,0,60.278,5.341Z" transform="translate(-54.113 0)" fill="#323232"/>
                        </svg>
                    </button>
                `,
				responsive: [
					{
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4
                        }
                    },
					{
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    }
                ]
			});
		},

		commentRate: function() {
			$('.product-comment-rating').rateYo({
				rating: $('.product-comment-rating').attr('data-rank'),
				starWidth : "16px",
				normalFill: "#dddddd",
				ratedFill : "#ffff00"
			});
		},

		zoom: {
			config: {
				gallery: 'product-thumb-image',
				responsive: true,
				zoomType: "inner",
				borderSize: 0,
				cursor: 'crosshair',
				onZoomedImageLoaded: function () {
					$('#primary-image').unbind('touchmove mousewheel');
					if($('#product-thumb-image .thumb-item a.zoomGalleryActive').length < 1) {
						$('#product-thumb-image .thumb-item:first-child a').addClass('zoomGalleryActive');
					}
				}
			},
			init: function() {
				$('.zoomContainer').remove();
				$('#primary-image').elevateZoom(this.config);
				this.eventListener();
			},
			eventListener: function() {
				var self = this;
				$('#primary-image').on('click tap', function () {
					$.fancybox.open($(this).data('elevateZoom').getGalleryList(), {
						i18n: {
							en: {
								SHARE: "{{ theme.settings.fancybox_share }}"
							}
						}
					});
					return false;
				});
				$('#product-thumb-image .thumb-item a').on('click tap', function() {
					var image = $('#primary-image');
					$('.zoomContainer').remove();
					image.removeData('elevateZoom').attr('src', $(this).data('image')).data('zoom-image', $(this).data('zoom-image')).elevateZoom(IdeaTheme.product.zoom.config);
				});
			}
		},

		eventListener: function () {
			var self = this;
		}
	}

	// .variant-select classına sahip select elementlerini dinle
	$('.variant-group-title select.variant-select').on('change', function() {
		// Seçilen varyantın değerini al
		var secilenVaryant = $(this).val();

		// Tüm optionları seçili olmaktan kaldır
		$(this).find('option').removeAttr('selected');

		// Seçilen varyantı "selected" yap
		$(this).find('option[value="' + secilenVaryant + '"]').attr('selected', 'selected');
	});
})(jQuery, window);