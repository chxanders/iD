var iD = function(container) {

    if (!iD.supported()) {
        container.innerHTML = 'This editor is supported in Firefox, Chrome, Safari, Opera, ' +
            'and Internet Explorer 9 and above. Please upgrade your browser ' +
            'or use Potlatch 2 to edit the map.';
        container.style.cssText = 'text-align:center;font-style:italic;';
        return;
    }

    container = d3.select(container);

    var map = iD.Map(),
    	controller = iD.Controller(map);
    
    var m = container.append('div')
        .attr('id', 'map')
        .call(map);

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

    leftbuttons.append('input')
        .attr({ type: 'text', placeholder: 'find a place', id: 'geocode-location' })
        .on('keydown', function () {
            if (d3.event.keyCode !== 13) return;
            d3.event.preventDefault();
            var val = d3.select('#geocode-location').node().value;
            d3.select(document.body).append('script')
                .attr('src', 'http://api.tiles.mapbox.com/v3/mapbox/geocode/' +
                    encodeURIComponent(val) + '.jsonp?callback=grid');
        });

    window.grid = function(resp) {
        map.center([resp.results[0][0].lon, resp.results[0][0].lat]);
    };

    bar.append('div')
        .attr('class', 'messages');

    var zoom = bar.append('div')
        .attr('class', 'zoombuttons')
        .selectAll('button')
            .data([['zoom-in', '+', map.zoomIn], ['zoom-out', '-', map.zoomOut]])
            .enter().append('button').attr('class', function(d) { return d[0]; })
            .text(function(d) { return d[1]; })
            .on('click', function(d) { return d[2](); });

    container.append('div')
        .attr('class', 'inspector-wrap').style('display', 'none');
    

    window.onresize = function() {
        map.size(m.size());
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

    map.background.source(iD.Background.Pants);

    var hash = iD.Hash().map(map);

    if (!hash.hadHash) { 
        map.zoom(15)
	    .center([-0.005, 51.46]);
    }

    pants.menuInit(container, pantsjsddm, map);
    return map;
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
