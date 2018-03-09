describe('Config', function() {

  describe('Init', function() {
    const yoa = new Yoa();

    it('default options', function() {
      expect(yoa.$options).to.be.empty;
      expect(yoa.$data).to.be.empty;
    });
  });

  it('set options', function() {
    expect(new Yoa({
      data: {a: 1, b: '2'}
    }).$data).to.be.deep.equal({a: 1, b: '2'});
    expect(new Yoa({
      data: function() {
        return {a: 1, b: '2'};
      }
    }).$data).to.be.deep.equal({a: 1, b: '2'});
  });
});
