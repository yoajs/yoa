describe('#Data', function() {
  it('data function this', function() {
    const yoa = new Yoa({
      data: function() {
        return {
          _this: this
        };
      }
    });
    expect(yoa.$data._this instanceof Yoa).to.be.true;
  });
});
