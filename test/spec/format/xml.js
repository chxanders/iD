describe('XML', function() {
    describe('#decode', function() {
        it('decodes xml', function() {
            expect(iD.format.XML.decode('<">')).to.eql('&lt;&quot;&gt;');
        });
    });

    describe('#rep', function() {
        it('converts a node to jxon', function() {
            expect(iD.format.XML.rep({ id: 'n-1', type: 'node', loc: [-77, 38] }))
            .to.eql({ node : { '@id': '-1', '@lat': 38, '@lon': -77, '@version': 0, tag: [ ] } });
        });
        it('converts a way to jxon', function() {
            expect(iD.format.XML.rep({ id: 'w-1', type: 'way', nodes: [] }))
            .to.eql({ way : { '@id' : '-1', nd : [ ], '@version': 0, tag: [ ] } });
        });
    });

    describe('#mapping', function() {
        it('serializes a node to xml', function() {
            expect(iD.format.XML.mapping({ id: 'n-1', type: 'node', loc: [-77, 38] }))
            .to.equal('&lt;node id=&quot;-1&quot; lon=&quot;-77&quot; lat=&quot;38&quot; version=&quot;0&quot;/&gt;');
        });

        it('serializes a way to xml', function() {
            expect(iD.format.XML.mapping({ type: 'way', nodes: [], id: 'w-1' }))
            .to.equal('&lt;way id=&quot;-1&quot; version=&quot;0&quot;/&gt;');
        });
    });
});
