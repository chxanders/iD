window.iD = function(container) {
    var connection = iD.Connection()
            .url('http://api06.dev.openstreetmap.org'),
        history = iD.History(),
        map = iD.Map()
            .connection(connection)
            .history(history),
        controller = iD.Controller(map, history);
    
    map.background.source(iD.Background.Pants);

    function editor() {
        if (!iD.supported()) {
            this.html('This editor is supported in Firefox, Chrome, Safari, Opera, ' +
                      'and Internet Explorer 9 and above. Please upgrade your browser ' +
                      'or use Potlatch 2 to edit the map.')
                .style('text-align:center;font-style:italic;');
            return;
        }

        var m = this.append('div')
            .attr('id', 'map')
            .call(map);

        var bar = this.append('div')
            .attr('id', 'bar');

    var menu = bar.append('div')
		.attr('class', 'topmenuitem');

    var pantsjsddm = menu.append('ul')
		.attr('id', 'jsddm').append('li').append('a')
		.attr('style', 'text-align:center;padding-left:0;width:80px;')
		.text('PANTS').append('ul');
    
    var leftbuttons = bar.append('div')
		.attr('class', 'leftbuttons');
    
    var buttons = leftbuttons.selectAll('add-button')
            .data([iD.modes.AddPlace, iD.modes.AddArea])
            .enter().append('button')
                .attr('class', 'add-button')
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

        this.append('div')
            .attr('class', 'inspector-wrap')
            .style('display', 'none');


        window.onresize = function() {
            map.size(m.size());
        };

        var keybinding = d3.keybinding()
            .on('a', function(evt, mods) {
                controller.enter(iD.modes.AddArea);
            })
            .on('p', function(evt, mods) {
                controller.enter(iD.modes.AddPlace);
            })
            .on('r', function(evt, mods) {
                controller.enter(iD.modes.AddRoad);
            })
            .on('z', function(evt, mods) {
                if (mods === '⇧⌘') history.redo();
                if (mods === '⌘') history.undo();
            });
        d3.select(document).call(keybinding);
        map.keybinding(keybinding);

        var hash = iD.Hash().map(map);

    if (!hash.hadHash) {
        map.zoom(15)
	    .center([-0.005, 51.46]);
    }
    pants.menuInit(this, pantsjsddm, map);
    controller.enter(iD.modes.Browse());
    };

    editor.map = function() {
        return map;
    };

    editor.controller = function() {
        return controller;
    };

    if (arguments.length) {
        d3.select(container).call(editor);
    }

    return editor;
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
