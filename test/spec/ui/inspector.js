describe("Inspector", function () {
    var inspector, element, entity = iD.Entity({type: 'node', id: "n12345", tags: {}});

    beforeEach(function () {
        inspector = iD.Inspector();
        element = d3.select('body')
            .append('div')
            .attr('id', 'inspector-wrap')
            .datum(entity)
            .call(inspector);
    });

    afterEach(function () {
        element.remove();
    });

    it("emits a close event when the close button is clicked", function () {
        var spy = sinon.spy();
        inspector.on('close', spy);

        happen.click(element.select('.close').node());

        expect(spy).to.have.been.calledWith(entity);
    });

    it("emits a changeTags event when the apply button is clicked", function () {
        var spy = sinon.spy();
        inspector.on('changeTags', spy);

        happen.click(element.select('.apply').node());

        expect(spy).to.have.been.calledWith(entity, {});
    });

    it("emits a remove event when the delete button is clicked", function () {
        var spy = sinon.spy();
        inspector.on('remove', spy);

        happen.click(element.select('.delete').node());

        expect(spy).to.have.been.calledWith(entity);
    });
});
