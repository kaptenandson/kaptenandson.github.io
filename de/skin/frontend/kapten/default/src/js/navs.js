(function($) {
    $(function() {
        var lastScrollPos = 0;
        var scrollingDown = false;
        var screenWidth = window.orientation ? screen.height : screen.width;
        var burgerMenuContent = $('#burger-menu-content');
        var menuContainer = $('#menu-container');
        var stickyLogo = $('header[role=banner] .logo');
        var globalLinks = $('#global-links');

        function checkTSBadge() {
            var $tsBadge = $('div[id^=tsbadgeResponsiveTop_]');

            if($tsBadge.length) {
                var pos = $tsBadge.height() - $(window).scrollTop();

                if($(window).scrollTop() > 0) {
                    menuContainer.css('top', pos > 0 ? pos : 0);
                }
            }
        }

        $('body').on("remove", 'div[id^=tsbadgeResponsiveTop_]', function() {
            checkTSBadge();
        });

        // Viewport manipulation to fit minimum screen-size
        // Most of this devices are retina and everything looks fine
        if(screenWidth < 320) {
            var scale = screenWidth / 320;
            $('meta[name=viewport]').attr('content', 'width=320, user-scalable=no, initial-scale=' + scale + ', maximum-scale=' + scale);
        }

        window.addEventListener("orientationchange", function() {
            screenWidth = window.orientation ? screen.height : screen.width;

            if(screenWidth < 320) {
                var scale = screenWidth / 320;
                $('meta[name=viewport]').attr('content', 'width=320, user-scalable=no, initial-scale=' + scale + ', maximum-scale=' + scale);
            } else {
                $('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0');
            }

        }, false);

        $(window).resize(function() {
            checkTSBadge();
            screenWidth = window.orientation ? screen.height : screen.width;
        });

        if($(window).scrollTop() > 10) {
            menuContainer.addClass('shadowed');
        } else {
            if(menuContainer.hasClass('burger')) {
                menuContainer.removeClass('burger');
            }
        }

        $(window).on('load scroll resize', function() {
            if(menuContainer.css('top') != 0) {
                var top = 'auto';
                $headerTeaser = $('#freeshippingInHeader');
                if($.contains(document.documentElement, $headerTeaser.get(0))) {
                    top = Math.max(22 - $(window).scrollTop(), 0);
                    if($(window).width() < 992) {
                        top = Math.max(19 - $(window).scrollTop(), 0);
                        //$('#user-links-cart-overlay').find('.cart-content').css('padding-top', (top + 11) + "px");
                        $('#close-cart-overlay').css('margin-top', (top) + "px");
                    }else{
                        top = Math.max(22 - $(window).scrollTop(), 0);
                        //$('#user-links-cart-overlay').find('.cart-content').css('padding-top', "0");
                        $('#close-cart-overlay').css('margin-top', "0");
                    }

                    top = top + "px";
                }
                menuContainer.css('top', top);
            }
        });

        $(window).scroll(function() {
            var scrollPos = $(window).scrollTop();

            checkTSBadge();

            if(scrollPos <= 10) {
                menuContainer.removeClass('shadowed');
            } else {
                menuContainer.addClass('shadowed');

                if(scrollPos < lastScrollPos + (scrollingDown ? -10 : 10)) {
                    if(scrollingDown) {
                        scrollingDown = false;
                        menuContainer.removeClass('burger');
                        // filterBar.removeClass('burger');
                    }
                } else {
                    if(!scrollingDown) {
                        scrollingDown = true;
                        menuContainer.addClass('burger');
                        // filterBar.addClass('burger');
                    }
                }
            }
            lastScrollPos = scrollPos;
            /*
            if(!filterFixed && (filterBar.offset().top - scrollPos) < menuContainer.height()) {
                filterBar.addClass('fixed');
                filterFixed = true;
            } else if(filterFixed && (filterBar.offset().top - scrollPos) > menuContainer.height()) {
                filterBar.removeClass('fixed');
                filterFixed = false;
            }
            */
        });


        $('#burger-menu-close > a').click(function(e) {
            e.preventDefault();
            var body = $('body');
            stickyLogo.removeClass('animate');
            body.removeClass('modal-open');
            body.removeClass('menu-open');
            $(window).scrollTop(body.data('scrollPos'));
            burgerMenuContent.fadeOut();
        });

        $('#burger-menu-button > a').click(function(e) {
            e.preventDefault();
            var body = $('body');
            stickyLogo.addClass('animate');
            body.addClass('modal-open');
            body.addClass('menu-open');
            burgerMenuContent.fadeIn(function() {
                body.data('scrollPos', $(window).scrollTop())
            });
        });

        //close by clcking outside of menu
        $(document).mouseup(function(e)  {
            var $container = $("#burger-menu-content");

            // if the target of the click isn't the container nor a descendant of the container
            if (!$container.is(e.target) && $container.has(e.target).length === 0 && $('body').hasClass('menu-open')) {
                e.preventDefault();
                var body = $('body');
                stickyLogo.removeClass('animate');
                body.removeClass('modal-open');
                body.removeClass('menu-open');
                $(window).scrollTop(body.data('scrollPos'));
                burgerMenuContent.fadeOut();
            }
        });



        $('#burger-menu-search > a').click(function(e) {
            e.preventDefault();
            var container = $('#burger-global-page-search');
            container.css('right', $(window).width() * -1);
            container.animate({'right': 0});
        });

        $('#burger-global-page-search-dismiss > a').click(function(e) {
            e.preventDefault();
            var container = $('#burger-global-page-search');
            container.animate({'right': '-100%'}, function() {
                stickyLogo.removeClass('animate');
            });
        });

        $('a.switch-language-button').click(function(e) {
            e.preventDefault();

            if($(this).parents('#burger-menu-content').length) {
                var container = $(this).parent();
                var select_menu = $(this).next();
                var gray_out = null;

                var bottom = (select_menu.height() * -1) + 30;
                if($( window ).width() < 992)
                    bottom = (select_menu.height() * -1) - 40;

                if(select_menu.is(':visible')) {
                    gray_out = $('#burger-menu-content > div.gray-out');
                    container.animate({'bottom': bottom, 'padding': 0}, function() {
                        select_menu.hide();
                        container.css({'position': 'relative', 'bottom': 0});
                    });
                    gray_out.fadeOut(function() {
                        gray_out.remove();
                    });
                    stickyLogo.removeClass('faded');
                } else {
                    container.parent().css('height', container.parent().height())
                    select_menu.show();
                    container.css({'position': 'absolute', 'bottom': bottom});
                    container.animate({'bottom': -8, 'padding': '20px 0'});
                    burgerMenuContent.prepend('<div class="gray-out"></div>');
                    $('> div.gray-out', burgerMenuContent).fadeIn().click(function() {
                        $('a.switch-language-button', burgerMenuContent).click();
                    });
                    stickyLogo.addClass('faded');
                }
            } else {
                $(this).next().slideToggle();
            }
        });

        $('a#global-page-search-button').click(function(e) {
            e.preventDefault();
            var globalLinksMenu = $('ul', globalLinks);
            var searchInputClear = $('#global-page-search-input-clear');
            var searchContainer = $('#global-page-search');

            globalLinksMenu.fadeOut(function() {
                // $(this).css({'display': 'block', 'visibility': 'hidden'});
                var menuWidth = globalLinksMenu.width();

                searchContainer.css('marginLeft', menuWidth);
                searchContainer.animate({'width': menuWidth, 'marginLeft': 0}, function() {
                    searchInputClear.fadeIn();
                });
            });
        });

        $('#global-page-search-input-clear').click(function(e) {
            e.preventDefault();
            var globalLinksMenu = $('ul', globalLinks);
            var searchInputClear = $('#global-page-search-input-clear');
            var searchContainer = $('#global-page-search');
            var menuWidth = globalLinksMenu.width();

            searchInputClear.hide();
            searchContainer.animate({'width': 0, 'marginLeft': menuWidth}, function() {
                globalLinksMenu.fadeIn();
            });
        });

        $('.burger-navbar a').click(function() {
            $('#burger-menu-close > a').click();
            return true;
        });

        $('#close-cart-overlay').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            jQuery('.cart-overlay-background').click();
        });
        $('nav[role=navigation]').on('click', '.cart-overlay-background', function(e) {
            if(e.target == this) {
                $('header[role=banner]').removeClass('no-transform');
                var cartOverlayContainer = $('#user-links-cart-overlay');
                cartOverlayContainer.removeClass('visible');
                $(this).remove();
            }
        });
    });
})(jQuery);

jQuery(document).ready(function($) {
    $("#burger-menu-content .arrow-down").unbind('click').on('click',  function() {
        var target = $(this).data('togglediv');
        $("#" + target + ".subblock-container").toggle();
        if($("#" + target + ".subblock-container").is(':visible')){
            $(this).addClass('arrow-up');

        }
        else {
            $(this).removeClass('arrow-up');
        }
    });
});
