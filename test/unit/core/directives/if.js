describe('#If', function() {
  var el = createTestElement('ifDirective', '<p y-if="isShow">hello yoa!</p>');

  var app = new Yoa({
    el: '#ifDirective',
    data: {
      isShow: true
    }
  })

  it('should exist when true', function() {
    app.set('isShow', true);
    return then(function() {
      expect(el.firstChild.innerHTML).to.equal('hello yoa!');
    })
  });

  it('should not exist when false', function() {
    app.set('isShow', false);
    return then(function() {
      expect(el.firstChild).to.be.null;
    })
  })
})
