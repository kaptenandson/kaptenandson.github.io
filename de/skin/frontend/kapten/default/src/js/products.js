(function($) {
    $(function($){

        var $productContainer = $('#product-container');

        if($productContainer.length === 0) {
            return;
        }

        var $productImageList = $('#product-image-list', $productContainer);
        var $productImage = $('div.product-image img.product-image', $productContainer);
        var $productImageDiv = $('div.product-image', $productContainer);
        var $productBadge = $('.product-badge');
        var $productImageSrc = $productImage.attr('src');

        $('div.product-image-container', $productImageDiv);

        function changeProductImage(src, zoomSrc) {
            $('div.product-image-container', $productImageDiv).append('<div class="product-image-fade"><img src="' + $productImage.attr('src') + '"/></div>');
            $productImage.attr('src', src).data('zoomImage', zoomSrc);

            if(!($productImage.attr('src') ==  $productImageSrc)) {
                $productBadge.hide();
            }else {
                $productBadge.show();
            }
            console.log( $productImage.attr('src'));

            $('.product-image-fade', $productImageDiv).fadeOut(function() {
                $(this).remove();
            });

            $('div.zoomContainer').remove();

            $('.image-zoom').elevateZoom({
                zoomType: "inner",
                cursor: "crosshair",
                responsive: true
            });
        }

        $('a', $productImageList).click(function(e) {
            e.preventDefault();
            changeProductImage($(this).attr('href'), $(this).data('zoom'));
            $('a', $productImageList).removeClass('active-image');
            $(this).addClass('active-image');
            return false;
        });


        //swipe
        var touchstartX = 0;
        var touchstartY = 0;
        var touchendX = 0;
        var touchendY = 0;

        var gesuredZone = $('div.product-image-container', $productImageDiv).get(0);
        gesuredZone.addEventListener('touchstart', function(event) {
            touchstartX = event.changedTouches[0].screenX;
            touchstartY = event.changedTouches[0].screenY;
        }, false);

        gesuredZone.addEventListener('touchend', function(event) {
            touchendX = event.changedTouches[0].screenX;
            touchendY = event.changedTouches[0].screenY;
            handleGesure();
        }, false);


        function handleGesure() {
            var swiped = false;
            if (touchendX < touchstartX && Math.abs(touchendX - touchstartX) > Math.abs(touchendY - touchstartY)) {
                //swiped left, next image
                $next =  $productImageList.find('.active-image').parent().next();
                if( $next.length == 0 )
                    $next = $productImageList.find('.active-image').parent().prevAll().last();

                swiped = true;
            }
            if (touchendX > touchstartX && Math.abs(touchendX - touchstartX) > Math.abs(touchendY - touchstartY)) {
                //swiped right, prev image
                $next =  $productImageList.find('.active-image').parent().prev();
                if( $next.length == 0 )
                    $next = $productImageList.find('.active-image').parent().next();

                swiped = true;
            }

            if(swiped) {
                $elem = $next.find('a');
                $('a', $productImageList).removeClass('active-image');
                $elem.addClass('active-image');
                changeProductImage($elem.attr('href'), $elem.data('zoom'));
            }

        }

        $('.image-zoom').elevateZoom({
            zoomType: "inner",
            cursor: "crosshair",
            responsive: true
        });
    });
})(jQuery);