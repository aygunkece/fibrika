;(function ($, w) {
    'use strict';
    if (!w.jQuery) {
        throw 'Ideasoft: jQuery not found';
    }
    w.IdeaApp.product = {
        productId: null,
        parentProductId: null,
        fullName: null,
        primaryImageUrl: null,
        commentPage: 1,
        optionData: null,
        selectedProductLength: 0,
        selectedProductPrice: 0,
        totalSelectedProductLength: 0,
        productBatch: {anticsrf: anticsrf, products: []},
        init: function () {
            this.setTotalProducts();
            this.setDefaultParams();
            this.combineThumbImagesCarousel();
            this.eventListener();
        },
        setDefaultParams: function () {
            this.productId = pageParams.product.id;
            this.parentProductId = pageParams.product.parentId;
            this.fullName = pageParams.product.fullName;
            this.primaryImageUrl = pageParams.product.primaryImageUrl;
        },
        getTotalProducts: function () {
            var self = this;
            var products = $('[data-combine-selected]');
            var allProducts = $('[data-parent-product-id]');
            this.selectedProductLength = products.length;
            this.selectedProductPrice = 0;
            this.totalSelectedProductLength = 0;
            products.each(function () {
                var productPrice = $(this).find('[data-combine-price-new]').html();
                var productQuantity = 1;
                if ($(this).find('[data-selector="qty-wrapper"] [data-selector="qty"]').length > 0) {
                    productQuantity = Number($(this).find('[data-selector="qty-wrapper"] [data-selector="qty"]').val());
                }
                if (productPrice) {
                    productPrice = Number(productPrice.replace(/\./g, '').replace(',', '.'));
                    self.selectedProductPrice += productPrice * productQuantity;
                    self.totalSelectedProductLength += productQuantity;
                }
            });
            var batchProducts = [];
            allProducts.each(function () {
                var productId = $(this).find('[data-selector="add-to-cart"]').attr('data-product-id');
                var productQuantity = 1;
                if ($(this).find('[data-selector="qty-wrapper"] [data-selector="qty"]').length > 0) {
                    productQuantity = $(this).find('[data-selector="qty-wrapper"] [data-selector="qty"]').val();
                }
                if (productId !== undefined) {
                    batchProducts.push({productId: productId, quantity: productQuantity});
                }
            });
            this.productBatch.products = batchProducts;
        },
        setTotalProducts: function () {
            this.getTotalProducts();
            $('[data-total-qty]').html(this.totalSelectedProductLength);
            $('[data-total-price]').html(this.selectedProductPrice.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));
        },
        addToCartBatch: function (element) {
            var self = this;
            IdeaApp.helpers.disableElement(element);
            if (this.selectedProductLength < self.productBatch.products.length) {
                IdeaApp.plugins.notification('SeÃ§enekli Ã¼rÃ¼nler iÃ§in lÃ¼tfen seÃ§im yapÄ±nÄ±z.', 'warning');
                IdeaApp.helpers.enableElement(element);
                return;
            }
            IdeaApp.helpers.ajaxRequest({
                url: IdeaApp.routing.generate("/cart/add_batch_item"),
                data: self.productBatch,
                success: function (response) {
                    IdeaCart.setData(response.data.cart);
                    IdeaApp.helpers.enableElement(element);
                    if (response.data.cart.items !== undefined) {
                        IdeaCart.listeners.postPersist(element, {success: true, item: response.data.cart.items[0]});
                    } else {
                        IdeaCart.listeners.postPersist(element, {success: true, item: response.data.current_item});
                    }
                },
                error: function (xhr) {
                    IdeaCart.helpers.ajaxRequestFail(xhr, element);
                    IdeaApp.helpers.enableElement(element);
                    IdeaCart.listeners.postPersist(element, {success: false, item: null});
                }
            });
        },
        combineThumbImagesCarousel: function () {
            if (!$('#combine-thumb-image')) {
                return;
            }
            $('#combine-thumb-image').slick({
                vertical: false,
                verticalSwiping: false,
                autoplay: false,
                arrows: false,
                infinite: false,
                speed: 300,
                slidesToShow: 4,
                slidesToScroll: 4,
                prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-arrow-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next"><i class="fas fa-arrow-right"></i></button>',
                responsive: [{
                    breakpoint: 767,
                    settings: {
                        vertical: false,
                        verticalSwiping: false,
                        arrows: false,
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                }, {
                    breakpoint: 324,
                    settings: {
                        vertical: false,
                        verticalSwiping: false,
                        arrows: false,
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                }]
            });
        },
        changePrimaryImage: function (element) {
            $('#combine-primary-image img').attr('src', element.attr('data-image'));
            $('#combine-primary-image img').attr('data-index', element.attr('data-index'));
        },
        popupImage: function (element) {
            var gallery = [];
            $('.combine-thumb-item').each(function () {
                gallery.push({src: $(this).find('a').attr('data-image'), title: ''});
            });
            $.fancybox.open(gallery, {}, element.attr('data-index'));
        },
        productTab: function (element, onstart, onclick) {
            var tabClass = element;
            IdeaApp.plugins.tab(tabClass, function () {
                if (typeof onstart == 'function') {
                    onstart();
                }
            }, function () {
                var $self = $(this), tabIndex = $self.attr('data-tab-index');
                if ($self.attr('data-type') == 'payment-option') {
                    if ($self.parents(tabClass).find('[data-tab-content=' + tabIndex + ']').html().trim() != '') {
                        return;
                    }
                    $self.parents(tabClass).find('[data-tab-content=' + tabIndex + ']').html('');
                    IdeaApp.plugins.loading.add($self.parents(tabClass).find('[data-tab-content=' + tabIndex + ']'));
                    $self.addClass('disabled');
                    IdeaApp.helpers.ajaxRequest({
                        type: 'GET',
                        url: '/taksit-secenekleri',
                        data: 'productId=' + pageParams.product.id,
                        success: function (response) {
                            $self.removeClass('disabled');
                            IdeaApp.plugins.loading.remove($self.parents(tabClass).find('[data-tab-content=' + tabIndex + ']'));
                            $self.parents(tabClass).find('[data-tab-content=' + tabIndex + ']').html(response);
                            $(element).find('[data-toggle="tooltip"]').tooltip();
                        }
                    });
                }
            }, function () {
                if (typeof onclick == 'function') {
                    onclick.call(this);
                }
            });
        },
        recommend: {
            openForm: function () {
                $('#recommend-form')[0].reset();
                $.fancybox.open({src: '#product-recommend-form'});
            }, submitForm: function () {
                var recommendForm = $('#recommend-form');
                recommendForm.validate({
                    errorElement: "div",
                    validClass: 'validate',
                    errorClass: 'validate-error',
                    rules: {
                        yourname: {required: true},
                        people: {required: true},
                        recommendmessage: {required: true, minlength: 5, maxlength: 300}
                    },
                    messages: {
                        yourname: {required: "LÃ¼tfen " + IdeaApp.helpers.getFormValidateMessage('#recommend-form [name="yourname"]') + " giriniz."},
                        people: {required: "LÃ¼tfen " + IdeaApp.helpers.getFormValidateMessage('#recommend-form [name="people"]') + " giriniz."},
                        recommendmessage: {
                            required: "LÃ¼tfen " + IdeaApp.helpers.getFormValidateMessage('#recommend-form [name="recommendmessage"]') + " giriniz.",
                            minlength: "" + IdeaApp.helpers.getFormValidateMessage('#recommend-form [name="recommendmessage"]') + " en az 5 karakter olmalÄ±dÄ±r.",
                            maxlength: "" + IdeaApp.helpers.getFormValidateMessage('#recommend-form [name="recommendmessage"]') + " en fazla 300 karakter olmalÄ±dÄ±r."
                        }
                    },
                    showErrors: function (errorMap, errorList) {
                        for (var i = 0; i < errorList.length; i++) {
                            var error = errorList[i];
                            error = IdeaApp.helpers.modifyValidationError(error);
                        }
                        this.defaultShowErrors();
                    }
                });
                if (recommendForm.valid()) {
                    recommendForm.find('#Submit').addClass('btn-loading').attr('disabled', true);
                    IdeaApp.helpers.ajaxRequest({
                        url: IdeaApp.routing.generate('/urun-tavsiye-et'),
                        data: recommendForm.serialize(),
                        success: function (response) {
                            if (response.success) {
                                IdeaApp.plugins.notification(response.data.message, 'confirmation');
                            } else {
                                IdeaApp.plugins.notification(response.errorMessage, 'warning');
                            }
                            recommendForm.find('#Submit').removeClass('btn-loading').attr('disabled', false);
                            $.fancybox.close();
                        }
                    });
                }
            }
        },
        comment: {
            load: function (element) {
                var commentCount = parseInt(element.attr('data-comment-count'));
                var totalPage = Math.ceil(commentCount / 10) - 1;
                var offset = IdeaApp.product.commentPage * 10;
                IdeaApp.plugins.loading.add('.product-detail-comments-content');
                IdeaApp.helpers.ajaxRequest({
                    url: IdeaApp.routing.generate('/urun-yorumlari'),
                    data: 'commentOffset=' + offset + '&productId=' + IdeaApp.product.productId,
                    type: 'get',
                    success: function (response) {
                        IdeaApp.plugins.loading.remove('#product-detail-comments');
                        $('.product-detail-comments-content').append(response);
                        if (IdeaApp.product.commentPage >= totalPage) {
                            $('.product-show-more-comments').parent().remove();
                            $('.product-add-comment-button').parent().removeClass().addClass('col-12 text-center');
                        }
                        IdeaApp.product.commentPage++;
                    }
                });
            }, openForm: function () {
                if (!isMember) {
                    window.location = IdeaApp.routing.generate('/uye-girisi');
                    return;
                }
                $('#comment-form')[0].reset();
                $.fancybox.open({src: '#product-comment-form'});
            }, submitForm: function () {
                var commentForm = $('#comment-form');
                commentForm.validate({
                    errorElement: "div",
                    validClass: 'validate',
                    errorClass: 'validate-error',
                    rules: {body: {minlength: 5, maxlength: 200}},
                    messages: {
                        label: {required: "LÃ¼tfen " + IdeaApp.helpers.getFormValidateMessage('#comment-form [name="label"]') + " giriniz."},
                        body: {
                            required: "LÃ¼tfen " + IdeaApp.helpers.getFormValidateMessage('#comment-form [name="body"]') + " giriniz.",
                            minlength: "" + IdeaApp.helpers.getFormValidateMessage('#comment-form [name="body"]') + " en az 5 karakter olmalÄ±dÄ±r.",
                            maxlength: "" + IdeaApp.helpers.getFormValidateMessage('#comment-form [name="body"]') + " en fazla 200 karakter olmalÄ±dÄ±r."
                        }
                    },
                    showErrors: function (errorMap, errorList) {
                        for (var i = 0; i < errorList.length; i++) {
                            var error = errorList[i];
                            error = IdeaApp.helpers.modifyValidationError(error);
                        }
                        this.defaultShowErrors();
                    }
                });
                if (commentForm.valid()) {
                    commentForm.find('#Submit').addClass('btn-loading').attr('disabled', true);
                    IdeaApp.helpers.ajaxRequest({
                        url: IdeaApp.routing.generate('/urun-yorum-ekle'),
                        data: commentForm.serialize(),
                        success: function (response) {
                            if (response.success) {
                                IdeaApp.plugins.notification(response.data.message, 'confirmation');
                            } else {
                                IdeaApp.plugins.notification(response.errorMessage, 'warning');
                            }
                            commentForm.find('#Submit').removeClass('btn-loading').attr('disabled', false);
                            $.fancybox.close();
                            setTimeout(function () {
                                IdeaApp.shoppingExperiences.openForm();
                            }, 1);
                        }
                    });
                }
            }
        },
        printProduct: function (element) {
            var url = '/urun-yazdir?productId=' + this.productId;
            IdeaApp.helpers.print(element, IdeaApp.routing.generate(url));
        },
        addPriceWarning: function () {
            if (!isMember) {
                window.location = IdeaApp.routing.generate('/uye-girisi');
                return;
            }
            IdeaApp.helpers.ajaxRequest({
                url: IdeaApp.routing.generate('/product/add-price-warning'),
                data: 'productId=' + this.productId,
                success: function (response) {
                    if (response.success) {
                        IdeaApp.plugins.notification(response.data.message, 'confirmation');
                    } else {
                        IdeaApp.plugins.notification(response.errorMessage, 'warning');
                    }
                }
            });
        },
        addStockWarning: function (element) {
            if (!isMember) {
                window.location = IdeaApp.routing.generate('/uye-girisi');
                return;
            }
            element.addClass('btn-loading').attr('disabled', 'disabled');
            var productId;
            if (route.group === 'combine') {
                productId = element.parents('[data-parent-product-id]').attr('data-parent-product-id');
            } else {
                productId = this.productId;
            }
            IdeaApp.helpers.ajaxRequest({
                url: IdeaApp.routing.generate('/product/add-stock-warning'),
                data: 'productId=' + productId,
                success: function (response) {
                    if (response.success) {
                        IdeaApp.plugins.notification(response.data.message, 'confirmation');
                    } else {
                        IdeaApp.plugins.notification(response.errorMessage, 'warning');
                    }
                    element.removeClass('btn-loading').removeAttr('disabled');
                }
            });
        },
        submitFeedForm: function () {
            var feedForm = $('#product-feed-form');
            feedForm.validate({
                errorElement: "div",
                validClass: 'validate',
                errorClass: 'validate-error',
                rules: {code: {required: true}},
                messages: {code: {required: "LÃ¼tfen gÃ¼venlik kodunu giriniz."}},
                errorPlacement: function (error, element) {
                    if (element.attr("type") == "checkbox" && element.parents('.form-group').find('div[id^=productFeed]').length == 0) {
                        element.parents('.form-group').append(error);
                    } else if (element.attr('id') == 'code') {
                        element.after(error);
                    }
                },
                showErrors: function (errorMap, errorList) {
                    for (var i = 0; i < errorList.length; i++) {
                        var error = errorList[i];
                        error = IdeaApp.helpers.modifyValidationError(error);
                    }
                    this.defaultShowErrors();
                }
            });
            $('[data-selector="product-feed"]').each(function () {
                $(this).rules('add', {
                    require_from_group: [1, "[data-selector='product-feed']"],
                    messages: {require_from_group: "LÃ¼tfen en az bir seÃ§enek seÃ§iniz."}
                });
            });
        },
        addSubscription: function () {
            var subscriptionForm = $('[data-selector="subscription-form"]');
            subscriptionForm.validate({
                errorElement: "div",
                validClass: 'validate',
                errorClass: 'validate-error',
                rules: {subscriptionPeriod: {required: true}, subscriptionDispatchCount: {required: true}},
                messages: {
                    subscriptionPeriod: {required: "LÃ¼tfen periyot seÃ§iniz."},
                    subscriptionDispatchCount: {required: "LÃ¼tfen sÃ¼re seÃ§iniz."}
                },
                showErrors: function (errorMap, errorList) {
                    for (var i = 0; i < errorList.length; i++) {
                        var error = errorList[i];
                        error = IdeaApp.helpers.modifyValidationError(error);
                    }
                    this.defaultShowErrors();
                }
            });
            if (subscriptionForm.valid()) {
                IdeaApp.plugins.notification('Sepete ekleme iÅŸlemi yapÄ±lacak.', 'confirmation');
            }
        },
        redirectSocialLink: function (element) {
            var socialLinks = {
                'twitter': 'http://twitter.com/intent/tweet?url={site_url}&text={site_title}',
                'facebook': 'http://www.facebook.com/sharer.php?&u={site_url}&t={site_title}',
                'google': 'http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk={site_url}&title={site_title}&annotation={site_keywords}&labels={site_keywords}',
                'pinterest': 'http://pinterest.com/pin/create/button/?url={site_url}&media={media}',
                'whatsapp': 'https://{whatsapp_source}.whatsapp.com/send?text={site_url}'
            };
            if (typeof socialLinks[element.attr('data-type')] === "undefined") {
                return;
            }
            var whatsappSource = "web";
            if (client.isMobile) {
                whatsappSource = "api";
            }
            var siteUrl = window.location.href;
            var siteTitle = encodeURIComponent($.trim(IdeaApp.helpers.loadMetaTagContent('title')));
            var productName = encodeURIComponent($.trim(this.fullName));
            var media = encodeURIComponent($.trim(this.primaryImageUrl));
            var url = socialLinks[element.attr('data-type')];
            url = url.replace(/{site_title}/g, siteTitle).replace(/{site_keywords}/g, productName).replace(/{site_url}/g, siteUrl).replace(/{media}/g, media).replace(/{whatsapp_source}/g, whatsappSource);
            window.open(url);
        },
        openPaymentOptions: function (element) {
            var headerTitle = 'Taksit SeÃ§enekleri';
            if (typeof element.attr('data-header-title') !== "undefined") {
                headerTitle = element.attr('data-header-title');
            }
            $("#payment-options-popup").remove();
            $('body').append('<div id="payment-options-popup" class="col-11 col-md-10 col-xl-6"><div class="payment-options-popup-title contentbox-header"><h4>' + headerTitle + '</h4></div><div class="payment-options-popup-content contentbox-body"></div></div>');
            IdeaApp.helpers.ajaxRequest({
                type: 'GET',
                url: '/taksit-secenekleri',
                data: {"productId": this.productId},
                success: function (response) {
                    $("#payment-options-popup .payment-options-popup-content").html(response);
                    $.fancybox.open({src: '#payment-options-popup'});
                }
            });
        },
        variant: {
            singular: function (element) {
                if (route.group === 'combine') {
                    this.loadCombineContent(element, element.attr('data-product-id'));
                } else {
                    this.loadContent(element.attr('data-url'));
                }
            }, selectBox: function (element) {
                var self = this;
                var parent = element.parents('.variant-select');
                if (element.attr('disabled')) {
                    return;
                }
                var dataGroupIndex = parseInt(element.attr('data-group-index'));
                var optionValueList = [];
                for (var i = dataGroupIndex; i >= 0; i--) {
                    optionValueList.push(parent.find('[data-group-index=' + i + '] option:selected').val());
                }
                var optionGroupCount = parent.find('[data-selector="select-dropdown-variant"]').length;
                for (var i = dataGroupIndex + 1; i < optionGroupCount; i++) {
                    var parentSelect = parent.find('[data-group-index=' + i + ']');
                    parentSelect.val(0);
                }
                if (element.val() == 0) {
                    return;
                }
                var options = {
                    selected_option_group_id: element.attr('data-group-id'),
                    next_option_group_id: element.parents('.variant-list').next().find('select').attr('data-group-id'),
                    selected_options: optionValueList
                };
                if (route.group === 'combine') {
                    options.parent_product_id = element.parents('[data-parent-product-id]').attr('data-parent-product-id')
                } else {
                    options.parent_product_id = IdeaApp.product.parentProductId > 0 ? IdeaApp.product.parentProductId : IdeaApp.product.productId
                }
                var optionStockData = [];
                IdeaApp.helpers.ajaxRequest({
                    url: IdeaApp.routing.generate("/product/related-options"),
                    data: options,
                    success: function (response) {
                        IdeaApp.product.optionData = response.data.options;
                        var nextSelectElement = element.parents('.variant-list').next().find('select');
                        nextSelectElement.removeAttr('disabled');
                        if (typeof options.next_option_group_id == 'undefined') {
                            if (response.data.options.length > 0) {
                                if (route.group === 'combine') {
                                    self.loadCombineContent(element, response.data.options[0].product_id);
                                } else {
                                    self.loadContent(response.data.options[0].product_url);
                                }
                            }
                        } else {
                            $.each(response.data.options, function (key, optionData) {
                                if (typeof optionStockData[optionData.option_title] == 'undefined') {
                                    optionStockData[optionData.option_title] = 0;
                                }
                                optionStockData[optionData.option_title] = optionStockData[optionData.option_title] + optionData.product_stock_amount;
                            });
                            var selectElement = element.parents('.variant-list').next();
                            var optionList = selectElement.find('option');
                            optionList.each(function () {
                                $(this).attr('disabled', true);
                            });
                            $.each(response.data.options, function (key, optionData) {
                                optionList.each(function () {
                                    if ($(this).val() == optionData.option_id) {
                                        $(this).attr('disabled', false);
                                        if (optionStockData[optionData.option_title] == 0 && $(this).html().indexOf('( TÃœKENDÄ° )') == -1) {
                                            $(this).append(' ( TÃœKENDÄ° )')
                                        }
                                        if (optionStockData[optionData.option_title] != 0) {
                                            $(this).text($(this).text().split(' ( TÃœKENDÄ° )')[0]);
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            }, plural: function (element) {
                var self = this;
                if (element.hasClass('variant-passive')) {
                    return;
                }
                var selectedElement = 'variant-selected';
                element.addClass(selectedElement).siblings().removeClass('variant-selected');
                var dataGroupIndex = parseInt(element.parents('.variant-list-group').attr('data-group-index'));
                var parent = element.parents('.variant-plural');
                var parentProductId = element.parents('[data-parent-product-id]').attr('data-parent-product-id');
                var optionValueList = [];
                for (var i = dataGroupIndex; i >= 0; i--) {
                    optionValueList.push(parent.find('[data-group-index=' + i + '] span.variant-selected').attr('data-option-id'));
                }
                var optionGroupCount = parent.find('[data-selector="select-plural-variant"]').length;
                for (var j = dataGroupIndex + 1; j < optionGroupCount; j++) {
                    parent.find('[data-group-index=' + j + '] span').addClass('variant-passive').removeClass('variant-selected').removeClass('variant-no-stock');
                }
                var options = {
                    selected_option_group_id: element.parents('.variant-list-group').attr('data-group-id'),
                    next_option_group_id: element.parents('.variant-list-group').next().attr('data-group-id'),
                    selected_options: optionValueList,
                    parent_product_id: IdeaApp.product.parentProductId > 0 ? IdeaApp.product.parentProductId : IdeaApp.product.productId
                };
                if (route.group === 'combine') {
                    options.parent_product_id = parentProductId;
                }
                var optionStockData = [];
                IdeaApp.helpers.ajaxRequest({
                    url: IdeaApp.routing.generate("/product/related-options"),
                    data: options,
                    success: function (response) {
                        $.each(response.data.options, function (key, optionData) {
                            if (typeof optionStockData[optionData.option_title] == 'undefined') {
                                optionStockData[optionData.option_title] = 0;
                            }
                            optionStockData[optionData.option_title] = optionStockData[optionData.option_title] + optionData.product_stock_amount;
                        });
                        if (typeof options.next_option_group_id == 'undefined') {
                            if (route.group === 'combine') {
                                self.loadCombineContent(element, response.data.options[0].product_id);
                            } else {
                                self.loadContent(response.data.options[0].product_url);
                            }
                        } else {
                            $.each(response.data.options, function (key, optionData) {
                                var eachElement = element.parents('.variant-list-group').next().find('span');
                                eachElement.each(function () {
                                    if ($(this).attr('data-option-id') == optionData.option_id) {
                                        $(this).removeClass('variant-passive');
                                        if (optionStockData[optionData.option_title] == 0) {
                                            $(this).addClass('variant-no-stock');
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            }, loadCombineContent: function (element, productId) {
                IdeaApp.plugins.loadingBar.show();
                IdeaApp.helpers.ajaxRequest({
                    type: 'POST',
                    data: {'pid': productId},
                    url: IdeaApp.routing.generate('/combine-product/detail'),
                    success: function (response) {
                        var product = response.data.product;
                        var parentElement = element.parents('[data-parent-product-id]');
                        parentElement.attr('data-combine-selected', '');
                        parentElement.find('[data-combine-image] img').attr('src', product.productImage.original_url);
                        parentElement.find('[data-combine-title]').html(product.productName);
                        parentElement.find('[data-combine-price]').html('');
                        if (product.productDiscountedPrice) {
                            parentElement.find('[data-combine-price]').append('<div class="combine-list-price-old"><span>' + Number(product.productPrice).toLocaleString('tr-TR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }) + '</span> <span>' + product.productCurrency + '</span></div>');
                            parentElement.find('[data-combine-price]').append('<div class="combine-list-price-new"><span data-combine-price-new>' + Number(product.productDiscountedPrice).toLocaleString('tr-TR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }) + '</span> <span>' + product.productCurrency + '</span></div>');
                        } else {
                            parentElement.find('[data-combine-price]').append('<div class="combine-list-price-new"><span data-combine-price-new>' + Number(product.productPrice).toLocaleString('tr-TR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }) + ' </span> <span>' + product.productCurrency + '</span></div>');
                        }
                        var productButton = parentElement.find('a[data-context="detail"]');
                        productButton.attr('data-product-id', product.productId);
                        if (product.stockAmount == 0) {
                            productButton.attr('data-selector', 'stock-warning');
                            productButton.removeClass('add-to-cart-button').removeClass('no-stock-button').addClass('remind-me-button').attr('disabled', false);
                            productButton.html(combineRemindMeText);
                        } else {
                            if (product.realAmount == 0) {
                                productButton.removeAttr('data-selector');
                                productButton.removeClass('add-to-cart-button').removeClass('remind-me-button').addClass('no-stock-button').attr('disabled', true);
                                productButton.html(combineInCartText);
                            } else {
                                productButton.attr('data-selector', 'add-to-cart')
                                productButton.removeClass('no-stock-button').removeClass('remind-me-button').addClass('add-to-cart-button').attr('disabled', false);
                                productButton.html(combineAddToCartText);
                            }
                        }
                        productButton.attr('data-stockamount', product.realAmount);
                        IdeaApp.product.setTotalProducts();
                        IdeaApp.plugins.loadingBar.hide();
                    }
                });
            }, loadContent: function (variantUrl) {
                IdeaApp.plugins.loadingBar.show();
                IdeaApp.helpers.ajaxRequest({
                    type: 'GET', url: variantUrl, success: function (response) {
                        window.history.pushState(null, null, variantUrl);
                        var responseHtml = document.createElement('html');
                        responseHtml.innerHTML = response;
                        $('head :not([rel*="stylesheet"], [rel*="icon"], script[src*="jquery"])').remove();
                        $('head').prepend($(responseHtml).find('head :not([rel*="stylesheet"], [rel*="icon"], script[src*="jquery"])'));
                        $('body #product-detail-container').replaceWith($(responseHtml).find('body #product-detail-container'));
                        $('[data-toggle="tooltip"]').tooltip();
                        IdeaApp.product.setDefaultParams();
                        IdeaApp.dynamicFormValidate();
                        if (typeof IdeaTheme.product !== "undefined") {
                            setTimeout(function () {
                                IdeaTheme.product.init();
                            }, 250);
                        }
                        IdeaApp.plugins.loadingBar.hide();
                    }
                })
            }
        },
        promotion: {
            selectOptionedProductPromotion: function (element) {
                var promotionId = parseInt(element.attr('data-promotion-id'));
                $.fancybox.open({
                    src: IdeaApp.routing.generate('/promosyon-teklifleri?promotionId=' + promotionId + '&productId=' + IdeaApp.product.productId),
                    type: 'ajax'
                });
            }, selectPromotion: function (element) {
                IdeaApp.helpers.disableElement(element);
                element.addClass('btn-loading');
                IdeaApp.helpers.ajaxRequest({
                    url: IdeaApp.routing.generate('/promosyon-sec'),
                    data: {
                        'promotion_id': parseInt(element.attr('data-promotion-id')),
                        'product_id': IdeaApp.product.productId,
                        'anticsrf': anticsrf
                    },
                    success: function (response) {
                        IdeaApp.helpers.enableElement(element);
                        element.removeClass('btn-loading');
                        if (response.success) {
                            window.location = IdeaApp.routing.generate("/sepet");
                        } else {
                            IdeaApp.plugins.notification(response.errorMessage, 'warning');
                        }
                    }
                });
            }, togglePromotionalProductVariants: function (id) {
                $('[data-product-id="' + id + '"]').toggle();
            }, controlPromotion: function () {
                var promotionSelector = $("#promotion-content");
                var operator = promotionSelector.attr("data-base-products-operator");
                var baseCount = promotionSelector.attr("data-base-count");
                var optionedProductsTree = promotionSelector.attr("data-optioned-products-tree");
                var obj = $.parseJSON(optionedProductsTree);
                var idArr = new Array();
                var totalAmount = 0;
                var amountArr = new Array();
                var pidsOrStocks = "";
                for (var i in obj) {
                    i = parseInt(i);
                    if (i == 0 || isNaN(i)) {
                        continue;
                    }
                    var str = "," + obj[i];
                    idArr = str.split(",");
                    idArr.shift();
                    for (var j = 0; j < idArr.length; j++) {
                        if ($("#option_" + i + "_" + idArr[j]).is(":checked") == true) {
                            totalAmount = totalAmount + parseInt($("#promotionalProductAmount_" + idArr[j]).val());
                            pidsOrStocks += idArr[j] + "_" + parseInt($("#promotionalProductAmount_" + idArr[j]).val()) + ",";
                        }
                    }
                    if (operator == "and") {
                        if (totalAmount < baseCount) {
                            $("#post-promotion-choices").hide();
                            $("#promotion-not-allowed").show();
                            return false;
                        }
                    } else {
                        amountArr.push(totalAmount);
                    }
                    totalAmount = 0;
                }
                if (operator == "or") {
                    var isPromotion = false;
                    for (i in amountArr) {
                        if (isNaN(i)) {
                            continue;
                        }
                        if (amountArr[i] >= baseCount) {
                            $("#post-promotion-choices").show();
                            $("#promotion-not-allowed").hide();
                            isPromotion = true;
                        }
                    }
                    if (!isPromotion) {
                        $("#post-promotion-choices").hide();
                        $("#promotion-not-allowed").show();
                        return false;
                    }
                } else if (operator == "and") {
                    $("#post-promotion-choices").show();
                    $("#promotion-not-allowed").hide();
                }
                $("#pids-or-stocks").val(pidsOrStocks);
            }, postPromotionChoices: function (element) {
                var params = {};
                params["promotion_id"] = element.attr("data-promotion-id");
                params["pidsOrStocks"] = $("#pids-or-stocks").val();
                params["anticsrf"] = anticsrf;
                IdeaApp.helpers.disableElement(element);
                element.addClass('btn-loading');
                IdeaApp.helpers.ajaxRequest({
                    url: IdeaApp.routing.generate('/varyantli-promosyon-sec'),
                    data: params,
                    success: function (response) {
                        IdeaApp.helpers.enableElement(element);
                        element.removeClass('btn-loading');
                        if (response.success) {
                            window.location = IdeaApp.routing.generate("/sepet");
                        } else {
                            $("#post-promotion-choices").hide();
                            $("#promotion-not-allowed").show();
                            IdeaApp.plugins.notification(response.errorMessage, 'warning');
                        }
                    }
                });
            }
        },
        eventListener: function () {
            var self = this;
            $(document).on('click', '[data-image]', function () {
                self.changePrimaryImage($(this));
            });
            $(document).on('click', '[data-selector="add-to-cart-batch"]', function () {
                self.addToCartBatch($(this));
            });
            $(document).on('click', '.combine-primary-image', function () {
                self.popupImage($(this));
            });
            $(document).on('click', '[data-selector="share-link"]', function () {
                self.redirectSocialLink($(this));
            });
            $(document).on('click', '[data-selector="recommend-product"]', function () {
                self.recommend.openForm();
            });
            $(document).on('click', '[data-selector="submit-recommend"]', function () {
                self.recommend.submitForm();
            });
            $(document).on('click', '[data-selector="add-comment"]', function () {
                self.comment.openForm();
            });
            $(document).on('click', '[data-selector="load-comments"]', function () {
                self.comment.load($(this));
            });
            $(document).on('click', '[data-selector="submit-comment"]', function () {
                self.comment.submitForm();
            });
            $(document).on('click', '[data-selector="print-product"]', function () {
                self.printProduct($(this));
            });
            $(document).on('click', '[data-selector="price-warning"]', function () {
                self.addPriceWarning();
            });
            $(document).on('click', '[data-selector="stock-warning"]', function () {
                self.addStockWarning($(this));
            });
            $(document).on('click', '[data-selector="open-payment-options"]', function () {
                self.openPaymentOptions($(this));
            });
            $(document).on('click', '[data-selector="select-optioned-product-promotion"]', function () {
                self.promotion.selectOptionedProductPromotion($(this));
            });
            $(document).on('click', '[data-selector="select-promotion"]', function () {
                self.promotion.selectPromotion($(this));
            });
            $(document).on('click', '[data-selector="show-promotional-product-variants"]', function () {
                self.promotion.togglePromotionalProductVariants($(this).attr('data-optioned-product-id'));
            });
            $(document).on('click', '[data-selector="control-promotion"]', function () {
                self.promotion.controlPromotion();
            });
            $(document).on('click', '[data-selector="post-promotion-choices"]', function () {
                self.promotion.postPromotionChoices($(this));
            });
            $(document).on('click', '[data-selector="submit-product-feed"]', function () {
                self.submitFeedForm();
                if ($('#product-feed-form').valid()) {
                    let self = $(this)
                    $(this).addClass('btn-loading');
                    IdeaApp.helpers.ajaxRequest({
                        url: IdeaApp.routing.generate('/recaptcha-visibility'),
                        success: function (response) {
                            if (response.success) {
                                if (response.data === 'invisible') {
                                    $("#product-feed-form").submit();
                                } else {
                                    if (grecaptcha.getResponse()) {
                                        reCaptchaProductFeedSubmit();
                                        $("#product-feed-form").submit();
                                    } else {
                                        IdeaApp.plugins.notification('Google DoÄŸrulamasÄ±nÄ± iÅŸaretleyiniz.', 'warning');
                                        self.removeClass('btn-loading');
                                    }
                                }
                            } else {
                                IdeaApp.plugins.notification(response.errorMessage, 'warning');
                                IdeaApp.plugins.loadingBar.hide();
                            }
                        }
                    });
                }
            });
            $(document).on('click', '[data-selector="submit-subscription"]', function () {
                self.addSubscription();
            });
            $(document).on('change', '[data-selector="select-singular-variant"]', function () {
                self.variant.singular($(this));
            });
            $(document).on('change', '[data-selector="select-dropdown-variant"]', function () {
                self.variant.selectBox($(this));
            });
            $(document).on('click', '[data-selector="select-plural-variant"] span', function () {
                self.variant.plural($(this));
            });
        }
    }
}(jQuery, window));

function reCaptchaProductFeedSubmit(token) {
    $(document).find('[data-sitekey="6Lcg9hoUAAAAADxSSRhCaT4MD93mbLJeE3nRcS6a"]').remove();
    $("#product-feed-form").append("<input name='recaptcha' type='hidden' value='" + token + "'>");
}