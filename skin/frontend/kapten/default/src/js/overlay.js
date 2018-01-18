var addOverlayContainer, removeOverlayContainer, pushErrorToContainer, addLoadingSpinner;

(function($) {
    $(function() {
        $('div[role=main]').on('click', '.overlay-container', function(e) {
            if(e.target == this && $(this).find('.loading').length == 0 && !$(this).data('reactid')) {
                removeOverlayContainer(this);
            }
        });
    });

    var loadSpinnerCode = '<div class="loading sk-fading-circle">' +
        '    <div class="sk-circle1 sk-circle"></div>' +
        '    <div class="sk-circle2 sk-circle"></div>' +
        '    <div class="sk-circle3 sk-circle"></div>' +
        '    <div class="sk-circle4 sk-circle"></div>' +
        '    <div class="sk-circle5 sk-circle"></div>' +
        '    <div class="sk-circle6 sk-circle"></div>' +
        '    <div class="sk-circle7 sk-circle"></div>' +
        '    <div class="sk-circle8 sk-circle"></div>' +
        '    <div class="sk-circle9 sk-circle"></div>' +
        '    <div class="sk-circle10 sk-circle"></div>' +
        '    <div class="sk-circle11 sk-circle"></div>' +
        '    <div class="sk-circle12 sk-circle"></div>' +
        '</div>';

    addOverlayContainer = function(modalClass, loading) {
        var container = $('div[role=main]').append('' +
            '<div class="' + modalClass + ' overlay-container fade">' +
            (loading ? loadSpinnerCode : '') +
            '</div>');

        var overlay = $('.' + modalClass, container);

        $('body').addClass('modal-open');

        setTimeout(function() {
            overlay.removeClass('fade')
        }, 1);

        return overlay;
    };

    removeOverlayContainer = function(container) {
        var $container = getMainContainer(container);

        $('> div', $container).addClass('slide');

        $container.addClass('fade');
        setTimeout(function() {
            $container.remove();
            $('body').removeClass('modal-open');
        }, 500);
    };
    
    pushErrorToContainer = function(container, text) {
        var $container = getMainContainer(container);
        
        $container.html('<div class="error-overlay-container overlay slide">' +
            '   <p>' + text + '</p>' +
            '   <div class="button-container">' +
            '       <button class="button btn-default button-noraml" onclick="removeOverlayContainer(this)" type="button">Ok</button>' +
            '   </div>' +
            '</div>');

        setTimeout(function() {
            $('> div', $container).removeClass('slide');
        }, 1);
    };

    addLoadingSpinner = function(container) {
        $(container).append(loadSpinnerCode);
    };
    
    var getMainContainer = function(elem) {
        var $elem = $(elem);
        
        if(!$elem.hasClass('overlay-container')) {
            $elem = $elem.parents('.overlay-container');
        }
        return $elem;
    } 
})(jQuery);
