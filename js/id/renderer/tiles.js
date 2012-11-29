iD.Tiles = function(selection, projection) {
    var t = {},
        tile = d3.geo.tile();

    // derive the url of a 'quadkey' style tile from a coordinate object
    function tileUrl(coord) {
        return  '/pants/tile/' + coord[2] + '/' + coord[0] + '/' + coord[1] + '.png';
    }

    // derive the tiles onscreen, remove those offscreen and position tiles
    // correctly for the currentstate of `projection`
    function redraw() {
        var tiles = tile
            .scale(projection.scale())
            .translate(projection.translate())();

        var image = selection
            .attr("transform", function() {
                return "scale(" + tiles.scale + ")translate(" + tiles.translate + ")";
            })
            .selectAll("image")
            .data(tiles, function(d) { return d; });

        image.exit()
            .remove();

        image.enter().append("image")
            .attr("xlink:href", tileUrl)
            .attr("width", 1)
            .attr("height", 1)
            .attr("x", function(d) { return d[0]; })
            .attr("y", function(d) { return d[1]; });
    }

    function setSize(x) {
        tile.size(x);
        redraw();
        return t;
    }

    t.setSize = setSize;
    t.redraw = redraw;

    return t;
};
