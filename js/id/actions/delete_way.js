// https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/DeleteWayAction.as
iD.actions.DeleteWay = function(way) {
    return function(graph) {
        graph.parentRelations(way.id)
            .forEach(function(parent) {
                graph = iD.actions.RemoveRelationMember(parent, way)(graph);
            });

        way.nodes.forEach(function (id) {
            var node = graph.entity(id);

            graph = iD.actions.RemoveWayNode(way, node)(graph);

            if (!graph.parentWays(id).length && !graph.parentRelations(id).length) {
                if (!node.hasInterestingTags()) {
                    graph = graph.remove(node);
                } else {
                    graph = graph.replace(node.update({_poi: true}));
                }
            }
        });

        return graph.remove(way, 'removed a way');
    };
};
