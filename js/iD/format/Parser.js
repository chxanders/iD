iD.format = function(path) {
    var refNodes = {};
    function getNodes(obj) {
        var nodes = [], nelems = obj.getElementsByTagName('nd');
        for (var i = 0, l = nelems.length; i < l; i++) {
            nodes[i] = 'n' + nelems[i].attributes.ref.nodeValue;
            refNodes['n' + nelems[i].attributes.ref.nodeValue] = true;
        }
        return nodes;
    }

    function getTags(obj) {
        var tags = {}, tagelems = obj.getElementsByTagName('tag');
        for (var i = 0, l = tagelems.length; i < l; i++) {
            var item = tagelems[i];
            tags[item.attributes.k.nodeValue] = item.attributes.v.nodeValue;
        }
        return tags;
    }

    function getMembers(obj) {
        var members = [],
            elems = obj.getElementsByTagName('member');

        for (var i = 0, l = elems.length; i < l; i++) {
            members[i] = {
                id: elems[i].attributes.type.nodeValue[0] + elems[i].attributes.ref.nodeValue,
                type: elems[i].attributes.type.nodeValue,
                role: elems[i].attributes.role.nodeValue
            };
        }
        return members;
    }

    function objectData(obj) {
        var o = {
            type: obj.nodeName,
            members: getMembers(obj),
            nodes: getNodes(obj),
            tags: getTags(obj)
        };
        for (var i = 0, l = obj.attributes.length; i < l; i++) {
            var n = obj.attributes[i].nodeName;
            var v = obj.attributes[i].nodeValue;
            o[n] = v;
        }
        if (o.lat) o.lat = parseFloat(o.lat);
        if (o.lon) o.lon = parseFloat(o.lon);
        o._id = o.id;
        o.id = o.type[0] + o.id;
        return iD.Entity(o);
    }

    function parse(path) {
		return d3.xml(path, 'application/xml', function(dom) {
	        if (!dom.childNodes) return new Error('Bad request');
	        var root = dom.childNodes[0];
	        var entities = {};
	        refNodes = {};
	        function addEntity(obj) {
	            var o = objectData(obj);
	            if (o.type === 'node') o._poi = !refNodes[o.id];
	            entities[o.id] = o;
	        }

	        _.forEach(root.getElementsByTagName('way'), addEntity);
	        _.forEach(root.getElementsByTagName('node'), addEntity);
	    	console.log(pants.map);
	        pants.map.history.merge(iD.Graph(entities, 'create'));
		});
    }
    return parse(path);
};
