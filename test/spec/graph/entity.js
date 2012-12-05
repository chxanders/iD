describe('Entity', function () {
    describe("#update", function () {
        it("returns a new Entity", function () {
            var a = iD.Entity(),
                b = a.update({});
            expect(b instanceof iD.Entity).to.be.true;
            expect(a).not.to.equal(b);
        });

        it("updates the specified attributes", function () {
            var tags = {foo: 'bar'},
                e = iD.Entity().update({tags: tags});
            expect(e.tags).to.equal(tags);
        });

        it("tags the entity as updated", function () {
            var tags = {foo: 'bar'},
                e = iD.Entity().update({tags: tags});
            expect(e._updated).to.to.be.true;
        });

        it("doesn't modify the input", function () {
            var attrs = {tags: {foo: 'bar'}},
                e = iD.Entity().update(attrs);
            expect(attrs).to.eql({tags: {foo: 'bar'}});
        })
    });

    describe("#created", function () {
        it("returns falsy by default", function () {
            expect(iD.Entity({id: 'w1234'}).created()).not.to.be.ok;
        });

        it("returns falsy for an unmodified Entity", function () {
            expect(iD.Entity({id: 'w1234'}).created()).not.to.be.ok;
        });

        it("returns falsy for a modified Entity with positive ID", function () {
            expect(iD.Entity({id: 'w1234'}).update({}).created()).not.to.be.ok;
        });

        it("returns truthy for a modified Entity with negative ID", function () {
           expect(iD.Entity({id: 'w-1234'}).update({}).created()).to.be.ok;
        });
    });

    describe("#modified", function () {
        it("returns falsy by default", function () {
            expect(iD.Entity({id: 'w1234'}).modified()).not.to.be.ok;
        });

        it("returns falsy for an unmodified Entity", function () {
            expect(iD.Entity({id: 'w1234'}).modified()).not.to.be.ok;
        });

        it("returns truthy for a modified Entity with positive ID", function () {
            expect(iD.Entity({id: 'w1234'}).update({}).modified()).to.be.ok;
        });

        it("returns falsy for a modified Entity with negative ID", function () {
           expect(iD.Entity({id: 'w-1234'}).update({}).modified()).not.to.be.ok;
        });
    });
});

describe('Node', function () {
    it("returns a node", function () {
        expect(iD.Node().type).to.equal("node");
    });

    it("returns a created Entity if no ID is specified", function () {
        expect(iD.Node().created()).to.be.ok;
    });

    it("returns an unmodified Entity if ID is specified", function () {
        expect(iD.Node({id: 'n1234'}).created()).not.to.be.ok;
        expect(iD.Node({id: 'n1234'}).modified()).not.to.be.ok;
    });

    it("defaults tags to an empty object", function () {
        expect(iD.Node().tags).to.eql({});
    });

    it("sets tags as specified", function () {
        expect(iD.Node({tags: {foo: 'bar'}}).tags).to.eql({foo: 'bar'});
    });
});

describe('Way', function () {
    it("returns a way", function () {
        expect(iD.Way().type).to.equal("way");
    });

    it("returns a created Entity if no ID is specified", function () {
        expect(iD.Way().created()).to.be.ok;
    });

    it("returns an unmodified Entity if ID is specified", function () {
        expect(iD.Way({id: 'w1234'}).created()).not.to.be.ok;
        expect(iD.Way({id: 'w1234'}).modified()).not.to.be.ok;
    });

    it("defaults nodes to an empty array", function () {
        expect(iD.Way().nodes).to.eql([]);
    });

    it("sets nodes as specified", function () {
        expect(iD.Way({nodes: ["n-1"]}).nodes).to.eql(["n-1"]);
    });

    it("defaults tags to an empty object", function () {
        expect(iD.Way().tags).to.eql({});
    });

    it("sets tags as specified", function () {
        expect(iD.Way({tags: {foo: 'bar'}}).tags).to.eql({foo: 'bar'});
    });
});

describe('Relation', function () {
    it("returns a relation", function () {
        expect(iD.Relation().type).to.equal("relation");
    });

    it("returns a created Entity if no ID is specified", function () {
        expect(iD.Relation().created()).to.be.ok;
    });

    it("returns an unmodified Entity if ID is specified", function () {
        expect(iD.Relation({id: 'r1234'}).created()).not.to.be.ok;
        expect(iD.Relation({id: 'r1234'}).modified()).not.to.be.ok;
    });

    it("defaults tags to an empty object", function () {
        expect(iD.Relation().tags).to.eql({});
    });

    it("sets tags as specified", function () {
        expect(iD.Relation({tags: {foo: 'bar'}}).tags).to.eql({foo: 'bar'});
    });
});
