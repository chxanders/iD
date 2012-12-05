iD.Inspector = function() {
    var event = d3.dispatch('changeTags', 'changeWayDirection', 'update', 'remove', 'close'),
        taginfo = iD.taginfo();

    function drawhead(selection) {
        selection.html('');
        selection.append('h2')
            .text(iD.util.friendlyName(selection.datum()));
        if (selection.datum().type === 'way') {
            selection.append('a')
                .attr('class', 'permalink')
                .attr('href', '#')
                .on('click', function(d) {
                    event.changeWayDirection(iD.Entity(d, {
                        nodes: _.pluck(d.nodes.reverse(), 'id')
                    }));
                });
        }
    }

    function inspector(selection) {
        selection.each(function(entity) {
            selection.html("").append('button')
                .text('x').attr({ title: 'close', 'class': 'close' })
                .on('click', function() {
                    event.close(entity);
                });

            selection.append('div')
                .attr('class', 'head').call(drawhead);

            var table = selection
                .append('div').attr('class', 'tag-table-wrap')
                .append('table').attr('class', 'inspector');

            table.append('thead').append('tr').selectAll('th')
                .data(['tag', 'value', ''])
                .enter()
                .append('th').text(String);

            var tbody = table.append('tbody');

            function draw(data) {
                var tr = tbody.selectAll('tr')
                    .data(d3.entries(data));
                tr.exit().remove();
                var row = tr.enter().append('tr');
                var valuetds = row.selectAll('td')
                    .data(function(d) { return [d, d]; });
                valuetds.enter().append('td').append('input')
                    .property('value', function(d, i) { return d[i ? 'value' : 'key']; })
                    .on('keyup.update', function(d, i) {
                        d[i ? 'value' : 'key'] = this.value;
                        update();
                    })
                    .each(function(d, i) {
                        if (!i) return;
                        var selection = d3.select(this);
                        selection.call(d3.typeahead()
                            .data(function(selection, callback) {
                                update();
                                taginfo.values(selection.datum().key, function(err, data) {
                                    callback(data.data);
                                });
                            }));
                    });

                row.append('td').attr('class', 'tag-help').append('a')
                    .text('?')
                    .attr('target', '_blank')
                    .attr('tabindex', -1)
                    .attr('href', function(d) {
                        return 'http://taginfo.openstreetmap.org/keys/' + d.key;
                    });
            }

            // Remove any blank key-values
            function clean(x) {
                for (var i in x) if (!i) delete x[i];
                return x;
            }

            // Add a blank row for new tags
            function pad(x) {
                if (!x['']) x[''] = '';
                return x;
            }

            function grabtags() {
                var grabbed = {};
                function grab(d) { grabbed[d.key] = d.value; }
                tbody.selectAll('td').each(grab);
                return grabbed;
            }

            // fill values and add blank field if necessary
            function update() {
                draw(pad(grabtags()));
            }

            var data = _.clone(entity.tags);
            draw(data);
            update();

            selection.append('div')
                .attr('class', 'buttons').call(drawbuttons);

            function drawbuttons(selection) {
                selection.append('button')
                    .attr('class', 'save').text('Save')
                    .on('click', function(entity) {
                        event.changeTags(entity, clean(grabtags()));
                        event.close(entity);
                    });
                selection.append('button')
                    .attr('class', 'cancel').text('Cancel')
                    .on('click', function(entity) { event.close(entity); });
                selection.append('button')
                    .attr('class', 'delete').text('Delete')
                    .on('click', function(entity) { event.remove(entity); });
            }
        });
    }

    return d3.rebind(inspector, event, 'on');
};
