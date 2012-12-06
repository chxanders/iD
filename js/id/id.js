window.iD = function(container) {
    var connection = iD.Connection()
            .url('http://api06.dev.openstreetmap.org'),
        history = iD.History(),
        map = iD.Map()
            .connection(connection)
            .history(history),
        controller = iD.Controller(map, history);

    map.background.source(iD.BackgroundSource.Pants);

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

        var pantsjsddm = bar.append('ul')
		.attr('id', 'jsddm').append('li').append('a')
		.attr('style', 'text-align:center;padding-left:0;width:80px;')
		.text('PANTS').append('ul');

        var buttons_joined = bar.append('div')
            .attr('class', 'buttons-joined');

        var buttons = buttons_joined.selectAll('button.add-button')
            .data([iD.modes.Browse(), iD.modes.AddPlace(), iD.modes.AddRoad(), iD.modes.AddArea()])
            .enter().append('button')
                .attr('class', 'add-button')
            .text(function (mode) { return mode.title; })
            .attr('data-original-title', function (mode) { return mode.description; })
            .call(bootstrap.tooltip().placement('bottom'))
            .on('click', function (mode) { controller.enter(mode); });

        controller.on('enter', function (entered) {
            buttons.classed('active', function (mode) { return entered.button === mode.button; });
        });

        bar.append('div')
            .attr('class', 'messages');

        var zoom = bar.append('div')
            .attr('class', 'zoombuttons')
            .selectAll('button')
                .data([['zoom-in', '+', map.zoomIn], ['zoom-out', '-', map.zoomOut]])
                .enter().append('button').attr('class', function(d) { return d[0]; })
                .text(function(d) { return d[1]; })
                .on('click', function(d) { return d[2](); });

        var gc = bar.append('div').attr('class', 'geocode-control');
        gc.append('button').text('?');
        gc
            .on('mouseover', function() {
                d3.select('.geocode-control input').style('display', 'inline-block');
            })
            .on('mouseout', function() {
                d3.select('.geocode-control input').style('display', 'none');
            });
        gc.append('input')
            .attr({
                type: 'text',
                placeholder: 'find a place'
            })
            .on('keydown', function () {
                if (d3.event.keyCode !== 13) return;
                d3.event.preventDefault();
                d3.json('http://api.tiles.mapbox.com/v3/mapbox/geocode/' +
                    encodeURIComponent(this.value) + '.json', function(err, resp) {
                    map.center([resp.results[0][0].lon, resp.results[0][0].lat]);
                });
            });

        this.append('div').attr('class', 'layerswitcher-control')
            .call(iD.layerswitcher(map));

        this.append('div')
            .attr('class', 'inspector-wrap')
            .style('display', 'none');

        window.onresize = function() {
            map.size(m.size());
        };

        var keybinding = d3.keybinding()
            .on('a', function(evt, mods) {
                controller.enter(iD.modes.AddArea());
            })
            .on('p', function(evt, mods) {
                controller.enter(iD.modes.AddPlace());
            })
            .on('r', function(evt, mods) {
                controller.enter(iD.modes.AddRoad());
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


        controller.enter(iD.modes.Browse());
        pants.menuInit(this, pantsjsddm, map);
    }

    editor.connection = function(_) {
        if (!arguments.length) return connection;
        connection = _;
        return editor;
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
