/* === ) Mini grid === */
$(window).on('resize', function () {
    minigrid({container: '.masonery', item: '.masonery > *', gutter: 0});
});
var transformProp;
var loaded;

(function () {
    var style = document.createElement('a').style;
    var prop;
    if (style[prop = 'webkitTransform'] !== undefined) {
        transformProp = prop;
    }
    if (style[prop = 'msTransform'] !== undefined) {
        transformProp = prop;
    }
    if (style[prop = 'transform'] !== undefined) {
        transformProp = prop;
    }
}());

function minigrid(props) {
    var containerEle = props.container instanceof Node ?
            props.container : document.querySelector(props.container);

    if (!containerEle) {
        return false;
    }

    var itemsNodeList = props.item instanceof NodeList ?
            props.item : containerEle.querySelectorAll(props.item);
    if (!itemsNodeList || itemsNodeList.length === 0) {
        return false;
    }

    if (!props.containerLoaded || typeof props.containerLoaded !== 'string') {
        props.containerLoaded = false;
    }

    if (!props.containerLoaded || typeof props.itemLoaded !== 'string') {
        props.itemLoaded = false;
    }

    if (loaded || props.skipWindowOnLoad) {
        init(containerEle, itemsNodeList, props);
        return;
    }

    if (/webkit/.test(navigator.userAgent.toLowerCase())) {
        window.addEventListener('load', function () {
            init(containerEle, itemsNodeList, props);
        });
    } else {
        window.onload = function () {
            init(containerEle, itemsNodeList, props);
        };
    }
}

function init(containerEle, itemsNodeList, props) {
    if (props.containerLoaded) {
        containerEle.classList.add(props.containerLoaded);
    } else if (!/loaded/.test(containerEle.className)) {
        containerEle.classList.add(containerEle.className.split(' ')[0] + '--loaded');
    }

    loaded = true;

    var gutter = (
            typeof props.gutter === 'number' &&
            isFinite(props.gutter) &&
            Math.floor(props.gutter) === props.gutter
            ) ? props.gutter : 0;
    var done = props.done;

    containerEle.style.width = '';

    var forEach = Array.prototype.forEach;
    var containerWidth = containerEle.getBoundingClientRect().width;
    var firstChildWidth = itemsNodeList[0].getBoundingClientRect().width + gutter;
    var cols = Math.max(Math.floor((containerWidth - gutter) / firstChildWidth), 1);
    var count = 0;

    var itemsGutter = [];
    var itemsPosX = [];

    for (var g = 0; g < cols; ++g) {
        itemsPosX.push(g * firstChildWidth + gutter);
        itemsGutter.push(gutter);
    }

    forEach.call(itemsNodeList, function (item) {
        var itemIndex = itemsGutter
                .slice(0)
                .sort(function (a, b) {
                    return a - b;
                })
                .shift();
        itemIndex = itemsGutter.indexOf(itemIndex);

        var posX = Math.round(itemsPosX[itemIndex]);
        var posY = Math.round(itemsGutter[itemIndex]);

        item.style.position = 'absolute';
        item.style.webkitBackfaceVisibility = item.style.backfaceVisibility = 'hidden';
        if (props.itemLoaded) {
            item.classList.add(props.itemLoaded);
        } else if (!/loaded/.test(item.className)) {
            item.classList.add(item.className.split(' ')[0] + '--loaded');
        }

        if (!props.animate && transformProp) {
            item.style[transformProp] = 'translate3D(' + posX + 'px,' + posY + 'px, 0)';
        }

        itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutter;
        count = count + 1;

        if (props.animate) {
            return props.animate(item, posX, posY, count);
        }

    });

    var containerHeight = itemsGutter
            .slice(0)
            .sort(function (a, b) {
                return a - b;
            })
            .pop();

    containerEle.style.height = containerHeight + 'px';

    if (typeof done === 'function') {
        done(itemsNodeList);
    }
}

minigrid({container: '.masonery', item: '.masonery > *', gutter: 0});

/* === ) kraj Mini grid-a, ne treba da stoji u document.ready === */




$(document).ready(function () {

    //sredjivanje side-menu dugmeta

    $('.toggle-menu').click(function () {

        $('.menu-overlay').fadeIn();
        $('.menu').addClass('active');
        $('body').addClass('inactive');

    });


    $('.menu-overlay').click(function () {
        $(this).fadeOut();
        $('.menu').removeClass('active');
        $('body').removeClass('inactive');
    });


    $('.menu span.fa-close').click(function () {
        $('.menu-overlay').fadeOut();
        $('.menu').removeClass('active');
        $('body').removeClass('inactive');
    });



    function animation() {
        var windowHeight = $(window).height();
        var scroll = $(window).scrollTop();
        $('.animation').each(function () {
            var pozicija = $(this).offset().top;

            var animacija = $(this).attr('data-animation');
            if (pozicija < scroll + windowHeight - 100) {
                $(this).addClass(animacija);
            }

        });
    }

    animation();

    $(window).scroll(function () {
        animation();
    });



//form validation

    $(function () {
        $(".contact-form").validate({
            highlight: function (element) {
                $(element).closest('.form-group').addClass("has-danger");
                $(element).addClass("form-control-danger");
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
                $(element).removeClass('form-control-danger').addClass('form-control-success');
            },
            rules: {
                name: {
                    required: true,
                    rangelength: [3, 50]
                },
                email: {
                    required: true,
                    email: true
                }

            },
            messages: {
                name: {
                    required: "* This field is required.",
                    rangelength: "Please, enter a name between 3 and 50 characters."
                },
                email: {
                    required: "* This field is required.",
                    email: "Please, enter a valid e-mail address."
                }
            },
            errorElement: 'p',
            errorPlacement: function (error, element) {
                error.appendTo($(element).closest('.form-group').find('.error'));
            }

        });
    });

});

