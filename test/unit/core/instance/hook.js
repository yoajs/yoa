describe('#Hook', function() {
  it('should call hook step by step', function() {
    var el = createTestElement('hook', '');
    var i = 0;

    var app = new Yoa({
      el: '#hook',
      hook: {
        init: function() {
          expect(i).to.equal(0);
          i++;
        },
        mounted: function() {
          expect(i).to.equal(1);
          i++;
        },
        // TODO
      }
    })
  })
})
