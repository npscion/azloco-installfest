var Pristine = {};
if (!Pristine) {
    Pristine = {};
}
// Debugging
var UI = {};
if (!UI) {
    UI = {};
}
(function() {
    /************************
    /*** Global Variables
    ************************/

    var Fancybox = {},
        Helper = {},
        BidModal = {},
        AddToCartModal = {},
        AddToWatchListModal = {},
        ConfirmAuctionModal = {},
        LinkProductModal = {},
        LinkedProductsModal = {},
        //UI = {},
        FullCalendar = {},
        now = moment(),
        thisMonth = moment().format('YYYY-MM'),
        endDateInput,
        eventArray = [];

    Pristine.Calendars = {};
    Pristine.AuctionListing = {};
    Pristine.AuctionListing.end_time = {
        hour: 20,
        min: 0
    };
    Pristine.Checkout = {};
    Pristine.Checkout.submitted = false;

    UI.AuctionListing = {};
    UI.Shipping = {};
    UI.Inventory = {};

    /************************
    /*** Helper Functions
    ************************/

    Helper.filterNonNumericKeys = function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };

    Helper.formatRemainingTime = function(epoch_time) {
        var remaining_time_in_seconds, days, hours, minutes, seconds;
        remaining_time_in_seconds = (Date.now() / 1000) - epoch_time;

        ended = ((remaining_time_in_seconds < 0) ? false : true);

        remaining_time_in_seconds = Math.abs(remaining_time_in_seconds);

        if (!ended) {
            days = Math.floor(remaining_time_in_seconds/86400);
            hours = Math.floor((remaining_time_in_seconds - days * 86400) / 3600);
            minutes = Math.floor((remaining_time_in_seconds - days * 86400 - hours * 3600) / 60);
            seconds = Math.floor((remaining_time_in_seconds - days * 86400 - hours * 3600 - minutes * 60));
        }

        return { ended: ended, days: days, hours: hours, minutes: minutes, seconds: seconds };
    };


    /************************
    /*** Fancybox
    ************************/

    Fancybox.last_currentOpts = {};
    Fancybox.overlayShow = true;
    Fancybox.last_pos = 0;
    Fancybox.titleFormat = function(titleStr, currentArray, currentIndex, currentOpts) {
        titleStr = '<div id="fancybox-title-' + currentOpts.titlePosition + '">' + titleStr + '<\/div>';
        this.last_currentOpts = currentOpts;
        this.last_pos = currentIndex;
        return titleStr;
    };
    Fancybox.Elem_fancybox_content = $("#fancybox-content"),
    Fancybox.Elem_fancybox_fullsize = $("<div>", {id: "fancybox-fullsize"}).click(function() {
        $.fn.fancybox.defaults.autoScale = !$.fn.fancybox.defaults.autoScale;
        $.fancybox.pos(last_pos);
    });
    $.fn.fancybox.defaults.onComplete = function() {
        if(Fancybox.last_currentOpts.type == "image") {
            var width = Fancybox.Elem_fancybox_content.width(),
                height = Fancybox.Elem_fancybox_content.height();
            if($.fn.fancybox.defaults.autoScale && (width < Fancybox.last_currentOpts.width || height < Fancybox.last_currentOpts.height)) {
                Fancybox.Elem_fancybox_fullsize.text("Zoom");
            } else if(!$.fn.fancybox.defaults.autoScale) {
                Fancybox.Elem_fancybox_fullsize.text("Fit");
            } else {
                return;
            }
            Fancybox.Elem_fancybox_fullsize.appendTo(Fancybox.Elem_fancybox_content);
        }
    }
    $.fn.fancybox.defaults.onCleanup = function() {
        Fancybox.Elem_fancybox_fullsize.detach();
    };
    $.fn.fancybox.defaults.onClosed = function() {
        $.fn.fancybox.defaults.autoScale = true;
    };

    // Fancybox initialization
    $('a.thumb').each(function() {
        $(this).fancybox({
            transitionIn: 'elastic',
            transitionOut: 'elastic',
            overlayShow: true,
            overlayOpacity: 0,
            hideOnOverlayClick: true,
            orig: $('img', this),
            speedOut: 200,
            margin: 20,
            titlePosition: 'inside',
            titleFormat: Fancybox.titleFormat
        });
    });

    /************************
    /*** Dropzone Functions
    ************************/

    //Delete Image
    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                var element = $(this);
                $.ajax({
                    type: "POST",
                    url: "/admin/product/ajax-delete-image/",
                    data: { image_id: $(this).attr('data-image-id') }
                })
                .done(function(response) {
                    if (response) {
                        $(element).parent('.dz-image-preview').remove();
                        //console.log($('#dropzone-preview').find('.dz-image-preview').length, "Images: ");
                        if ($('#dropzone-preview').find('.dz-image-preview').length === 0) {
                            $('#no-images').show();
                        }
                        console.log('success');
                    } else {
                        console.log('failure');
                    }
                })
                .fail(function() {
                })
                .always(function(response) {
                });
            }
        },
        '.image-remove-link'
    );

    //Delete Image, non-AJAX for create, rather than list
    // TODO
    /*
    $('body').on(
        {
            click: function() {
                //console.log($('#dropzone-preview').find('.dz-image-preview').length, "Images: ");
                if ($('#dropzone-preview').find('.dz-image-preview').length === 0) {
                    $('#no-images').show();
                }
            }
        },
        '.dz-remove'
    );
    */

    //Create Dropzone
    Dropzone.options.createProductForm = {
        uploadMultiple: true,
        parallelUploads: 20,
        paramName: "image_list",
        autoProcessQueue: false,
        addRemoveLinks: true,
        thumbnailWidth: 180,
        thumbnailHeight: 180,
        previewsContainer: '#dropzone-previews .row',
        clickable: "#dropzone-clickable",
        dictDefaultMessage: "",
        init: function() {
            var thedrop = this, description = $("#description"), i, files_copy, order, index, count;
            // First change the button to actually tell Dropzone to process the queue.
            this.element.querySelector("input[type=submit]").addEventListener("click", function(e) {
                // Make sure that the form isn't actually being sent.
                e.preventDefault();
                e.stopPropagation();

                // Provide warning if no images have been uploaded
                if (thedrop.files.length == 0) {
                    $('.modal-body').find('.flash-messenger').html('<div id="no-images-warning" class="alert alert-warning text-center"><b>Warning!</b> You must upload images to submit a product.</div>');
                    $('#no-images-warning').show();
                } else if ($('#no-images-warning').length > 0) {
                    $('#no-images-warning').hide();
                }

                //Update the order before processing the queue.
                files_copy = thedrop.files.slice(0, thedrop.files.length);
                order = $('#dropzone-previews').sortable('toArray');
                for (i = 0; i < files_copy.length; i += 1) {
                    thedrop.files[i] = files_copy[(order[i] - 1)];
                }
                thedrop.processQueue();
            });
            this.on("addedfile", function(file) {
                if (!$('#no-images').hasClass('hidden')) {
                    $('#no-images').addClass('hidden');
                }
                if ($('.dz-preview').length % 4 == 0) {
                    $('#dropzone-previews').append("<div class='row'></div>");
                    this.previewsContainer = $('#dropzone-previews .row:last')[0];
                }
                $(file.previewElement).attr('id', this.files.length);
                $(file.previewElement).addClass('col-sm-3');
                $(file.previewElement).find('img').addClass('img-thumbnail');
                $(file.previewElement).find('.dz-details').addClass('hidden');
                $(file.previewElement).find('.dz-success-mark').addClass('hidden');
                $(file.previewElement).find('.dz-error-message').addClass('hidden');
                $(file.previewElement).find('.dz-error-mark').addClass('hidden');

                $("#dropzone-previews").sortable({
                    items:'.dz-preview',
                    cursor: 'move',
                    opacity: 0.5,
                    containment: '#dropzone-previews',
                    distance: 20,
                    tolerance: 'pointer'
                });
            });
            // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
            // of the sending event because uploadMultiple is set to true.
            this.on("sendingmultiple", function() {
                // Gets triggered when the form is actually being sent.
                // Hide the success button or the complete form.
                $('#auction-submit-btn').hide();
                $('#product-submit-btn').hide();
                $('button#processing-submission').show();
            });
            this.on("successmultiple", function(files, response) {
                try {
                    var response = $.parseJSON(response);
                } catch (e) {
                    UI.FlashMessenger.showMessage(false);
                    return;
                }

                //console.log(response);
                // Gets triggered when the files have successfully been sent.
                // Redirect user or notify of success.
                if (response.result == false) {
                    $('#confirm-auction-create-modal').modal('toggle');
                    $('button#processing-submission').hide();
                    $('#auction-submit-btn').show();
                    $('#product-submit-btn').show();
                    thedrop.removeAllFiles(true);
                    UI.FlashMessenger.showMessage(response);
                    UI.clearInputErrors(response);
                    UI.displayInputErrors(response);
                    return false;
                }

                if (window.location.href.indexOf('/admin/auction') > -1) {
                    window.location = "/admin/auction/print-label-queue";
                } else {
                    window.location = "/admin/product";
                }
            });
            this.on("errormultiple", function(files, response) {
              // Gets triggered when there was an error sending the files.
              // Maybe show form again, and notify user of error
            });
        }
    };

    $('#confirm-auction-create-modal').on("show.bs.modal", function () {
        if ($('#no-images-warning').length > 0) {
            $('#no-images-warning').hide();
        }
    });

    //Update Dropzone
    Dropzone.options.updateProductImages = {
        uploadMultiple: true,
        parallelUploads: 20,
        paramName: "image_list",
        autoProcessQueue: true,
        addRemoveLinks: false,
        thumbnailWidth: 180,
        thumbnailHeight: 180,
        previewsContainer: '#dropzone-previews .row',
        clickable: "#dropzone-clickable",
        dictDefaultMessage: "",
        init: function() {
            var temp_id = 0;
            var thedrop = this, description = $("#description"), i, files_copy, order, index, count;
            this.on("addedfile", function(file) {
                if (!$('#no-images').hasClass('hidden')) {
                    $('#no-images').addClass('hidden');
                }
                if ($('.dz-preview').length % 4 == 0) {
                    $('#dropzone-previews').append("<div class='row'></div>");
                    $(file.previewElement).attr('id', this.files.length);
                    this.previewsContainer = $('#dropzone-previews .row:last')[0];
                }
                $(file.previewElement).addClass('col-sm-3');
                $(file.previewElement).find('img').addClass('img-thumbnail');
                $(file.previewElement).find('.dz-details').addClass('hidden');
                $(file.previewElement).find('.dz-success-mark').addClass('hidden');
                $(file.previewElement).find('.dz-error-message').addClass('hidden');
                $(file.previewElement).find('.dz-error-mark').addClass('hidden');
                thedrop.processQueue();
            });
            // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
            // of the sending event because uploadMultiple is set to true.
            this.on("sendingmultiple", function() {
                // Gets triggered when the form is actually being sent.
                // Hide the success button or the complete form.
            });
            this.on("successmultiple", function(files, response) {
                // Even upon submitting multiple, it appears they come through
                // one at a time.
                var file = files[0];
                var r = $.parseJSON(response);
                $(file.previewElement).append('<a href="javascript: void(0)" class="image-remove-link" data-image-id="'+r.id+'">Remove Image</a>');
                $(file.previewElement).attr('id', r.id);
                // Gets triggered when the files have successfully been sent.
                // Redirect user or notify of success.
                /*if (response != false) {
                    console.log(response);
                    //window.location = window.location.origin + response;
                } else {
                    thedrop.removeAllFiles(true);
                    alert('Unable to add the image. Please make sure the image is a jpeg and try again.');
                }*/
            });
            this.on("errormultiple", function(files, response) {
              // Gets triggered when there was an error sending the files.
              // Maybe show form again, and notify user of error
            });
        }
    };

    Dropzone.options.updateAuctionImages = {
        uploadMultiple: true,
        parallelUploads: 20,
        paramName: "image_list",
        autoProcessQueue: true,
        addRemoveLinks: false,
        thumbnailWidth: 180,
        thumbnailHeight: 180,
        previewsContainer: '#dropzone-special-previews .row',
        clickable: "#dropzone-special-clickable",
        dictDefaultMessage: "",
        init: function() {
            var thedrop = this, description = $("#description"), i, files_copy, order, index, count;
            this.on("addedfile", function(file) {
                if ($('.dz-preview').length % 4 == 0) {
                    $('#dropzone-special-previews').append("<div class='row'></div>");
                    $(file.previewElement).attr('id', this.files.length);
                    this.previewsContainer = $('#dropzone-special-previews .row:last')[0];
                }
                $(file.previewElement).addClass('col-sm-3');
                $(file.previewElement).append('<a href="javascript: void(0)" class="image-remove-link">Remove Image</a>');
                $(file.previewElement).find('img').addClass('img-thumbnail');
                $(file.previewElement).find('.dz-details').addClass('hidden');
                $(file.previewElement).find('.dz-success-mark').addClass('hidden');
                $(file.previewElement).find('.dz-error-message').addClass('hidden');
                $(file.previewElement).find('.dz-error-mark').addClass('hidden');
                var res = thedrop.processQueue();
            });
        }
    };
    /************************
    /*** UI Functions
    ************************/

    //UI FlashMessenger
    UI.FlashMessenger = {};

    //Expects Pristine_Model_Response
    UI.FlashMessenger.showMessage = function(response) {
        if (typeof(response) === 'object') {
            if (response.hasOwnProperty('message')) {
                $('.flash-messenger').addClass('alert');
                if (response.hasOwnProperty('message_type')) {
                    $('.flash-messenger').addClass('alert-' + response.message_type);
                } else {
                    $('.flash-messenger').addClass('alert-danger');
                }
                $('.flash-messenger').html(response.message);
                window.setTimeout(
                    function() {
                        $('.flash-messenger').removeClass('alert');
                        if (response.hasOwnProperty('message_type')) {
                            $('.flash-messenger').removeClass('alert-' + response.message_type);
                        } else {
                            $('.flash-messenger').removeClass('alert-danger');
                        }
                        $('.flash-messenger').html('');
                    },
                    5000
                );
            }
        } else {
            $('.flash-messenger').addClass('alert');
            $('.flash-messenger').addClass('alert-danger');
            $('.flash-messenger').html('Oops! Something has gone wrong.');
            window.setTimeout(
                function() {
                    $('.flash-messenger').removeClass('alert');
                    $('.flash-messenger').removeClass('alert-danger');
                    $('.flash-messenger').html('');
                },
                5000
            );
        }
    };

    UI.FlashMessenger.clearMessage = function() {
        $('.flash-messenger').removeClass('alert');
        $('.flash-messenger').html('');
        //All alert classes
        $('.flash-messenger').removeClass('alert-success');
        $('.flash-messenger').removeClass('alert-info');
        $('.flash-messenger').removeClass('alert-warning');
        $('.flash-messenger').removeClass('alert-danger');
    };

    //Expects Pristine_Model_Response
    UI.displayInputErrors = function(response) {
        var errors, key;
        if (typeof(response) === 'object') {
            if (response.hasOwnProperty('values')) {
                if (response.values.hasOwnProperty('errors')) {
                    if (typeof(response.values.errors) === 'string') {
                        errors = $.parseJSON(response.values.errors);
                    } else {
                        errors = response.values.errors;
                    }
                    console.log(errors);
                    for (key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            if ($.isArray(errors[key])) {
                                for (var i = 0; i < errors[key].length; i += 1) {
                                    var spoofed_response = {};
                                    spoofed_response.values = {};
                                    spoofed_response.values.errors = {};
                                    for (var prop in errors[key][i]) {
                                        if (errors[key][i].hasOwnProperty(prop)) {
                                            spoofed_response.values.errors[prop.replace('_', '-') + "_" + i] = {};
                                        }
                                    }
                                    if (Object.keys(spoofed_response.values.errors).length > 0) {
                                        UI.displayInputErrors(spoofed_response);
                                    }
                                }
                                continue;
                            }
                            if (typeof(errors[key]) === 'object') {
                                //TODO Find keys that are numeric, they should be arrays
                                console.log(errors[key]);
                                $('#' + key).parents('.form-group').addClass('has-error');
                            }
                        }
                    }
                }
            }
        }
    };

    UI.clearInputErrors = function() {
        $('.has-error').removeClass('has-error');
    };

    /*** Session Expiration Modal ***/
    UI.session = false;
    UI.getSessionInfo = function() {
        clearTimeout(UI.session_timeout);
        $.ajax({
            type: "GET",
            url: "/user/auth/session-info"
        })
        .done(function(response) {
            try {
                var response = $.parseJSON(response);
                if (response.result == false) {
                    if (UI.session == true) {
                        location = "/login?redirect_url=" + encodeURI(location.pathname);
                    }
                } else {
                    UI.session = true;
                    UI.session_timeout = setTimeout(function() {
                        $('#session-expire-modal').modal({
                            show: true,
                            keyboard: false,
                            backdrop: 'static'
                        });
                        setTimeout(UI.getSessionInfo, response.values.session_length - response.values.prompt_length + 1000);
                    }, response.values.prompt_length);
                }
            } catch (e) {
                console.log(e);
            }
        })
        .fail(function() {
        })
        .always(function(response) {
        });
    }

    /************************
    /*** Pristine UI
    ************************/
    Pristine.UI = {};

    /*** Session Expiration Modal ***/
    Pristine.UI.displayExpiredSessionModal = function() {
        UI.getSessionInfo();
    };


    /*** Homepage Slider ***/
    Pristine.UI.verticalyCenterImages = function() {
        $('.slider-image-wrapper img').each(function() {
            var height = $(this).height;
            $(this).css('margin-top', '50px');
            console.log($(this).outerHeight());
        });
    }

    /*** Countdown ***/
    Pristine.UI.updateCountdown = function() {
        $('.product-countdown p, .product-countdown span').each(function() {
            time_obj = Helper.formatRemainingTime($(this).attr('data-pristine-end-time'));
            if (!time_obj.ended) {
                /*
                days = ((time_obj.days) ? time_obj.days + 'd ' : '');
                hours = ((time_obj.hours) ? time_obj.hours + 'h ' : '');
                minutes = ((time_obj.minutes) ? time_obj.minutes + 'm ' : '');
                seconds = ((time_obj.seconds) ? time_obj.seconds + 's ' : '0s');

                if (time_obj.days < 1 && time_obj.hours < 1 && time_obj.minutes <= 10) {
                    $(this).addClass('red');
                } else {
                    $(this).addClass('green');
                }

                $(this).html(days + hours + minutes + seconds);
                */
                days = ((time_obj.days) ? time_obj.days : '0');
                hours = ((time_obj.hours) ? time_obj.hours : '0');
                minutes = ((time_obj.minutes) ? time_obj.minutes : '0');
                seconds = ((time_obj.seconds) ? time_obj.seconds : '0');

                if (time_obj.days < 10) {
                    days = "0" + days;
                }
                if (time_obj.hours < 10) {
                    hours = "0" + hours;
                }
                if (time_obj.minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (time_obj.seconds < 10) {
                    seconds = "0" + seconds;
                }

                if (time_obj.days < 1 && time_obj.hours < 1 && time_obj.minutes <= 10) {
                    $(this).addClass('red');
                } else {
                    $(this).addClass('green');
                }

                $(this).html(days + ":" + hours + ":" + minutes + ":" + seconds);
            } else {
                $(this).addClass('red');
                $(this).html('<b>ENDED</b>');
            }
        });
        setTimeout(Pristine.UI.updateCountdown, 1000);
    }

    /*** Bid Updates ***/
    Pristine.UI.updateBids = function() {
        if (typeof auction_data != 'undefined') {
            $.ajax({
                type: "POST",
                url: "http://update."+ location.hostname,
                data: { auction_data: auction_data }
            })
            .done(function(response) {
                try {
                    var response = $.parseJSON(response);
                        console.log(response);
                    for (var i = 0; i < response.length; i += 1) {
                        auction_data[response[i].auction_id] = response[i].bid_id;
                        $('.high-bid-' + response[i].auction_id).html('$'+response[i].amount);
                        $('.high-bid-' + response[i].auction_id).addClass('bid-update');
                        $('.high-bid-' + response[i].auction_id).attr('data-pristine-update-expire', Date.now());
                        $('.min-bid-' + response[i].auction_id).html(response[i].minimum_next_bid_amount);
                        $('.bid-count-' + response[i].auction_id).html(response[i].count);
                        $('.high-bid-username-' + response[i].auction_id).html(response[i].username);
                    }
                } catch (e) {
                    console.log(e);
                }
            })
            .fail(function() {
            })
            .always(function() {
            });
            setTimeout(Pristine.UI.updateBids, 1000);
        }
    }

    /*** Bid Highlight Updates ***/
    Pristine.UI.removeHighlights = function () {
        var epoch_now = Date.now() / 1000;
        $('.bid-update').each(function() {
            if (epoch_now - ($(this).attr('data-pristine-update-expire') / 1000) > 10) {
                $(this).removeClass('bid-update');
            }
        });
        setTimeout(Pristine.UI.removeHighlights, 10000);
    }

    /*** Panel Menus ***/
    Pristine.UI.togglePanelButton = function() {
        $('span.panel-menu-button').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');
    }

    UI.toggleChevron = function(b) {
        $(b).find('.glyphicon').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');
    }

    $('body').on(
        {
            click: function() {
                UI.toggleChevron(this);
            }
        },
        '.toggle-chevron'
    );

    /*** Checkout Shipping Address Toggle ***/
    Pristine.UI.toggleShippingAddress = function () {
        if ($('#address_type')) {
            if ($('#address_type').val() == 'shipping') {
                $('#address-toggle').click();
            }
        }
    }

    /*** Product Batch Upload ***/
    Pristine.UI.checkUploadProgress = function () {
        if (typeof(batch_upload) !== 'undefined' && batch_upload) {
            UI.getSessionInfo();
            $.ajax({
                type: "GET",
                url: "/admin/batch-product-upload/ajax-upload-status"
            })
            .done(function(response) {
                try {
                    var response = $.parseJSON(response);
                    if (response.result) {
                        $('#processed-records').html(response.values.current_line);
                        $('#total-records').html(response.values.line_count);
                        $('#upload-progress-bar').attr('aria-valuenow', response.values.line_count);
                        $('#upload-progress-bar').css('width', (response.values.current_line / response.values.line_count) * 100 + '%');
                        $('#percent-complete').html(Math.round((response.values.current_line / response.values.line_count) * 100));
                        setTimeout(Pristine.UI.checkUploadProgress, 1000);
                    } else {
                        location.reload();
                    }
                } catch (e) {
                    console.log(e);
                }
            })
            .fail(function() {
            })
            .always(function() {
            });
        }
    }

    /*** Mobile MMenu Stuff ***/
    Pristine.UI.mmenu = function() {
        //Menus
        var admin_menu, auction_menu, marketplace_menu, user_menu;
        if ($('#auction-category-menu').length > 0) {
            $("#auction-category-menu").mmenu(
                {
                    offCanvas: { position: "left" },
                    navbar: { title: "Auction Menu" }
                }

            );
            auction_menu = $('#auction-category-menu').data('mmenu');
        }
        if ($('#admin-category-menu').length > 0) {
            $("#admin-category-menu").mmenu(
                {
                    offCanvas: { position: "left" },
                    navbar: { title: "Admin Panel" }
                }

            );
            admin_menu = $('#admin-category-menu').data('mmenu');
        }
        if ($('#marketplace-category-menu').length > 0) {
            $("#marketplace-category-menu").mmenu(
                {
                    offCanvas: { position: "left" },
                    navbar: { title: "Marketeplace Menu" }
                }
            );
            marketplace_menu = $('#marketplace-category-menu').data('mmenu');
        }
        if ($('#user-menu').length > 0) {
            $("#user-menu").mmenu(
                {
                    offCanvas: { position: "right" },
                    navbar: { title: "User Menu" }
                }
            );
            user_menu = $('#user-menu').data('mmenu');
            user_menu.bind('open', function() {
                $('#user-tag span').toggleClass('glyphicon-chevron-left glyphicon-chevron-right');
            });
            user_menu.bind('close', function() {
                $('#user-tag span').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
            });
        }
        if ($('.mm-page').length > 0) {
            $('.mm-page').css('height', document.height + $('.footer').height() + 125 /*margin top*/);
        }
    }

    /*** Auction/Product Images ***/
    Pristine.UI.sortable = function () {
    }

    Pristine.UI.dropzone = function () {
    }

    /************************
    /*** Bid Event Handlers
    ************************/

    /** Input Max Bid ***/
    $('body').on(
        {
            keydown: function(e) {
                Helper.filterNonNumericKeys(e);
            }
        },
        '.max-bid-input'
    );

    /** Submit Max Bid ***/
    $('body').on(
        {
            click: function() {
                var max_bid = $(this).parents('.max-bid-form').find('.max-bid-input').val();
                max_bid = parseFloat(max_bid).toFixed(2);
                BidModal.body_html = $('#bid-dialog .modal-body').html();
                BidModal.footer_html = $('#bid-dialog .modal-footer').html();
                if ($(this).attr('data-pristine-drop-ship') == 1) {
                    $('<p class="fine-print" style="color: red;">This item is not available for local pickup.</p>').appendTo('#bid-dialog .modal-body');
                }
                if (max_bid > 0) {
                    $('#bid-dialog .confirm-max-bid-button').attr('data-pristine-max-bid-amount', max_bid);
                    $('#bid-dialog .confirm-max-bid-button').attr('data-pristine-product_venue_id', $(this).attr('data-pristine-product-venue-id'));
                    $('#bid-dialog .bid-dialog-product-title').html('Bid $' + max_bid + ' on ' + $(this).attr('data-pristine-title') + '?');
                } else {
                    $('#bid-dialog .modal-body').html('<div class="alert alert-danger" role="alert">Uh oh! You forgot to enter a max bid!</div>');
                    $('#bid-dialog .confirm-max-bid-button').remove();
                }
                $('#bid-dialog').modal();
            }
        },
        '.max-bid-button'
    );

    $('body').on(
        {
            submit: function(e) {
                e.preventDefault();
                $(this).find('.max-bid-button').click();
            }
        },
        '.max-bid-form'
    );

    /** Confirm Max Bid Modal Event Handlers ***/
    $('#bid-dialog').on('hidden.bs.modal', function() {
        $('#bid-dialog .modal-body').html('');
        $(BidModal.body_html).appendTo('#bid-dialog .modal-body');
        $('#bid-dialog .modal-footer').html('');
        $(BidModal.footer_html).appendTo('#bid-dialog .modal-footer');
        /*if (location.pathname.indexOf('auction/dashboard') > 0) {
            location.reload();
        }*/
    });

    /** Confirm Max Bid ***/
    $('body').on(
        {
            click: function() {
                var max_bid = $(this);
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    url: "/user/max-bid/add",
                    data: { amount: $(this).attr('data-pristine-max-bid-amount'), product_venue_id: $(this).attr('data-pristine-product_venue_id') }
                })
                .done(function(response) {
                    try {
                        var response = $.parseJSON(response);
                        $('#bid-dialog .modal-body').html('<div class="alert alert-' + response.message_type + '" role="alert">' + response.message + '</div>');
                        $('#bid-dialog .confirm-max-bid-button').remove();
                        if (response.values) {
                            if (response.values['max_bid']) {
                                $('.max-bid-' + response.values['product_venue_id']).html(response.values['max_bid']);
                            }
                            if (response.values['high_bid']) {
                                $('.high-bid-' + response.values['product_venue_id']).html(response.values['high_bid']);
                            }
                            if (response.values['min_bid']) {
                                $('.min-bid-' + response.values['product_venue_id']).html(response.values['min_bid']);
                            }
                            $('.bid-count-' + response.values['product_venue_id']).html(response.values['bid_count']);
                        }
                    } catch (e) {
                        $('#bid-dialog .modal-body').html('<div class="alert alert-danger" role="alert">Uh oh! Something has gone wrong!</div>');
                        $('#bid-dialog .confirm-max-bid-button').remove();
                        // TODO Change button text to "Close"
                    }
                })
                .fail(function() {
                    $('#bid-dialog .modal-body').html('<div class="alert alert-danger" role="alert">Uh oh! Something has gone wrong!</div>');
                    $('#bid-dialog .confirm-max-bid-button').remove();
                })
                .always(function(response) {
                    $('.max-bid-input').val('');
                });
            }
        },
        '.confirm-max-bid-button'
    );

    /************************
    /*** Nav appearing/disappearing border
    ************************/
    $(document).scroll(function() {
        if ($(document).scrollTop() > 0) {
            $('#search-nav').addClass('border-bottom');
        } else {
            $('#search-nav').removeClass('border-bottom');
        }
    });

    /************************
    /*** Session Expiration Event Handlers
    ************************/
    $('#session-expire-modal').on('hide.bs.modal', function() {
        UI.getSessionInfo();
    });

    /************************
    /*** Add to Cart Event Handlers
    ************************/

    // Process add to cart
    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                AddToCartModal.body_html = $('#add-to-cart-dialog .modal-body').html();
                AddToCartModal.footer_html = $('#add-to-cart-dialog .modal-footer').html();

                $.ajax({
                    type: "POST",
                    url: "/marketplace/cart/ajax-add",
                    data: { product_venue_id: $(this).attr('data-pristine-product-venue-id'), user_id: $(this).attr('data-pristine-user-id') }
                })
                .done(function(response) {
                    try {
                        var response = $.parseJSON(response);
                        console.log(response);
                        $('#add-to-cart-dialog .modal-body').html("<div class='alert alert-" + response.message_type + "' role='alert'>" + response.message + '</div>');
                        $('#add-to-cart-dialog').modal();
                        if (response.values.cart_count != 0) {
                            $('#cart-count').html(response.values.cart_count);
                        }
                    } catch (e) {
                        console.log(e);
                        $('#add-to-cart-dialog .modal-body').html('<div class="alert alert-danger" role="alert">Uh oh! Something has gone wrong!</div>');
                    }
                })
                .fail(function() {
                    $('#add-to-cart-dialog .modal-body').html('<div class="alert alert-danger" role="alert">Uh oh! Something has gone wrong!</div>');
                })
                .always(function(response) {
                    $('#add-to-cart-dialog .confirm-add-to-cart-button').remove();
                });
            }
        },
        '.add-to-cart-button'
    );

    // Reset add to cart modal on hide
    $('#add-to-cart-dialog').on('hidden.bs.modal', function() {
        $('#add-to-cart-dialog .modal-body').html('');
        $(AddToCartModal.body_html).appendTo('#add-to-cart-dialog .modal-body');
        $('#add-to-cart-dialog .modal-footer').html('');
        $(AddToCartModal.footer_html).appendTo('#add-to-cart-dialog .modal-footer');
    });

    /************************
    /*** Menu toggle
    ************************/

    $('body').on(
        {
            click: function() {
                $(this).children().toggle(400);
            }
        },
        'a.menu-toggle'
    );

    /************************
    /*** Watch list Event Handlers
    ************************/

    // Add item to watch list and display modal
    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                // Save original modal content
                AddToWatchListModal.body_html = $('#add-to-watch-list-dialog .modal-body').html();
                AddToWatchListModal.footer_html = $('#add-to-watch-list-dialog .modal-footer').html();

                // Send AJAX request
                var product_venue_id = $(this).attr('data-pristine-product-venue-id');

                $.ajax({
                    type: "POST",
                    url: "/user/watch-list/ajax-add/",
                    data: { product_venue_id: product_venue_id }
                })
                .done(function(response) {
                    try {
                        var response = $.parseJSON(response);
                        var go_to_watch_list_button = '<a href="/user/auction/dashboard/view/watching" type="button" class="btn btn-default btn-sm go-to-watch-list-button watch">WATCH LIST</a>';
                        $("[data-pristine-product-venue-id=" + product_venue_id + "]").filter(".add-to-watch-list-button").after(go_to_watch_list_button);
                        $("[data-pristine-product-venue-id=" + product_venue_id + "]").filter(".add-to-watch-list-button").remove();
                    } catch (e) {
                        console.log(e);
                        $('#add-to-cart-dialog .modal-body').html('<div class="alert alert-danger" role="alert">Uh oh! Something has gone wrong!</div>');
                    }
                })
                .fail(function() {
                    $('#add-to-cart-dialog .modal-body').html('<div class="alert alert-danger" role="alert">Uh oh! Something has gone wrong!</div>');
                })
                .always(function(response) {
                });

                // Modify modal content
                $('#add-to-watch-list-dialog .add-to-watch-list-dialog-product-title').html($(this).attr('data-pristine-title'));

                // Display modal
                $('#add-to-watch-list-dialog').modal();
            }
        },
        '.add-to-watch-list-button'
    );

    // Reset add to watch list modal on hide
    $('#add-to-watch-list-dialog').on('hidden.bs.modal', function() {
        $('#add-to-watch-list-dialog .modal-body').html('');
        $(AddToWatchListModal.body_html).appendTo('#add-to-watch-list-dialog .modal-body');
        $('#add-to-watch-list-dialog .modal-footer').html('');
        $(AddToWatchListModal.footer_html).appendTo('#add-to-watch-list-dialog .modal-footer');
    });

    /************************
    /*** General Checkout Event Handlers
    ************************/

    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                $.ajax({
                    type: "GET",
                    url: "/user/profile/ajax-add-card"
                })
                .done(function(response) {
                    $('#add-card-modal .modal-body').html(response);
                    $('#add-card-modal').modal('toggle');
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#add-card'
    );

    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    url: "/user/profile/ajax-add-card" + (($(this).attr('data-pristine-user-id')) ? '/user-id/' + $(this).attr('data-pristine-user-id') : ''),
                    data: $('#add-card-form').serialize(),
                    beforeSend: function() {
                        $('#add-card-modal .modal-body').html($('#add-card-modal .modal-body-spinner').html());
                    }
                })
                .done(function(response) {
                    $('#add-card-modal').attr('data-posted', true);
                    $('#add-card-modal .modal-body').html(response);
                    if (!$('form#add-card-form').length) {
                        $('#add-card-modal button#add-card-submit').hide();
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#add-card-submit'
    );

    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                if ($('#add-card-modal').attr('data-posted')) {
                    location.reload();
                }
            }
        },
        '#add-card-modal [data-dismiss=modal]'
    );

    $('#add-card-modal').on('hide.bs.modal', function (e) {
        // This works, even if you don't click the close button
        if ($('#add-card-modal').attr('data-posted')) {
            location.reload();
        }
    })

    /************************
    /*** User Auction Checkout Event Handlers
    ************************/

    /*
    $('body').on(
        {
            change: function() {
                // Use address management tool, not this
                $('#shipping_first_name').val(payment_profiles[$(this).val()].billTo.firstName);
                $('#shipping_last_name').val(payment_profiles[$(this).val()].billTo.lastName);
                $('#shipping_address1').val(payment_profiles[$(this).val()].billTo.address);
                $('#shipping_city').val(payment_profiles[$(this).val()].billTo.city);
                $('#shipping_state_code').val(payment_profiles[$(this).val()].billTo.state);
                $('#shipping_zip').val(payment_profiles[$(this).val()].billTo.zip);
                $('#shipping_country_code').val(payment_profiles[$(this).val()].billTo.country);

                $('#shipping_state_code').trigger('change');
            }
        },
        '#payment_method'
    );
    */

    /************************
    /*** Guest Checkout Event Handlers
    ************************/

    /*** Toggle Shipping Address ***/
    $('body').on(
        {
            click: function() {
                if ($(this).hasClass('separate-shipping')) {
                    $('#shipping_name').removeAttr('disabled');
                    $('#shipping_address1').removeAttr('disabled');
                    $('#shipping_address2').removeAttr('disabled');
                    $('#shipping_city').removeAttr('disabled');
                    $('#shipping_state_code').removeAttr('disabled');
                    $('#shipping_country_code').removeAttr('disabled');
                    $('#marketplace_shipping_state_code').removeAttr('disabled');
                    $('#marketplace_shipping_country_code').removeAttr('disabled');
                    $('#shipping_zip').removeAttr('disabled');
                    $(this).removeClass('separate-shipping');
                    $('.shipping').removeClass('hidden');
                    $(this).html('Ship to billing address');
                    $('#address_type').val('shipping');
                    $('#shipping_state_code').change();
                    $('#shipping_country_code').change();
                    $('#marketplace_shipping_state_code').change();
                    $('#marketplace_shipping_country_code').change();
                    $('#billing_state_code').removeClass('marketplace_shipping_state_code');
                } else {
                    $('#shipping_name').attr('disabled', 'disabled');
                    $('#shipping_address1').attr('disabled', 'disabled');
                    $('#shipping_address2').attr('disabled', 'disabled');
                    $('#shipping_city').attr('disabled', 'disabled');
                    $('#shipping_state_code').attr('disabled', 'disabled');
                    $('#shipping_country_code').attr('disabled', 'disabled');
                    $('#marketplace_shipping_state_code').attr('disabled', 'disabled');
                    $('#marketplace_shipping_country_code').attr('disabled', 'disabled');
                    $('#shipping_zip').attr('disabled', 'disabled');
                    $(this).addClass('separate-shipping');
                    $('.shipping').addClass('hidden');
                    $(this).html('Ship to a different address');
                    $('#address_type').val('billing');
                    $('#billing_state_code').addClass('marketplace_shipping_state_code');
                    $('#billing_state_code').change();
                    $('#billing_country_code').change();
                }
            }
        },
        '#address-toggle'
    );

    /*** Change Billing State Code ***/
    $('body').on(
        {
            change: function() {
                if ($('#shipping_state_code').attr('disabled') == 'disabled') {
                    UI.getSessionInfo();
                    $.ajax({
                        type: "POST",
                        url: "/marketplace/checkout/ajax-update-totals",
                        data: { state: $(this).val() }
                    })
                    .done(function(response) {
                        var response = $.parseJSON(response);
                        console.log(response.values);
                        try {
                            $('#tax-total').html(response.values.tax_total);
                            $('#shipping-total').html(response.values.shipping_total);
                            $('#grand-total').html(response.values.grand_total);
                        } catch (e) {
                            console.log(e);
                        }
                    })
                    .fail(function() {
                    })
                    .always(function() {
                    });
                }

            }
        },
        '#billing_state_code'
    );

    /*** Change Billing Country Code ***/
    $('body').on(
        {
            change: function() {
                if ($('#shipping_country_code').attr('disabled') == 'disabled') {
                    UI.getSessionInfo();
                    $.ajax({
                        type: "POST",
                        url: "/marketplace/checkout/ajax-update-totals",
                        data: { country: $(this).val() }
                    })
                    .done(function(response) {
                        var response = $.parseJSON(response);
                        console.log(response.values);
                        try {
                            $('#tax-total').html(response.values.tax_total);
                            $('#shipping-total').html(response.values.shipping_total);
                            $('#grand-total').html(response.values.grand_total);
                        } catch (e) {
                            console.log(e);
                        }
                    })
                    .fail(function() {
                    })
                    .always(function() {
                    });
                }

            }
        },
        '#billing_country_code'
    );

    /*** Shipping Method ***/
    $('body').on(
        {
            change: function() {
                if ($('#shipping_state_code')) {
                    $('#shipping_state_code').trigger('change');
                }
                if ($('#marketplace_shipping_state_code')) {
                    $('#marketplace_shipping_state_code').trigger('change');
                }
            }
        },
        "input[name='shipment_method']"
    );

    /*** Change Auction Shipping State Code ***/
    $('body').on(
        {
            change: function() {
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    //url: "/marketplace/checkout/ajax-update-totals",
                    url: "/user/invoice/ajax-auction-update-totals",
                    data: { state: $(this).val(), country: $('#shipping_country_code').val(), user_id: $(this).attr('data-pristine-user-id'), local_pickup: (($('#shipment_method-pickup').attr('checked') == 'checked') ? true : false) }
                })
                .done(function(response) {
                    var response = $.parseJSON(response);
                    try {
                        $('#adjustment-total').html(response.values.adjustment_total);
                        $('#tax-total').html(response.values.tax_total);
                        $('#shipping-total').html(response.values.shipping_total);
                        $('#grand-total').html(response.values.grand_total);
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#shipping_state_code'
    );

    /*** Change Marketplace Shipping State Code ***/
    $('body').on(
        {
            change: function() {
                UI.getSessionInfo();

                var country;

                if ($(this).hasClass('marketplace_shipping_state_code')) {
                    country = $('#billing_country_code').val();
                } else {
                    country = $('#marketplace_shipping_country_code').val();
                }

                data = {
                    state: $(this).val(),
                    country: country,
                    user_id: $(this).attr('data-pristine-user-id'),
                    local_pickup: (($('#shipment_method-pickup').attr('checked') == 'checked') ? true : false)
                }

                $.ajax({
                    type: "POST",
                    //url: "/marketplace/checkout/ajax-update-totals",
                    url: "/user/invoice/ajax-marketplace-update-totals",
                    data: data
                })
                .done(function(response) {
                    var response = $.parseJSON(response);
                    console.log(response);
                    try {
                        $('#adjustment-total').html(response.values.adjustment_total);
                        $('#tax-total').html(response.values.tax_total);
                        $('#shipping-total').html(response.values.shipping_total);
                        $('#grand-total').html(response.values.grand_total);
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#marketplace_shipping_state_code, .marketplace_shipping_state_code'
    );

    /*** Change Auction Shipping Country Code ***/
    $('body').on(
        {
            change: function() {
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    //url: "/marketplace/checkout/ajax-update-totals",
                    url: "/user/invoice/ajax-auction-update-totals",
                    data: { country: $(this).val(), state: $('#shipping_state_code').val(), user_id: $(this).attr('data-pristine-user-id'), local_pickup: (($('#shipment_method-pickup').attr('checked') == 'checked') ? true : false) }
                })
                .done(function(response) {
                    var response = $.parseJSON(response);
                    console.log(response.values);
                    try {
                        $('#adjustment-total').html(response.values.adjustment_total);
                        $('#tax-total').html(response.values.tax_total);
                        $('#shipping-total').html(response.values.shipping_total);
                        $('#grand-total').html(response.values.grand_total);
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#shipping_country_code'
    );

    /*** Change Marketplace Shipping Country Code ***/
    $('body').on(
        {
            change: function() {
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    //url: "/marketplace/checkout/ajax-update-totals",
                    url: "/user/invoice/ajax-marketplace-update-totals",
                    data: { country: $(this).val(), state: $('#marketplace_shipping_state_code').val(), user_id: $(this).attr('data-pristine-user-id'), local_pickup: (($('#shipment_method-pickup').attr('checked') == 'checked') ? true : false) }
                })
                .done(function(response) {
                    var response = $.parseJSON(response);
                    console.log(response.values);
                    try {
                        $('#adjustment-total').html(response.values.adjustment_total);
                        $('#tax-total').html(response.values.tax_total);
                        $('#shipping-total').html(response.values.shipping_total);
                        $('#grand-total').html(response.values.grand_total);
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#marketplace_shipping_country_code'
    );

    /************************
    /*** Registration Event Handlers
    ************************/

    /** Reuse Address ***/
    $('body').on(
        {
            click: function() {
                $('#shipping_name').val($('#billing_name').val());
                $('#shipping_address1').val($('#billing_address1').val());
                $('#shipping_address2').val($('#billing_address2').val());
                $('#shipping_city').val($('#billing_city').val());
                $('#shipping_state_code').val($('#billing_state_code').val());
                $('#shipping_country_code').val($('#billing_country_code').val());
                $('#shipping_zip').val($('#billing_zip').val());
            }
        },
        '#shipping_equals_billing'
    );

    /************************
    /*** Auction Search Event Handlers
    ************************/

    /** Change Search Type ***/
    $('body').on(
        {
            click: function() {
                var category_code;
                category_code = $(this).attr('data-pristine-search-category');
                $(this).parents('div.search-by-category').find('span.search-category').html($(this).html());
                $(this).parents('div.search-by-category').find('input.search-category').val(category_code);
                $(this).parents('div.search-by-category').find('input.search-category').val();
            }
        },
        '.search-by-category ul.dropdown-menu li a'
    );

    /** Toggle filters **/
    $('body').on(
        {
            click: function() {
                var id, type;
                type = $(this).data('pristine-auction-type');

                console.log(type);
                console.log($('input.auction-search-include[data-pristine-auction-type="'+type+'"]'));
                // $('input.auction-search-include[data-pristine-auction-type="'+type+'"]').hide();

                $('input.auction-search-include[data-pristine-auction-type="'+type+'"]').prop( "checked", function( i, val ) {
                    return !val;
                });
                $(this).toggleClass('active');
            }
        },
        '.search-controls .auction-type-filter button'
    );

    /** Toggle filters **/
    $('body').on(
        {
            click: function() {
                var id, statuses;
                status = $(this).data('pristine-auction-status');

                console.log(status);
                console.log($('input.auction-search-include[data-pristine-auction-status="'+status+'"]'));
                // $('input.auction-search-include[data-pristine-auction-status="'+status+'"]').hide();

                $('input.auction-search-include[data-pristine-auction-status="'+status+'"]').prop( "checked", function( i, val ) {
                    return !val;
                });
                $(this).toggleClass('active');
            }
        },
        '.search-controls .auction-status-filter button'
    );

    /************************
    /*** Category Search Event Handlers
    ************************/

    /** Change Search Type ***/
    $('body').on(
        {
            click: function() {
                var search_type;
                search_type = $(this).attr('data-pristine-search-type');
                console.log(search_type);
                $(this).parents('div.category-search').find('#search_type').val(search_type);
                $(this).parents('div.category-search').find('.search-selection').html($(this).html());
                $(this).parents('div.category-search').find('input.search_selection').val(search_type);
            }
        },
        '.category-search ul.dropdown-menu li a'
    );

    // *****************************
    // Auction Index
    // -----------------------------

    // Auction search

    // Initialize date range picker
    (function() {
        if ($('input#by_date[type=checkbox]').is(":checked")) {
            $('input#date-range.drp').removeAttr('disabled');
        } else {
            // If user chooses to not search by date, return false
            $('input#date-range.drp').attr('disabled', 'disabled');
        }
        if ($('input#date-range.drp').length > 0) {
            var start, end;
            if ($('input#date-range-start').val()) {
                start = moment($('input#date-range-start').val(), "YYYY/MM/DD");
            } else {
                start = moment().subtract(1, "month");
            }
            if ($('input#date-range-end').val()) {
                end = moment($('input#date-range-end').val(), "YYYY/MM/DD");
            } else {
                end = moment().add(1, "month");
            }
            $('input#date-range').daterangepicker({
                "startDate": start.format('MM/DD/YYYY'),
                "endDate": end.format('MM/DD/YYYY')
            });
            $('input#date-range-start').val('');
            $('input#date-range-end').val('');
        }
    })();

    $('body').on(
        {
            change: function() {
                if ($(this).is(":checked")) {
                    // If user chooses to search by date, enable date range
                    // picker and record values for hidden start and end
                    var start, end;
                    $('input#date-range.drp').removeAttr('disabled');
                    start = $('input#date-range').data('daterangepicker').startDate.format('YYYY/MM/DD');
                    end = $('input#date-range').data('daterangepicker').endDate.format('YYYY/MM/DD');
                    $('input#date-range-start').val(start);
                    $('input#date-range-end').val(end);
                } else {
                    // If user chooses to not search by date, disable date
                    // range picker and wipe values from hidden start and end
                    $('input#date-range.drp').attr('disabled', 'disabled');
                    $('input#date-range-start').val('');
                    $('input#date-range-end').val('');
                }
            }
        },
        'input#by_date[type=checkbox]'
    );

    $('body').on(
        {
            change: function() {
                var start, end;
                start = $('input#date-range').data('daterangepicker').startDate.format('YYYY/MM/DD');
                end = $('input#date-range').data('daterangepicker').endDate.format('YYYY/MM/DD');
                $('input#date-range-start').val(start);
                $('input#date-range-end').val(end);
            }
        },
        'input#date-range.drp'
    );

    // *****************************
    // Auction Listing
    // -----------------------------
    // Function library

    /**
     * Returns a settings object for initilizing a jQuery UI datepicker
     */
    UI.AuctionListing.datepickerSetter = function(auction_type) {
        var is_daily;
        if (auction_type == 'daily') {
            is_daily = true;
        } else {
            is_daily = false;
        }
        // Return datepicker settings object
        return {
            dateFormat: 'yy-mm-dd',
            beforeShowDay: function(day) {
                // Today, known auction date, days from a to d
                var today = new Date();
                // Never allow past dates
                if (day < today) {
                    return [false, ""];
                }
                if (auction_type == 'daily') {
                    // Daily
                    return [true, ''];
                } else if (auction_type == 'weekly') {
                    // Weekly
                    return [day.getDay() == 3, ''];
                } else if (auction_type == 'monthly') {
                    // Monthly
                    var next_week = new Date(),
                        one_week = 7*1000*60*60*24;
                    if (day.getDay() != 0) {
                        return [false, ''];
                    }
                    next_week.setTime(day.getTime() + one_week);
                    if (next_week.getMonth() == day.getMonth()) {
                        return [false, ''];
                    }
                    return [true, ''];
                } else {
                    return [false, 'Select an auction type to see available dates.'];
                }
            },
        };
    };

    /**
     * Init
     */
    (function() {
        // Auctions end at 7:00PM
        UI.AuctionListing.auction_end_hour = Pristine.AuctionListing.end_time.hour;
        // Auctions that are in the process of being listed
        UI.AuctionListing.temp_auctions = [];
        // Auctions that are pulled in by FullCalendar
        UI.AuctionListing.fullCal = {
            "primary": new Array(0),
            "linked": new Array(0),
            "rendered": false
        };
        // For resetting the legend
        UI.AuctionListing.fullCal.legendReset = $('.fullcal-legend').html();
        // Title for all temp_auctions
        if ($('#title').val()) {
            UI.AuctionListing.temp_title = $("#title").val();
        } else {
            UI.AuctionListing.temp_title = "(Untitled)";
        }
        // Last row of auction set widgets (jQuery selector)
        UI.AuctionListing.last_row = $('#auction-form-section').children().last();
        // Last auction set widget (jQuery selector)
        UI.AuctionListing.last_auction_set = $('.auction-set-container').last();
        if ($('.auction-set-container').length == 0) {
            UI.AuctionListing.last_auction_set = null;
        }
        // Date interval pattern, as defined by the user
        UI.AuctionListing.date_interval = parseInt($('#auction-interval-select').val());
        // Initialize temp_auction title
        if ($('#consignor').val() > 0) {
            UI.AuctionListing.temp_title = $('#title').val();
        } else {
            UI.AuctionListing.temp_title = "";
        }
        // Initialize temp_auctions based on initial DOM state
        $('.auction-set-container').each(function() {
            var end_date = moment($(this).find('.auction-end-date-field').val());
            if (end_date.isValid()) {
                end_date.hour(UI.AuctionListing.auction_end_hour);
            } else {
                end_date = '';
            }
            UI.AuctionListing.temp_auctions.push({
                "auction_index": parseInt($(this).attr('auction-index')),
                "date": end_date,
                //"type": $(this).find('.auction-type-select').val(),
                "consignor_user_id": parseInt($('select#consignor').val()),
                "title": UI.AuctionListing.temp_title
            });
        });
        // Initialize template auction set
        UI.AuctionListing.template_auction_set = $('.auction-set-container-template').clone();
        UI.AuctionListing.template_auction_set.removeClass('hidden');
        UI.AuctionListing.template_auction_set.removeClass('auction-set-container-template');
        UI.AuctionListing.template_auction_set.addClass('auction-set-container');
        UI.AuctionListing.template_auction_set.find("#auction-type_0").val('daily');
        // Initialize datepicker on all '.auction-end-date-field' elements
        for (var i=0; i < $('.auction-end-date-field').length; i++) {
            var initial_end_date = $('#end-date_' + i).val();
            var auction_type = $('#auction-type_' + i).val();
            var datepicker_settings = UI.AuctionListing.datepickerSetter(auction_type);
            $('#end-date_' + i).datepicker(datepicker_settings);
            //$('#end-date_' + i).datepicker( "option", "dateFormat", "yy-mm-dd");
            $('#end-date_' + i).val(initial_end_date);
        }
    })();

    /**
     * Sets indices of all elements within auction set
     */
    UI.AuctionListing.setAuctionIndex = function(auction_selector, auction_index) {
        auction_selector.attr('auction-index', auction_index);
        auction_selector.find('.btn-delete').attr('auction-index', auction_index);
        auction_selector.find('.auction-type-select').attr('name', 'auction_set[' + auction_index + '][auction_type]');
        auction_selector.find('.auction-type-select').attr('id', 'auction-type_' + auction_index);
        auction_selector.find('.auction-end-date-field').attr('name', 'auction_set[' + auction_index + '][end_date]');
        auction_selector.find('.auction-end-date-field').attr('id', 'end-date_' + auction_index);
        auction_selector.find('.auction-start-price-field').attr('name', 'auction_set[' + auction_index + '][start_price]');
        auction_selector.find('.auction-start-price-field').attr('id', 'start-price_' + auction_index);
        auction_selector.find('.auction-reserve-price-field').attr('name', 'auction_set[' + auction_index + '][reserve_price]');
        auction_selector.find('.auction-reserve-price-field').attr('id', 'reserve-price_' + auction_index);
    }

    /**
     * Manages indices for remaining auction set elements after one of the sets
     * is deleted.
     */
    UI.AuctionListing.indexAuctionSets = function(deleted_auction_index) {
        var auction_sets = $('.auction-set-container');
        var auction_rows = $('.auction-set-row');
        var row_index = Math.floor(deleted_auction_index / 3);
        // Starting at the index of the deleted auction, incrementally traverse
        // array of auction sets, decrementing each index and moving the first
        // element of each row to the end of the previous row.
        for (var auction_index = deleted_auction_index; auction_index < auction_sets.length; auction_index++) {
            UI.AuctionListing.last_row = $('.auction-set-row').last();
            var auction = auction_sets[auction_index];
            var auction_date;
            var auction_type = $('#auction-type_'+auction_index).val();
            // Decrement form element indices
            UI.AuctionListing.setAuctionIndex($(auction), auction_index);
            // Re-instantiate datepickers
            auction_date = $(auction).find('.auction-end-date-field').val();
            $(auction).find('.auction-end-date-field').datepicker('destroy');
            $(auction).find('.auction-end-date-field').datepicker(UI.AuctionListing.datepickerSetter(auction_type));
            //$(auction).find('.auction-end-date-field').datepicker( "option", "dateFormat", "yy-mm-dd" );
            $(auction).find('.auction-end-date-field').val(auction_date);
            // If we are modifying an element that is currently the first element
            // of a new row, then we want it to become the final element of the
            // previous row (i mod 3 == 2), so we append it to that row.
            if ((auction_index % 3) === 2) {
                // Move this element to the preceding row
                $(auction).appendTo(auction_rows[row_index]);
                row_index++;
            }
            // If the last row is empty, delete it
            if (UI.AuctionListing.last_row.find('.auction-set-container').length === 0) {
                UI.AuctionListing.last_row.remove();
                UI.AuctionListing.last_row = $('.auction-set-row').last();
            }
        }
    }

    /** Deprecated
     * Make state of from_auction match state of to_auction. Does not include
     * date, which is handled per increment tool.
     *
    UI.AuctionListing.copyAuctionState = function(from_auction, to_auction) {
        var auction_type = from_auction.find('.auction-type-select').val();
        var start_price = parseFloat(from_auction.find('.auction-start-price-field').val());
        var reserve_price = parseFloat(from_auction.find('.auction-reserve-price-field').val());
        // Set auction type
        to_auction.find('.auction-type-select').val(auction_type);
        // Set or hide prices
        if (auction_type == 'weekly') {
            if (isNaN(start_price)) {
                start_price = "";
            }
            to_auction.find('.auction-start-price-field').val(start_price);
            if (isNaN(reserve_price)) {
                reserve_price = "";
            }
            to_auction.find('.auction-reserve-price-field').val(reserve_price);
        } else {
            to_auction.find('.auction-start-price-container').hide();
            to_auction.find('.auction-reserve-price-container').hide();
        }
    }
    */

    /**
     * Remove one event from the CLNDR element.
     */
    UI.AuctionListing.removeClndrEvent = function(remove_event) {
        for (var i=0; i < Pristine.Calendars.clndr.options.events.length; i++) {
            var clndr_event = Pristine.Calendars.clndr.options.events[i];
            if (clndr_event.date === remove_event.date && clndr_event.type === remove_event.type) {
                Pristine.Calendars.clndr.options.events.splice((i), 1);
                break;  // Remove at most one event
            }
        }
        Pristine.Calendars.clndr.render();
    }

    /**
     * Remove one event from the temp_auctions array.
     */
    UI.AuctionListing.removeTempEvent = function(auction_index) {
        UI.AuctionListing.temp_auctions.splice(auction_index, 1);
        for (var i=auction_index; i < UI.AuctionListing.temp_auctions.length; i++) {
            UI.AuctionListing.temp_auctions[i].auction_index = UI.AuctionListing.temp_auctions[i].auction_index - 1;
        }
    }

    /**
     * Clone appropriate auction widget, wipe the unique data, and return it.
     * If there are auctions listed, clone the last auction. If there are no
     * auctions listed, clone the hidden template auction.
     */
    UI.AuctionListing.cloneTemplateAuction = function() {
        var clone_auction;
        if (UI.AuctionListing.last_auction_set && UI.AuctionListing.last_auction_set.length > 0) {
            clone_auction = UI.AuctionListing.last_auction_set.clone();
            clone_auction.find('.auction-type-select').val(UI.AuctionListing.last_auction_set.find('.auction-type-select').val());
        } else {
            clone_auction = UI.AuctionListing.template_auction_set.clone();
        }
        // Reset reference to old auction date
        clone_auction.find(".auction-end-date-field").attr("data-old-value", "");
        return clone_auction;
    }

    /**
     * Add an auction set widget to the DOM
     */
    UI.AuctionListing.addAuctionSet = function() {
        // Auction widget to add to DOM
        var new_auction_set = UI.AuctionListing.cloneTemplateAuction();
        // Index new auction_set fields
        UI.AuctionListing.setAuctionIndex(new_auction_set, $('.auction-set-container').length);
        // Add a new row, if necessary
        if (UI.AuctionListing.last_row.find('.auction-set-container').length >= 3) {
            $('#auction-form-section').append(UI.AuctionListing.last_row.clone());
            UI.AuctionListing.last_row = $('#auction-form-section').children().last();
            UI.AuctionListing.last_row.html('');
        }
        // Append auction_set to the last row
        new_auction_set.appendTo(UI.AuctionListing.last_row);
        // Add new datepicker to the new element
        var i = $('.auction-set-container').length - 1;
        var auction_type = $('#auction-type_'+i).val();
        $('input#end-date_'+i).removeClass('hasDatepicker');
        $('input#end-date_'+i).datepicker(UI.AuctionListing.datepickerSetter(auction_type));
        //$('input#end-date_'+i).datepicker( "option", "dateFormat", "yy-mm-dd" );
        // Check the current pattern selector, set date based on initial date.
        var end_date = moment($('#end-date_'+(i-1)).val());
        if (end_date.isValid()) {
            end_date.add(UI.AuctionListing.date_interval, 'days');
            end_date.hour(UI.AuctionListing.auction_end_hour);
            new_auction_set.find('.auction-end-date-field').val(end_date.format('YYYY-MM-DD'));
        } else {
            end_date = '';
            new_auction_set.find('.auction-end-date-field').val(end_date);
        }
        // Add event to temp_auctions
        UI.AuctionListing.temp_auctions.push({
            "auction_index": parseInt(new_auction_set.attr('auction-index')),
            "date": end_date,
            //"type": new_auction_set.find('.auction-type-select').val(),
            "consignor_user_id": parseInt($('select#consignor').val()),
            "title": UI.AuctionListing.temp_title
        });
        // Register change event to update the CLNDR
        new_auction_set.find('input.auction-end-date-field').change();
        // Set last auction
        UI.AuctionListing.last_auction_set = $('.auction-set-container').last();
    }

    /**
     * Remove auction set element from the DOM.
     */
    UI.AuctionListing.deleteAuctionSet = function() {
        var end_date = UI.AuctionListing.last_auction_set.find('input.auction-end-date-field').val();
        var remove_index = parseInt($(UI.AuctionListing.last_auction_set).attr('auction-index'));
        // Delete the last auction set
        UI.AuctionListing.last_auction_set.remove();
        // If the last row is empty, delete it
        var row_count = $('.auction-set-row').length;
        if (UI.AuctionListing.last_row.find('.auction-set-container').length === 0 && row_count > 1) {
            UI.AuctionListing.last_row.remove();
            UI.AuctionListing.last_row = $('#auction-form-section').children().last();
        }
        // Remove CLNDR event
        remove_event = {
            date: end_date,
            type: "temp"
        }
        UI.AuctionListing.removeClndrEvent(remove_event);
        // Remove event from temp_auctions
        UI.AuctionListing.removeTempEvent(remove_index);
        // Set last auction
        UI.AuctionListing.last_auction_set = $('.auction-set-container').last();
    }

    /**
     * Prints DYMO labels for auction items, given a set of XML representations.
     */
    UI.printDYMOLabels = function(labels) {
        try {
            // Get list of printers
            var printers = dymo.label.framework.getPrinters();
            if (printers.length == 0) {
                throw "Error: Failed to find DYMO printer.";
            }
            // Specify a printer (first printer found)
            var printerName = "";
            for (var i = 0; i < printers.length; ++i) {
                var printer = printers[i];
                if (printer.printerType == "LabelWriterPrinter") {
                    printerName = printer.name;
                    break;
                }
            }
            // Cast labels as an array. Assumes one valid label is passed.
            if (!Array.isArray(labels)) {
                labels = [labels];
            }
            // Print each label
            labels.forEach(function(l, i, a){
                var label = dymo.label.framework.openLabelXml(l);
                label.print(printerName);
            });
        } catch (e) {
            console.log(e);
        }
    };

    UI.AuctionListing.resetLegend = function() {
        $('.fullcal-legend').html(UI.AuctionListing.fullCal.legendReset);
    };

    UI.AuctionListing.buildLegend = function() {
        UI.AuctionListing.resetLegend();
        UI.AuctionListing.fullCal.legend = {};
        //console.log($('select#consignor').val());
        if ($('select#consignor').length > 0) {
            //console.log("Show");
            $('.fullcal-legend-row.temporary').removeClass('hidden');
            if ($('select#consignor').val() > 0) {
                $('.fullcal-legend .temporary.consignor').html(UI.AuctionListing.getConsignorName($('select#consignor').val()));
            } else {
                $('.fullcal-legend .temporary.consignor').html("(No consignor selected)");
            }
        } else {
            //console.log("Hide");
            $('.fullcal-legend-row.temporary').addClass('hidden');
        }
        UI.AuctionListing.fullCal.primary.map(function(auction, i, arr){
            if (!UI.AuctionListing.fullCal.legend.hasOwnProperty(auction['consignor_user_id'])) {
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']] = {};
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].color = auction.color;
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].consignor = auction.consignor_name;
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].consignor_id = auction.consignor_user_id;
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].auctions = [];
            }
            //console.log(auction.auction_id);
            UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].auctions.push(auction);
        });
        UI.AuctionListing.fullCal.linked.forEach(function(auction, i, arr){
            if (!UI.AuctionListing.fullCal.legend.hasOwnProperty(auction.consignor_user_id)) {
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']] = {};
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].color = auction.color;
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].consignor = auction.consignor_name;
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].consignor_id = auction.consignor_user_id;
                UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].auctions = [];
            }
            //console.log(auction.auction_id);
            UI.AuctionListing.fullCal.legend[auction['consignor_user_id']].auctions.push(auction);
        });
        UI.AuctionListing.paintLegend(UI.AuctionListing.fullCal.legend);
    }

    UI.AuctionListing.paintLegend = function(l) {
        var legend = $('.fullcal-legend');
        $.each(l, function(i, r) {
            var row = $('.fullcal-legend-row-template').clone();
            row.removeClass('fullcal-legend-row-template');
            row.removeClass('hidden');
            row.addClass('fullcal-legend-row');
            row.attr("style", "background:"+r.color);
            row.attr("consignor-user-id", r.consignor_id);
            row.find('span.consignor').html(r.consignor);
            row.appendTo(legend);
            $.each(r.auctions, function(j, a) {
                var auc = $('.auction-template').clone();
                auc.removeClass('auction-template');
                auc.removeClass('hidden');
                auc.addClass('auction');
                auc.find('a.auction-id').html(a.product_venue_id);
                auc.find('a.auction-id').attr('href', '/a'+a.product_venue_id);
                auc.find('span.auction-title').html(a.auction_title);
                auc.appendTo($('.fullcal-legend-row[consignor-user-id='+a.consignor_user_id+']').find('.auction-list'));
            });
        });
    }

    UI.AuctionListing.getConsignorName = function(id) {
        //console.log(id + " : " + $('select#consignor option[value="'+id+'"]').html());
        if ($('select#consignor').length > 0) {
            return $('select#consignor option[value="'+id+'"]').html();
        } else {
            UI.getSessionInfo();
            $.ajax({
                type: "POST",
                url: "/admin/user/ajax-get-organization-name",
                data: {id: id}
            })
            .done(function(resp){
                console.log(resp);
                return resp;
            })
            .fail(function() {
                return "(Failed to load consignor)";
            })
            .always();
        }
    }

    /**
     * Looks for XML labels in a hidden queue withing the DOM, then sends them
     * to be printed and clears the queue on succes.
     */
    Pristine.AuctionListing.printLabelQueue = function(callback) {
        // Print labels for each id.
        UI.getSessionInfo();
        $.ajax({
            url: "/admin/auction/ajax-dymo-print-queue"
        })
        .done(function(response) {
            try {
                var response = $.parseJSON(response);
                if (!response.result) {
                    throw response.message_type + ": " + response.message;
                }
                var labels = response.values.labels;
                UI.printDYMOLabels(labels);
            } catch (e) {
                console.log(e);
            }
        })
        .fail(function() {
        })
        .always(function() {
            callback();
        });
    }

    /* Deprecated
    // Clone auction set
    function cloneAuctionSet(auction_set) {
        // Temporarily destroy datepicker on cloned object
        // Otherwise, datepickers will collide and cause a problem with no errors message
        var cloned_date = $(auction_set).find('.auction-end-date-field').val();
        $(auction_set).find('.auction-end-date-field').datepicker('destroy');
        var auction_type = auction_set.find('select.auction-type-select').val();
        var last_row = $('#auction-form-section').children().last();
        var new_auction_set = auction_set.clone();
        // Replace the datepicker we destroyed above
        $(auction_set).find('.auction-end-date-field').datepicker();
        $(auction_set).find('.auction-end-date-field').datepicker( "option", "dateFormat", "yy-mm-dd" );
        // Reset the date
        $(auction_set).find('.auction-end-date-field').val(cloned_date);
        // Select proper auction type
        new_auction_set.find('option[value="' + auction_type + '"]').attr('selected', '');
        var end_date = moment(new_auction_set.find('.auction-end-date-field').val());
        if (end_date.isValid()) {
            // Increment date according to clone tool's setting
            var date_interval = parseInt($('#auction-interval-select').val());
            end_date.add(date_interval, 'days');
        } else {
            end_date = '';
        }
        // Index new auction_set fields
        UI.AuctionListing.setAuctionIndex(new_auction_set, $('.auction-set-container').length);
        // Add a new row, if necessary
        if (last_row.find('.auction-set-container').length >= 3) {
            $('#auction-form-section').append(last_row.clone());
            last_row = $('#auction-form-section').children().last();
            last_row.html('');
        }
        // Append auction_set to the last row
        new_auction_set.appendTo(last_row);
        // Add new row for clone tool if necessary
        if (last_row.find('.auction-set-container').length >= 3) {
            $('#auction-form-section').append(last_row.clone());
            last_row = $('#auction-form-section').children().last();
            last_row.html('');
        }
        var end_date_index = $('input.auction-end-date-field').length - 1;
        $('input#end-date_' + end_date_index).datepicker();
        $('input#end-date_' + end_date_index).datepicker( "option", "dateFormat", "yy-mm-dd" );
        // Set date value after datepicker so it doesn't get blown away
        new_auction_set.find('.auction-end-date-field').val(end_date.format('YYYY-MM-DD'));
        // Register change event to update the CLNDR
        new_auction_set.find('input.auction-end-date-field').change();
    }
    */

    // -----------------------------
    // Event handlers

    // Print auction lot DYMO Label
    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                var ids = [$(this).attr('data-product-id')];
                $.ajax({
                    type: "POST",
                    url: "/admin/auction/ajax-dymo-print",
                    data: { ids: ids }
                })
                .done(function(response) {
                    try {
                        var response = $.parseJSON(response);
                        console.log(response);
                        var labels = response.values.labels;
                        UI.printDYMOLabels(labels);
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '.dymo-print-product'
    );

    // Print auction lot DYMO Label
    $('body').on(
        {
            click: function() {
                var user_id = $(this).attr('data-user-id');
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    url: "/admin/consignor-payment/print-dymo-label",
                    data: { id: user_id }
                })
                .done(function(response) {
                    try {
                        var response = $.parseJSON(response);
                        console.log(response);
                        var labels = [];
                        labels.push(response.values.label);
                        UI.printDYMOLabels(labels);
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '.dymo-print-consignor'
    );

    // Prevent form submission on ENTER
    if ($('form.prevent-enter-submit').length > 0) {
        $('form.prevent-enter-submit').ready(function() {
            $(window).keydown(function(e) {
                if (e.keyCode == 13) {
                    //e.preventDefault();
                    return;
                }
            })
        });
    }

    // Image Order Change
    $('body').on(
        {
            sortupdate: function() {
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    url: "/admin/product/ajax-image-order",
                    data: { image_order: $(this).sortable('toArray') }
                })
                .done(function(response) {
                    try {
                        var response = $.parseJSON(response);
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#dropzone-previews'
    );

    // Preview name snippet
    $('body').on(
        {
            change: function () {
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    url: "/admin/product/ajax-snippet-value",
                    data: { snippet_id: parseInt($(this).val()) }
                })
                .done(function(response) {
                    try {
                        var response = $.parseJSON(response);

                        // If not blank, add a paragraph break.
                        if (response.text) {
                            response.text = response.text + "\r\n\r\n";
                        }

                        // Prepend content to description.
                        $('#description').val(response.text + $('#description').val());

                        // Adjust snippet editing button group
                        if (response.id) {
                            $('#edit-name-snippet').attr('href', '/admin/snippet/update/id/' + response.id);
                            $('#edit-name-snippet').removeAttr('disabled');
                        } else {
                            $('#edit-name-snippet').attr('href', 'javascript void(0)');
                            $('#edit-name-snippet').attr('disabled', 'disabled');
                        }
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#name_snippet'
    );

    // Preview LOA snippet
    $('body').on(
        {
            change: function() {
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    url: "/admin/product/ajax-snippet-value",
                    data: { snippet_id: parseInt($(this).val()) }
                })
                .done(function(response) {
                    try {
                        var response = $.parseJSON(response);
                        $('#loa-snippet-preview').html(response.text);
                        if (response.id) {
                            $('#edit-loa-snippet').attr('href', '/admin/snippet/update/id/' + response.id);
                            $('#edit-loa-snippet').removeAttr('disabled');
                        } else {
                            $('#edit-loa-snippet').attr('href', 'javascript void(0)');
                            $('#edit-loa-snippet').attr('disabled', 'disabled');
                        }
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#loa_snippet'
    );

    // Consignor change
    $('body').on(
        {
            change: function() {
                if ($(this).val() != 39) {
                    $('#cost').attr('disabled', 'disabled');
                } else {
                    $('#cost').removeAttr('disabled');
                }

                var consignor_user_id = $(this).val();

                // Set consignor user id
                if ($(this).val()) {
                    consignor_user_id = $(this).val();
                } else {
                    consignor_user_id = 0;
                }

                // Set all existing temp_auction titles and consignor user ids
                UI.AuctionListing.temp_auctions.forEach(function(auction) {
                    auction.consignor_user_id = consignor_user_id;
                });
            }
        },
        '#consignor'
    );

    // Title change
    $('body').on(
        {
            change: function() {
                if ($(this).val() != 39) {
                    $('#cost').attr('disabled', 'disabled');
                } else {
                    $('#cost').removeAttr('disabled');
                }

                var consignor_user_id = $(this).val();

                // Set title
                if ($(this).val()) {
                    UI.AuctionListing.temp_title = $(this).val();
                } else {
                    UI.AuctionListing.temp_title = "(Untitled)";
                }

                // Set all existing temp_auction titles and consignor user ids
                UI.AuctionListing.temp_auctions.forEach(function(auction) {
                    auction.title = UI.AuctionListing.temp_title;
                });
            }
        },
        '#title'
    );

    // FullCalendar render
    $('#product-calendar-modal').on('shown.bs.modal', function () {
        if (UI.AuctionListing.fullCal.rendered) {
            $('#auction-calendar').fullCalendar('refetchEvents');
        } else {
            $("#auction-calendar").fullCalendar('render');
            UI.AuctionListing.fullCal.rendered = true;
        }
    });

    // Update date interval select
    $('body').on(
        {
            change: function() {
                UI.AuctionListing.date_interval = parseInt($('#auction-interval-select').val());
            }
        },
        '#auction-interval-select'
    );

    // Increment auction quantity
    // Event handler for quantity field calls addAuctionSet()
    $('body').on(
        {
            click: function() {
                var quantity = parseInt($('#auction-quantity').val()) + 1;
                $('#auction-quantity').val(quantity);
                $('#auction-quantity').change();
            }
        },
        '#add-auction-button'
    );

    // Decrement auction quantity
    // Event handler for quantity field calls deleteAuctionSet()
    $('body').on(
        {
            click: function() {
                var quantity = parseInt($('#auction-quantity').val()) - 1;
                $('#auction-quantity').val(quantity);
                $('#auction-quantity').change();
            }
        },
        '#delete-auction-button'
    );

    // Delete specific auction-set widget
    $('body').on(
        {
            click: function() {
                var remove_event;
                var remove_index;
                var quantity = parseInt($('#auction-quantity').val());
                var auction_set_container = $(this).parents('.auction-set-container');
                var index = parseInt($(this).attr('auction-index'));
                var end_date = auction_set_container.find('input.auction-end-date-field').val();
                // Remove CLNDR event
                remove_event = {
                    date: end_date,
                    type: "temp"
                }
                UI.AuctionListing.removeClndrEvent(remove_event);
                // Remove temporary auction event
                remove_index = parseInt($(auction_set_container).attr('auction-index'));
                UI.AuctionListing.removeTempEvent(remove_index);
                // Remove the widget
                auction_set_container.remove();
                // Update quantity after deletion to prevent automatic deletion of last set
                $('#auction-quantity').val(quantity - 1);
                // Re-index the widgets and their input fields
                UI.AuctionListing.indexAuctionSets(index);
            }
        },
        '.auction-set .btn-delete'
    );

    // Validate auction quantity
    $('body').on(
        {
            change: function() {
                var quantity = parseInt($('#auction-quantity').val());
                if (quantity < 0 || isNaN(quantity)) {
                    quantity = 0;
                }
                $('#auction-quantity').val(quantity);
                // Add auction widgets
                while ($('.auction-set-container').length < quantity) {
                    UI.AuctionListing.addAuctionSet();
                }
                // Delete auction widgets
                while ($('.auction-set-container').length > quantity) {
                    UI.AuctionListing.deleteAuctionSet();
                }
            },
            keydown: function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    $('#auction-quantity').change();
                }
            }
        },
        '#auction-quantity'
    );

    $('body').on(
        {
            keydown: function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    console.log("Prevent");
                }
            }
        },
        'form.prevent-enter-submit input, form.prevent-enter-submit select'
    );

    // On auction-end-date-field change, update CLNDR
    $('body').on(
        {
            change: function() {
                // Build array of user input end dates
                var end_date_fields = $('input.auction-end-date-field');
                var end_dates = end_date_fields.map(function() { return $(this).val() });
                var old_event = $.parseJSON($(this).attr('data-old-value'));
                var this_auction_index;
                // Add event
                Pristine.Calendars.clndr.addEvents([
                    {
                        date: $(this).val(),
                        type: 'temp'
                    }
                ]);
                Pristine.Calendars.clndr.render();
                // Remove old event
                if (old_event) {
                    UI.AuctionListing.removeClndrEvent(old_event);
                }
                // Update temp_auctions event details
                this_auction_index = parseInt($(this).parents('.auction-set-container').attr('auction-index'));
                for (var i=0; i < UI.AuctionListing.temp_auctions.length; i++) {
                    if (UI.AuctionListing.temp_auctions[i].auction_index === this_auction_index) {
                        UI.AuctionListing.temp_auctions[i].date = moment($(this).val());
                        UI.AuctionListing.temp_auctions[i].date.hour(UI.AuctionListing.auction_end_hour);
                    }
                }
                // Reset old-event attribute
                $(this).attr('data-old-value', JSON.stringify({ date:$(this).val(), type:"temp" }));
            }
        },
        'input.auction-end-date-field'
    );

    // Show/hide price fields for auction-set panels
    $('body').on(
        {
            change: function() {
                var auction_panel = $(this).parent().parent();
                if ($(this).val() == 'daily') {
                    auction_panel.find('.auction-start-price-container').hide();
                    auction_panel.find('.auction-reserve-price-container').hide();
                    auction_panel.find('.daily-auction-start-price-container').show();
                } else {
                    auction_panel.find('.auction-start-price-container').show();
                    auction_panel.find('.auction-reserve-price-container').show();
                    auction_panel.find('.daily-auction-start-price-container').hide();

                    if ($(this).val() == 'weekly') {
                        // Set default weekly starting price
                        if (!auction_panel.find('input.auction-start-price-field').val()) {
                            auction_panel.find('input.auction-start-price-field').val(20);
                        }
                    } else if ($(this).val() == 'monthly') {
                        // Set default platinum starting price
                        if (!auction_panel.find('input.auction-start-price-field').val()) {
                            auction_panel.find('input.auction-start-price-field').val(50);
                        }
                    }
                }

                // Reset datepicker
                auction_panel.find('input.auction-end-date-field').datepicker('destroy');
                auction_panel.find('input.auction-end-date-field').datepicker(UI.AuctionListing.datepickerSetter($(this).val()));
            }
        },
        '.auction-set .auction-type-select'
    );

    // Check md5 hash of current-state product fields against pre-recorded hash
    $('body').on(
        {
            click: function() {
                var fields = $('input#title').val() +
                             $('input#subtitle').val() +
                             $('textarea#description').val() +
                             '#' + $('select#loa_snippet').val() +
                             $('select#category').val() +
                             $('select#shipping_item_type').val();

                var field_hash = md5(utf8_encode(fields));

                if (field_hash !== $('#product-field-hash').html()) {
                    // Display product modification warning
                    $('#product-modification-warning').removeClass('hidden');
                } else {
                    $('#product-modification-warning').addClass('hidden');
                }

                // Populate modal content
                $("#confirm-product-title").html($('input#title').val());
                $("#confirm-product-subtitle").html($('input#subtitle').val());
                $("#confirm-product-description").html($('textarea#description').val());
                if ($('select#category').val()) {
                    $("#confirm-category-code").html($('select#category').find('option[value="' + $('select#category').val() + '"]').html());
                } else {
                    $("#confirm-category-code").html("<i>Please select a category</i>");
                }
                if ($('select#shipping_item_type').val()) {
                    $("#confirm-shipping-item-type-code").html($('select#shipping_item_type').find('option[value="' + $('select#shipping_item_type').val() + '"]').html());
                } else {
                    $("#confirm-shipping-item-type-code").html("<i>Please select a shipping type</i>");
                }
                if ($('select#consignor').val()) {
                    $("#confirm-consignor").html($('select#consignor').find('option[value="' + $('select#consignor').val() + '"]').html());
                } else {
                    $("#confirm-consignor").html("<i>Please select a consignor</i>");
                }
                if ($("#confirm-quantity")) {
                    $("#confirm-quantity").html($('input#auction-quantity').val());
                }
            }
        },
        '#confirm-auction-list-button,#confirm-auction-update-button'
    );

    // Confirm auction creation
    $('body').on(
        {
            click: function() {
                // Populate modal content
                $("#confirm-product-title").html($('input#title').val());
                $("#confirm-product-subtitle").html($('input#subtitle').val());
                $("#confirm-product-description").html($('textarea#description').val());
                if ($('select#category').val()) {
                    $("#confirm-category-code").html($('select#category').find('option[value="' + $('select#category').val() + '"]').html());
                } else {
                    $("#confirm-category-code").html("<i>Please select a category</i>");
                }
                if ($('select#shipping_item_type').val()) {
                    $("#confirm-shipping-item-type-code").html($('select#shipping_item_type').find('option[value="' + $('select#shipping_item_type').val() + '"]').html());
                } else {
                    $("#confirm-shipping-item-type-code").html("<i>Please select a shipping type</i>");
                }
                if ($('select#consignor').val()) {
                    $("#confirm-consignor").html($('select#consignor').find('option[value="' + $('select#consignor').val() + '"]').html());
                } else {
                    $("#confirm-consignor").html("<i>Please select a consignor</i>");
                }
                $("#confirm-quantity").html($('input#auction-quantity').val());
            }
        },
        '#confirm-auction-create-button'
    );

    // Confirm product information on create
    $('body').on(
        {
            click: function() {
                // Populate modal content
                $("#confirm-product-title").html($('input#title').val());
                $("#confirm-product-subtitle").html($('input#subtitle').val());
                $("#confirm-product-description").html($('textarea#description').val());
                if ($('select#category').val()) {
                    $("#confirm-category-code").html($('select#category').find('option[value="' + $('select#category').val() + '"]').html());
                } else {
                    $("#confirm-category-code").html("<i>Please select a category</i>");
                }
                if ($('select#shipping_item_type').val()) {
                    $("#confirm-shipping-item-type-code").html($('select#shipping_item_type').find('option[value="' + $('select#shipping_item_type').val() + '"]').html());
                } else {
                    $("#confirm-shipping-item-type-code").html("<i>Please select a shipping type</i>");
                }
            }
        },
        '#confirm-product-create-button'
    );

    // Confirm product information on update
    $('body').on(
        {
            click: function() {
                // Populate modal content
                $("#confirm-product-title").html($('input#title').val());
                $("#confirm-product-subtitle").html($('input#subtitle').val());
                $("#confirm-product-description").html($('textarea#description').val());
                if ($('select#category').val()) {
                    $("#confirm-category-code").html($('select#category').find('option[value="' + $('select#category').val() + '"]').html());
                } else {
                    $("#confirm-category-code").html("<i>Please select a category</i>");
                }
                if ($('select#shipping_item_type').val()) {
                    $("#confirm-shipping-item-type-code").html($('select#shipping_item_type').find('option[value="' + $('select#shipping_item_type').val() + '"]').html());
                } else {
                    $("#confirm-shipping-item-type-code").html("<i>Please select a shipping type</i>");
                }
            }
        },
        '#confirm-product-update-button'
    );

    /* Deprecated
    // Clone final auction set.
    $('body').on(
        {
            click: function() {
                var last_auction_set = $('.auction-set-container').last();
                cloneAuctionSet(last_auction_set);
                var quantity = parseInt($('#auction-quantity').val()) + 1;
                $('#auction-quantity').val(quantity);
                $('#auction-quantity').change();
            }
        },
        '#clone-auction-button'
    );
    */

    // -----------------------------

    /************************
    /*** Drag-and-drop auction calendar
    ************************/

    // Contains all events to update indexed by auction id
    var update_events = {},
        consignor_color_map = {},
        colors = ['#BE1D23', '#009999', '#4e77ff', '#a17eff', '#19c21e', '#c26343', '#215ac2'];

    Pristine.AuctionListing.Edit = {};
    Pristine.AuctionListing.Edit.base_url = '/admin/auction/update';

    // If updating an auction, get pv_id from URL
    if (window.location.href.indexOf(Pristine.AuctionListing.Edit.base_url) > -1) {
        Pristine.AuctionListing.Edit.auction_pv_id = parseInt(
            window.location.href.substring(
                window.location.href.indexOf(Pristine.AuctionListing.Edit.base_url) + Pristine.AuctionListing.Edit.base_url.length + ('/id/').length
            )
        );
    } else {
        Pristine.AuctionListing.Edit.auction_pv_id = null;
    }

    /**
     * TODO Refactor event sources s.t. the first two become one.
     */
    $('#auction-calendar').fullCalendar({
        defaultView: 'month',
        header: { right: 'today month,basicWeek,basicDay prev,next' },
        editable: true,
        eventSources: [
            // Primary product events
            function(start, end, timezone, addEvents) {
                UI.AuctionListing.fullCal.primary = new Array(0);
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    url: "/admin/product/ajax-get-auction-events",
                    data: {
                        id: $('#auction-calendar').attr('product-id'),
                        "status-codes": ['future', 'active', 'finished']
                    }
                })
                .done(function(response) {
                    try {
                        response = $.parseJSON(response);
                        //console.log(response);
                        if (response.result) {
                            addEvents(response.values
                                .map(function(auction) {
                                    if (!consignor_color_map.hasOwnProperty(auction.consignor_user_id)) {
                                        consignor_color_map[auction.consignor_user_id] = colors[0];
                                        colors.splice(0, 1);
                                    }
                                    var event = {
                                        title: auction.product_venue_id,
                                        start: moment(auction.end_date),
                                        color: consignor_color_map[auction.consignor_user_id],
                                        consignor_user_id: auction.consignor_user_id,
                                        consignor_name: auction.consignor_name,
                                        product_venue_id: auction.product_venue_id,
                                        auction_title: auction.product_title,
                                        auction_type_code: auction.type
                                    }
                                    // Add event to full_cal_auctions
                                    UI.AuctionListing.fullCal.primary.push(event);
                                    // Return FullCalendar event object
                                    return event;
                                })
                                .filter(function(event) {
                                    if (Pristine.AuctionListing.Edit.auction_pv_id && Pristine.AuctionListing.Edit.auction_pv_id == event.product_venue_id) {
                                        return false;
                                    }
                                    return true;
                                })
                            );
                            UI.AuctionListing.buildLegend()
                        } else {
                            // Return empty object if no events are found
                            return {};
                        }
                    } catch (e) {
                        console.log(e);
                        return {};
                    }
                })
                .fail(function() {
                    return {};
                })
                .always();
            },
            // Linked product events
            function(start, end, timezone, addEvents) {
                UI.AuctionListing.fullCal.linked = new Array(0);
                $.ajax({
                    type: "POST",
                    url: "/admin/product/ajax-get-auction-events",
                    data: { id: $('#auction-calendar').attr('product-id'), type: 'linked' }
                })
                .done(function(response) {
                    try {
                        response = $.parseJSON(response);
                        //console.log(response);
                        if (response.result) {
                            addEvents(response.values.map(function(auction) {
                                if (!consignor_color_map.hasOwnProperty(auction.consignor_user_id)) {
                                    consignor_color_map[auction.consignor_user_id] = colors[0];
                                    colors.splice(0, 1);
                                }
                                var event = {
                                    title: auction.auction_id,
                                    start: moment(auction.end_date),
                                    color: transparent(consignor_color_map[auction.consignor_user_id]),
                                    consignor_user_id: auction.consignor_user_id,
                                    consignor_name: auction.consignor_name,
                                    product_venue_id: auction.product_venue_id,
                                    auction_title: auction.product_title,
                                    auction_type_code: auction.type
                                }
                                // Add event to full_cal_auctions
                                UI.AuctionListing.fullCal.linked.push(event);
                                // Return FullCalendar event object
                                return event;
                            }));
                            UI.AuctionListing.buildLegend()
                        } else {
                            // Return empty object if no events are found
                            return {};
                        }
                    } catch (e) {
                        console.log(e);
                        return {};
                    }
                })
                .fail(function() {
                    return {};
                })
                .always();
            },
            // Temporary auction events
            function(start, end, timezone, addEvents) {
                addEvents(UI.AuctionListing.temp_auctions
                    .filter(function(auction) {
                        // Filter by valid end date input
                        if (moment(auction.date).isValid()){
                            return true;
                        }
                        return false;
                    })
                    .map(function(auction) {
                        var event_title;
                        // Map data to fullCalendar events
                        return {
                            title: "",
                            start: moment(auction.date),
                            color: "#91c9ff",
                            auction_index: auction.auction_index
                        }
                    })
                );
            }
        ],
        //events: ,
        eventDrop: function(event, delta, revertCallback) {
            // Full list of events in FullCalendar memory
            var current_events = $('#auction-calendar').fullCalendar('clientEvents');
            // Dates with events
            var dates = {};
            // True iff multiple events share the same end date
            var is_conflict = false;

            /* Deprecated
            // Revert if end dates collide
            $.each(current_events, function(key, this_event) {
                console.log(this_event);
                if (dates[this_event.start.format('YYYY-MM-DD')]) {
                    is_conflict = true;
                } else {
                    dates[this_event.start.format('YYYY-MM-DD')] = this_event;
                }
            });
            */

            if (event.hasOwnProperty('auction_index')) {
                // Modify a temporary (currently being listed) auction
                $('#end-date_' + event.auction_index).val(event.start.format('YYYY-MM-DD'));
                $('#end-date_' + event.auction_index).change();
                return true;
            }

            if (event.hasOwnProperty('product_venue_id')) {
                // Update a listed auction
                update_events[event.product_venue_id] = {
                    "product_venue_id": event.product_venue_id,
                    "auction_type_code": event.auction_type_code,
                    "end_date": event.start.format('YYYY-MM-DD HH:mm:ss')
                };
            }

            // AJAX save auction event
            $.ajax({
                type: "POST",
                url: "/admin/auction/ajax-save-auction",
                data: { "auction_data": JSON.stringify(update_events) }
            })
            .done(function(response) {
                try {
                    response = $.parseJSON(response);
                    if (!response.result) {
                        $('.product-calendar.alert').html(response.message);
                        $('.product-calendar.alert').addClass('alert-warning');
                        $('.product-calendar.alert').removeClass('hidden');
                        // Simultaneous editing is causing a conflict
                        revertCallback();
                        // TODO Update events from source
                    } else {
                        $('.product-calendar.alert').html('');
                        $('.product-calendar.alert').removeClass('alert-warning');
                        $('.product-calendar.alert').addClass('hidden');
                    }
                    // Clear red borders
                    for (var i = 0; i < current_events.length; i += 1) {
                        current_events[i].borderColor = '';
                        $('#auction-calendar').fullCalendar('updateEvent', current_events[i]);
                    }
                    // Clear update_events
                    update_events = {};
                } catch (e) {
                    console.log(e);
                    revertCallback();
                }
            })
            .fail(function() {
                // Revert using revertCallback
            })
            .always(function() {
                // TODO Pristine.Calendars.clndr.render();
            });
        }
    });

    $('body').on(
        {
            click: function() {
                if ($(this).attr("checked")) {
                    $("input.auction-search-include").attr("checked", true);
                } else {
                    $("input.auction-search-include").attr("checked", false);
                }
            }
        },
        'input#auction-search-all'
    )

    function transparent(hex) {
        if (hex.charAt(0) === '#') {
            hex = hex.substring(1);
        }
        if (hex.length == 3) {
            hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
        }
        if (hex.length == 6) {
            r = parseInt(hex.substring(0,2), 16);
            g = parseInt(hex.substring(2,4), 16);
            b = parseInt(hex.substring(4,6), 16);
            return "rgba(" + r + "," + g + "," + b + ",0.3)";
        } else {
            // input error
            return null;
        }
    }

    /************************
    /*** Linking products
    ************************/

    $('body').on(
        {
            click: function() {
                LinkProductModal.body_html = $('#link-product-modal .modal-body').html();
                LinkProductModal.footer_html = $('#link-product-modal .modal-footer').html();
            }
        },
        '.link-product-button'
    );

    $('body').on(
        {
            click: function() {
                ViewLinkedProductsModal.body_html = $('#view-linked-products-modal .modal-body').html();
                ViewLinkedProductsModal.footer_html = $('#view-linked-products-modal .modal-footer').html();
            }
        },
        '.link-product-button'
    );

    Pristine.Calendars.initializeClndr = function() {
        var consignor_color_map = {},
            colors = ['pristine-red', 'sea-green', 'blue-purple', 'purple', 'regular-green', 'sedona-brown', 'blue'],
            update = null;
        if ($('.auction-set.update').length > 0) {
            consignor_color_map[$('select#consignor').val()] = colors[0];
            colors.splice(0, 1);
            update = {
                date: $('.auction-set.update').find('.auction-end-date-field').val(),
                type: consignor_color_map[$('select#consignor').val()],
                accounted: false
            };
            //console.log("Update: ", update);
            //console.log($('select#consignor').val());
        }
        // Load auctions
        var productId = $('#calendar').attr('product-id');
        if (!productId) {
            // No calendar element on the page
            return;
        }
        $.ajax({
            type: "POST",
            url: "/admin/auction/ajax-get-auctions-by-product-id",
            data: { product_id: productId }
        })
        .done(function(response) {
            try {
                //console.log(response);
                var response = $.parseJSON(response);
                if (response.values.hasOwnProperty('primary')) {
                    response.values.primary.forEach(function(auction) {
                        //console.log(auction);
                        if (!consignor_color_map.hasOwnProperty(auction.consignor_user_id)) {
                            consignor_color_map[auction.consignor_user_id] = colors[0];
                            colors.splice(0, 1);
                        }
                        // If an auction is being updated, it is not accounted for, and
                        // the current auction matches, account for the update by skipping.
                        // Otherwise, add the event to the eventArray.
                        //console.log("update: ", update);
                        if (update && !update.accounted && update.date == auction.end_date.substring(0, 10) && update.type == consignor_color_map[auction.consignor_user_id]) {
                            update.accounted = true;
                        } else {
                            eventArray.push({ date: auction.end_date.substring(0, 10), type: consignor_color_map[auction.consignor_user_id] });
                        }
                    });
                }
                if (response.values.linked && response.values.linked.length > 0) {
                    response.values.linked.forEach(function(auction) {
                        //console.log(auction);
                        if (!consignor_color_map.hasOwnProperty(auction.consignor_user_id)) {
                            consignor_color_map[auction.consignor_user_id] = colors[0];
                            colors.splice(0, 1);
                        }
                        eventArray.push({ date: auction.end_date.substring(0, 10), type: consignor_color_map[auction.consignor_user_id] + ' transparent', product_id: auction.product_id });
                    });
                }
                $('.auction-end-date-field').each(function(index) {
                    if ($(this).val() !== '') {
                        eventArray.push({ date: $(this).val(), type: 'temp' });
                    }
                });
                Pristine.Calendars.buildClndr();
            } catch (e) {
                console.log(e);
            }
        })
        .fail(function() {
            console.log('ERROR');
        })
        .always(function(response) {
        });
    };

    Pristine.Calendars.buildClndr = function() {
        Pristine.Calendars.clndr = $('#calendar').clndr({
            template: $("#clndr-template").html(),
            events: eventArray,
            clickEvents: {
                click: function(target) {
                    //console.log("Click: ", target);
                    // Add new event widget to page
                    var quantity = parseInt($('#auction-quantity').val()) + 1
                    var last_auction;
                    // Create element with pattern application
                    $('#auction-quantity').val(quantity);
                    $('#auction-quantity').change();
                    // Modify the fresh element
                    last_auction = $('.auction-set-container').last();
                    $(last_auction).find('.auction-end-date-field').val(target.date.format('YYYY-MM-DD'));
                    $(last_auction).find('.auction-end-date-field').change();
                },
                nextMonth: function() {
                    //console.log('next month.');
                },
                previousMonth: function() {
                    //console.log('previous month.');
                },
                onMonthChange: function() {
                    //console.log('month changed.');
                },
                nextYear: function() {
                    //console.log('next year.');
                },
                previousYear: function() {
                    //console.log('previous year.');
                },
                onYearChange: function() {
                    //console.log('year changed.');
                }
            },
            multiDayEvents: {
                startDate: 'startDate',
                endDate: 'endDate',
                singleDay: 'date'
            },
            showAdjacentMonths: true,
            adjacentDaysChangeMonth: false
        });
        $('#calendar .day.event').addClass('original');
    }

    $('body').on(
        {
            mouseenter: function() {
                var info = "";
                info += "<span class='heading'>"+$(this).attr('date')+"</span>";
                info += "<br/>"
                info += "<span>Auctions: "+$(this).find('#primary-auction-count').html()+"</span>";
                info += "<br/>"
                info += "<span>Products: "+$(this).find('#linked-product-count').html()+"</span>";
                $('#clndr-info-content').html(info);
            },
            mouseleave: function() {
                $('#clndr-info-content').html('');
            }
        },
        '.day'
    );

    /**
     * Consignor Shipping Dashboard
     * /user/consignor/shipments
     */

    UI.ConsignorShipping = {};

    /**
     * Sets attributes of a package, which depend on user_id and package_index
     */
    UI.ConsignorShipping.setPackageAttributes = function (package_object, values) {
        console.log(values);
        $(package_object).attr('user-id', values.user_id);
        $(package_object).attr('package', values.package_index);
        console.log($(package_object).find('.ship-to .name').html());
        $(package_object).find('.ship-to .name').html(values.ship_to_name);
        console.log($(package_object).find('.ship-to .name').html());
    }

    /**
     * Toggles a package between inactive (empty) state and active state.
     */
    UI.ConsignorShipping.togglePackage = function (package_object) {
        var user_id = $(package_object).attr('user-id');
        var package_count = $('button[user-id="' + user_id + '"]').find('span.package-count');

        $(package_object).toggleClass('empty');
        $(package_object).find('.panel-heading .placeholder').toggleClass('hidden');
        $(package_object).find('.panel-heading .ship-to').toggleClass('hidden');
        $(package_object).find('.panel-footer').toggleClass('hidden');
        if ($(package_object).hasClass('empty')) {
            $(package_object).find('.panel-footer input').attr('disabled', 'disabled');
            $(package_count).html(parseInt($(package_count).html()) - 1);
            $("input#package_quantity").val(parseInt($("input#package_quantity").val()) - 1);
        } else {
            $(package_object).find('.panel-footer input').removeAttr('disabled');
            $(package_count).html(parseInt($(package_count).html()) + 1);
            $("input#package_quantity").val(parseInt($("input#package_quantity").val()) + 1);
        }
    }

    /**
     * Defines jQueryUI sortable behavior for each package. Designed to be used
     * as parameter of a $(selector).each(...) expression.
     */
    UI.ConsignorShipping.setSortablePackages = function (index, package_contents) {
        $(package_contents).sortable({
            connectWith: '.package[user-id="' + $(package_contents).parent('.package').attr('user-id') + '"] .package-contents',
            placeholder: 'portlet-placeholder',
            handle: '.handle',
            receive: function(event, ui) {
                var item = ui.item,
                    sender = ui.sender[0],
                    receiver = $(this)[0],
                    user_id = $(receiver).parent('.package').attr('user-id'),
                    shipment_count = $('.shipment[user-id="' + user_id + '"]').length,
                    package_count = $('.package[user-id="' + user_id + '"]').length,
                    item_count = $('.package[user-id="' + user_id + '"] .item').length;

                console.log(shipment_count);
                console.log(package_count);
                console.log(item_count);
                console.log(receiver);

                // Protect against empty packages
                if (!$(sender).find('.item').length) {
                    // Only allow last package to be empty
                    if ($(sender).parent('.package').attr('package') != (package_count - 1)) {
                        $(sender).sortable('cancel');
                        return;
                    }
                    // Return final package to blank state
                    UI.ConsignorShipping.togglePackage($(sender).parent('.package'));
                }
                // If empty package was added to, activate it
                //if ($('.package.empty[user-id="' + user_id + '"]').find('.item').length) {

                if ($(receiver).find('.item').length) {
                    console.log($(receiver).parents());
                    console.log($(receiver).parents().find('.package.empty[user-id="' + user_id + '"]'));
                    console.log($('.package.empty[user-id="' + user_id + '"]'));
                    //UI.ConsignorShipping.togglePackage($('.package.empty[user-id="' + user_id + '"]'));
                    UI.ConsignorShipping.togglePackage($(receiver).parents().find('.package.empty[user-id="' + user_id + '"]'));
                }
                // Update item_quantity form element values in sender and receiver packages
                $(sender).parents('.package').find('input#item_quantity').val(
                    parseInt($(sender).parents('.package').find('input#item_quantity').val()) - 1
                );
                $(receiver).parents('.package').find('input#item_quantity').val(
                    parseInt($(receiver).parents('.package').find('input#item_quantity').val()) + 1
                );
                // Re-index each item in both the sender and receiver package-contents
                // so that form submission creates a proper tree structure of packages
                // and their items.
                $(sender).find('.item').each(function(i, item) {
                    $(item).find('input#invoice_product_venue_product_user_address_id').attr(
                        'name',
                        'package[' + parseInt($(item).parents('.package').attr('package')) + ']' +
                        '[item][' + parseInt(i) + '][invoice_product_venue_product_user_address_id]'
                    );
                });
                $(receiver).find('.item').each(function(i, item) {
                    $(item).find('input#invoice_product_venue_product_user_address_id').attr(
                        'name',
                        'package[' + parseInt($(item).parents('.package').attr('package')) + ']' +
                        '[item][' + parseInt(i) + '][invoice_product_venue_product_user_address_id]'
                    );
                });
                // If more packages can be created, append the cloned blank package to the form
                if (item_count > package_count && $('.package.empty[user-id="' + user_id + '"]').length < 1) {
                    var blank_package = $(UI.ConsignorShipping.empty_package).clone(),
                        ship_to_name = $(sender).parents('.package').find('.ship-to .name').html();
                    // Set indices of the empty package clone
                    UI.ConsignorShipping.setPackageAttributes(
                        blank_package,
                        {
                            user_id: user_id,
                            package_index: package_count,
                            ship_to_name: ship_to_name
                        }
                    );
                    // Append the new, empty package
                    $('form#user-' + user_id + '.shipment').append(blank_package);
                    // Move the button to the bottom
                    $('form#user-' + user_id + '.shipment').append($('form#user-' + user_id + '.shipment').find('.row.create-shipment-button'));
                    // Re-assign sortables to include the new package
                    $('.package-contents').each(function (index, package_contents) {
                        UI.ConsignorShipping.setSortablePackages(index, package_contents);
                    });
                }

                return;
            }
        })
    }

    // Initialize view elements
    if ($('.package.empty').length > 0) {
        UI.ConsignorShipping.empty_package = $('.package.empty').first().clone();
        UI.ConsignorShipping.setPackageAttributes(
            UI.ConsignorShipping.empty_package,
            {
                user_id: null,
                package_index: null,
                ship_to_name: null
            }
        );
    } else {
        UI.ConsignorShipping.empty_package = null;
    }

    $('.package-contents').each(function (index, package_contents) {
        UI.ConsignorShipping.setSortablePackages(index, package_contents);
    });

    /**
     * /admin/invoice/
     */

    $('body').on(
        {
            change: function() {
                console.log("HERE")
                var start, end;
                start = $("input#id-range-start").val();
                end = $("input#id-range-end").val();
                $('a#print-packets').attr('href', "/admin/invoice/print-packet/start-id/"+start+"/end-id/"+end);
            }
        },
        "input#id-range-end, input#id-range-start"
    );

    /**
     * /admin/invoice/details
     */

    /**
     * Applies tracking number to all items in the invoice.
     * - If tracking number is in use:
     *   - Ask for confirmation
     *   - If confirmed: add all items to package identified by tracking number
     * - Else:
     *   - Delete any old ties to packages (PIPV records)
     *   - Create a shipment, package, and PIPVs for all IPVs in invoice
     */
    UI.Shipping.addTrackingToUnshipped = function(tracking_number, invoice_id, confirm) {
        // Flags true to display alert flash messages to the user.
        alert = true;
        // Call PHP service to apply the tracking number
        $.ajax({
            type: "POST",
            url: "/admin/invoice/ajax-apply-tracking-number/",
            data: {
                tracking_number: $('input#tracking-number').val(),
                invoice_id: invoice_id,
                confirmation: confirm
            }
        })
        .done(function(r) {
            try {
                r = $.parseJSON(r);
            } catch (e) {
                UI.FlashMessenger.showMessage(false);
                return;
            }
            if (r.result) {
                if (r.values.request_confirmation) {
                    // Shipment with that tracking number already exists.
                    // Suppress alert message and prompt confirmation.
                    $("#confirm-duplicate-tracking-modal").modal('show');
                    alert = false;
                    return;
                } else {
                    // Tracking number applied
                    //console.log("Success");
                    //console.log(r.values);
                    if (r.values.hasOwnProperty("shipment_id")) {
                        r.values.items.forEach(function(i) {
                            //console.log(i);
                            //console.log('td.shipment-info[data-ipv-id="'+i+'"]');
                            //console.log($('td.shipment-info[data-ipv-id="'+i+'"]'));
                            $('td.shipment-info[data-ipvpua-id="'+i+'"]').html(
                                "<a href=/user/shipment/details/id/"+r.values.shipment_id+">"+r.values.shipment_id+"</a><a id=\"remove-item-from-shipment-button\" data-ipvpua-id=\""+i+"\" href=\"javascript:void(0)\" class=\"btn btn-default btn-xs\" style=\"margin:0 6px;\"><span class=\"icon-left glyphicon glyphicon-remove\"></span>Remove</a>"
                            )
                            $('td.shipment-info[data-ipvpua-id="'+i+'"]').addClass('success');
                        });
                        window.setTimeout(
                            function(){
                                r.values.items.forEach(function(i) {
                                    $('td.shipment-info[data-ipvpua-id="'+i+'"]').removeClass('success');
                                })
                            },
                            3000
                        );
                    }
                    return;
                }
            }
            UI.FlashMessenger.showMessage(false);
            //console.log("Error");
        })
        .fail(function() {
            UI.FlashMessenger.showMessage(false);
        })
        .always();
    };
    // Apply tracking number to invoice.
    $('body').on(
        {
            click: function() {
                UI.Shipping.addTrackingToUnshipped($('input#tracking-number').val(), $('input#invoice-id').val(), 0);
            }
        },
        'button#apply-tracking-number'
    );
    // Confirm application of tracking number to invoice.
    $('body').on(
        {
            click: function() {
                UI.Shipping.addTrackingToUnshipped($('input#tracking-number').val(), $('input#invoice-id').val(), 1);
                $("#confirm-duplicate-tracking-modal").modal('hide');
            }
        },
        'button#confirm-apply-tracking-number'
    );

    /**
     * Removes a single item from shipment
     */
    $('body').on(
        {
            click: function() {
                var pv_id;
                ipvpua_id = $(this).data('ipvpua-id');
                $.ajax({
                    type: "POST",
                    url: "/admin/shipment/ajax-remove-item-from-shipment/",
                    data: { ipvpua_id: ipvpua_id }
                })
                .done(function(r) {
                    try {
                        r = $.parseJSON(r);
                    } catch (e) {
                        UI.FlashMessenger.showMessage(false);
                        return;
                    }
                    console.log(r);
                    if (!r.result) {
                        UI.FlashMessenger.showMessage(r);
                    }
                    if (r.message_type == 'success') {
                        $('td[data-ipvpua-id='+ipvpua_id+']').html("<span>Removed</span>");
                        $('td[data-ipvpua-id='+ipvpua_id+']').addClass("warning shipment-removed");
                        window.setTimeout(
                            function() {
                                $('td.shipment-removed').html("<span>Pending</span>");
                                $('td.shipment-removed').removeClass("warning shipment-removed");
                            },
                            3000
                        );
                    } else if (r.message_type == 'danger') {
                        UI.FlashMessenger.showMessage(r);
                    } else {
                    }
                })
                .fail(function() {
                    UI.FlashMessenger.showMessage(false);
                })
                .always();
            }
        },
        "#remove-item-from-shipment-button"
    );

    /**
     * /user/shipment/details
     */

    // Build form in modal
    $('body').on(
        {
            click: function() {
                $.ajax({
                    type: "GET",
                    url: "/user/shipment/ajax-edit",
                    data: {id:parseInt($(this).data('pristine-shipment-id'))}
                })
                .done(function(r) {
                    $('#edit-shipment-modal .modal-body').html(r);
                    $('#edit-shipment-modal').modal('show');
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#edit-shipment-button'
    );
    // Serialize form and send to Zend for processing
    $('body').on(
        {
            click: function() {
                $.ajax({
                    type: "POST",
                    url: "/user/shipment/ajax-edit" + (($(this).attr('data-shipment-id')) ? '/id/' + $(this).attr('data-shipment-id') : ''),
                    data: $('#edit-shipment-form').serialize()
                })
                .done(function(response) {
                    $('#edit-shipment-modal').attr('data-posted', true);
                    $('#edit-shipment-modal .modal-body').html(response);
                    if ($('form#edit-shipment-form').length == 0) {
                        $('#edit-shipment-submit').hide();
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#edit-shipment-submit'
    );

    // Reload page once form data is posted
    $('#edit-shipment-modal').on('hide.bs.modal', function() {
        if ($('#edit-shipment-modal').attr('data-posted')) {
            location.reload();
        }
    })

    /**
     * /admin/invoice/details
     */

    // Create new adjustment

    // Build form in modal
    $('body').on(
        {
            click: function() {
                $.ajax({
                    type: "GET",
                    url: "/admin/invoice/ajax-adjust",
                    data: {
                        invoice_id: parseInt($(this).data('pristine-invoice-id')),
                        user_id: parseInt($(this).data('pristine-user-id'))
                    }
                })
                .done(function(r) {
                    $('#user-adjustment-modal .modal-body').html(r);
                    $('#user-adjustment-modal').modal('show');
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#user-adjustment-button'
    );
    // Serialize form and send to Zend for processing
    $('body').on(
        {
            click: function() {
                var url = "/admin/invoice/ajax-adjust" +
                (($(this).attr('data-user-id')) ? '/user-id/' + $(this).attr('data-user-id') : '') +
                (($(this).attr('data-invoice-id')) ? '/invoice-id/' + $(this).attr('data-invoice-id') : '');

                $.ajax({
                    type: "POST",
                    url:  url,
                    data: $('#invoice-adjustment-form').serialize()
                })
                .done(function(response) {
                    $('#user-adjustment-modal').attr('data-posted', true);
                    $('#user-adjustment-modal .modal-body').html(response);
                    // If there is not form, remove submit button
                    if ($("#user-adjustment-modal form").length == 0) {
                        $('#user-adjustment-submit').hide();
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#user-adjustment-submit'
    );
    // Reload page once form data is posted
    $('body').on(
        {
            click: function() {
                if ($('#user-adjustment-modal').attr('data-posted')) {
                    location.reload();
                }
            }
        },
        '#user-adjustment-modal [data-dismiss=modal]'
    );

    // Edit adjustment

    // Build form in modal
    $('body').on(
        {
            click: function() {
                $.ajax({
                    type: "GET",
                    url: "/admin/invoice/ajax-adjust",
                    data: {
                        adjustment_id: parseInt($(this).data('adjustment-id'))
                    }
                })
                .done(function(r) {
                    $('#edit-adjustment-modal .modal-body').html(r);
                    $('#edit-adjustment-modal').modal('show');
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#edit-adjustment-button'
    );
    // Serialize form and send to Zend for processing
    $('body').on(
        {
            click: function() {
                var url = "/admin/invoice/ajax-adjust" +
                (($(this).attr('data-adjustment-id')) ? '/adjustment_id/' + $(this).attr('data-adjustment-id') : '');

                $.ajax({
                    type: "POST",
                    url:  url,
                    data: $('#invoice-adjustment-form').serialize()
                })
                .done(function(response) {
                    $('#edit-adjustment-modal').attr('data-posted', true);
                    $('#edit-adjustment-modal .modal-body').html(response);
                    if ($("#edit-adjustment-modal form").length == 0) {
                        $('#edit-adjustment-submit').hide();
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#edit-adjustment-submit'
    );
    // Reload page once form data is posted
    $('body').on(
        {
            click: function() {
                if ($('#edit-adjustment-modal').attr('data-posted')) {
                    location.reload();
                }
            }
        },
        '#edit-adjustment-modal [data-dismiss=modal]'
    );

    /**
     * /admin/user/index
     * User Note
     */

    // Build form in modal
    $('body').on(
        {
            click: function() {
                var user_id = parseInt($(this).data('pristine-user-id'));
                $.ajax({
                    type: "GET",
                    url: "/admin/user/ajax-edit-note",
                    data: {
                        user_id: user_id
                    }
                })
                .done(function(r) {
                    var note;
                    $('#user-note-modal .modal-body').html(r);
                    $('#user-note-modal button#edit-note-submit').attr('data-user-id', user_id);
                    note = $('textarea#note').val();
                    // Add timestamp to note
                    if (note.length) {
                        note = note + "\r\n"
                    }
                    note = note + moment().format('MM/DD/YYYY    ');
                    $('textarea#note').val(note);
                    $('#edit-note-submit').show();
                    $('#user-note-modal').modal('show');
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#edit-note-button'
    );
    // Serialize form and send to Zend for processing
    $('body').on(
        {
            click: function() {
                var url = "/admin/user/ajax-edit-note" +
                (($(this).attr('data-user-id')) ? '/user_id/' + $(this).attr('data-user-id') : '');
                $.ajax({
                    type: "POST",
                    url:  url,
                    data: $('#edit-note-form').serialize()
                })
                .done(function(response) {
                    $('#user-note-modal').attr('data-posted', true);
                    $('#user-note-modal .modal-body').html(response);
                    if ($('form#edit-note-form').length == 0) {
                        $('#edit-note-submit').hide();
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#edit-note-submit'
    );
    // Reload page once form data is posted
    $('body').on(
        {
            click: function() {
                if ($('#user-note-modal').attr('data-posted')) {
                    location.reload();
                }
            }
        },
        '#user-note-modal [data-dismiss=modal]'
    );

    $('body').on(
        {
            click: function() {
                var pua_id, quantity;
                pua_id = $(this).data('pua-id');
                quantity = $('input#quantity-'+pua_id).val();
                //console.log(pua_id);
                //console.log(quantity);
                $.ajax({
                    type: "POST",
                    url:  "/admin/inventory/update",
                    data: {
                        id: pua_id,
                        quantity: quantity
                    },
                })
                .done(function(r){
                    r = $.parseJSON(r);
                    if (!r.result) {
                        //console.log(r.message);
                        $('button#submit-'+pua_id).hide();
                        $('button#error-'+pua_id).show();
                        setTimeout(function(){
                            $('button#submit-'+pua_id).show();
                            $('button#error-'+pua_id).hide();
                            $('input#quantity-'+pua_id).val($('input#quantity-'+pua_id).data('quantity'));
                        }, 1000);
                        return false;
                    }
                    $('button#submit-'+pua_id).hide();
                    $('button#success-'+pua_id).show();
                    $('input#quantity-'+pua_id).attr('data-quantity', quantity);
                    setTimeout(function(){
                        $('button#submit-'+pua_id).show();
                        $('button#success-'+pua_id).hide();
                    }, 1000);
                })
                .fail(function(){})
                .always(function(){});
            }
        },
        'button.submit-inventory-update'
    );

    /**
     * /admin/invoice/details
     */

    // Create new adjustment

    // Build form in modal
    $('body').on(
        {
            click: function() {
                $.ajax({
                    type: "GET",
                    url: "/admin/inventory/add-location",
                    data: {
                        product_id: parseInt($(this).data('product-id'))
                    }
                })
                .done(function(r) {
                    $('#add-inventory-location-modal .modal-body').html(r);
                    $('#add-inventory-location-submit').show();
                    $('#add-inventory-location-modal').modal('show');
                    UI.Inventory.InitialAddressOptions = $('select#address').html();
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#add-inventory-location-button'
    );
    // Serialize form and send to Zend for processing
    $('body').on(
        {
            click: function() {
                $.ajax({
                    type: "POST",
                    url:  "/admin/inventory/add-location",
                    data: $('#add-inventory-location-form').serialize()
                })
                .done(function(response) {
                    $('#add-inventory-location-modal').attr('data-posted', true);
                    $('#add-inventory-location-modal .modal-body').html(response);
                    if ($('#add-inventory-location-form').length == 0) {
                        $('#add-inventory-location-submit').hide();
                    }
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#add-inventory-location-submit'
    );
    // Reload page once form data is posted
    $('body').on(
        {
            click: function() {
                if ($('#add-inventory-location-modal').attr('data-posted')) {
                    location.reload();
                }
            }
        },
        '#add-inventory-location-modal [data-dismiss=modal]'
    );

    $('body').on(
        {
            change: function() {
                $.ajax({
                    type: "GET",
                    url:  "/admin/user/get-addresses",
                    data: { user_id: $(this).val() }
                })
                .done(function(response) {
                    var r, addresses;
                    r = $.parseJSON(response);
                    if (!r.result) {
                        console.log(r.message);
                        return false;
                    }
                    $('#address-form-group').hide();
                    // Build out address array
                    addresses = [];
                    r.values.addresses.forEach(function(a) {
                        addresses.push($.parseJSON(a));
                    });
                    // Reset the address select
                    address_select = $('select#address');
                    address_select.html(UI.Inventory.InitialAddressOptions);
                    // Append address options to the fresh select
                    addresses.forEach(function(a) {
                        $('select#address').append("<option value=\""+a.id+"\">"+a.address1+"</option>")
                    });
                    $('#address-form-group').show();
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        'form#add-inventory-location-form select#user_id'
    );

    // Sorry
    $('body').on(
        {
            change: function() {
                var address_id = $(this).val();
                $('input#address_id').val(address_id);
            }
        },
        'form#add-inventory-location-form select#address'
    );


    // Edit Max Bid
    $('body').on(
        {
            click: function() {
                $.ajax({
                    type: "POST",
                    url:  "/admin/auction/edit-max-bid",
                    data: {
                        max_bid_id: $('#edit-max-bid-submit').data('max-bid-id'),
                        amount: $('input#max-bid-amount').val()
                    }
                })
                .done(function(response) {
                    response = $.parseJSON(response);
                    console.log(response);
                    if (response.result) {
                        $('#edit-max-bid-modal').attr('data-success', true);
                        $('#edit-max-bid-submit').hide();
                    }
                    $('#edit-max-bid-modal #flash-message').removeClass("alert-success");
                    $('#edit-max-bid-modal #flash-message').removeClass("alert-danger");
                    $('#edit-max-bid-modal #flash-message').removeClass("alert-warning");
                    $('#edit-max-bid-modal #flash-message').addClass("alert-"+response.message_type);
                    $('#edit-max-bid-modal #flash-message').html(response.message);
                    $('#edit-max-bid-modal #flash-message').show();
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#edit-max-bid-submit'
    );
    // Reload page once form data is posted
    $('body').on(
        {
            click: function() {
                $('#edit-max-bid-modal #flash-message').show();
                if ($('#edit-max-bid-modal').attr('data-success')) {
                    location.reload();
                }
            }
        },
        '#edit-max-bid-modal [data-dismiss=modal]'
    );

    // Issue second chance offers
    $('body').on(
        {
            click: function() {
                $.ajax({
                    type: "POST",
                    url:  "/admin/auction/issue-second-chance-offers",
                    data: {
                        product_venue_id: $('#issue-second-chance-offers-submit').data('product-venue-id'),
                        quantity: $('input#quantity').val()
                    }
                })
                .done(function(response) {
                    //console.log(response);
                    response = $.parseJSON(response);
                    //console.log(response);
                    if (response.result) {
                        $('#issue-second-chance-offers-modal').attr('data-success', true);
                        $('#issue-second-chance-offers-submit').hide();
                    }
                    $('#issue-second-chance-offers-modal #flash-message').removeClass("alert-success");
                    $('#issue-second-chance-offers-modal #flash-message').removeClass("alert-danger");
                    $('#issue-second-chance-offers-modal #flash-message').removeClass("alert-warning");
                    $('#issue-second-chance-offers-modal #flash-message').addClass("alert-"+response.message_type);
                    $('#issue-second-chance-offers-modal #flash-message').html(response.message);
                    $('#issue-second-chance-offers-modal #flash-message').show();
                })
                .fail(function() {
                })
                .always(function() {
                });
            }
        },
        '#issue-second-chance-offers-submit'
    );
    // Reload page once form data is posted
    $('body').on(
        {
            click: function() {
                $('#issue-second-chance-offers-modal #flash-message').show();
                if ($('#issue-second-chance-offers-modal').attr('data-success')) {
                    location.reload();
                }
            }
        },
        '#issue-second-chance-offers-modal [data-dismiss=modal]'
    );

    /* /user/invoice/dashboard: Create new shipping address during checkout */
    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                var state_code, country_code;
                if ($('#shipping_state_code').length) {
                    state_code = $('#shipping_state_code').val();
                } else if ($('#marketplace_shipping_state_code').length) {
                    state_code = $('#marketplace_shipping_state_code').val();
                }
                if ($('#shipping_country_code').length) {
                    country_code = $('#shipping_country_code').val();
                } else if ($('#marketplace_shipping_country_code').length) {
                    country_code = $('#marketplace_shipping_country_code').val();
                }
                $.ajax({
                    type: "POST",
                    url:  "/user/profile/ajax-save-address",
                    data: {
                        user_id: $(this).data('pristine-user-id'),
                        name: $('input#shipping_name').val(),
                        address1: $('input#shipping_address1').val(),
                        address2: $('input#shipping_address2').val(),
                        city: $('input#shipping_city').val(),
                        state_code: state_code,
                        zip: $('input#shipping_zip').val(),
                        country_code: country_code,
                        address_type_code: 'shipping'
                    },
                })
                .done(function(r){
                    try {
                        r = $.parseJSON(r);
                        if (!r.result) {
                            Pristine.UI.validateCheckoutAddress(r.values.address);
                            $('button#save-new-address').hide();
                            $('button#new-address-failure').show();
                            setTimeout(function(){
                                $('button#save-new-address').show();
                                $('button#new-address-failure').hide();
                            }, 2000);
                            return false;
                        }
                        $('button#save-new-address').hide();
                        $('button#new-address-success').show();
                        // Add this address to select
                        $('#shipping-address-select').append("<option value=\"" + r.values.address.id + "\" selected>" + r.values.address.address1 + "</option>");
                        setTimeout(function(){
                            $('button#save-new-address').show();
                            $('button#new-address-success').hide();
                        }, 2000);
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function(){})
                .always(function(){});
            }
        },
        'button#save-new-address'
    );

    Pristine.UI.validateCheckoutAddress = function(address) {
        if (!address.name) {
            $("#shipping_name").parent('.form-group').addClass('has-error');
            setTimeout(function(){
                $("#shipping_name").parent('.form-group').removeClass('has-error');
            }, 3000);
        }
        if (!address.address1) {
            $("#shipping_address1").parent('.form-group').addClass('has-error');
            setTimeout(function(){
                $("#shipping_address1").parent('.form-group').removeClass('has-error');
            }, 3000);
        }
        if (!address.city) {
            $("#shipping_city").parent('.form-group').addClass('has-error');
            setTimeout(function(){
                $("#shipping_city").parent('.form-group').removeClass('has-error');
            }, 3000);
        }
        if (!address.state_code) {
            $("#marketplace_shipping_state_code").parent('.form-group').addClass('has-error');
            $("#shipping_state_code").parent('.form-group').addClass('has-error');
            setTimeout(function(){
                $("#marketplace_shipping_state_code").parent('.form-group').removeClass('has-error');
                $("#shipping_state_code").parent('.form-group').removeClass('has-error');
            }, 3000);
        }
        if (!address.zip) {
            $("#shipping_zip").parent('.form-group').addClass('has-error');
            setTimeout(function(){
                $("#shipping_zip").parent('.form-group').removeClass('has-error');
            }, 3000);
        }
        if (!address.country_code) {
            $("#marketplace_shipping_country_code").parent('.form-group').addClass('has-error');
            $("#shipping_country_code").parent('.form-group').addClass('has-error');
            setTimeout(function(){
                $("#marketplace_shipping_country_code").parent('.form-group').removeClass('has-error');
                $("#shipping_country_code").parent('.form-group').removeClass('has-error');
            }, 3000);
        }
    }

    /* /user/invoice/dashboard: Update shipping address during checkout */
    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                var state_code, country_code;
                if ($('#shipping_state_code').length) {
                    state_code = $('#shipping_state_code').val();
                } else if ($('#marketplace_shipping_state_code').length) {
                    state_code = $('#marketplace_shipping_state_code').val();
                }
                if ($('#shipping_country_code').length) {
                    country_code = $('#shipping_country_code').val();
                } else if ($('#marketplace_shipping_country_code').length) {
                    country_code = $('#marketplace_shipping_country_code').val();
                }
                $.ajax({
                    type: "POST",
                    url:  "/user/profile/ajax-save-address",
                    data: {
                        address_id: $('select#shipping-address-select').val(),
                        name: $('input#shipping_name').val(),
                        address1: $('input#shipping_address1').val(),
                        address2: $('input#shipping_address2').val(),
                        city: $('input#shipping_city').val(),
                        state_code: state_code,
                        zip: $('input#shipping_zip').val(),
                        country_code: country_code,
                        address_type_code: 'shipping'
                    },
                })
                .done(function(r){
                    try {
                        r = $.parseJSON(r);
                        if (!r.result) {
                            Pristine.UI.validateCheckoutAddress(r.values.address);
                            $('button#save-address-changes').hide();
                            $('button#address-save-failure').show();
                            setTimeout(function(){
                                $('button#save-address-changes').show();
                                $('button#address-save-failure').hide();
                            }, 2000);
                            return false;
                        }
                        $('button#save-address-changes').hide();
                        $('button#address-save-success').show();
                        setTimeout(function(){
                            $('button#save-address-changes').show();
                            $('button#address-save-success').hide();
                        }, 2000);
                    } catch (e) {
                        console.log(e);
                    }
                })
                .fail(function(){})
                .always(function(){});
            }
        },
        'button#save-address-changes'
    );

    /* /user/invoice/dashboard: Make shipping address primary during checkout */
    $('body').on(
        {
            click: function() {
                UI.getSessionInfo();
                $.ajax({
                    type: "POST",
                    url:  "/user/profile/ajax-make-address-primary",
                    data: {
                        address_id: $('select#shipping-address-select').val()
                    }
                })
                .done(function(r){
                    r = $.parseJSON(r);
                    if (!r.result) {
                        $('button#make-address-primary').hide();
                        $('button#make-primary-failure').show();
                        setTimeout(function(){
                            $('button#make-address-primary').show();
                            $('button#make-primary-failure').hide();
                        }, 2000);
                        return false;
                    }
                    $('button#make-address-primary').hide();
                    $('button#make-primary-success').show();
                    setTimeout(function(){
                        $('button#make-address-primary').show();
                        $('button#make-primary-success').hide();
                    }, 2000);
                })
                .fail(function(){})
                .always(function(){});
            }
        },
        'button#make-address-primary'
    );

    /* /user/invoice/dashboard: Change address form on address select change */
    $('body').on(
        {
            change: function() {
                var id,
                    address;

                id = $(this).val();
                address = $('div#shipping-addresses div#address_'+id);

                $('input#shipping_name').val(address.data('name'));
                $('input#shipping_address1').val(address.data('address1'));
                $('input#shipping_address2').val(address.data('address2'));
                $('input#shipping_city').val(address.data('city'));
                $('select#shipping_state_code').val(address.data('state-code'));
                $('input#shipping_zip').val(address.data('zip'));
                $('select#shipping_country_code').val(address.data('country-code'));
            }
        },
        'select#shipping-address-select'
    );

    // Disable Process payment button on submission
    $('body').on(
        {
            click: function(e) {
                $(this).hide();
                $('#processing-payment').show();
            }
        },
        'button#process-payment'
    );
    $('body').on(
        {
            submit: function(e) {
                if (Pristine.Checkout.submitted) {
                    e.preventDefault();
                    //console.log("Multiple checkout prevented!");
                }
                Pristine.Checkout.submitted = true;
                return;
            }
        },
        'form#checkout'
    );


    // Initialize all tooltips
    $('[data-toggle="tooltip"]').tooltip({container: 'body'});
    // Initialize all popovers
    $('[data-toggle="popover"]').popover();
})();

/************************
/*** Window & Document Events
************************/

$(window).resize(function() {
    $('.mm-page').css('height',  + $('.search-wrapper').height() + $('.footer').height() + 125 /*Margin Top*/);
});

$(document).ready(function() {
    //Pristine UI Scripts
    Pristine.UI.updateCountdown();
    Pristine.UI.mmenu();
    Pristine.UI.updateBids();
    Pristine.UI.removeHighlights();
    Pristine.UI.checkUploadProgress();
    Pristine.UI.toggleShippingAddress();
    Pristine.UI.displayExpiredSessionModal();
    // Pristine listing scripts
    if (window.location.pathname.indexOf('/admin/auction') >= 0) {
        Pristine.Calendars.initializeClndr();
    }
    if (window.location.pathname.indexOf('/admin/auction/print-label-queue') >= 0) {
        Pristine.AuctionListing.printLabelQueue(function() {
            window.location.replace("/admin/auction");
        });
    }
    //Image Sortable
    if ($('#dropzone-previews') && $('.dz-preview').length > 0) {
        $("#dropzone-previews").sortable({
            items:'.dz-preview',
            cursor: 'move',
            opacity: 0.5,
            containment: '#dropzone-previews',
            distance: 20,
            tolerance: 'pointer'
        });
    }
    // Submit reorder form when option is changed
    $('#sort-method').change(function() {
        location = $(this).val();
    });
    $('#sort').change(function() {
        var url, i;
        url = location.href;
            console.log("URL: " + url);
        p = "&sort=";
        i = url.indexOf(p);
            console.log("i: " + i);
        if (i == -1) {
            p = "?sort=";
            i = url.indexOf(p);
        }
        if (i == -1) {
            if (url.indexOf("?") == -1) {
                url = url.substring(0, url.length-1) + "?sort=" + $(this).val();
                console.log("URL: " + url);
            } else {
                url = url + "&sort=" + $(this).val();
                console.log("URL: " + url);
            }
        } else {
            j = url.indexOf("&", i+p.length)
            if (j == -1) {
                url = url.substring(0, i) + p + $(this).val();
                console.log("URL: " + url);
            } else {
                url = url.substring(0, i) + p + $(this).val() + url.substring(j);
                console.log("URL: " + url);
            }
        }
        location = url;
    });
});
