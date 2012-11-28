var iD = function(container) {
    container = d3.select(container);

    var m = container.append('div')
        .attr('id', 'map');
    var map = iD.Map(m.node());

    var controller = iD.Controller(map);

    var bar = container.append('div')
        .attr('id', 'bar');

    var menu = bar.append('div')
		.attr('class', 'topmenuitem');

    var pantsjsddm = menu.append('ul')
		.attr('id', 'jsddm').append('li').append('a')
		.attr('style', 'text-align:center;padding-left:0;width:80px;')
		.text('PANTS').append('ul');
    
    var leftbuttons = bar.append('div')
		.attr('class', 'leftbuttons');
    
    var buttons = leftbuttons.selectAll('buttons')
        .data([iD.modes.AddPlace, iD.modes.AddArea])
        .enter().append('button')
        .text(function (mode) { return mode.title; })
        .on('click', function (mode) { controller.enter(mode); });

    controller.on('enter', function (entered) {
        buttons.classed('active', function (mode) { return entered === mode; });
    });

    leftbuttons	.append('input')
        .attr('type', 'text')
        .attr('placeholder', 'find a place')
        .attr('id', 'geocode-location')
        .on('keydown', function () {
            if (d3.event.keyCode !== 13) return;
            d3.event.preventDefault();
            var val = d3.select('#geocode-location').node().value;
            var scr = document.body.appendChild(document.createElement('script'));
            scr.src = 'http://api.tiles.mapbox.com/v3/mapbox/geocode/' +
                encodeURIComponent(val) + '.jsonp?callback=grid';
        });

    window.grid = function(resp) {
        map.setCenter([resp.results[0][0].lon, resp.results[0][0].lat]);
    };

    bar.append('div')
        .attr('class', 'messages');

    var zoom = bar.append('div')
        .attr('class', 'zoombuttons');

    zoom.append('button')
        .attr('class', 'zoom-in')
        .text('+')
        .on('click', map.zoomIn);

    zoom.append('button')
        .attr('class', 'zoom-out')
        .text('–')
        .on('click', map.zoomOut);
    
    map.on('update', function() {
    	map.redraw();
    });

    window.onresize = function() {
        map.setSize([m.node().offsetWidth, m.node().offsetHeight]);
    };

    d3.select(document).on('keydown', function() {
        // cmd-z
        if (d3.event.which === 90 && d3.event.metaKey) {
            map.undo();
        }
        // cmd-shift-z
        if (d3.event.which === 90 && d3.event.metaKey && d3.event.shiftKey) {
            map.redo();
        }
    });

    var hash = iD.Hash().map(map);
    if (!hash.hadHash) map.setZoom(15).setCenter([-0.005, 51.46]);

    pants.menuInit(container, pantsjsddm, map);
};

iD.supported = function() {
    if (navigator.appName !== 'Microsoft Internet Explorer') {
        return true;
    } else {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
        if (re.exec(ua) !== null) {
            rv = parseFloat( RegExp.$1 );
        }
        if (rv && rv < 9) return false;
        else return true;
    }
};
